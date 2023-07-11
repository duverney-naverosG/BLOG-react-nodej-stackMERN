const mongoose = require("mongoose");
const { config } = require("dotenv");
config();

const main = async() =>{
    try {
        const db = await mongoose.connect("mongodb://127.0.0.1:27017/blog") 
        console.log("DB conectada : ", db.connection.name);
    } catch (error) {
        console.log(error);
    
    }
}

main()