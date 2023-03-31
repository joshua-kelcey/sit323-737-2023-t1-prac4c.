const express = require("express");
const res = require("express/lib/response");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require("path");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;

const app = express();

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());


// Reset the token file to make the user authenticate
fs.writeFile( "localToken.json",
              JSON.stringify({}),
              (err) => {
                if (err) throw err;
                console.log("Creating Token");
    }
)


function getJwt() {
    // if the token isn't valid, it won't make it past this function
    let this_token = JSON.parse(fs.readFileSync('./localToken.json').toString()); // load the token in
    return this_token.Authorization;
  }
  
passport.use( "jwt",
              new JWTstrategy( { secretOrKey: "TOP_SECRET_KEY",
                                 jwtFromRequest: getJwt,
                                },
                                async (token, done) => {
                                    return done(null, token.user);
                                }
             )
);
  
passport.use(
    "signin",
    // usernameField and passwordField point to the username and password name (in the html), passed into the function here as (username, password)
    new localStrategy( { usernameField: "username", passwordField: "password" },
                        async (username, password, done) => {
                        done(null, {user:username,password:password}, { message: "signed in" })
                       }
    )
);

const port=3040;
app.listen(port,()=> {
    console.log("Listening to port: " +port);
})

app.get("/", (req,res)=>{
    res.send("Welcome to the site! Authenticate at /signin to use the calculator")
})

// test to see if authenticated or not
app.get("/secure", passport.authenticate("jwt", {session:false}), (req,res)=>{
    res.send("Passed Security!")
})

app.get("/success", (req,res)=>{
    res.send("Signed In!")
})

app.get("/failed", (req,res)=>{
    res.send("Failed To Sign In!")
})

// user has to go to signin to authenticate
app.get("/signin", (req,res)=>{
    res.render("signin")
})

app.post("/signin",  (req,res,next)=>{
    // authenticate using a local strategy, if it fails run the function
    passport.authenticate("signin", async (error, user, info) => {
        
        if (error) return next(error.message);

        // create a token
        if (user){
            console.log(user);
            const body = { _id: user.username, password: user.password }
            let encrypt_key = "TOP_SECRET_KEY";
            const token = jwt.sign({user:body}, encrypt_key);

            await fs.writeFile( "localToken.json",
                                JSON.stringify({Authorization: token}),
                                (err) => {
                                     if (err) throw err;
                                    console.log("Creating Token");
                                }
            )

            res.redirect(`/success`);
        } 

    })( req, res, next )
})


app.post("/signin", (req,res,next)=>{
    res.send("Sign In Complete")
})


const add = function(n1,n2){
    return n1+n2;
}


const subtract = function(n1,n2){
    return n1-n2;
}


const divide = function(n1,n2){
    return n1/n2;
}


const multiply = function(n1,n2){
    return n1*n2;
}


const checkNumbers = function(n1,n2){

    if(isNaN(n1)) {
        throw new Error("n1 incorrectly defined");
    }
    
    if(isNaN(n2)) {
        throw new Error("n2 incorrectly defined");
    }
    
    if (n1 === NaN || n2 === NaN) {
        throw new Error("Parsing Error");
    }
}


const calculator = function(req,operation){
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);
    checkNumbers(n1,n2);
    const result = operation(n1,n2);
    return result;
}


//http://localhost:3040/add?n1=2&n2=10
//Invoke-RestMethod -Uri http://localhost:3040/add?n1=2"&"n2=10 -Method Get -Headers @{"Content-Type"="application/json"}
app.get("/add", passport.authenticate("jwt", {session:false}), (req,res)=>{
    try{
        const result = calculator(req, add);
        res.status(200).json({statuscode:200, data: result }); 
    } catch(error) { 
        res.status(500).json({statuscode:500, msg: error.toString() })
      }
});


//http://localhost:3040/subtract?n1=2&n2=10
//Invoke-RestMethod -Uri http://localhost:3040/subtract?n1=2"&"n2=10 -Method Get -Headers @{"Content-Type"="application/json"}
app.get("/subtract", passport.authenticate("jwt", {session:false}), (req,res)=>{
    try{
        const result = calculator(req, subtract);
        res.status(200).json({statuscode:200, data: result }); 
    } catch(error) { 
        res.status(500).json({statuscode:500, msg: error.toString() })
      }
});


//http://localhost:3040/multiply?n1=2&n2=10
//Invoke-RestMethod -Uri http://localhost:3040/multiply?n1=2"&"n2=10 -Method Get -Headers @{"Content-Type"="application/json"}
app.get("/multiply", passport.authenticate("jwt", {session:false}), (req,res)=>{
    try{
        const result = calculator(req, multiply);
        res.status(200).json({statuscode:200, data: result }); 
    } catch(error) { 
        res.status(500).json({statuscode:500, msg: error.toString() })
      }
});


//http://localhost:3040/divide?n1=2&n2=10
//Invoke-RestMethod -Uri http://localhost:3040/divide?n1=2"&"n2=10 -Method Get -Headers @{"Content-Type"="application/json"}
app.get("/divide", passport.authenticate("jwt", {session:false}), (req,res)=>{
    try{
        const result = calculator(req, divide);
        res.status(200).json({statuscode:200, data: result }); 
    } catch(error) { 
        res.status(500).json({statuscode:500, msg: error.toString() })
      }
});