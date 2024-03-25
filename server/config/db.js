const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectMongoDB = async() => {
    try{
        console.log(`Connecting to Mongo DB....`);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongo DB connectd: ${conn.connection.host}`);
    }catch(error){
        console.log(`Error Occured While connecting DB`);
        console.log(error);
    }
}

module.exports  = connectMongoDB;