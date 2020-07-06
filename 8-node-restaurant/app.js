const express = require('express')
const emailSender = require('./myModules/emailSender') //* importing the emailSender module
// to be able to get and read files
const fs = require('fs')
// including the adminRouter
const adminRoute = require('./routes/adminRoute')
//set fileupload middleware
// using it here because then it will be used in all routes
const fileUpload = require('express-fileupload')
const app = express();

//use express urelencoder to get the posted data
app.use(express.urlencoded({
  extended: false
}))

app.use(fileUpload({
  limits: {
      fileSize: 50 * 1024 * 1024
  }, // 50 bytes * 1024 mb * 1024
}));
// the above code is the same process as with the body parser just the express version
// let q = url.parse(req.url, true) // q is as same as urlObj as used it before

// import nodemailer 
//const nodemailer = require('nodemailer') //* we put this in the external module emailSender.js

// access to the public folder
app.use(express.static('./public'))

// set the view engine type
app.set('view engine', 'ejs')
// path to the view engine folder
app.set('views', __dirname + '/views')



app.get('/', (req, res) => {
  res.render('main')
})
// app.get('/home/subhome',(req,res)=>{
//     res.render('main') 
// })

// the route to the adminRoute file



app.get('/contact', (req, res) => {
  res.render('contact', {
    sent: 1
  })
  // let q = url.parse(req.url, true) //* q is as same as urlObj as used it before
  //console.log(q.query)

  // this didn't work with the if-statement. have to change the url: in the public:contact.js folder
  //  if (q.query.name && q.query.email && q.query.subject) { // means if there is something entered in the name input
  //  console.log(q.query)

  //* the following commented code is in an external module named: emailSender.js
  //* also it should be written in the app.post function. 
  // const transporter = nodemailer.createTransport({
  //     service: 'gmail',  
  //     auth: {  
  //         user: 'nerdined7@gmail.com',
  //         pass: '....'
  //     }
  // })
  // const mailOption = {
  //     from: 'another@email.com',
  //     to: 'nerdined7@gmail.com',
  //     subject: 'your registration was a success',
  //     text: 'this is a dummy  text'
  // }

  // transporter.sendMail(mailOption, function(error, info){
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('Email sent: ' + info.response);
  //     }

  //   }); 

  //   }

})

// we wanted to do it without ajax we didn't comment it /contact.. just changed it in contact.ejs into /contact1
app.post('/contact', (req, res) => {
  console.log(req.body);
  // making a server-side validation
  // first put the params into a variable :   emailSender.sendEmail( req.body.email, req.body.subject, req.body.message,(ok)=>
  const name = req.body.name
  const email = req.body.email
  const subject = req.body.subject
  const message = req.body.message

  if (name != "" && name.length < 100) { // this is the validation .. saying : if the name is not empty and smaller than 100 characters.. //*1
    //then we put the following code into an if-statement
    emailSender.sendEmail(name, email, subject, message, (ok) => {

      //res.json(200)
      if (ok) {
        res.sendStatus(200)

      } else {
        res.sendStatus(500)

      }

    });
  }

})


app.post('/contact1', (req, res) => {
  console.log(req.body);
  // making a server-side validation
  // first put the params into a variable :   emailSender.sendEmail( req.body.email, req.body.subject, req.body.message,(ok)=>
  const name = req.body.name
  const email = req.body.email
  const subject = req.body.subject
  const message = req.body.message

  if (name != "" && name.length < 100) { // this is the validation .. saying : if the name is not empty and smaller than 100 characters.. //*1
    //then we put the following code into an if-statement
    emailSender.sendEmail(name, email, subject, message, (ok) => {

      //res.json(200)
      if (ok) {
        // res.sendStatus(200)
        res.render('contact', {
          sent: 2
        }) // because we want to render the contact page after sending the message and email we have to use res.render and not res.sendStatus !
      } else {
        // res.sendStatus(500)
        res.render('contact', {
          sent: 3
        }) // this will show the "view" contact
      }

    });
  }

})

//* created a json file for it and put it there
// let meals = [{
//     title: "Beefy Burgers",
//     description: "Great way to make your business appear trust and relevant.",
//     imgUrl: "/img/burger/1.png",
//     price: 15
//   },
//   {
//     title: "Burger Boys",
//     description: "Great way to make your business appear trust and relevant.",
//     imgUrl: "/img/burger/2.png",
//     price: 5
//   },
//   {
//     title: "Burger Bizz",
//     description: "Great way to make your business appear trust and relevant.",
//     imgUrl: "/img/burger/3.png",
//     price: 5
//   },
//   {
//     title: "Crackles Burger",
//     description: "Great way to make your business appear trust and relevant.",
//     imgUrl: "/img/burger/4.png",
//     price: 5
//   },
//   {
//     title: "Bull Burgers",
//     description: "Great way to make your business appear trust and relevant.",
//     imgUrl: "/img/burger/5.png",
//     price: 5
//   },
//   {
//     title: "Rocket Burgers",
//     description: "Great way to make your business appear trust and relevant.",
//     imgUrl: "/img/burger/6.png",
//     price: 5
//   },
//   {
//     title: "Smokin Burger",
//     description: "Great way to make your business appear trust and relevant.",
//     imgUrl: "/img/burger/7.png",
//     price: 5
//   },
//   {
//     title: "Delish Burger",
//     description: "Great way to make your business appear trust and relevant.",
//     imgUrl: "/img/burger/8.png",
//     price: 5
//   },
//   {
//     title: "Crackles Burger",
//     description: "Great way to make your business appear trust and relevant.",
//     imgUrl: "/img/burger/4.png",
//     price: 5
//   },
//   {
//     title: "Bull Burgers",
//     description: "Great way to make your business appear trust and relevant.",
//     imgUrl: "/img/burger/5.png",
//     price: 5
//   }
// ]

//* to write this two variables globally i will make sure that int info is always synchronized with my json data file. 
//get the data from the json file
const mealData = fs.readFileSync(__dirname + '/meals.json')
// convert the json string to object
const myMeals = JSON.parse(mealData)

// using the 
app.use('/admin', adminRoute.adminPageRouter(myMeals))

// app.get('/admin/addmeal', (req, res) => {
//   //res.render('adminAddMeal', {meals: meals}) changed it after deleting the meal obj and creating the file now named myMeals

//   //const mealData = fs.readFileSync(__dirname + '/meals.json')
//   //const myMeals = JSON.parse(mealData)
//   res.render('adminAddMeal', {meals: myMeals})
   
//   })


// app.post('/admin/addmeal', (req, res) => {
//   // creating them as variables and not passing them directly because of the validation for the server that i will create
//   const mealTitle = req.body.mealTitle
//   const mealPrice = req.body.mealPrice
//   const mealDescription = req.body.mealDescription

//   let obj = {
//     title: mealTitle,
//     description: mealDescription,
//     imgUrl: "/img/burger/1.png",
//     price: mealPrice

//   }
// // normally we would save it in a database or for simulation create an own json file for it. but for now i will keep it here and push it into the meals array
//   myMeals.push(obj)  // pushing the object into the "meals"
//   // res.render('adminAddMeal', {
//   //   meals: meals
//   // })

//   //put the stringified object into the meals.json file . so its not deleted when the site is down and loads again
//  fs.writeFileSync(__dirname + '/meals.json',JSON.stringify(myMeals))
//   res.redirect('/admin/addmeal') // like this the page doesn't submit again and again

// });

// app.get('/admin/deletemeal', (req, res) => {
//   res.render('adminDeleteMeal', {meals: myMeals})
// })

app.get('/menu', (req, res) => {
  //res.render('menu', {meals: meals})

 // const mealData = fs.readFileSync(__dirname + '/meals.json')
 // const myMeals = JSON.parse(mealData)
  res.render('adminAddMeal', {meals: myMeals})
})
app.listen(4200, () => {
  console.log('app is listening to port 4200');

})

//* !name means if there is no name. same as name !=''

//*2
//* to write this two variables globally i will make sure that int info is always synchronized with my json data file. 
// if i wrote it those two lines in every app.get it would slow down the application as it would it read it again
//* to make sure that my data is synchronized with the file the cases are :  it will always have to be in sync when added or deleted
//* so i will have to add these two lines in my created function when i add or delete the data
// so i can make sure it is always synced