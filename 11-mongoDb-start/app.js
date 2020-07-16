const express = require('express')
const passwordHash = require('password-hash')

//const MongoClient = require('mongodb').MongoClient
//this line equals the one above and is called destructuring 
// const { MongoClient } = require('mongodb')

//const ObjectId = require('mongodb').ObjectID
//this line is the same as both above 
const { MongoClient, ObjectId } = require('mongodb') //*2
const app = express()

// URL connection string 
const connectionString = 'mongodb+srv://....:....@cluster0.....mongodb.net/.....?retryWrites=true&w=majority'

// to read the send json data// to get the info from the user
app.use(express.urlencoded({extended: false}))
app.use(express.json())

////////////////////////////////////////////////////////

// set the view engine 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views')

/////////////////////////////////////////////////////////


app.get('/', (req, res) => {
    res.send('welcome to mongo land')
})

// check if it is connected to the front
app.get('/register', (req,res)=>{
    res.render('register')
})

// register the user POST
app.post("/register", (req,res)=>{
// check to see if i get any data
    console.log(req.body);
// get the data from the register.ejs
const username = req.body.username.trim();
const password = passwordHash.generate(req.body.password); // crypt the password // encrypted  req.body.password
if(username && password){
    (async()=>{
        try{
            const client = await MongoClient.connect( connectionString, {
    
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const db = client.db('planetNerd');
            
            const response = await db.collection("users").findOne({
                username: username,
              //  password: password,
            });
            
            //check if the user exist or not
            console.log(response);
            if(response){
                client.close();
                res.json(3)
            } else{
                const insertResponse = await db.collection('users').insertOne({
                    username: username,
                    password: password,
                })
              //  console.log(insertResponse);
                client.close();
                if(insertResponse.result.ok){ // got this 'result'ok' from the consol log
                    res.json(1); //res.send(response)//res.json(response) //

                } else {
                    res.json(2)
                }
            }
        } catch (error){
            res.json(2);
        }
     })();

} else {
    res.json(2)//res.json(3)
}
    
})
// 1 register success
//2 server error
//3 user already exists




/////////////////////////////////////////

let mongoClient
app.get('/connect', (req, res) => {
    // connect node js to mongoDb server or cluster // this line is a must to connect
    MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(client => {
        mongoClient = client
        console.log(client)
        res.send('connected');
    }).catch(error => {
        console.log(error);
        res.send('could not connect')
    })
})

app.get('/close', (req, res) => {
    //close connection to mongoDb
    mongoClient.close()
    res.send('closed');

});

// created this route and used promises !
app.get('/adduser', (req, res) => {
    // connect or better establish  node js to mongoDb server or cluster
    MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(client => {
        // get the database
        const db = client.db('planetNerd')
        // insertOne to add one object into the object users in the database (the object in mongo db is called collection.. collection of objects)
        db.collection('users').insertOne({

            email: 'neda@gmail.com',
            password: '12345'
        }).then(response => {
            console.log(response)
            res.send(response);
            //close the connection to the server ! because there is only limited connections to the server maybe around 10-15 times 
            client.close()
        }).catch(error => {
            console.log(error);
            res.send(error);
            client.close()
        })
    }).catch(error => {
        res.send('can not connect')
    });
})

// creating a route but we are going to use async await ! it does the same job as /adduser.. BUT will be easier to read

app.get('/adduserasync', (req, res) => {
    //iffie (async()=>{your code})()
    (async () => {

        try {
            const client = await MongoClient.connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            const db = client.db('planetNerd')
            const response = await db.collection('users').insertOne({
                title: 'any book title',
                category: 'software engineering'
            })
            client.close()
            res.send(response);
        } catch (error) {   
            res.send(error);
        }
    })()
});

// insert more than one data to the database 
app.get('/insertmany', (req,res)=>{
  //iffie (async()=>{your code})()
  (async () => {

    try {
        const client = await MongoClient.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        const db = client.db('planetNerd')
        const response = await db.collection('users').insertMany([

            {
                title: 'title 1 ',
                category: 'some data'
            },
            {
                title: 'title 2 ',
                category: 'another book'
            },
            {
                title: 'title 3 ',
                category: 'light version'
            },
            {
                email: 'neda@gmail.com',
                password: '12345'
            },
        ])
        client.close()
        res.send(response);
    } catch (error) {   
        res.send(error);
    }
})()
})

// find certain data from the database .. its an array of data that will be shown
app.get('/getuser', (req, res) => {
    //iffie (async()=>{your code})()
    (async () => {

        try {
            const client = await MongoClient.connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            const db = client.db('planetNerd')
            // get all elements from my database : because its and array i have to add toArray()
            const response = await db.collection('users').find().toArray()
            //console.log(response);
            

            client.close()
            res.send(response);
        } catch (error) {   
            res.send(error);
        }
    })()
});

// find one.. will find one specific result from the data base  //*1
// it will show me the object with all its data with that specific id ( because i am searching here to find the id)
app.get('/findone',(req,res)=>{
    (async ()=>{
       try { 
        const client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db('planetNerd')
        const response = await db.collection('users').findOne({_id: new ObjectId('5efc65a3b5e9f962c6c0001f')}) //*3
        client.close()
        res.send(response)
       } catch (error){
           res.send(error)
       }
    })()
})

// update many data at the same time 
app.get('/updatemany',(req,res)=>{  //*4
    (async ()=>{
       try { 
        const client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db('planetNerd')
        const response = await db.collection('users').updateMany({password:'12345'}, { $set:{email:'pipapo@mail'} }) //*4
        client.close()
        res.send(response)
       } catch (error){
           res.send(error)
       }
    })()
})


// update a single data from the data base 
app.get('/updateone',(req,res)=>{
    (async ()=>{
       try { 
        const client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db('planetNerd')
        const response = await db.collection('users').updateOne({_id: new ObjectId('5efc65a3b5e9f962c6c0001e')}, { $set:{email:'bla@mail'} }) //*5
        client.close()
        res.send(response)
       } catch (error){
           res.send(error)
       }
    })()
})

// delete many items from the database 
app.get('/deletemany',(req,res)=>{
    (async ()=>{
       try { 
        const client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db('planetNerd')
        const response = await db.collection('users').deleteMany({password: '1234' }) //*6
        client.close()
        res.send(response)
       } catch (error){
           res.send(error)
       }
    })()
})

// delete one single item/ data with the specific search category
app.get('/deleteone',(req,res)=>{
    (async ()=>{
       try { 
        const client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db('planetNerd')
        const response = await db.collection('users').deleteOne({category: 'light version' }) //*7
        client.close()
        res.send(response)
       } catch (error){
           res.send(error)
       }
    })()
})



app.listen(3000, () => {
    console.log('listening to port 3000!');

})



//* 
//app.set is a middleware
// app.use should have a function


//*
// clusters are a group of databases...
// collections are a group of objects in the database..
// the collections of objects are like tables in Sql

//* the connections to the database are limited.. one can only open a few connections to the server. 
// thats why we need to close the connection after establishing it.

//*
// MongoClient is a method to connect to the mongoDb server
// client is the connection between us and the mongo db cluster
// with this line : const db = client.db('planetNerd')
// client.db is accessing to the database we have created in mongoDb.. in this case : planetNerd
// with: db.collection i can access the collection of object i have in that given database 
// with db.collection('users').insertOne we access the collection in the database which is 'users' in the database nerdPlanet .. cuz i could have more 
// and with insertOne() i am inserting the data i want to store in the collection 'users.. in the database named nerdPlanet

//*
// insertMany() takes and array of objects

//*1 
// to find a specific data in the database i have to use findOne()
//*3 
// so if we want to find the data with the id that mongo db gives the data automatically.. we have to 
// write : // .findOne({_id: new ObjectId('5efc65a3b5e9f962c6c0001f')})... in the findOne() we have to set {} because its an object with properties what we are searching for
// then we write new ObjectId.. which is the key word from mongoDb.. its given to each uploaded data and is unique.
// then i insert that unique number in quotations '5efc65a3b5e9f962c6c0001f'
//BUT before i have to add ObjectId in my required line.. because i want to get that given key word which is from mongo db itself, nothing i set
//from the library : const { MongoClient, ObjectId } = require('mongodb') //*2 


//*4
// with updateMany() we can update/edit more than one data at the same time from the database 
// .updateMany({password:'12345'}, { $set:{email:'pipapo@mail'} })  
// the first filter {password:'12345'} is the element i want to find and change. 
// in this case of filter : everything that has that password // you can search for what every property that you want to have changed 
// will be changed to : { $set:{email:'pipapo@mail'} })
// the category that you want to change has to be set with : $set:
//*5 
// ({password:'12345'}, { $set:{email:'pipapo@mail'} })   .. so if the element you are searching for with that password.. 
// has the category : email.. the $set: will replace that email with the one you have set. 
// BUT if the element with tat password has no such category as email.. $set: will ADD the category email to the searched element ! 
//*6 
//deleteMany({password: '1234' })  will delete all elements with the password 12345 that you are searching for. 
//*7
// deleteOne({category: 'light version' }) will delete that one element that has the category:'light version'... 
// if there are two it would take the first one 
