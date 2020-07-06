//------------ set up

const express = require('express')
//const fileUpload = require('express-fileupload')

// require fs because we need it in post to be able to add products
const fs = require('fs')
const path = require('path')

// creating a function from the adminRoute to be able to pass a parameter because we want the meals file to only be used from one source ! 
// instead of calling the file again in app.js 
function adminPageRouter(myMeals) {

    const adminRoute = express.Router()

    // ---------------------routes 
    
    // admin // add meal // get
    adminRoute.get('/addmeal', (req, res) => {
        //res.render('adminAddMeal', {meals: meals}) changed it after deleting the meal obj and creating the file now named myMeals
    
        //const mealData = fs.readFileSync(__dirname + '/meals.json')
        //const myMeals = JSON.parse(mealData)
        res.render('adminAddMeal', {
            meals: myMeals
        })
    
    })

    // adminRoute.use(fileUpload({
    //     limits: {
    //         fileSize: 50 * 1024 * 1024
    //     }, // 50 bytes * 1024 mb * 1024
    //   }));
  
    
    // admin/delete meal // post
    adminRoute.post('/addmeal', (req, res) => {
        // creating them as variables and not passing them directly because of the validation for the server that i will create
        const mealTitle = req.body.mealTitle
        const mealPrice = req.body.mealPrice
        const mealDescription = req.body.mealDescription
       
        console.log(req.body); // seeing username 
        console.log(req.files.mealImg); 
    // creating an if statement for validation of the filled data types
    if(mealTitle && mealPrice && mealDescription && req.files){
    
    const mealImg = req.files.mealImg // putting the file name into a variable 
    //get image extension (jpeg, png etc)
    let ext = mealImg.name.substr(mealImg.name.lastIndexOf('.'))

    // move the uploaded file to public folder
    mealImg.mv('./public/uploadedfiles/' + mealTitle.replace(/ /g, '_') + myMeals.length + ext).then(() => {  
   
    let obj = {
        title: mealTitle,
        description: mealDescription,
        imgUrl: '/uploadedfiles/' + mealTitle.replace(/ /g, '_') + myMeals.length + ext,
        price: mealPrice

    }
   // normally we would save it in a database or for simulation create an own json file for it. but for now i will keep it here and push it into the meals array
   myMeals.push(obj) // pushing the object into the "meals"
   // res.render('adminAddMeal', {
   //   meals: meals
   // })
   fs.writeFileSync('./meals.json', JSON.stringify(myMeals))
    // we need to write the full path on res.redirect
    res.redirect('/admin/addmeal') // like this the page doesn't submit again and again
    
    //res.render('main')
     }).catch(error => {
      console.log(error.message);
      res.send(error.message)
   })
    } else{
        res.send('the meal data is not complete')
    }
   //put the stringified object into the meals.json file . so its not deleted when the site is down and loads again
   
    });
    
    adminRoute.get('/deletemeal', (req, res) => {
        res.render('adminDeleteMeal', {
            meals: myMeals
        })
    })
    

    adminRoute.post('/deletemeal', (req, res)=>{   //*1
    //console.log(req.body.mealid);
   // res.json(1)   //i will have t use this if i send dataType: "json", in the ajax request in the admindeletemeal.ejs
   // deleteing a meal from the meals array
   const idx = req.body.mealid
  // console.log(req.body.mealid);


  
  console.log(myMeals[idx].imgUrl);
  console.log('/public'+myMeals[idx].imgUrl);

  // deleting the image from the uploadedfiles folder
  //synchronized version 
  try{
 fs.unlinkSync('./public'+myMeals[idx].imgUrl);
} catch(err){
    console.log(err);
    
}

// if the code blocks : 
// fs.unlink('./public'+myMeals[idx].imgUrl, (err) => {
//     if (err) {
//       console.error(err)
//       return
//     }
  
// })

// deleting meal from the meals.json
   myMeals.splice(idx, 1)
    console.log(myMeals);

    //getting the meals objects converting it to json and send it back so the meals are deleted
    // deleting the element from the backend (meals.json file)
    fs.writeFileSync('./meals.json', JSON.stringify(myMeals))

   res.sendStatus(200)  
})

    // connecting it to adminEditMeal and the content of meals.json
    adminRoute.get('/editmeal',(req,res) =>{
    res.render('adminEditMeal', {meals: myMeals}) //
  
  })

  adminRoute.post('/editmeal',(req,res) =>{
   console.log(req.body);
   myMeals[req.body.mealid].title = req.body.mealTitle
   myMeals[req.body.mealid].description = req.body.mealDescription
   myMeals[req.body.mealid].price = req.body.mealPrice
   fs.writeFileSync('./meals.json', JSON.stringify(myMeals))     
   res.sendStatus(200) //
  
  })
  
    return adminRoute  // we must return it here ! because the app only uses the express router !

}


//------------ export the module to app.js
module.exports = {adminPageRouter}
    




//* /deletemeal (and all the others.. /addmeal etc)  will be automatically added to /admin... so the route of it will be /admin/deletemeal.. 
//so when writing it in the url in the ajax request of the adminDeletemeal.ejs the route is then /admin/deletemeal
//! i changed the style.css library in line 2765 the size of the uploaded image .. so every uploaded image has the same size. and looks the sam e
// i added width and height to it 
// .best_burgers_area .single_delicious .thumb img {
//     -webkit-border-radius: 50%;
//     -moz-border-radius: 50%;
//     border-radius: 50%;
//     width:166px;
//     height:166px;
//   }