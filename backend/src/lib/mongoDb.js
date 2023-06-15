import mongoose from "mongoose";

const connectMongoDb = async () => {
  //   console.log(process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (e) {
    console.log(e);
  }
};

export default connectMongoDb;
