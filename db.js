// // Mongoose library ko import kar rahe hain, jo MongoDB se baat karne mein मदद karti hai.
// const mongoose = require('mongoose');

// // dotenv library ko import kar rahe hain, taaki hum .env file se variables padh sakein.
// const dotenv = require('dotenv');

// // .env file mein likhe variables ko load kar rahe hain.
// dotenv.config();

// // Yeh ek function hai jo database se connect hone ki koshish karega.
// const connectDB = async () => {
//     try {
//         // Yeh line actual connection banati hai. Yeh .env file se MONGO_URL uthayega.
//         await mongoose.connect(process.env.MONGO_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         // Agar connection successful ho gaya, toh console par message dikhega.
//         console.log("MongoDB connection SUCCESSFUL ✅");

//     } catch (error) {
//         // Agar connection mein koi error aaya, toh yahan error message dikhega.
//         console.error("MongoDB connection FAILED ❌:", error.message);
        
//         // Agar DB connect nahi hua, toh server ko band kar dega.
//         process.exit(1); 
//     }
// };

// // Is function ko export kar rahe hain taaki hum ise server.js file mein use kar sakein.
// module.exports = connectDB;