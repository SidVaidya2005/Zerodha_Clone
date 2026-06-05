const { OAuth2Client } = require("google-auth-library");

const SCOPES = ["openid", "email", "profile"];

// Built per-call (like authService.getSecret) so env vars can be set inline in
// tests and a missing var surfaces on use, not at module load.
function getClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI is not set");
  }
  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

function getAuthUrl(state) {
  return getClient().generateAuthUrl({
    access_type: "online",
    scope: SCOPES,
    state,
    prompt: "select_account",
  });
}

async function exchangeCodeForProfile(code) {
  const client = getClient();
  const { tokens } = await client.getToken(code);
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload || !payload.email) throw new Error("Google account has no email");
  if (!payload.email_verified) throw new Error("Google email is not verified");

  return {
    googleId: payload.sub,
    email: payload.email,
    fullName: payload.name || payload.email,
    avatarUrl: payload.picture,
  };
}

module.exports = { getAuthUrl, exchangeCodeForProfile };
