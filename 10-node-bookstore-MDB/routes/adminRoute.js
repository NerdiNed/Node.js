const express = require('express')
const fs = require('fs')
const dataModule = require('../modules/mongodbDataModule') 
//set middleware to parse the json


const adminRouter = express.Router()
//set middleware to parse the json
adminRouter.use(express.json())
adminRouter.use(express.urlencoded({extended: false}))
//creating a middleware to check the session for all routes in admin/ ..admin/blabla
adminRouter.use((req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/login')
    }
})


adminRouter.get('/', (req, res)=>{
    res.render('admin', {email:req.session.user.email})
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
            dataModule.addBook(bookTitle, bookDescription, bookPdf, imgs, req.session.user._id ).then(()=>{  //*2 //!
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

adminRouter.get('/mybooks',(req, res)=>{
    dataModule.userBooks(req.session.user._id).then(books=>{
        res.render('mybooks', {books})
    }).catch(error=>{
        res.send("404. page can't be found")
    })

})



adminRouter.get('/logout', (req,res)=>{
    req.session.destroy()
    res.redirect('/login')
})

adminRouter.get("/mybook/:id", (req, res)=>{
    const bookId = req.params.id 
    dataModule.getBook(bookId).then(book =>{
        res.render("editbook", {book})

    }).catch(error=>{
        res.send("this book doesn't exist")
    })
})



adminRouter.post('/editbook', (req,res)=>{
    // this way to write the code is called deconstruction/deconstructor
    const {newBookTitle, oldImgsUrls, bookDescription, bookId} = req.body  //!4  //REVIEW 
    //* below is the same code as above
    // const newBookTitle = req.body.bookTitle
    // const oldImgsUrlsJson = req.body.oldImgsUrls  // but with the decunstruction the cariable name has to be the same name as added to req.body.
    // const bookDescription = req.body.bookDescription
    console.log(newBookTitle,oldImgsUrls, bookDescription, bookId);
    console.log(req.files); // to see the image file (but you have to choose a file to upload) because they are stored in files
    
    // check if the data is pdf or images to later be able to delete from database first, ten the server
    let newPdfBook = null
    let newImgs =[]
    // see if the user has send already something. by iterating through the properties
    if(req.files){ // see if there is anything in the file
        newPdfBook = req.files.bookPdf
        for( const key in req.files){ // iterating through the objects
         if(req.files[key].mimetype != 'application/pdf'){// check if the file is an image or pdf if its not a pdf its an image and i will push it to the images
            newImgs.push(req.files[key])
        }
      }
    }
    let oldImgsUrlsArr = JSON.parse(oldImgsUrls)
   // console.log(oldImgsUrlsArr );
    //delete the domain from the imgs urls
    oldImgsUrlsArr= oldImgsUrlsArr.map(element =>{
        return element.substr(element.indexOf('/uploadedfiles/'))
    }) 
  //  console.log(oldImgsUrlsArr );
    
     //rendering the new updated book. by calling the function from the dataModule
    dataModule.updatedBooks(bookId, newBookTitle,oldImgsUrlsArr,bookDescription, newPdfBook, newImgs, req.session.user._id).then(()=>{ //*5 /6
             res.json(1)
        }).catch(error =>{
            res.json(2)
        }) 
    
    
})

adminRouter.post("/deletebook", (req, res)=>{
    console.log(req.body);
    const bookDeleteId =  req.body.bookDeleteId
    dataModule.deleteBook(bookDeleteId, req.session.user._id).then(() =>{
        res.json(1)
    }).catch(error =>{
        res.json(2)
    })
    
   
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

//! 
//req.session.user._id  we go this _id from the consol log in the app.js.. app.post('/login)
// and it will be passed as userId parameter in mongodb datamodule in the addBook function
//and the _id will replace the 1 that we set for our user ids in the json file

//!4
//REVIEW
// the bookId is referring to the injected  fd.append(bookId, '<%= book.id %>')  in the front end edit.book.ejs
//with the injection in the front end we are able to inject backend into the front end also into the java script 

//*5
// JSON.parse(oldImgsUrls) i get the images as json file and i convert them into objects and array of objects

//*6
//req.session.user_id is getting the userId from the  function updatedBooks in the mongodb data module