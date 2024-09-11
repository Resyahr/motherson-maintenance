import mongoose from "mongoose";

const mongodbURI = process.env.MONGODB_URI as string;

export async function dbConnect() {
  try {
    if (!mongodbURI) {
      throw "Please define an enviroment variable for mongodbURI";
    }
    const db = await mongoose.connect(mongodbURI);
    console.log("Connected to DB");
    return db;
  } catch (error) {
    console.log("An error ocurred: " + error);
    throw error;
  }
}
