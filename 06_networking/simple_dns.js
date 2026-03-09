const dns = require("node:dns/promises");

(async () => {
  const googleIp = await dns.lookup("google.com");
  console.log(googleIp);
})();
