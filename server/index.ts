import mongoose from "mongoose";
const config = useRuntimeConfig(

);
const db = async () => {
    console.log(config.mongoUrl, ":mongoUrl的路径");
    // try {
    //     mongoose.set('strictQuery', false);
    //     await mongoose.connect(config.mongoUrl);
    //     console.log("DB connection established.");
    // } catch (err) {
    //     console.error("DB connection failed.", err);
    // }
};

export default db;