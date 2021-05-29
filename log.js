var express = require('express');
var app = express();
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(express.json())
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
knex.schema.hasTable("userTable").then( (exits) => {
    if (!exits) {
        return knex.schema.createTable("userTable",(table) => {
            table.increments("id").primary();
            table.string("username");
            table.string("email");
            table.string("password");
            table.string("role")
        })
    }
}) 
 knex.schema.hasTable("event_T").then((exits)=>{
    if(!exits){
        return knex.schema.createTable("event_T", (t) => {
            t.increments("id").primary();
            t.string("userEmail");
            t.string("Name");
            t.string("Description");
            t.integer("StartDate");
            t.integer("EndDate");
            t.string("City")

        })
    }
})
// Signup part
app.post("/signup", (req,res) => {
    const email = req.body.email
    knex.select('email').from('userTable').where('email', email)
    .then((data) => {
        // console.log(data, "???????????????????????????????")
        if (data.length > 0){
            console.log("user allready exists")
            res.send("user allready exists")
        }else{
            knex("userTable")
                .insert({
                        username : req.body.username,
                        email : req.body.email,
                        password : req.body.password,
                        role : req.body.role
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
    knex.select("email","role").from("userTable").where("email", req.body.email).andWhere("password",req.body.password)
    .then((data) => {
        if(data.length) {
            jwt.sign({ user: data }, "secretkey", (err, token) => {
                res.cookie('token',token);
                console.log(token);
                res.send("Auth successful")
            })        
        
        } else {
            res.status(401).json('Unauthorized client')
        }
    }).catch((err) => {
        console.log(err)
        res.send(err)  
    })

});
app.post('/eventModule',(req,res) => {
    const cook = req.cookies.token
    console.log(cook)
    jwt.verify(cook, "secretkey",(err,authdata) => {
        if(err){
            res.sendStatus(403)
        }else{
            var eventemail = req.body.userEmail;
            knex.select("*").from("userTable").where("email",eventemail)
            .then((data) =>{
                console.log(data);
                console.log(authdata);
                if(authdata["user"][0]["email"] === eventemail){
                    knex("event_T")
                        .insert({
                            userEmail : req.body.userEmail,
                            Name : req.body.Name,
                            Description : req.body.Description,
                            StartDate : req.body.StartDate,
                            EndDate : req.body.EndDate,
                            City : req.body.City

                        }).then(() => {
                            res.send("created!!!")
                            console.log("created!!!");
                        }).catch((err) => {
                            res.send(err)
                        })
                }else{
                    console.log("not match gmail...");
                    res.send("not match gmail....")
                }
            }).catch((err) => {
                res.send(err)
                console.log(err);
            })
        }

        })
    })


app.put('/updates',(req,res) => {
    var eventemail = req.body.userEmail;
    knex.select("*").from("userTable").where("email",eventemail)
    .then((data) =>{
        console.log(data);
        const cook = req.cookies.token
        console.log(cook)
        jwt.verify(cook, "secretkey",(err,authdata) => {
            if (err){
                console.log(err)
                res.send(err)
            }else{
                console.log(authdata);

                if(authdata["user"][0]["email"] === eventemail){
                    // console.log(">>>>>>");
                    var decoded = jwt.verify(req.headers.authorization,"secretkey")
                    // console.log(decoded,"asd")
                    console.log(decoded["user"][0]["email"])
                    knex('event_T')
                    .where({userEmail:decoded["user"][0]["email"]})

                    .update(req.body)
                    .then(() => {
                        res.send("updates successfully!!!!!")
                        console.log("updates successfully!!!")
                    }).catch((err) => {
                        console.log(err)
                        res.send(err)
                    })
                }else{
                    res.send("not updating!!!")
                    console.log("not updating!!!");
                }
            }

        })
        }).catch((err) => {
            res.send(err)
            console.log(err);
        
    })
})

app.delete('/deleted',(req,res) => {
    var eventemail = req.body.userEmail;
    knex.select("*").from("userTable").where("email",eventemail)
    .then((data) =>{
        console.log(data);
        const cook = req.cookies.token
        console.log(cook)
        jwt.verify(cook, "secretkey",(err,authdata) => {
            if (err){
                console.log(err)
                res.send(err)
            }else{
                console.log(authdata);

                if(authdata["user"][0]["email"] === eventemail){
                    // console.log(">>>>>>");
                    var decoded = jwt.verify(req.headers.authorization,"secretkey")
                    // console.log(decoded,"asd")
                    console.log(decoded["user"][0]["email"])
                    knex('event_T')
                    .where({userEmail:decoded["user"][0]["email"]})

                    .del(req.body)
                    .then(() => {
                        res.send("deleted successfully!!!!!")
                        console.log("deleted successfully!!!")
                    }).catch((err) => {
                        console.log(err)
                        res.send(err)
                    })
                }else{
                    res.send("not updating!!!")
                    console.log("not updating!!!");
                }
            }

        })
        }).catch((err) => {
            res.send(err)
            console.log(err);
        
    })
})

app.get("/sequence" , (req,res) => {
    knex()
        .select("*")
        .from("eventModel")
        .then(() => {
            knex("eventModel").orderBy([{ column: req.query.sortby,order : "asc" }])
            .then((data) => {
                console.log(data)
                res.send(data)
            })          
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
        })
})
app.get('/admi',(req,res) => {
    const cook = req.cookies.token
    // console.log(cook)
    jwt.verify(cook, "secretkey",(err,authdata) => {
        if(err){
            res.sendStatus(403)
        }else{
            // res.send(authdata)
            // console.log(authdata)
            if(authdata['user'][0]["role"] == "Admin"){
                knex("userTable")
                    .select("*")
                    .from("userTable")
                    .then(() => {
                        knex.select("*").from("userTable").then((data) => {
                            res.send(data)
                            console.log(data)

                        })
                        .catch((err) => {
                            res.send(err)
                            console.log(err)
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                        res.send(error)
                    })
            }else{
                console.log("......")
                res.send("......")
            }
        }

    })
})

app.get('/byUser',(req,res) => {
    const cook = req.cookies.token
    // console.log(cook)
    jwt.verify(cook, "secretkey",(err,authdata) => {
        if(err){
            res.sendStatus(403)
        }else{
            // res.send(authdata)
            console.log(authdata)
            if(authdata['user'][0]["role"] == "user"){
                knex("userTable")
                    .select("*")
                    .from("userTable")
                    .then(() => {
                        knex.select("*").from("userTable").then((data) => {
                            res.send(data)
                            console.log(data)

                        })
                        .catch((err) => {
                            res.send(err)
                            console.log(err)
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                        res.send(error)
                    })
            }else{
                console.log("user is not admin......")
                res.send("user is not admin.........")
            }
        }

    })
})


app.get('/joinTable',(req,res) => {
    const cook = req.cookies.token
    jwt.verify(cook, "secretkey",(err,authdata) => {
        if (err){
            console.log(err)
            res.send(err)
        }else{
            console.log(authdata);
            if(authdata['user'][0]["role"] == "Admin"){
                knex.select("*").from("userTable").rightJoin("event_T","userTable.email","event_T.userEmail")
                .then((data) => {
                    res.send(data)
                    console.log(data)

                }).catch((err) => {
                    res.send(err)
                    console.log(err)
                })
            }

        }
    
    })
})

app.get('/secondjoinTable',(req,res) => {
    const cook = req.cookies.token
    jwt.verify(cook, "secretkey",(err,authdata) => {
        if (err){
            console.log(err)
            res.send(err)
        }else{
            console.log(authdata);
            // if(authdata['user'][0]["role"] == "Admin"){
                knex.select("*").from("event_T").innerJoin("userTable","event_T.userEmail","userTable.email")
                .then((data) => {
                    res.send(data)
                    console.log(data)

                }).catch((err) => {
                    res.send(err)
                    console.log(err)
                })
            // }

        }
    
    })
})

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






