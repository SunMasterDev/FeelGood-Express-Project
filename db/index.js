const knex=require('knex')

const db=knex.default({
    client:'mysql2',
    connection:{
        user:process.env.DB_USER,
        password:process.env.DB_PASS,
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        database:process.env.DB_NAME,
        timezone:'+00:00'
    }
})
//เรียกกี่ครั้ง ก็เรียก db ครั้งเดียว
module.exports=db;