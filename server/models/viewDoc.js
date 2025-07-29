import mongoose from "mongoose";
import User from "./User.js"

const allDocs = async () => {
  try {
    // Fetch all users from the User model
    const results = await User.find();//returns all documents in the User collection
                             //User.findById() can be used to find a specific user by ID
                             //User.find({ username: "akalu" }) can be used to find a user by username

    console.log(results);//displays all documents in the User collection
    // results.forEach(user => {//displays each user document
    //   console.log(`Username: ${user.username}, Email: ${user.email}`);
    // });

  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export default allDocs;