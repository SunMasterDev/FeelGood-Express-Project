const express=require('express');
const db = require('../db');
const dayjs=require('dayjs')

const router=express.Router();

async function getPostAndComment(postId){//ใช้หลายที่เลยต้องมาสร้างเป็นฟังค์ชั่น
    let onePost= null;
    let postComments=[];

    try {
        //GET ONE POST
        const somePost=await db
        .select('*')
        .from('post') //ลืมใส่
        .where('id', +postId)
        onePost=somePost[0]; //เลือกเฉพาะตัวเดียว ไม่ให้เป็น array
        onePost.createdAtText=dayjs(onePost.createdAt).format('D MMM YYYY - HH:mm') //เปลี่ยน onePost
        //get post comment
        postComments= await db
        .select('*')
        .from('comment')
        .where('postId', +postId)
        postComments=postComments.map(comment=>{
                const createdAtText=dayjs(comment.createdAt).format('D MMM YYYY - HH:mm') //เปลี่ยน comment และ postComments
                return{...comment,createdAtText}
               })
    } catch (error) {
        console.error(error);
    }

    const customTitle= !!onePost? `${onePost.title} | ` : `ไม่พบไม่เนื้อหา | `;
    return {onePost,postComments,customTitle}
}

//ข้อมูลจำลอง
// const allPosts=[{
//     id: 2,title:'รวยจังเลย22' ,from:'คนหล่อ',createdAtText:'14 Feb 2025',commentsCount:2
// },
// {
//     id: 1,title:'มีเงิน10ล้าน' ,from:'พี่หน่วง',createdAtText:'13 Feb 2025',commentsCount:0
// }]

//ไปหน้าสร้างโพสใหม่
router.get('/new',(req,res)=>{
    res.render('postNew')
})

//post รับค่าจาก body ที่สร้างโพสใหม่ //ทดสอบได้ที่ postman
router.post('/new',async (req,res)=>{
   const {title,content,from,accepted }=req.body ?? {};
    try {
        //validation
        if(!title || !content || !from){
            throw new Error('no text')
        }else if(accepted != 'on'){
            throw new Error('no accepted')
        }
        //create post ไป sql มี insert
        await db.insert({title,content,from,createdAt:new Date()}).into('post')
    } catch (error) {
        console.log(error);
        let errorMessage='ผิดพลาดอะไรซักอย่าง';
        if(error.message === 'no text'){ //error.message
            errorMessage= 'กรุณาใส่ข้อมูลให้ครบถ้วน'
        }else if(error.message=== 'no accepted'){
            errorMessage='กรุณากดยอมรับด้วย'
        }
        return res.render('postNew',{errorMessage,values:{title,content,from}}); //ใส่ return ให้ไปที่ postNew แสดง error 
    }
    res.redirect('/p/new/done') //แต่ถ้าสร้างสำหรับให้ไปที่หน้า NewDone

    // console.log(req.body);
    // const {title} = req.body ?? {}; //?? {} ทำให้ค่าเป็น Undefine หรือ ออเจคธรรมดา เวลาไม่ได้ส่งค่าไป
    // res.send(`Submit title=${title}`)
})

//สร้างโพสต์ใหม่สำเร็จขึ้น popup
router.get('/new/done',(req,res)=>{
    res.render('postNewDone');
})

//ไปหน้าที่เฉพาะโพสต์ 1 2 3
router.get('/:postId',async(req,res)=>{
    const {postId} = req.params;

    const postData=await getPostAndComment(postId); //มาจาก function ตัวบนสุด

    res.render('postNewId',postData) //มีอันเดียวไม่ต้องใส่ {} ที่ postData

    // const onePost=allPosts.find(post=>post.id === +postId); //+ คือ shortcut แปลงเป็นตัวเลข
    // const customTitle=onePost?.title ?`${onePost.title} | `: 'ไม่พบไม่เนื้อหา | '; //สำหรับชื่อ title เปลี่ยนแปลงตาม id

});
//สร้างcomment
router.post('/:postId/comment', async(req,res)=>{
    const {postId} = req.params;
    const {content,from,accepted }=req.body ?? {};
    try {
        //validation
        if( !content || !from){
            throw new Error('no text')
        }else if(accepted != 'on'){
            throw new Error('no accepted')
        }
        //create conmment ไปที่ sql
        await db.insert({content,from,createdAt:new Date(),postId:+postId}).into('comment'); //into ไปที่ sql ที่สร้าง comment
    } catch (error) {
        console.log(error);
        let errorMessage='ผิดพลาดอะไรซักอย่าง';
        if(error.message === 'no text'){ //error.message
            errorMessage= 'กรุณาใส่คอมเม้นก่อน'
        }else if(error.message=== 'no accepted'){
            errorMessage='กรุณากดยอมรับด้วย'
        }
        const postData=await getPostAndComment(postId); //มาจาก function ตัวบนสุด
        return res.render('postNewId',{...postData,errorMessage,values:{content,from}}); //ใส่ return ให้ไปที่ postNewId อยู่ทีหน้าเดิม เพื่อแสดง error
    }
    res.redirect(`/p/${postId}`) //ถ้าสร้างคอมเม้นสำเร็จให้แสดงคอมเม้นหน้าเฉพาะที่หน้าเดิม
})

module.exports=router