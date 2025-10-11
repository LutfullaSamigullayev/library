const nodemailer = require("nodemailer")

module.exports = async function(email, otp) {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "samigullayevlutfulla@gmail.com",
                pass: process.env.APP_PASS
            }
        })
        await transport.sendMail({
            from: "samigullayevlutfulla@gmail.com",
            to:email,
            subject: "DevBook",
            text: "Verification code from devbook",
            html: `<p style="font-size: 24px">Verify code<strong style="color: blue">${otp}</strong></p>`
        })
    } catch (error) {
        throw new Error(error)
    }
}

