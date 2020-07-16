const express = require('express')
const session = require('express-session')
const fileupload = require('express-fileupload')
const cookie = require('cookie-parser')

const fs = require('fs')

//include data Module
const dataModule = require('./modules/mongodbDataModule') 
//include the admin router 
const adminRouter = require('./routes/adminRoute')

const app = express()
// access to the public folder
app.use(express.static( __dirname +'/public'))  // or app.use(express.static(./public'))
// set the view engine 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views')

app.use(express.urlencoded({extended: false}))
//set middleware to parse the json
app.use(express.json())
// session options 
const sessionOptions = {
secret: 'bookstore',
resave: false,
saveUninitialized: false,
cookie: { }  // if there is secure: tru in the {} then i have to use https: in the browser..(not now as i am working on localhost)
}
// app.use(session({
//     secret: 'bookstore',
//     cookie: {}
// }));
// use the session
app.use(session(sessionOptions))
//use the cookie
app.use(cookie())
// use the fileuploader
app.use(fileupload({
    limits: {fileSize: 50 * 1024 * 1024}
}))

// get the data from the json file books.
//const bookData = fs.readFileSync(__dirname + '/books.json')
/// convert the json data into object
//const theBooks = JSON.parse(bookData)

//this route middleware should be at the end of all the others, so the router can use all the others
//! create route to admitRoute
app.use('/admin', adminRouter)

//get the main page and render
app.get('/', (req, res)=>{
    res.render('main')
});
// get the register page
app.get('/register', (req,res)=>{
    res.render('register')
});

app.post('/register', (req, res)=>{
    console.log(req.body);
   //this is the register post handler
   //1 means user registered successfully //  res.json(1)
   //2 means data error // res.json(2)
   //3 means user exists
   //4 means server error
    const email = req.body.email.trim()
    const password = req.body.password
    const passwordRep = req.body.passwordRep
    if(email && password && password == passwordRep){
        dataModule.registerUser(email,password).then(()=>{
        res.json(1)
        }).catch(error=>{
            console.log(error);
            if(error == 'exist'){
                res.json(3)
            } else{
                res.json(4)
            }
            
        })
    } else{
        res.json(2)
    }
    // const userData = fs.readFileSync(__dirname + '/users.json')
    // const userJson = JSON.parse(userData)
   

});
// login route
app.get('/login', (req,res)=>{
    if(req.session.user){
        res.redirect('/admin')
    } else {
        res.render('login')
    }
})
// get the data from the login
app.post('/login', (req,res)=>{
    console.log(req.body);
    if(req.body.email && req.body.password){ // if i have these data then go on
        dataModule.checkUser(req.body.email.trim(), req.body.password).then(user =>{
            req.session.user = user 
            console.log(user);
            res.json(1)
        }).catch(error =>{
            if(error == 3){
                res.json(3)
            } else{
                res.json(4)
            }
        })
    } else{
        res.json(2) // something is missing show error 2
    }
      
})
// shop route
app.get('/shop', (req, res)=>{
    dataModule.getAllBooks().then(books=>{ //*1
        res.render('shop', {books})
    })
})


// get book by using TITLE  and ID
app.get('/product/:title/:id', (req, res)=>{ //*2
  // res.send(req.params.id)
  // res.send(req.params.title)

  //ahmad solution: 
  dataModule.getBook(req.params.id).then(book =>{
      // check if the user is  inside the session to be able to download the book
      let checkLogin = false
      if(req.session.user){
          checkLogin = true
      } // the validation is also in the login.ejs
      res.render('singleProduct', {book, checkLogin})
  }).catch(error =>{
      res.send('404, book could not be found')
  })


  //my solution
//   dataModule.getAllBooks().then(books=>{
//     // const bookTitle = req.params.title
//     // foundBook = books.find(book => book.title.().replace(/ /g,' ' ) == bookTitle)
    
//     //consol.log(foundBook.details;
//     console.log(req.params.title);
//     const bookTitle = req.params.title
//     const foundBook = books.find(book => book.title.trim().replace(/ /g ,'_') == bookTitle)
//     const descripLength = foundBook.description.length-4

//     if(foundBook){
//         res.render('singleProduct', {
//             bookTitle : foundBook.title,
//             bookDescription: foundBook.description.slice(3, descripLength),
//             bookImg0: foundBook.imgs[0],
//             bookImg1: foundBook.imgs[1],
//             bookImg2: foundBook.imgs[2],
//             tempFile: foundBook.pdfUrl
//         })
   
//     } else { 
//         res.send('you are on the wrong way')
//     }
    
//   })
})


// set the port
app.listen(4000, ()=>{
    console.log('App listens on port 4000!');
    
});


//* 
// app.use(bla()) function in use that means it is a middleware

//*1
// shop route could also write it like this : blaBooks is the books object the array of books which it is going through
// i am writing {books:blaBooks}) because the property and the value don't have the same names. if they had the same name it's like the above code which is not commented
// app.get('/shop', (req, res)=>{
//     dataModule.getAllBooks().then(blaBooks=>{ 
//         res.render('shop', {books:blaBooks})
//     })
//     res.render('shop')
// })

//*2
//app.get('/product/:title/:id' 
// with this line /:title/: we are accessing the bookTitle and id (same name as in the json.file)
// we don't need the title here to get the book, but we add it for SEO search engine operations.
// for the browser url.. it wil be the path we will see in the url in the browser. but we can access them like this in 
// shop.ejs.. : <h6><a href="/product/<%=books[i].title.trim().replace(/ /g, '_')%>/<%= books[i].id %>">Download Now</a></h6>