import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const signToken = (id) => {
    // jwt token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const signup = async (req, res) => {
    const { name, email, password, age, gender, genderPreference } = req.body;
    try {

        if (!name || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: "You must at lest 18 years old",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }
        // Check if user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already in use",
            });
        }

        //passwordvalidaion
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            genderPreference,
        });

        const token = signToken(newUser._id);

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });


        res.status(201).json({
            success: true,
            user: newUser,
        });
    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ status: true, message: "Invalid Credential" })
        }

        const token = signToken(user._id);

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });


        return res.status(200).json({
            success: true,
            message: "user login successfull",
            user,
        });
    } catch (error) {
        console.log("Error in login controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: 'None',
        secure: true,  // Should be true if your application is running on HTTPS
        path: '/' // Specify the same path as the cookie was set
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
};

