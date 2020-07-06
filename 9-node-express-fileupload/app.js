//setting up the app
const express = require('express')
// setting up the file uploader package. can upload any file 
const fileUpload = require('express-fileupload')
const app = express()


// setting limit of the uploading file to my site
app.use(fileUpload({
    limits: {
        fileSize: 50 * 1024 * 1024
    }, // 50 bytes * 1024 mb * 1024
}));

// setting view engine 
app.set('view engine', 'ejs')
// setting view folder 
app.set('views', __dirname + '/views')
// setting and using the public folder
app.use(express.static(__dirname + '/public'))

//for later getting the data : name etc
app.use(express.urlencoded({
    extended: false
}))

// getting the info and render from my main page
app.get('/', (req, res) => {
    res.render('main')
});

// setting the post for the input
app.post('/', (req, res) => {
   console.log(req.body); // seeing username 
   console.log(req.files.photo); // seeing all file info  //*1
   // move the uploaded file to public folder
   req.files.photo.mv(__dirname + '/public/uploadedfiles/' + req.files.photo.name).then(() => {  //*2
    // with redirect wont send the file again when page is refreshed
    res.redirect('/admin/addmeal')
    //res.render('main')
     }).catch(error => {
      console.log(error.message);
      res.send(error.message)
   })
 })

app.listen(3000, () => {
    console.log('app listening on port 3000');
 })


// can read more about the instructions on the express-filUpload manual site. www.npmjs.com/
//*1 
// req.files will show me all files that are uploaded 
// req.files.photo... the photo is the name of name in the input of the html : <input type="file" name="photo"> so it will show me the info of that one file that is uploaded
//*2
// with a promise instead of callback : then() ..catch 