const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
app.use(express.json());
app.use(cookieParser());

const {connectDB} = require('./config/db');
const {todoRoutes} = require('./routes/todoRoutes');
const {authRoutes}= require("./routes/userRoutes");

app.use(cors({
    credentials:true,
    origin: ["http://127.0.0.1:5500","http://localhost:5500"],
    methods:"GET,POST,PUT,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization']
}));

connectDB()
    .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }).catch((err)=>{
        console.error("Database connection error:", err);
    });

app.use('/todo', todoRoutes);
app.use("/user", authRoutes);