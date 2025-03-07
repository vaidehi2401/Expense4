const Sib = require('sib-api-v3-sdk'); 
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../util/database')
const User = require('../models/userModel')
const ForgotPassword = require('../models/forgotPasswordModel')
const transEmailApi = new Sib.TransactionalEmailsApi();
const bcrypt = require('bcrypt');
const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.API_KEY;

const sender = {
    email: 'vaidehidhole312@gmail.com'
};

exports.getForgotEmail = async (req, res) => {
    const receiverEmail = req.body.email;
    const transaction = await sequelize.transaction();
    console.log(receiverEmail)
    const receivers = [{ email: receiverEmail }];

    try {
        const user = await User.findOne({ 
            where: { email: receiverEmail },
            transaction
        });
        if (!user) {
            await transaction.rollback(); 
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const resetToken = uuidv4();
        await ForgotPassword.create({
            id: resetToken,
            userId: user.id,
            isActive: true
        }, { transaction });
        await transaction.commit();
        const resetUrl = `http://localhost:3003/password/resetpassword/${resetToken}`;
        const response = await transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Your Password',
            htmlContent: `<p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>`,
        });
        console.log(response);
        res.json({ success: true, message: 'Email sent' });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
};
exports.checkForgotEmail= async(req, res)=>{
    const forgotId = req.params.forgotid;
    console.log(forgotId)
    try{
    const resetReq = await ForgotPassword.findOne({
        where: { id: forgotId, isActive: true }
    });
    if (!resetReq) {
        return res.send(`
            <html>
                <head>
                    <title>Reset Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            background-color: #f4f4f4;
                            padding: 50px;
                        }
                        .message-box {
                            background: white;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    <div class="message-box">
                        <h2>Password Reset Link Expired</h2>
                        <p>This password reset link has already been used or has expired.</p>
                    </div>
                </body>
            </html>
        `);
    }
    res.send(`
            <html>
                <head>
                    <title>Reset Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                        }
                        .container {
                            background: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                            width: 350px;
                            text-align: center;
                        }
                        input {
                            width: 100%;
                            padding: 10px;
                            margin: 10px 0;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            font-size: 16px;
                        }
                        button {
                            width: 100%;
                            padding: 10px;
                            background: #28a745;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                        }
                        button:hover {
                            background: #218838;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Reset Your Password</h2>
                        <form action="/password/updatepassword" method="POST">
                            <input type="hidden" name= "resetId" id="resetId" value=${forgotId} />
                            <input type="email" name="email" id="email" placeholder="Enter your email" required />
                            <input type="password" name="newPassword" id="password" placeholder="Enter new password" required />
                            <button type="submit" id="resetPassword">Reset Password</button>
                        </form>
                    </div>
                      <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js"></script>
    <script src="/js/forgotPassword.js"></script>

                </body>
            </html>
    `);
   
        }
    catch(err){
        console.error("Error handling forgot password request:", err);
        res.status(500).send("Server error. Please try again later.");
    }}
    exports.setNewPassword = async (req, res) => {
        const t = await sequelize.transaction(); // Begin transaction
        try {
            console.log("Received Request Body:", req.body); // Log the request data
            
            const { email, newPassword, resetId } = req.body; // Destructure correct fields
            console.log(resetId)
            if (!email || !newPassword || !resetId) {
                return res.status(400).json({ success: false, message: "Missing required fields." });
            }
            
    
            // Hash the new password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
            // Check if user exists
            const user = await User.findOne({ where: { email }, transaction: t });
            if (!user) {
                await t.rollback();
                return res.status(404).json({ success: false, message: "User not found." });
            }
    
            // Check if reset request is valid
            const resetRequest = await ForgotPassword.findOne({ where: { id: resetId, isActive: true }, transaction: t });
            if (!resetRequest) {
                await t.rollback();
                return res.status(400).json({ success: false, message: "Invalid or expired reset link." });
            }
    
            // Update user's password
            await user.update({ password: hashedPassword }, { transaction: t });
    
            // Mark reset request as inactive
            await resetRequest.update({ isActive: false }, { transaction: t });
    
            await t.commit();
            return res.status(200).json({ success: true, message: "Password updated successfully." });
    
        } catch (err) {
            await t.rollback();
          //  console.error("Error updating password:", err);
            return res.status(500).json({ success: false, message: "Server error. Please try again later." });
        }
    };
    