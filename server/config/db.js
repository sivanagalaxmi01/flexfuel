import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

const connectToDB = async () =>
{
    try
    {
      await mongoose.connect(MONGO_URL);
      console.log("Data base connected");
   }catch(err)
   {
    console.log(err);
   }
}

export default connectToDB;