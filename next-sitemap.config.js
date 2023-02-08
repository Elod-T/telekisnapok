/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.telekisnapok.hu",
  generateRobotsTxt: true,
  exclude: ["/api", "/api/*", "/admin", "/admin/*", "/manager", "/manager/*"],
};
