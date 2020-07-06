const express = require ('express')
const bodyParser = require('body-parser') //!7
const app = express();  //* 1 the application is an instance from express

// det body parser middleware
app.use(bodyParser.urlencoded({extended : true})) //!7
//app.use(express.urlencoded({extended : true})) //?
//route /root of the domain
app.get('/', (req, res)=>{ //*2
//res.send('hello fbw5')  //* sending the response 
res.sendFile(__dirname + '/home.html')  //! 4
})   //*2

app.post('/', (req,res)=>{  //*6
console.log(req.body);
if(req.body.username == 'user1' && req.body.password == '1234'){ //*8
    res.send('your login was successful')
        
} else {
    res.send("this didn't work")
}
  


})

// app.post('/',(req, res)=>{
//     console.log(req.body);
 //res.send('this is the post handler )  
// })

//get the route for about : /about  //*3
app.get('/about', (req,res)=>{
 res.send(__dirname) //!5
})

//route/ contact
app.get('/contact', (req,res) =>{
    res.send('contact me')
})

app.get('/test', (req,res)=>{
    console.log(req);
    
    res.json('test')
})

// the app has to listen to a port 
app.listen(3000, ()=>{
    console.log('app listening on port 3000!');
    
})






//* 1 this is was the instance will return

//*2 sending the data by using get. this is a get request to get the url  
// sending a post request would be done the same way app.post
//it's a callback function same as in node.js

//*3 in node js we had to use switch case to create a route for /about
 
//! 4 
// trying to get the file ('home.html') 
// by writing : res.sendFile('home.html') i would get an error saying:
// path must be absolute or specify root to res.sendFile
// absolute means static : but my path can't be static when working on an extern project (outside of my computer)
// the path is not found .. so : i have to use __direname + 
// (__dirname + '/home.html')   i have to use a slash before home
// __direname is the absolute path to my project
// it has to be sendFile not .send because we want to get the entire file. 

//!5
// because __direname is the direct directory path i can just replace the 
//res.send('about') with  res.send(__dirname) it will show me the path in my browser instead of 'about'

//* __dirname is an environmental variable .. means it depends on the environment 

//*6
// i need a post handler to be able to send the password and email

//!7
// middleware is a function has to be at the beginning of the app
// it stops the process and then goes on only when its needed/called like a promise
//! bodyParser
// the bodyParser will let you show the content of the post in the terminal and not in the url in the browser. like this 
// you can access the content you need like username for example directly or everything that is in the body 
// by consoling console.log(req.body) or console.log(req.body.username)
//? bodyParse is almost since a year a part of express .. so i actually don't need to write bodyparse anymore. 
//i can write : app.use(express.urlencoded({extended : true})) 

//*8 
// req.body.password  accesses the name="" in the html <input type="password" name="password">
// same as in the other inputs <input type="text" name="username" placeholder="username">