const express = require('express')
const homeRouter = require('./routes/homeRouter')
const productRouter = require('./routes/productRouter')
const app = express();

app.use('/home', homeRouter) //!1
app.get('/', (req, res)=>{
    res.send('hello')
});

app.use('/product', productRouter)


//* commented the following lines, as i have routed the subhome and home in the homeRouter file so its going to be used in /home which i assigned to homeRouter
// app.get('/home', (req, res)=>{
//     res.send('home')
// });

// app.get('/home/subhome', (req, res)=>{
//     res.send('subhome')
// });

app.listen(4000, () =>{
    console.log('app is listening to port 4000!');
    
})

// with require we always need to use the relative path ./
//!1 app.use is not a middleware in this case its a router !
//* app.use('/home', homeRouter) i am assigning 'homeRouter' to '.home' : 
//* means if you find /home connect it to homeRouter and use what is in there for /home
//* homeRouter is then only responsibly for /home.... for you(homeRouter) '/home' is your route 
