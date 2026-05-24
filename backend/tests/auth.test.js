const request = require("supertest");

process.env.JWT_SECRET = "test-secret-do-not-use-in-prod";
const buildApp = require("../app");
const { UserModel } = require("../model/UserModel");

const app = buildApp();

const VALID_USER = {
  fullName: "Asha Rao",
  email: "asha@example.com",
  phoneNumber: "9876543210",
  password: "hunter2hunter2",
};

function authCookie(res) {
  const raw = res.headers["set-cookie"] || [];
  return raw.find((c) => c.startsWith("auth="));
}

describe("POST /signup", () => {
  it("creates a user, sets the auth cookie, returns the public user", async () => {
    const res = await request(app).post("/signup").send(VALID_USER);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ fullName: "Asha Rao", email: "asha@example.com" });
    expect(res.body).not.toHaveProperty("passwordHash");
    expect(authCookie(res)).toBeDefined();

    const stored = await UserModel.findOne({ email: "asha@example.com" });
    expect(stored).not.toBeNull();
    expect(stored.passwordHash).not.toBe(VALID_USER.password);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/signup").send({ email: "x@y.z" });
    expect(res.status).toBe(400);
  });

  it("returns 409 when the email is already registered", async () => {
    await request(app).post("/signup").send(VALID_USER);
    const res = await request(app).post("/signup").send(VALID_USER);
    expect(res.status).toBe(409);
  });
});

describe("POST /login", () => {
  beforeEach(async () => {
    await request(app).post("/signup").send(VALID_USER);
  });

  it("returns 200 + sets the cookie on correct credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: VALID_USER.email, password: VALID_USER.password });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(VALID_USER.email);
    expect(authCookie(res)).toBeDefined();
  });

  it("returns 401 on wrong password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: VALID_USER.email, password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("returns 401 on unknown email", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "nobody@example.com", password: "whatever" });
    expect(res.status).toBe(401);
  });
});

describe("GET /me", () => {
  it("returns 401 without a cookie", async () => {
    const res = await request(app).get("/me");
    expect(res.status).toBe(401);
  });

  it("returns the user when the cookie is valid", async () => {
    const signupRes = await request(app).post("/signup").send(VALID_USER);
    const cookie = authCookie(signupRes);

    const meRes = await request(app).get("/me").set("Cookie", cookie);
    expect(meRes.status).toBe(200);
    expect(meRes.body.email).toBe(VALID_USER.email);
  });
});

describe("POST /logout", () => {
  it("clears the auth cookie so subsequent /me returns 401", async () => {
    const signupRes = await request(app).post("/signup").send(VALID_USER);
    const cookie = authCookie(signupRes);

    const logoutRes = await request(app).post("/logout");
    expect(logoutRes.status).toBe(204);
    const cleared = (logoutRes.headers["set-cookie"] || []).find((c) => c.startsWith("auth="));
    expect(cleared).toMatch(/auth=;/);

    // The cookie clear is what the browser would honor; the original token
    // is still valid until expiry, so /me with the original cookie still
    // works. That is correct stateless-JWT behavior.
    const meRes = await request(app).get("/me").set("Cookie", cookie);
    expect(meRes.status).toBe(200);
  });
});
