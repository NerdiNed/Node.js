// this  is a web application 

// const http = require('http')

// const fs = require('fs')

// http.createServer((req, res) => {
//     res.writeHead(200, {'content-type': 'text/plain'})
//     res.end('hello world')

// }).listen(4000)


// http.createServer((req, res) => {
//     // res.writeHead(200, {'content-type': 'application/json'}) // send JSON
//      //res.writeHead(200, {'content-type': 'text/plain'}) // send text data
//      res.writeHead(200, {'content-type': 'text/html'}) // send html
//     let obj = {
//         name: "ahmad",
//         firstName: "osman"
//     }

//     //res.end(JSON.stringify(obj))
//     res.end("<h2>text</h2>");
// }).listen(4000)


// this is a web application

// http.createServer((req, res) => {
//     res.writeHead(200, {'content-type': 'application/json'})

//     let obj = {
//         name: "ahmad",
//         firstName: 'osman'
//     }
//      send json text
//     res.end(JSON.stringify(obj))

// }).listen(4000)


// http.createServer((req, res) => {
//     res.writeHead(200, {'content-type': 'text/html'})

//     // send html text
//     let myHtml = 
//     '<html>'+
//     '<head>'+
//     '<title>my first server page</title>'+
//     '</head>'+
//     '<body>'+
//     '<h2>text</h2>'+
//     '</body>'+
//     '</html>'

//     res.end(myHtml)

// }).listen(4000)

 //send html text from file

// http.createServer((req, res) => {
//     res.writeHead(200, {'content-type': 'text/html'}) // send html
//     fs.readFile('views/index.html', (err, data) =>{
//         console.log(err);

//         res.end(data)
//     })


// }).listen(4000)

// http.createServer((req, res) => {
//     res.writeHead(200, {'content-type': 'text/html'})
//    console.log(req.url);

//    let text = fs.readFileSync('views/index.html')
//    res.end(text);

// }).listen(4000)


const http = require('http')

const fs = require('fs')


http.createServer((req, res) => {

    console.log(req.url);
    if (req.url == '/1') {
        res.writeHead(200, {
            'content-type': 'text/html'
        })
        let text = fs.readFileSync('views/index.html')
        res.end(text)
    } else {
        if (req.url == '/2') {
            res.writeHead(200, { 'content-type':'text/html' })
            let text = fs.readFileSync('views/index2.html')
            res.end(text);
        } else {
            if(req.url == '/bldsdf/style.css'){ //! i can create my own route
                res.writeHead(200, {'content-type': 'text/css'}) // send html
            let text = fs.readFileSync('views/style.css');
            res.end(text);
            } else{
                if(req.url == '/fgfgfgfgfg/ss.css'){
                    res.writeHead(200, {'content-type': 'text/css'}) // send html
                    let text = fs.readFileSync('views/style.css');
                    res.end(text);
                } else{
                    res.writeHead(404, {'content-type': 'text/html'}) // send html
                res.end("404 no such page");
                }
                
            }
            
        }
    }

}).listen(4000)






//---------------Quick Comments in class , not corrected


//*req is what i get from the user = request
//* res is what i send the user  = response
//! the order of the parameters req and res is important. we write req even we don't use it. 
// 200 means ok .. 404 is an error. this is just a control instance
//* every response needs a writeHead ! 
//* end is sending the data back to the client side.  its only one time as the response has already ended, can't write it afterwards again

//* every server has to listen to a port ! so the createdServer function has .listen(4000)

//! if i make any changes on my server i have to restart my server with ctrl+ c .. this will kill the last running process
//! then i have to write node app.js to run the server again 
//! if the file name (application) is called app2.. i will have to write node app2.js 
//? to check it in the browser i have to write localhost:4000 (the port number i have entered after listen) in my case i entered listen(4000)
//! the port address can only be used once. if the server is already running with that port number you have to use another number for the port
//* killall node command will kill all node applications on the server //! BUT DON'T do it on a real server ! only on the local server (own computer)

//* every file has a content: 
//* 'text/plain' will create text 
//*'text/html'  will create html
//* 'application/json' will create json / objects

//* the app.js code can not bee seen by the client .. only on the server side !

//* node is a compiler 
//* so by typing node app.js  i am compiling the code i have written to see what it is like in console log
//! if the file name (application) is called app2.. i will have to run node app2.js 

//* fs means file system 
//* to access the index html file we need to connect from the app.js (not the other way around like usual through link or script
//* from here we need to do it with :const = require ('fs') and it needs a callback function .. or async 

//* if(req.url == '/bldsdf/style.css'){ <= random created route 
//!  in my index html i have to connect it :  <link rel="stylesheet" href="/bldsdf/style.css">
//*res.writeHead(200, {'content-type': 'text/css'})
//*let text = fs.readFileSync('views/style.css'); <=  correct route of the css
//! i can name the url what ever i like and create my own route. 
//! it will be able to access the css as long as in the readFileSync('views/style.css')
//! it is connected to correct route of the css (like in my files) 
//! it will be able to recognize it and apply to it.
//! at the same time i will have to connect this created route to the html so
//! it has to be the same as in the css link in the index.html as i am connecting that one to this external stylesheet
//!  in my index html i have to connect it :  <link rel="stylesheet" href="/bldsdf/style.css">


