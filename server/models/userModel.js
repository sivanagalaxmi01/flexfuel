
import mongoose from 'mongoose';

const signupSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true }, 
  clerkUserId: { type: String, required: true, unique: true },
  role: { type: String, default: "user", enum: ["user", "admin"] }
});

const Signup = mongoose.model("Signup", signupSchema);
export default Signup;
