//* this route will be only responsible for the rout home that i am creating


const express = require('express')
const homeRouter = express.Router() //*1

homeRouter.get('/',(req,res)=>{ //*2
    res.send('welcome home')
})

// or

// homeRouter.route('/').get(('/',(req,res)=>{ //*2
//     res.send('welcome home');
// })

homeRouter.get('/subhome', (req, res)=>{ //*2 //!3
    res.send('welcome to subhome')
})

module.exports = homeRouter;



//*1 Router()  with capital R is a method
//*2 the route is / because it is the root of THIS file homeRoute..the root of this branch

//!3 /subhome will be added to /home.. so it will be /home/subhome because i have assigned the homeRouter it in the app.js to /home
//! so everything i create for it in homeRouter will be added to /home