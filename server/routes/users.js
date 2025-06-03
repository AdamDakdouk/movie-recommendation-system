const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const { User } = require("../models/User"); 
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, message : `${req.body.email} is already registered. Please use a different email or login.`  });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
            const resetToken = crypto.randomBytes(20).toString('hex');
            console.log(resetToken)
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Email not found" });
        }

        // Generate a unique token and expiration time
        
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour
        
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Configure Nodemailer to send the email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'mou3ajanetabousamra@gmail.com',
                pass: 'Mou3ajanet@Samra30',
            },
        });

        const resetUrl = `http://localhost:3000/reset_password/${resetToken}`;
        const mailOptions = {
            from: 'mou3ajanetabousamra@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `You requested to reset your password. Click the link below to reset your password:\n\n${resetUrl}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Password reset link sent to your email." });
    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred, please try again later." });
    }
});

router.post('/reset_password/:token', async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.json({ success: false, message: "Passwords do not match" });
    }

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" });
        }

        // Update the user's password
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();
        res.status(200).json({ success: true, message: "Password successfully updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred, please try again later." });
    }
});

module.exports = router;
