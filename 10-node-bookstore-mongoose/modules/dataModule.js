const fs = require('fs')
const passwordHash = require('password-hash')


function registerUser(email, password){
    return new Promise((resolve, reject)=>{
        // get the file user.json to read
        const readData = fs.readFileSync('./users.json')
        // get the data from the users.json and convert to object
        const data = JSON.parse(readData)
        // check if user email exists or not using es6 find array method
        const existUser = data.users.find(user=> user.email == email)   // user.email from the users.json //  == email the parameter email
        if(existUser){
            reject('exist')
            } else {
                // if the email doesn't already exist push it into the users.json
                data.users.push({
                    id: data.newId,
                    email: email,
                    password:passwordHash.generate(password) //password:password //*2
                })
                // increase the newId property for data that is to be used for the next registering user
                data.newId++
                // convert the data back to json text and write it into the file users.json
                fs.writeFileSync('./users.json', JSON.stringify(data))
                resolve()
            }
        })
    }

function addBook(bookTitle, bookDescription, bookPdf, bookImgs){
    // create a promise 
    return new Promise((resolve,reject)=>{
        // read books.json
        const booksJson = fs.readFileSync('./books.json')
        //convert the read file to object
        const booksObj =JSON.parse(booksJson)
 
        // search for existing title and user id to validate if it already exists
        const findBookTitle = booksObj.books.find(book => book.title == bookTitle && book.userid == 1)
    // if the book already exists.. reject it 
        if(findBookTitle){
            reject(3)
        } else {    //else.. do the rest
        // images are in an array so creating an empty one here
        const imgsArr =[]
        //interrogate through the book images: bookImg
        bookImgs.forEach((img, idx)=>{
        //get image extension (jpeg, png etc)
            let ext = img.name.substr(img.name.lastIndexOf('.'))                                                         
            let newImageName = bookTitle.trim().replace(/ /g,'_')+ '_' + 1 +'_' + idx + ext  // the '_' before the plus one is an underscore for between the username and title + 1 is the adding number to the image to make it unique
            img.mv('./public/uploadedfiles/' + newImageName)
            imgsArr.push('/uploadedfiles/' + newImageName )

        });
        // set a new pdf file name 
        let pdfName =  bookTitle.trim().replace(/ /g,'_')+ '_' +1 + '.pdf'
        // move the pdf file with the new name to the uploadedfiles
        bookPdf.mv('./public/uploadedfiles/' + pdfName)
        // set the pdf url that is going to be saved in the json file
        let pdfNewUrl = '/uploadedfiles/'+ pdfName

        //add the new book to books.json
        booksObj.books.push({
            id:booksObj.newId,
            title: bookTitle.trim(),
            description: bookDescription,
            imgs: imgsArr,
            pdfUrl: pdfNewUrl,
            userid: 1
        })
        // increase the newId by one for the next book
        booksObj.newId++
        //save the booksObj to books.json
        fs.writeFileSync('./books.json', JSON.stringify(booksObj))
        resolve()
      }
    })

} 

// get the data of all books from the json to send it to shop
function getAllBooks() {
    return new Promise((resolve, reject)=>{
        // read file from json
        const booksJson = fs.readFileSync('./books.json')
        // convert json to object
        const booksObj = JSON.parse(booksJson)
        // export the object using resolve to be used in:then handler in the app.js 
        resolve(booksObj.books)

    })
    
}

function getBook(id){
    return new Promise((resolve, reject)=>{
        const booksJson = fs.readFileSync('./books.json')
        const booksObj = JSON.parse(booksJson)
        // find a book with id [id]
        const findBook = booksObj.books.find(book => book.id == id)
        if(findBook){
            resolve(findBook)
        } else {
            reject(new Error("can not find a book with this id:" + id))
        }
    })
}

function checkUser(email, password) {
  return new Promise((resolve, reject)=>{
      const usersJson = fs.readFileSync('./users.json')
      const usersObj = JSON.parse(usersJson)
      const matchUser = usersObj.users.find(user => user.email == email) // find in the user object that the user.email matches the email
        if(matchUser){ // if i find the user with same email...// FIRST CHECK IF THE EMAIL EXIST.. THEN CHECK IF THE HASHED PASSWORD EXISTS
            if(passwordHash.verify(password, matchUser.password)){ //  and if a hashed password exist //matchUser and the password of the password from user.json
                resolve(matchUser)
        }else{ // if the username or password is wrong then reject error 3
            reject(3)
        }
       } else{
         reject(3)
       }
    })
  }

  


module.exports = {
    registerUser,
    addBook,
    getAllBooks,
    getBook,
    checkUser,
    
}


//*1
// search for existing title and user id to validate if it already exists
// this is another way... we are saying if the data is not valid... 
    // const isNotValid = booksObj.books.find((bookData) =>{
        //  bookData.title === bookTitle
        // book.userid === 1
        //   return bookData.title !== bookTitle && bookData.userid !== 1;

        // })

        // if(isNotValid){
        //     reject()
        // }
        //console.log(isNotValid);

//*2
// before we had written password: password .. now we are crypting the user password so its not visible in the json file or in the database later
 