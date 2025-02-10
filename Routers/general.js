const express= require('express');
const db=require('../db');
const dayjs=require('dayjs');

const router= express.Router();

//ข้อมูลจำลอง
// const allPosts=[{
//     id: 2,title:'รวยจังเลย22' ,from:'คนหล่อ',createdAtText:'14 Feb 2025',commentsCount:2
// },
// {
//     id: 1,title:'มีเงิน10ล้าน' ,from:'พี่หน่วง',createdAtText:'13 Feb 2025',commentsCount:0
// }]

//หน้าแรก //get อ่านข้อมูล
router.get('/',async(req,res)=>{
    let allPosts=[]; //P ตัวใหญ่
    try {
       allPosts=await db
       .select('post.id','post.title','post.from','post.createdAt')
       .count('comment.id as commentsCount')
       .from('post')
       .leftJoin('comment','post.id','comment.postId')
       .groupBy('post.id')
       .orderBy('post.id','desc')
       allPosts=allPosts.map(post=>{
        const createdAtText=dayjs(post.createdAt).format('D MMM YYYY - HH:mm')
        return{...post,createdAtText}
       })
    } catch (error) {
        console.error(error); 
    }
    res.render('home',{allPosts})
});

module.exports=router;