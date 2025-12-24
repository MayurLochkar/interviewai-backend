// const router = require('express').Router();
// const User = require('../models/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // REGISTER
// router.post("/register", async (req, res) => {
//     try {
//         // Generate new password hash
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);

//         // Create new user
//         const newUser = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword,
//         });

//         // Save user and respond
//         const user = await newUser.save();
//         res.status(201).json({_id: user._id, email: user.email});
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // LOGIN
// router.post("/login", async (req, res) => {
//     try {
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(404).json("User not found");
//         }

//         const validPassword = await bcrypt.compare(req.body.password, user.password);
//         if (!validPassword) {
//             return res.status(400).json("Wrong password");
//         }

//         // Create and assign a token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

//         const { password, ...others } = user._doc; // Don't send password back
//         res.status(200).json({...others, token});

//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;