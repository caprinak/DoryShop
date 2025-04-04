export default {
  oidc: {
    clientId: "0oao4jzv0bzMrK1Hv5d7", // Replace with your Okta Client ID
    issuer: "https://dev-98791869.okta.com/oauth2/default", // Replace with your Okta Issuer URL
    redirectUri: "http://localhost:4200/login/callback",
    scopes: ["openid", "profile", "email"],
    //pkce: true,
  },
};
