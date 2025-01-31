import { ethers } from "ethers";
import {phrase} from './config'
import { pool } from "./db";
import express from 'express';
const app = express();
app.use(express.json());
app.post('/signup',async (req,res)=>{
    const {username, password} = req.body;
    const hdWallet = ethers.HDNodeWallet.fromPhrase(phrase as string)
    try {
        const client = await pool.connect();
        const queryRes = await client.query('INSERT INTO users(name,password) VALUES($1,$2) RETURNING id',[username,password]);
        const userId = queryRes.rows[0].id;
        const child = hdWallet.deriveChild(userId);
        await client.query('UPDATE users SET deposit_address = $1, privatekey= $2 WHERE id = $3',[child.address,child.privateKey,userId]);
        client.release();
        res.send(child.address);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error')
    } 
})
app.get('/address/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        const client = await pool.connect();
        const queryRes = await client.query('SELECT deposit_address FROM users WHERE id = $1 ',[id]);
        res.send(queryRes.rows[0].deposit_address);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error')
    }
})
app.listen(3000,()=>{
    console.log('App listening on 3000');
})