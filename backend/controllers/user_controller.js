

const User = require('../models/user_model');
const bcrypt = require('bcryptjs');

const Course = require('../models/courses_model');

const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// *-----------------------------
//  Home Logic
// *-----------------------------

const home = async (req, res) => {
    try {
        res.status(200).send("wellcome...");
    }
    catch (error) {
        console.log(error.message);
    }
}


// *-----------------------------
//  Registration Logic
// *-----------------------------

const register = async (req, res) => {
    try {
        // console.log(req.body);
        const { username, email, phone, password } = req.body;

        let imageUrl = req.headers['x-additional-info'];
        if (imageUrl == 'undefined') {
            imageUrl = '/userimages/user.png'; // Default image URL
        }


        const userExist = await User.findOne({ email });

        const mobileExist = await User.findOne({ phone });

        if (userExist) {
            return res.status(400).json({ message: "email already exist" });
        }

        if (mobileExist) {
            return res.status(400).json({ message: "Mobile number already exist" });
        }

        //Hash the password
        const saltRound = 10;
        const hash_password = await bcrypt.hash(password, saltRound);

        // let image = req.file ? req.file.filename : 'user.png'; // Set default image here

        const userCreated = await User.create({ username, email, phone, image: imageUrl, password: hash_password })

        const token = await new Token({
            userId: userCreated._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `https://wealthify01.vercel.app/${userCreated.id}/verify/${token.token}`;
        await sendEmail(userCreated.email, "Verify Email", url);



        res.status(200).json({
            message: "An Email sent to your account please verify",
            token: await userCreated.generateToken(),                                              //Token for authentification
            userId: userCreated._id.toString()
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).json('Internal server error');
    }
}

const verify = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        if (!token) return res.status(400).send({ message: "Invalid link" });

        await User.updateOne({ _id: user._id }, { verified: true });

        const deletedToken = await Token.deleteOne({ _id: token._id });


        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {

        res.status(500).send({ message: "Internal Server Error" });
    }
}


// *-----------------------------
//  Login Logic
// *-----------------------------

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credintials" });
        }

        const user = await bcrypt.compare(password, userExist.password);          //check valid password

        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        if (!userExist.verified) {
            let token = await Token.findOne({ userId: userExist._id });

            // console.log(!token);

            if (!token) {
                token = await new Token({
                    userId: userExist._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();

                const verificationUrl = `https://wealthify01.vercel.app/${userExist.id}/verify/${token.token}`;
                await sendEmail(userExist.email, "Verify Email", verificationUrl);
                console.log("ha");
                return res.status(400).json({
                    message: "An email has been sent to your account for verification.",
                });
            }

            return res.status(400).json({
                message: "An email was already sent. Please check your inbox to verify.",
            });
        }

        userExist.lastLogin = Date.now();
        userExist.lastLogout = 0;
        await userExist.save();

        if (user) {
            res.status(200).json({
                message: "Login Successful",
                token: await userExist.generateToken(),                                              //Token for authentification
                userId: userExist._id.toString()
            })
        }
        else {
            res.status(401).json({ message: "Invalid Credintial" });
        }

    }
    catch (error) {
        res.status(500).json("internal server error")
    }
}

const logout = async (req, res) => {
    try {
        const { userId } = req.body;  // Assuming the userId is sent in the request body

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.lastLogout = Date.now();
        await user.save();

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// ?Reset
const resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email in MongoDB
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate reset token
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();


        // Send password reset email
        const resetLink = `https://wealthify01.vercel.app/reset/${user._id}/${token.token}`;
        await sendEmail(email, "Password Reset Request", resetLink);

        res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Failed to send password reset email.' });
    }
}


// Update Password
const updatePassword = async (req, res) => {

    console.log("hii");
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        // Find user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        if (!token) return res.status(400).send({ message: "Invalid link" });

        const deletedToken = await Token.deleteOne({ _id: token._id });

        //Hash the password
        const saltRound = 10;
        // Update user's password (assuming you have a method to hash passwords)
        user.password = await bcrypt.hash(password, saltRound); // Update password logic

        // const hash_password = await bcrypt.hash(password, saltRound);


        await user.save();

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Failed to reset password.' });
    }
}

// *-----------------------------
//  User Logic-To send user Data
// *-----------------------------

const user = async (req, res) => {
    try {
        // const userData = await User.find({});
        const userData = req.user;
        console.log(userData);
        return res.status(200).json({ userData });
    } catch (error) {
        console.log(` error from user route ${error.message}`);
    }
};


// *-------------------------------------------
// * Get All Course Logic
// *-------------------------------------------
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}, { password: 0 });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No Courses Found" });
        }

        return res.status(200).json(courses);
    }
    catch (error) {
        next(error);
    }

}

// *-------------------------------------------
// * Course Delete
// *-------------------------------------------
const deleteCourseById = async (req, res) => {
    try {
        const id = req.params.id;
        await Course.deleteOne({ _id: id });
        return res.status(200).json({ message: "Course deleted Successfully..." });
    }
    catch (error) {
        next(error);
    }
}

// *-------------------------------------------
// * Single USer Logic
// *-------------------------------------------
const updateUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const updateUserData = req.body;

        const updateData = await User.updateOne(
            { _id: id },
            { $set: updateUserData }
        );

        return res.status(200).json(updateData);
    }
    catch (error) {
        next(error);
    }
}


// *-------------------------------------------
// * Single Course Logic
// *-------------------------------------------
const getCourseByID = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const data = await Course.findOne({ _id: id }, { password: 0 });
        return res.status(200).json(data);
    }
    catch (error) {
        console.log(error.message);
    }
}

// *-------------------------------------------
// * Book Course Logic
// *-------------------------------------------
const buyCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const updateUserData = req.body;

        const updateData = await Course.updateOne(
            { _id: id },
            { $set: updateUserData }
        );

        return res.status(200).json(updateData);
    }
    catch (error) {
        next(error);
    }
}



module.exports = {
    home,
    register,
    verify,
    resetPassword,
    updatePassword,
    login,
    user,
    getCourses,
    deleteCourseById,
    updateUserById,
    buyCourse,
    getCourseByID,
    logout
};