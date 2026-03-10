import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import sendMail from "../config/Mail.js"

export const signUp = async (req, res) => {
    try {
        const { name, email, password, userName } = req.body
        const findByEmail = await User.findOne({ email })
        if (findByEmail) {
            return res.status(400).json({ message: "Email already Exists" })
        }
        const findByUserName = await User.findOne({ userName })
        if (findByUserName) {
            return res.status(400).json({ message: "UserName already Exists" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be 6 characters" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            userName,
            email,
            password: hashedPassword
        })

        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "Strict"
        })

        return res.status(201).json(user)

    }
    catch (error) {
        return res.status(500).json({ message: `signup error ${error}` })
    }
}

export const signIn = async (req, res) => {
    try {
        const { password, userName } = req.body
        const user = await User.findOne({ userName })
        if (!user) {
            return res.status(400).json({ message: "User no found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" })
        }

        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "Strict"
        })

        return res.status(200).json(user)

    }
    catch (error) {
        return res.status(500).json({ message: `signin error ${error}` })
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: `signout succesfully` })
    }
    catch (error) {
        return res.status(500).json({ message: `signin Error ${error}` })

    }
}

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not Found" })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false

        await user.save()
        await sendMail(email, otp)
        return res.status(200).json({ message: "Email Succesfully Send" })

    } catch (error) {
        return res.status(500).json({ message: `Send otp error ${error}` })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expired opt" })
        }

        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined
        await user.save()
        return res.status(200).json({ message: "Otp Verified" })

    } catch (error) {
        return res.status(500).json({ message: `Verify otp error ${error}` })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "Otp verification required" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.isOtpVerified = false

        await user.save()

        return res.status(200).json({ message: "Password reset Succesfully" })

    } catch (error) {
        return res.status(500).json({ message: `Reset otp error ${error}` })
    }
}