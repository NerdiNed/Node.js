const express = require('express')
const fs = require('fs')
const dataModule = require('../modules/dataModule')

const adminRouter = express.Router()

//creating a middleware to check the session for all routes in admin/ ..admin/blabla
adminRouter.use((req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/login')
    }
})


adminRouter.get('/', (req, res)=>{
    res.render('admin')
})

    adminRouter.get('/addbook', (req, res) => {
       // console.log(req.session.user);
        // this secures the admin page.
        // if(req.session.user){
        //     res.render('admin')
        // } else {
        //     res.redirect('/login')
        // }
        res.render('addBook') // this has to be commented when there is no middleware because its in the if-statement
    })

//response map
// 1 means error
// 2 means all good

    adminRouter.post('/addbook', (req, res)=>{
        // console.log(req.body);
        // console.log(req.files);
        // console.log(Object.keys(req.files));
        // validation to see if there is any pdf file. there has to be a book
        if(req.files){
        // assigning the data for the validation for server side
        const bookPdf = req.files.bookPdf
        const bookTitle = req.body.bookTitle
        const bookDescription = req.body.bookDescription
        // const bookImg = req.body.bookImg //*1
        // creating validation for server side
        if(bookTitle&& bookDescription && bookPdf && Object.keys(req.files).length >1){ //*1 
            // creating an empty array
            const imgs =[]  //*2
            for (const key in req.files) { //!2
                if (req.files[key].mimetype != "application/pdf") { //!3
                    imgs.push(req.files[key]);
                    
                }
            }
            dataModule.addBook(bookTitle, bookDescription, bookPdf, imgs ).then(()=>{  //*2
                res.json(1)
            }).catch(error=>{
                if(error == 3){
                    res.json(3)
                }
            })
        } else{
            res.json(2)
        }
        // else if there is no pdf : 
     } else{
        res.json(2)
        }
    
    })




//------------ export the module to app.js
module.exports = adminRouter


//*1
// Object.keys(req.files).length >1  is for the images.. as they could be more than one.. and 
// they have an added number to them each time a new image gets added img1, img2 img3 etc.. 
// and they are an array. so to get the elements i am using Object.keys() to get them .. and then add the req.files in it as i am going through those files. and the length of it +1 to get the added numbers
// so because it can be many files.. i cant use req.bookImg

//*2 
// the images are objects.. and i have to interrogate through the images.
// to be able to interrogate through objects i have to use : for in

//*3 
// checking if the mimetype is NOT a pdf.. if its an image then push it to imgs.push(req.files[key]);
// req.files[key] is the Object with its properties .. mimetype(filetype) is the single property out of that image we are searching for. we logged it to see that its mimetype