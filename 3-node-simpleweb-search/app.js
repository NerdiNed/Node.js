const http = require('http')
const fs = require('fs')
const url = require('url')

// import nodemailer 
const nodemailer = require('nodemailer')

//import our module
const saver = require('./modules/saver') //* need full path to import the module // //* to call the module i only need the module name : saver .. not saver.js // if you create your own module you need ./

http.createServer(function (req, res) {
    let q = url.parse(req.url, true) //* q is as same as urlObj as used it before
    console.log(req.url)

    switch (q.pathname) {
        case '/home':
            res.writeHead(200, {
                'content-type': 'text/html'
            })
            let replacedPart = fs.readFileSync('views/replacedPart.html')
            let text = fs.readFileSync('views/26-HTML-CSS-Summerize/index.html')
            res.end(text.toString().replace(
                `<div class="card">
                <div class="card-head">
                    <h3>card1 title</h3>
                </div>
                <div class="card-content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos earum dolorem vitae deserunt deleniti accusamus. Qui ipsum culpa nobis voluptate a vero quod sit magni atque porro! Ratione, fugit placeat?</div>
            </div>
            <div class="card">
                <div class="card-head">
                    <h3>card2 title</h3>
                </div>
                <div class="card-content">Distinctio sunt blanditiis omnis, ratione placeat enim ipsa magnam! Modi laboriosam sapiente iste provident blanditiis earum, velit commodi accusantium adipisci alias ipsum nesciunt consequatur voluptatem est! Tempora, qui eveniet! Iure!</div>
            </div>
            <div class="card">
                <div class="card-head">
                    <h3>card3 title</h3>
                </div>
                <div class="card-content">Dicta aperiam porro nihil aliquid. Ipsa consequuntur perspiciatis tempore dolorum dolores excepturi necessitatibus culpa minus saepe non voluptates voluptatibus molestiae qui, fuga ratione sit similique quae ducimus incidunt, cum officia.</div>
            </div>`, replacedPart))
            //res.end(text)
            break;
        case '/logo': {
            res.writeHead(200, {
                'content-type': 'image/png'
            })
            let img = fs.readFileSync('views/26-HTML-CSS-Summerize/img/Logo.png')
            res.end(img)
            break;
        }
        case '/hero': //! and i have to link this exact route into my css file in the .banner background image :  background-image: url('/hero');
            res.writeHead(200, {
                'content-type': 'image/jpg'
            })
            let img = fs.readFileSync('views/26-HTML-CSS-Summerize/img/hero.jpg')
            res.end(img)
            break;
        case '/css': //! in my index.html i have to put this exact same route into my connected css link !!!
            res.writeHead(200, {
                'content-type': 'text/css'
            })
            let css = fs.readFileSync('views/26-HTML-CSS-Summerize/css/index.css')
            res.end(css)
            break;
        case '/contact':
            // saver.saveContent("hello, i am some content", "content.txt" ) //! first content parameter, then path 
            // get the contact form data
            if (q.query.name) { // means if there is something entered in the name input
                let message = q.query.name + '\n' + q.query.subject + '\n' + q.query.message + '\n'
                saver.saveContent(message, "content.txt")

                const transporter = nodemailer.createTransport({
                    service: 'gmail', //* this is the mail provider that the server uses ! so from the server side not client. if its yahoo it has to be written yahoo
                    auth: {  //* we can use other emails as well like yahoo etc. but that would be a different setting
                        user: 'nerdined7@gmail.com', //* the email from my domain site for example
                        pass: 'enter the password'
                    }
                })
                const mailOption = {
                    from: 'another@email.com',
                    to: 'nerdined7@gmail.com',
                    subject: 'email from our nodejs website',
                    text: 'this is a dummy  text'
                }

                transporter.sendMail(mailOption, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                    let contactReplaced = fs.readFileSync('views/26-HTML-CSS-Summerize/contactReplaced.html')
            
                  }); 
                }
                let contactReplaced = fs.readFileSync('views/26-HTML-CSS-Summerize/contactReplaced.html')
            res.writeHead(200, {
                'content-type': 'text/html'
            })
            res.end(contactReplaced)
            
            break;
        default:
            res.writeHead(404, {
                'content-type': 'text/html'
            })
            res.end('<h2>404 page is not found</h2>')
            break;
    }
}).listen(4800)


//! i want to get the data from the contact form
//* it requires a url : const url = require('url')
//* then it the in the createServer function : let q= url.parse(req.url, true)
// then in the case /contact : i ad and if statement : meaning : if there is any of those inputs filled (name, message, subject which is stored in let = message) 
// then show me the message in contact.txt which is going to be created each time the data is send and site is refreshed
// if(q.query.name){
//     let message = q.query.name + '\n'+ q.query.subject+ '\n'+ q.query.message 
//  saver.saveContent(message, "content.txt" ) 

// }

//! 
//import our module
// const saver = require('./modules/saver') //* need full path to import the module // 
//* to call the module i only need the module name : saver .. not saver.js
//! if you create your own module you need ./
//! if you want to import js in js you need ./

//! let q= url.parse(req.url, true) by default it is false. 
// we need to put true if we want to access single parts and not the entire path : /contact?name=&subject=&message=saasd
//we want only parts like name ..subject etc to be shown or accessed in the "eingabeleiste im browser"