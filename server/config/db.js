import mongoose from "mongoose";

//? Connect DB
export const ConnectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/whatsapp`);
  } catch (error) {
    console.log(error);
  }
};
