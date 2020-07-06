
// creating a server. 
// server needs a callback.
// the callback needs TWO parameters, 1.the request 2. the response
// each website needs to listen to some port. this port hast to be reserved for the one server. (can't use it on another page)
//on binary level every file has a head , then a content ! so when the site is running it will go through the file and will run/read from the head down
// 200 is to check if everything is alright 
// the write head checks if the file is really what the content type is. 
// then it needs a content type. the content type is an object {....}
// the content type is either text/plain, text/html, application/json

const http = require('http')   // this is the required to use your system as a server
const fs = require('fs')
const url = require('url')  //*5

http.createServer(function (req,res) { 
   // console.log(req.url); // this url can be anything i choose it just cares about that there is an url typed in the browser
    let urlObj = url.parse(req.url, true) //*6
   console.log(urlObj);
    
    switch(urlObj.pathname){ // same as yesterday just instead of if statement with switch case
        case '/home': 
       // get shared content
       let sharedText = fs.readFileSync('views/shared.html')
       res.writeHead(200,{'content-type': 'text/html'})
       let text = fs.readFileSync('views/index.html')
       //res.end("<h2>Welcome Home</h2>")
       res.end(text.toString().replace('this will be shared content', sharedText))
       // res.end('<h2>Welcome Home</h2>')
      // res.end(text)
        break;
        case '/about':  //!4
        let sharedText1 = fs.readFileSync('views/shared.html')
        res.writeHead(200,{'content-type': 'text/html'})
        let text1 = fs.readFileSync('views/about.html') //! 1
        res.end(text1.toString().replace('this will be shared content', sharedText1)) //!2
        break;
        case '/contact': 
      if(urlObj.query.fname){  //!3
          console.log(urlObj.query.fname); 
      }
      let sharedText2 = fs.readFileSync('views/shared.html')
      res.writeHead(200,{'content-type': 'text/html'})
      let text2 = fs.readFileSync('views/contact.html') //! 1
      res.end(text2.toString().replace('this will be shared content', sharedText2)) //!2
        break;
        case '/somecss': 
        res.writeHead(200,{'content-type': 'text/css'} )
        res.end('body{background-color : red}')
        break;
        case '/somejson': 
        res.writeHead(200,{'content-type': 'application/json'} )
        res.end("{'name' : 'neda', 'age' : 'forever young'}")
        break;
        default:
            res.writeHead(404,{'content-type': 'text/html'} )
            res.end('<h2>404 page is not found</h2>')

    }

 }).listen(4500)




  //!1 in the if statement i can use let text = more than once 
  //! in switch case i either have to put it in a scope (but the brake outside) 
  //! or enter the entire file link into the res.end(fs.readFileSync('views/index1.html'))

  //!2 if you send data to the client side it will be text. BUT readFileSync will always 
  //! return binary data. so we have to use to STRING to be able to replace it
  //! replace needs two parameters, one is the content that has to be replaced(so it has to be exactly 
  //! the same! in this case it was: 'this will be shared content') and the second parameter is what 
  //! you want it to be replaced with.. in this case the shared file

//! 3 if the user comes to the page the first time . fname will be empty. so i write the if statement : if there is a name entered show it.. (consol log) if not go on and do the rest 
 //!4 the about is connected with a link to the somecss in the about.html
//* 5 To find out which page the visitor requested, we’re going to use a new Node module called "url"( not so sure : url when i want to send data to the client side)
//*6 Then, all we need to do is "parse" the visitor’s request like this : url.parse(req.url).pathname; to get the name of the page requested