import mongoose from 'mongoose';
const connectDB = async (MONGO_URI) => { 
    try {
        // const MONGO_URI = 'mongodb+srv://developerkaleb:iLO2hZ7A3fvvzOfd@cluster0.lnrshaz.mongodb.net/express';
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;