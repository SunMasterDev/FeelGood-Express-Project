require('dotenv').config();
const express=require('express');
const hbs=require('hbs');
const generalRouter=require('./Routers/general')
const postsRouter=require('./Routers/post')

const app=express();
const port=process.env.APP_PORT;


app.use(express.urlencoded({extended:true})) //plug-in ของ middleware //extended ทำให้อ่านค่า Object Array ที่ซับซ้อน
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/Views/partials');
app.use('/static',express.static('static')); //เข้าถึง static


app.use('/',generalRouter);
app.use('/p',postsRouter);




app.listen(port,()=>{
    console.log(`ทำงานได้ http://localhost:${port}`)
})