import express from 'express';
import cors from 'cors';
import 'dotenv/config' ;
import cookieParser  from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authRoute.js'
import userRouter from './routes/userRoute.js';

const app = express();

const allowedOrigin = ["http://localhost:5173"]
connectDB();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: allowedOrigin}));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter)

app.get('/', (req,res) => {
    res.send("Hello APP");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
})