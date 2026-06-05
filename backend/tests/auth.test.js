const request = require("supertest");

process.env.JWT_SECRET = "test-secret-do-not-use-in-prod";
process.env.GOOGLE_CLIENT_ID = "test-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
process.env.GOOGLE_REDIRECT_URI = "http://localhost:3002/auth/google/callback";
process.env.FRONTEND_URL = "http://localhost:3000";
process.env.DASHBOARD_URL = "http://localhost:3004";

// Mock only our own service seam — keep the real getAuthUrl (it just builds a
// URL string, no network) and stub the network exchange.
jest.mock("../services/googleAuthService", () => ({
  ...jest.requireActual("../services/googleAuthService"),
  exchangeCodeForProfile: jest.fn(),
}));

const googleAuthService = require("../services/googleAuthService");
const buildApp = require("../app");
const { UserModel } = require("../model/UserModel");

const app = buildApp();

const GOOGLE_PROFILE = {
  googleId: "google-sub-123",
  email: "asha@example.com",
  fullName: "Asha Rao",
  avatarUrl: "https://example.com/asha.png",
};

function findCookie(res, prefix) {
  const raw = res.headers["set-cookie"] || [];
  return raw.find((c) => c.startsWith(prefix));
}

const authCookie = (res) => findCookie(res, "auth=");
const stateCookie = (res) => findCookie(res, "oauth_state=");

// Returns the `state` value the server set on the oauth_state cookie.
function stateValue(res) {
  const cookie = stateCookie(res) || "";
  const match = cookie.match(/oauth_state=([^;]+)/);
  return match ? match[1] : null;
}

afterEach(() => {
  googleAuthService.exchangeCodeForProfile.mockReset();
});

describe("GET /auth/google", () => {
  it("redirects to Google's consent screen and sets a matching state cookie", async () => {
    const res = await request(app).get("/auth/google").redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toMatch(/^https:\/\/accounts\.google\.com\//);
    expect(res.headers.location).toContain("client_id=test-client-id");
    expect(res.headers.location).toContain("scope=");

    const state = stateValue(res);
    expect(state).toBeTruthy();
    expect(stateCookie(res)).toMatch(/HttpOnly/i);
    // The state in the redirect URL must equal the one stored in the cookie.
    expect(res.headers.location).toContain(`state=${state}`);
  });
});

describe("GET /auth/google/callback", () => {
  it("exchanges the code, creates the user, sets the auth cookie, redirects to the dashboard", async () => {
    googleAuthService.exchangeCodeForProfile.mockResolvedValue(GOOGLE_PROFILE);

    const res = await request(app)
      .get("/auth/google/callback?code=good-code&state=abc")
      .set("Cookie", "oauth_state=abc")
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("http://localhost:3004");
    expect(authCookie(res)).toBeDefined();

    const stored = await UserModel.findOne({ googleId: GOOGLE_PROFILE.googleId });
    expect(stored).not.toBeNull();
    expect(stored.email).toBe("asha@example.com");
    expect(stored.fullName).toBe("Asha Rao");
  });

  it("reuses an existing user instead of creating a duplicate", async () => {
    googleAuthService.exchangeCodeForProfile.mockResolvedValue(GOOGLE_PROFILE);

    await request(app)
      .get("/auth/google/callback?code=c1&state=abc")
      .set("Cookie", "oauth_state=abc")
      .redirects(0);
    await request(app)
      .get("/auth/google/callback?code=c2&state=abc")
      .set("Cookie", "oauth_state=abc")
      .redirects(0);

    expect(await UserModel.countDocuments({ googleId: GOOGLE_PROFILE.googleId })).toBe(1);
  });

  it("rejects a state mismatch without exchanging the code", async () => {
    const res = await request(app)
      .get("/auth/google/callback?code=good-code&state=evil")
      .set("Cookie", "oauth_state=abc")
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("http://localhost:3000/login?error=state");
    expect(authCookie(res)).toBeUndefined();
    expect(googleAuthService.exchangeCodeForProfile).not.toHaveBeenCalled();
  });

  it("rejects a missing state cookie", async () => {
    const res = await request(app)
      .get("/auth/google/callback?code=good-code&state=abc")
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("http://localhost:3000/login?error=state");
    expect(authCookie(res)).toBeUndefined();
    expect(googleAuthService.exchangeCodeForProfile).not.toHaveBeenCalled();
  });

  it("redirects to the login error page when the exchange fails", async () => {
    googleAuthService.exchangeCodeForProfile.mockRejectedValue(
      new Error("Google email is not verified")
    );

    const res = await request(app)
      .get("/auth/google/callback?code=bad-code&state=abc")
      .set("Cookie", "oauth_state=abc")
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("http://localhost:3000/login?error=oauth");
    expect(authCookie(res)).toBeUndefined();
  });

  it("redirects to the login error page when the user denies consent", async () => {
    const res = await request(app)
      .get("/auth/google/callback?error=access_denied")
      .set("Cookie", "oauth_state=abc")
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("http://localhost:3000/login?error=oauth");
    expect(googleAuthService.exchangeCodeForProfile).not.toHaveBeenCalled();
  });
});

describe("GET /me", () => {
  it("returns 401 without a cookie", async () => {
    const res = await request(app).get("/me");
    expect(res.status).toBe(401);
  });

  it("returns the user when the cookie is valid", async () => {
    googleAuthService.exchangeCodeForProfile.mockResolvedValue(GOOGLE_PROFILE);
    const loginRes = await request(app)
      .get("/auth/google/callback?code=good-code&state=abc")
      .set("Cookie", "oauth_state=abc")
      .redirects(0);
    const cookie = authCookie(loginRes);

    const meRes = await request(app).get("/me").set("Cookie", cookie);
    expect(meRes.status).toBe(200);
    expect(meRes.body.email).toBe(GOOGLE_PROFILE.email);
    expect(meRes.body).not.toHaveProperty("googleId");
  });
});

describe("POST /logout", () => {
  it("clears the auth cookie", async () => {
    const res = await request(app).post("/logout");
    expect(res.status).toBe(204);
    expect(authCookie(res)).toMatch(/auth=;/);
  });
});
