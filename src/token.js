const jwt = require("jsonwebtoken")

const privateKey = "privateKey"


function generate(data) {
    return jwt.sign(data, privateKey)
}

function verify(token) {
    try {
        const decoded = jwt.verify(token, privateKey)
        return decoded
    } catch (e) {
        return null
    }
}


module.exports = { generate, verify }
