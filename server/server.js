
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const Result=require('./models/Result');

mongoose.connect("mongodb://localhost:27017/mcqdb");

const app=express();
app.use(cors());
app.use(express.json());

app.post("/api/result",async(req,res)=>{
 const r=new Result(req.body);
 await r.save();
 res.json({msg:'saved'});
});

app.listen(5000,()=>console.log('Server running'));