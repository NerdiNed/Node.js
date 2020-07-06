//* creating an external mailer module

// import nodemailer 
const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({  //* the transporter is outside of the function, because its static.. its always the same
    service: 'gmail',  
    auth: {  
        user: 'nerdined7@gmail.com', //* receiving email of the host // site owner //!2
        pass: '......'
    }
})

function sendEmail(name, email, subject, message, callback) { 

    const mailOption = {
        from: 'nerdined7@gmail.com', //*1  //* website email //!2+3
        to: 'nerdined7@gmail.com', //!4 
        subject: subject,
        text: email+ '\n' +  name + '\n' + message
    }

    transporter.sendMail(mailOption, function(error, info){
        if (error) {
          console.log(error);
          callback(false);
        } else {
          console.log('Email sent: ' + info.response);
         callback(true);
        }

      }); 

 }

 module.exports = {sendEmail}  //* passing it in {} as an object.. so i can use it like a method an own function in the app.js


 //* //should be the email of the site that the owner of the site gets the email from 
 //!2 so here we would enter the admins email just created for the website example : info@gmail.com 
 //!2+3 so in from: we also enter the email created for the site info@gmail because that is the email address the admin gets the notifcation from 
//! 4 here we enter the email we want to receive the notification from for example neda@gmail there i will get a notifcation from info@gmail that i have received an email from the customer that has written a message to info@gmailcom on the website

//! in the contact.js we changed the path of the URL

//! in the css- bootstrap.min.css we changed the modal. z-index into 9999999 
//! as we had a bug in the bootstrap version 4. the modal window was not closing. 
//! NORMALLY you should never touch the library ! its better to change /overwrite the css inline in the html (if its only one line)
//! or in style.css : .model{z-index:999999;} in html inline it would probably be style="z-index:9999999"