import express from 'express';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '@repo/backend-common/config';
import { middleware } from './middleware';
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from '@repo/common/types';
import {prismaClient} from "@repo/db/client";

const app = express();

app.post('/signup', async(req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
           message: "Incorrect inputs",
        })
    }
    //db call
    try{
        await prismaClient.user.create({
            data:{
                email:parsedData.data?.username,
                password:parsedData.data.password,
                name:parsedData.data.name
            }
        });
    }catch(e){
        return res.status(500).json({
            message: "User already exists with this email"
        })
    }
    res.json({
        "userId":123
    })
});
app.post('/signin', (req, res) => {
    const data = SigninSchema.safeParse(req.body);
     if (!data.success) {
        return res.status(400).json({
           message: "Incorrect inputs",
        })
    }
    const userId = 1;
    const token =jwt.sign({userId}, JWT_SECRET);
    res.json({token});
});
            
app.post('/room', middleware,(req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
     if (!data.success) {
        return res.status(400).json({
           message: "Incorrect inputs",
        })
    }
    //db call
    res.json({
        roomId:123
    })
});
app.listen(3001);