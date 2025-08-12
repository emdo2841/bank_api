const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
       
        });
            
    } catch (error) {
         
        process.exit(1);
    }
    mongoose.connection.on("disconnected", () => {
            });
};

module.exports = { connectToMongo };