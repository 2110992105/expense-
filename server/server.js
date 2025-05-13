const express=require('express');
const app=express();
const cors=require('cors');

require('dotenv').config({path:"./config.env"});

const port=process.env.PORT||5000;
// add middleware
app.use(cors());
app.use(express.json());
// mongodb connection
const con=require('./db/connection');

// using routes
app.use(require('./routess/route'));
con.then(db=>{
    if(!db)return process.exit(1);
    // listen to http server
    app.listen(port,()=>{
        console.log(`Server is running on port: http://localhost:${port}`);
    });
    app.on('error',err=>{
        console.log(`Failed to Connect with HTTP server:${err}`);
});
}).catch(error=>{
        console.log(`Connection Failed...!${error}`);
});
