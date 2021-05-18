var express = require('express');
var app = express();
var mysql = require('mysql');
const bodyParser=require("body-parser");
app.use(bodyParser.json())

var port = 7000;


const knex = require("knex")({
    client: "mysql",
    version: '7.2',
    connection: {
      host: "localhost",
      user: "root",
      password: "Shanti123#@!",
      database: "student_details"
    }
})


knex.schema.hasTable("pagalDetails").then( (exits) => {
    if (!exits) {
        return knex.schema.createTable("pagalDetails",(table) => {
            table.increments("id").primary();
            table.string("username");
            table.string("email");
            table.string("password");
        })
    }
}) 

// Signup part

app.post("/signup", (req,res) => {
    const email = req.body.email
    knex.select('email').from('pagalDetails').where('email', email)
    .then((data) => {
        console.log(data, "???????????????????????????????")
        if (data.length > 0){
            console.log("user allready exists")
            res.send("user allready exists")
        }else{
            knex("pagalDetails")
                .insert({
                        username : req.body.username,
                        email : req.body.email,
                        password : req.body.password,
                    })
                    .then(() => {
                        console.log("your details are created.... ")
                        res.send("your details are created.... ")
                    }).catch((error) => {
                        console.log(error)
                        res.send(error)
                    })
        }
    })
})

//Logging part:-

app.post("/login" , (req,res) => {
    console.log(req.body.email, " email....")
    knex.select("email").from("pagalDetails").where("email", req.body.email).andWhere("password",req.body.password)
    .then((data) => {
        if (data.length){
            console.log("congrats! " , "you have logged in successfully...  ")
            res.send("logged in successfully ")
        }else if (!data.length) {
            console.log("Invaild email and password...! ")
            res.send("Invaild email and password...!   ")
        }
    }).catch((err) => {
        console.log(err)
        res.send(err)  
    })
});

app.listen(port, () => {
    console.log(`your port is running ${port}`)
})




























// app.post("/posting",function(req,res){
//     knex('pagalDetails').insert(
//         {
//             username : req.body.username,
//             email : req.body.email,
//             password : req.body.password,
//         }
//         ).then(()=>{
//         knex.select("*").from("pagalDetails").then((data)=>{
//             res.send(data)
//         })
//     }).catch(()=>{
//         console.log("ERROR-----------------")
//     })
// });






