//------------ set up
const express = require('express')
//const fileUpload = require('express-fileupload') //*1

// require fs because we need it in post to be able to add products
const fs = require('fs')
// creating a function from the adminRoute to be able to pass a parameter because we want the meals file to only be used from one source ! 
// instead of calling the file again in app.js 
function adminPageRouter(myMeals) {
    // ---------------------routes 
    const adminRoute = express.Router()

    // creating a middleware to check the session for all routes in admin/ ..admin/blabla
    //* middleware should be a function and MUST contain 3 parameters
    // parameters : 1.req  2. res 3. next (next is a callback)
    adminRoute.use((req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            res.redirect('/')
        }

    })

    adminRoute.get('/', (req, res) => {
        console.log(req.session.user);
        // this secures the admin page. //*3
        // if(req.session.user){
        //     res.render('admin')
        // } else {
        //     res.redirect('/login')
        // }
        res.render('admin') // this has to be commented when there is no middleware because its in the if-statement
    })


    // admin // add meal // get
    adminRoute.get('/addmeal', (req, res) => {
        //res.render('adminAddMeal', {meals: meals}) changed it after deleting the meal obj and creating the file now named myMeals

        res.render('adminAddMeal', {
            meals: myMeals,
            check: true
        })
    })

    // admin/delete meal // post
    adminRoute.post('/addmeal', (req, res) => {
        // creating them as variables and not passing them directly because of the validation for the server that i will create
        const mealTitle = req.body.mealTitle
        const mealPrice = req.body.mealPrice
        const mealDescription = req.body.mealDescription
        const mealDetails = req.body.mealDetails

        console.log(req.body); // seeing username 
        console.log(req.files.mealImg);

        // creating an if statement for validation of the filled data types
        if (mealTitle && mealPrice && mealDescription && req.files) {

            // check if the meal Title already exists
            const findMatchMeal = myMeals.find(meal => meal.title == mealTitle)
             // check if the meal Title already exists
            if (findMatchMeal) {
                // res.send("this meal title already exists")
                res.render('adminAddMeal', {
                    meals: myMeals,
                    check: false
                });
            } else {
                // putting the file name into a variable 
                const mealImg = req.files.mealImg
                //get image extension (jpeg, png etc)
                let ext = mealImg.name.substr(mealImg.name.lastIndexOf('.'))

                // move the uploaded file to public folder
                mealImg.mv('./public/uploadedfiles/' + mealTitle.replace(/ /g, '_') + myMeals.length + ext).then(() => {

                    let obj = {
                        title: mealTitle,
                        description: mealDescription,
                        imgUrl: '/uploadedfiles/' + mealTitle.replace(/ /g, '_') + myMeals.length + ext,
                        price: mealPrice,
                        details: mealDetails

                    }
                    // normally we would save it in a database or for simulation create an own json file for it. but for now i will keep it here and push it into the meals array
                    myMeals.push(obj) // pushing the object into the "meals"

                    //put the stringified object into the meals.json file . so its not deleted when the site is down and loads again
                    fs.writeFileSync('./meals.json', JSON.stringify(myMeals))
                    // we need to write the full path on res.redirect
                    res.redirect('/admin/addmeal') // like this the page doesn't submit again and again

                    //res.render('main')
                }).catch(error => {
                   // console.log(error.message);
                    res.send(error.message)
                })
        //closing the else of the meal title searcher here
            }
        } else {
            res.send('the meal data is not complete')
        }

    });

    adminRoute.get('/deletemeal', (req, res) => {
        res.render('adminDeleteMeal', {
            meals: myMeals
        })
    })


    adminRoute.post('/deletemeal', (req, res) => { //*1
        //console.log(req.body.mealid);
        // res.json(1)   //i will have t use this if i send dataType: "json", in the ajax request in the admindeletemeal.ejs
        // deleteing a meal from the meals array
        const idx = req.body.mealid
        // console.log(req.body.mealid);

        console.log(myMeals[idx].imgUrl);
        console.log('/public' + myMeals[idx].imgUrl);

        // deleting the image from the uploadedfiles folder
        //synchronized version 
        try {
            fs.unlinkSync('./public' + myMeals[idx].imgUrl);
        } catch (err) {
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
    adminRoute.get('/editmeal', (req, res) => {
        res.render('adminEditMeal', {
            meals: myMeals
        }) 

    })

    //sending the edited data
    adminRoute.post('/editmeal', (req, res) => {
        console.log(req.body);
        console.log(req.files);
        myMeals[req.body.mealid].title = req.body.mealTitle
        myMeals[req.body.mealid].description = req.body.mealDescription
        myMeals[req.body.mealid].price = req.body.mealPrice



        //should only run if there is an image . so adding a if-statement
        if (req.files) {
            console.log(req.files);
            const mealImg = req.files.imgFile
            try {
                //delete the old image file from the backend
                fs.unlinkSync('./public' + myMeals[req.body.mealid].imgUrl)
            } catch (error) {
                console.log(error);

            }

            // get image extension
            let ext = mealImg.name.substr(mealImg.name.lastIndexOf('.'))

            mealImg.mv('./public/uploadedfiles/' + req.body.mealTitle.replace(/ /g, '_') + req.body.mealid + ext).then(() => {
                myMeals[req.body.mealid].imgUrl = "/uploadedfiles/" + req.body.mealTitle.replace(/ /g, '_') + (req.body.mealid) + ext
                // updating my json file myMeals
                fs.writeFileSync('./meals.json', JSON.stringify(myMeals))
                //res.sendStatus(200)
                res.json(myMeals[req.body.mealid].imgUrl)
            }).catch(error => {
                res.sendStatus(500)
            })
        } else {
            fs.writeFileSync('./meals.json', JSON.stringify(myMeals))
            // res.sendStatus(200)
            res.json(myMeals[req.body.mealid].imgUrl)
        }

    })
 // this route is only to check if the meal title already exist or not
 adminRoute.post('/checkMealName', (req,res) =>{
    // console.log(req.body)
     const findMeal = myMeals.find(meal => meal.title == req.body.mealtitle)
     if(findMeal){
         res.render("adminAddMeal")
     } else{
         res.json("notexist")
     }
     

 })

    return adminRoute // we must return it here ! because the app only uses the express router !
}


//------------ export the module to app.js
module.exports = {
    adminPageRouter
}





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
//*1 
// using it in app.js so it can be accessed from all routes
//*2
// next means go to the next route/task and secure it
//*3
// because i wrote middleware to secure all the routes i dommented this for showing purpose