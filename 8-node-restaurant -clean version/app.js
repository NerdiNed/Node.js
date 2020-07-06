const express = require('express')
const emailSender = require('./myModules/emailSender') //* importing the emailSender module
// to be able to get and read files
const fs = require('fs')
// including the adminRouter
const adminRoute = require('./routes/adminRoute')
//set fileUpload middleware
// using it here because then it will be used in all routes
const fileUpload = require('express-fileupload')
// set up session
const session = require('express-session')
// set up the cookie parser
const cookie = require('cookie-parser') //4 

const app = express();

// declare the session parameters
// create session object options
const sessionOptions = {
  secret: 'burger', // can be a random name to make your session distinguishable from the other sessions
  cookie: {
    // secure: true,
    // maxAge: 5 * 60 * 1000  // setting an expire time for the cookie   //24 * 60 * 60 * 1000 -> 24h ... the 1000 are milliseconds
  } // if we don't want to use cookies for the session we set it as an empty object {}
}

// use a session
app.use(session(sessionOptions))

// using cooking parser
app.use(cookie()) //4 its the name of my const cookie. has to be the same name

//use express urlEncoder to get the posted data //! every time we use this we have to use app.use(express.json()) directly after it !
app.use(express.urlencoded({
  extended: false // false means the data that is send is not encoded // true means the data is encoded
}))
// need this middleware to check if the request coming to the server is json then it will convert it for you to object
app.use(express.json())
//limits the size of the uploaded files
app.use(fileUpload({
  limits: {
    fileSize: 50 * 1024 * 1024
  }, // 50 bytes * 1024 mb * 1024
}));

// access to the public folder
app.use(express.static('./public'))

// set the view engine type
app.set('view engine', 'ejs')
// path to the view engine folder
app.set('views', __dirname + '/views')



app.get('/', (req, res) => {

  res.render('main')
})

// i can set any random sub-route that i want 
// app.get('/home/subhome',(req,res)=>{
//     res.render('main') 
// })

app.get('/contact', (req, res) => {
  res.render('contact', {
    sent: 1
  })

})

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

//get the data from the json file
const mealData = fs.readFileSync(__dirname + '/meals.json') //*2
// convert the json string to object
const myMeals = JSON.parse(mealData) //*2

// the route to the adminRoute file
app.use('/admin', adminRoute.adminPageRouter(myMeals))

app.get('/login', (req, res) => {
  //check to see if there is a cookie saved in the browser(in req) or not
  console.log(req.cookies);
  // check if req.cookie.burgerUser exist to log him directly
  if (req.cookies.burgerUser) {
    // read the file for the user
    const userText = fs.readFileSync(__dirname + '/users.json')
    // convert the json string to object
    const userJson = JSON.parse(userText)
    //check existing user
    const foundUser = userJson.find(user => user.username == req.cookies.burgerUser.username && user.password == req.cookies.burgerUser.password)
    // if foundUser exist
    if (foundUser) { // cookie checker. so if the user still has the cookie but i want to suspend him from the database.. if he can't be found here he cant get in
      req.session.user = foundUser // use this
      res.redirect('/admin')
    } else { //if it doesn't exist render login
      res.render('login')
    }
  } else { // if you don't have cookie we will render login
    res.render('login')
  }

  //res.render('login')

});

app.get('/logout', (req, res) => {
  // destroy the session and log out
  req.session.destroy()
  //destroy the cookie when log out
  res.clearCookie('burgerUser') // need clearCookie and the cookie name
  res.redirect('/')
});

app.post('/login', (req, res) => {
  //get data send from the user
  //read json file
  //convert it to object
  //compare if username and password are same of one of in .json redirect /admin or show error message
  // console.log(req.body);
  // const config = require('./users.json');
  // const name = req.body.username
  // const password = req.body.password
  // const jsonData = JSON.stringify(req.body)
  // console.log(jsonData);
  // console.log(config);
  // config.forEach(element => {
  //     if (name == element.username && password == element.password) {
  //         res.redirect('/admin')
  //     }else {
  //         console.log('your data are wrong');
  //     }
  // });

  //console.log(req.session);

  const userText = fs.readFileSync(__dirname + '/users.json')
  // convert the json string to object
  const userJson = JSON.parse(userText)
  // let check = false
  // for (let i = 0; i< userJson.length; i++){
  //   if(req.body.username == users[i].username && req.body.password == users[i].password){
  //    check = true
  //    break;
  //   } 
  // }
  //  if (check){
  //    res.json("exist")
  //    
  //  } else {
  //    res.json('not existent')
  //  }

  const foundUser = userJson.find(user => user.username == req.body.username && user.password == req.body.password)
  if (foundUser) {
    req.session.user = foundUser
    // to save a cookie when logging in
    res.cookie("burgerUser", foundUser, {
      //maxAge: 60000,   //*set the age for the cookie for 1min
      httpOnly: true,
    }) //httpOnly:true will store the cookie in the browser chache. even we close the browser and kill the session  //set expiring age for that burgerUser cookie for 1 minute//4 res.cookie is the same as my const cookie name 
    res.json("exist")
  } else {
    res.json('notexist')
  }

});

app.get('/menu', (req, res) => {
  // i wrote this outside so it will be accessed anyway
  //  const mealData = fs.readFileSync(__dirname + '/meals.json')
  //  const myMeals = JSON.parse(mealData)
  res.render('menu', {
    meals: myMeals
  })
  //res.render('adminAddMeal', {meals: myMeals})
});

// show the single meals when they are clicked on in the menu page using id
// app.get('/meal/:id', (req, res) => { //*5
//   //res.send(req.params.id)
//   const idx = req.params.id
//  console.log(req.params.id);
 
//   if(myMeals[idx]){
//   res.render('meal', {
//     mealTitle: myMeals[idx].title,
//     mealPrice: myMeals[idx].price,
//     mealDescription: myMeals[idx].description,
//     mealImg: myMeals[idx].imgUrl
//   })
// } else{ 
//   res.send("this site doesn't exist")

// }
// });

//* show the single meals when they are clicked on in the menu page with their title in the browser
app.get('/meal/:title', (req, res) => { //*5
  //res.send(req.params.id)
  const browserMealTitle = req.params.title
  const displayedMeal = myMeals.find(meal =>meal.title.trim().replace(/ /g,'_')== browserMealTitle)
  console.log(req.params.title);
 
  if(displayedMeal){
  res.render('meal', {
    mealTitle: displayedMeal.title,
    mealPrice: displayedMeal.price,
    mealDescription: displayedMeal.description,
    mealImg: displayedMeal.imgUrl,
    mealDetails: displayedMeal.details
  })
} else{ 
  res.send("this site doesn't exist")

}
});

app.listen(4200, () => {
  console.log('app is listening on port 4200');

});




















//* !name means if there is no name. same as name !=''

//*2
//* to write this two variables globally i will have to make sure that int info is always synchronized with my json data file. 
// if i wrote it those two lines in every app.get it would slow down the application as it would it read it again
//* to make sure that my data is synchronized with the file the cases are :  it will always have to be in sync when added or deleted
//* so i will have to add these two lines in my created function when i add or delete the data
// so i can make sure it is always synced
//*
// session is shared between the browser and the server. like a backend global storage.
// if i log in from a certain browser, the changed the browser, the new browser will ask me to log in again because it has no access to that session.  
//! when i want to set a cookie i use res.cookie!
//! when i want to see a cookie i have to write req.cookies !
//* foundUser = validUser

//*5
// /meal/:id means that i am setting an id after meals/ in my menu.ejs <h3><a href="/meal/<%=i%>">.. in this case i put the index directly
//after the slash in meals. so the index is going to be my id ! 
// i set that meal/ with an aa tag which i closed after the imported express tags  <h3><a href="/meal/<%=i%>"><%= meals[i].title %></a>
//so everything i put directly after the /meal/ will be the id 
// and with /meal/ in my app.get('/meal/:id' it know where to access it in the menu.ejs

//* in the menu.ejs
//this <%=mealTitle%>, description etc are not the same as in the other ejs file( addmeal for example) these are new set variables but i will set them with the same values -->
