const jwt = require("jsonwebtoken")

const accessToken = (payload) => {
    try {
        return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
            expiresIn: "15m",
          });
    } catch (error) {
        throw new Error(error)
    } 
}

const refreshToken = (payload) => {
    try {
        return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
            expiresIn: "15d",
          });
    } catch (error) {
        throw new Error(error)
    } 
}

module.exports = {
    accessToken, refreshToken
}