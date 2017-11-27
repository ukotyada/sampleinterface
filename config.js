// Shared env vars in all environments 

config={
    apiUrl: process.env.API_URL || "http://localhost:7000/",
    clientId : process.env.CLIENT_ID || ""
}
  
module.exports = config;