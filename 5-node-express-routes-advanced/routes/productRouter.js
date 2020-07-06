const express = require('express')
const productRouter = express.Router()

productRouter.get('/', (req, res) =>{
    res.send('this is a product page')
})

productRouter.get('/pr1', (req, res) =>{ //! 1
    res.send('this is a fake product sub page')
})

productRouter.get('/pr2', (req, res) =>{ //! 1
    res.send('these are more fake products sub pages')
})

// this is a sub-subroute
productRouter.get('/pr2/subpr2', (req, res) =>{ 
    res.send('this is a sub sub.. a sub from pr2 ')
})


module.exports = productRouter

//! 1 this will be added to /products... so in the url it will be /product/pr1.. 
//* if i want to create a sub sub i can also create a new file a child of this one, 
//* but i will have to connect it to THIS file (productRouter) do the same thing like i have to connect the app.js with the productRouter 
//* but in here --- its like a tree that has a branch and the branch has a twig and the tig a leaf.. so the leaf is connected to the twig.. 
//*the twig to the branch then the branch to the main tree


