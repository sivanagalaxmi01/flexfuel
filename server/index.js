import express from 'express';
import cors from 'cors';
import connectToDB from './config/db.js';
import  {requireAuth} from '@clerk/express';
import router from './router/userRouter.js';

const app = express();


app.use(express.json());
app.use(cors());

app.use('/api' , router);
connectToDB();

const PORT = process.env.PORT || 1700;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
