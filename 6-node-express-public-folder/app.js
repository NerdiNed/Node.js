const express = require('express');
const app = express();

app.use(express.static('./public')) //! to access the public it is always express.static

app.get('/', (req,res)=>{
    res.send('whats up?')
})
app.get('/home',(req,res)=>{
    res.sendFile(__dirname + '/home.html') //* __direname + because the error was that it needs an absolute path
})

app.listen(4500, ()=>{
    console.log('app is listening to port 4500');
    
})

//* app.use(express.static('./public'))
//* everything in the public folder doesn't need to have be routed or created a separate path for it.
//* it will be accessible from that path.. i don't need to create the path with ./public/js/script... 
//* so when i have an html file that has dependencies to css and js which are in a public folder 
//* i connect the html with the css for example by using link.. but in the scr i dont need to write ./public/css/style.css.. i can directly write : /css/style.css.. it will get it automatically out of the public folder.. because that is accessible from everywhere

