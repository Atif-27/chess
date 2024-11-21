import express from 'express';
import prisma from '@chess/db/client';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

interface User{
    id:string;
    username:string;
}

app.post('/api/v1/register',async (req,res)=>{
    let {username,name,email,password}=req.body;
    password= bcrypt.hashSync(password,10);
    try {
        const ifExist=await prisma.user.findFirst({
            where:{
                OR:[
                    {
                        username
                    },
                    {
                        email
                    }
                ]
            }
        });
        if(ifExist){
            throw new Error('User already exists');
        }
        const data=await prisma.user.create({
            data:{
                username,
                name,
                email,
                password
            }
        })
        res.cookie('token',generateToken(data),{
            httpOnly:true,
            secure:true
        });
        res.status(201).json({
            message:'User created successfully',
            data
        });
    } catch (error:any) {
        res.status(500).json({
            message:'Internal server error',
            error:error.message
        });
    }
}
);

app.post('/api/v1/login',async (req,res)=>{
    let {username,password}=req.body;
    
    try {
        const user=await prisma.user.findFirst({
            where:{
                username
            }
        });
        if(!user){
            throw new Error('User not found');
        }
        if(!bcrypt.compareSync(password,user.password)){
            throw new Error('Invalid password');
        }
        res.cookie('token',generateToken(user),{
            httpOnly:true,
            secure:true
        });
        res.status(200).json({
            message:'User logged in successfully',
            user
        });
    } catch (error:any) {
        res.status(500).json({
            message:'Internal server error',
            error:error.message
        });
    }
}
);
const generateToken=(user:User)=>{
    return jsonwebtoken.sign({userId:user.id,username:user.username}, process.env.JWT_SECRET as string, {
        expiresIn: '1h'
    });
}


app.listen(4000,()=>{
    console.log('Server is running on port 4000');
}
);