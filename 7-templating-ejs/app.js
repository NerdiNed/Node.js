const express = require('express')

const app = express();

// set view engine type
app.set('view engine', 'ejs') //*1 key and value always have to be there ! 

// set the views folder - folder where the views are saved
app.set('views', __dirname + '/views' ) //*2



app.get('/', (req, res)=>{
   //res.send('hello');
   let arr = ['banana', 'apple', 'melon'];
   res.render('main', {title:'main page', fruits: arr});//!3 // i can pass as many parameters as i want
    
});

app.get('/contact', (req, res)=>{
  
    res.render('main', {title:'contact', fruits:[]});//!3
     
 });

app.listen(3500, ()=>{
    console.log('app listening on port 3500');
 
})




//*1 view engine is the key the value is ejs. there are other view engines, but we want to use ejs !
//*2 key and value : name of the folder  and path of the folder ! 
//! when using ejs those two lines have to be written //1 and // 2 

//* also possible :  res.render('main', {title:'main page',arr});

//!3 because both are using the page main.js we have to pass the same parameters in contact as in the home page !! 
//! res.render('main', {title:'main page', fruits: arr});//!  in home 
//! res.render('main', {title:'main page', fruits:[]});//! 
//! i have that same line in '/contact' and in '/'  !!! but in contact i pass an empty array, 
//! because i don't want that to be rendered in contact. BUT i have to use the same parameters because both are accessing to the main.ejs file !
//! if i want different content for contact i will have to create another ejs file for example main2.ejs and 
//! include that in the app.get for example as : res.render('main2', {title:'contact', Some dummy Data});
//! doesn't need to be the same parameters then anymore