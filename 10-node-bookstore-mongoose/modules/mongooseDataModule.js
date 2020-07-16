const passwordHash = require('password-hash')
//const {MongoClient, ObjectID} = require('mongodb')
//require mongoose
const mongoose = require('mongoose')
const fs = require('fs')
// URL connection string 
const connectionString = 'mongodb+srv://...:...@cluster0.2yu3i.mongodb.net/......?retryWrites=true&w=majority'

//get mongoose schema object from  mongoose
const Schema = mongoose.Schema  //*2
//with destructuring it is like this :
// const {Schema} = mongoose

// create the schema for the user
const userSchema = new Schema({ //*3

    password:{
        type: String,
        required: true  //*4
    },
    email: {
        type: String,
        required : true,
        unique: true //*5
    },
 

})

// create a schema for the books
const bookSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String
    },
    pdfUrl: {
        type: String,
        required: true,
    },
    imgs: {
        type: [String],  // [] indicates that it is an array of images !
        required: true,
        min: 1, // means there has to be minimum one image be uploaded // without it at least an empty array would be required
    }, 
    userid :{
        type: String,
        required: true
    }
})

// create a user model
// connect the collection of the database (which is called  mongoose_user )with the created schema here
const Users = mongoose.model('users', userSchema)

// create book model
const Books = mongoose.model('books', bookSchema)

// create a connect function.. to connect or mongooseDataModule with our mongo db database
//*6
// check if mongoose is already connected to the database //*1
// check the connection, if successful it will resolve if not it will reject
// create a function that will return a promise
function  connectFcn() { //*7
    return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) { //*6 //*1
            resolve()
        }else {
            mongoose.connect(connectionString, {// connect will return a promise... 
                useUnifiedTopology:true,
                useCreateIndex: true,
                useNewUrlParser: true
            }).then(() => {
                resolve()
            }).catch(error => {
                reject(error)
            })
        }
    })
}

// transferring all the functions from our dataModule.js to this mongoose module
// to be able to connect our page with our database 
// get specific data from the user 

function registerUser(email, password){
    return new Promise((resolve, reject)=>{
        connectFcn().then(()=>{
            // create new user
            const newUser = new Users({
                email: email,
                password: passwordHash.generate(password)
            })
            // save the new User in the database
            newUser.save().then(result =>{
                console.log(result);
                resolve()
            }).catch(error =>{
                console.log(error.code);
                if(error.code === 11000){
                    reject('exists')
                }else{
                    reject(error)
                }
            })

        }).catch(error=>{
            reject(error)
        })
    })
                
}


function checkUser(email, password) {
    return new Promise((resolve, reject)=>{
        connectFcn().then(()=>{
            //find the user to verify him/her
            Users.findOne({  //*3
                email: email
            }).then(user =>{
                if(user){
                    if(passwordHash.verify(password, user.password)){
                        resolve(user)
                    } else{
                        reject(3)
                    }
                } else {
                    reject(error)
                }
            }).catch(error =>{
                reject(error)
            })
        }).catch(error =>{
            reject(error)
        })
    })
    
}

function addBook(bookTitle, bookDescription, bookPdf, booksImgs, userId){
    return new Promise((resolve, reject)=>{
        connectFcn().then(()=>{
            Books.findOne({
                title: bookTitle,
                userid: userId
            }).then(findBook =>{
                if(findBook){
                    reject(3)
                } else {

                    // try {
                        const imgsArr = []
                        booksImgs.forEach((img, idx) => {
                            //get file extension
                            let ext = img.name.substr(img.name.lastIndexOf('.'))
                            //set the new image name
                            let newImageName = bookTitle.trim().replace(/ /g, '_') + '_' + userId + '_' + idx + ext // the '_' before the plus one is an underscore for between the username and title + 1 is the adding number to the image to make it unique which is now replaced with userId
                            img.mv('./public/uploadedfiles/' + newImageName)
                            imgsArr.push('/uploadedfiles/' + newImageName) // saving the URL.. this is going to be used there
                        });
                        // set a new pdf file name 
                        let pdfName = bookTitle.trim().replace(/ /g, '_') + '_' + userId + '.pdf'
                        // move the pdf file with the new name to the uploadedfiles
                        bookPdf.mv('./public/uploadedfiles/' + pdfName) // moving the files on the back
                        // set the pdf url that is going to be saved in the json file
                        let pdfNewUrl = '/uploadedfiles/' + pdfName // this is going to be used on the front end
                        
                        const newBook = new Books({
                            title: bookTitle,
                            description: bookDescription,
                            imgs: imgsArr, // this is a list of URLs
                            pdfUrl: pdfNewUrl,
                            userid: userId
                        })

                        newBook.save().then(() => {
                            
                            resolve()
                        }).catch(error => {
                            reject(error)
                        })
                    // }catch (error) {
                    //     reject(error)
                    // }
                }
            }).catch(error=>{
                reject(error)
            })
        }).catch(error=>{
            reject(error)
        })
    })
}



function getAllBooks() {
    return new Promise((resolve, reject) => {
        connectFcn().then(()=> {
           
            Books.find().then(books => {
                // add id property to each book instead of _id
                // this is how it is used in the ejs
                books.forEach(book => {
                    // change the old id with the new one
                    // book.id = book._id  same as below
                    book['id'] = book['_id'] // changing the object key['id']. change the old Id with underscroll into id without _: book['_id'] is the one to be replaced 
                })
                resolve(books)
            })

        }).catch(error => {
            reject(error)
        })

    }).catch(error => {
        reject(error)
    })
}

function getBook(id) {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {
           Books.findOne({_id : id}).then(book => {
               
                if (book) {
                    book.id = book._id
                    resolve(book)
                } else {
                    reject(new Error("can not find a book with this id:" + id))
                }
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })

}

function userBooks(userid) {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {
            Books.find({
                userid: userid
            }).then(books => {
                // add id property to each book instead of _id
                // this is how it is used in the ejs
                books.forEach(book => {
                    // change the old id with the new one
                    // book.id = book._id  same as below
                    book['id'] = book['_id'] // changing the object key['id']. change the old Id with underscroll into id without _: book['_id'] is the one to be replaced 
                })
                resolve(books)
            })
        }).catch(error => {
            reject(error)
        })
    }).catch(error => {
        reject(error)
    })
}

function updatedBooks(bookId, newBookTitle, oldImgsUrls, bookDescription, newPdfBook, newImgs, userId) {
    return new Promise((resolve, reject) => {
        try {  // with async function we need try catch to get an error- 

            // going to use iffy as this function will have many callings. and promises will be too nested. so i will use async await
            (async () => {

                let oldBookData = await getBook(bookId)
                // need to find the images that i need to delete
                const deletedImgs = []
                const keepImgs = []
                // get update version number of the property named update
                //* will delete this code because we only need version nr__V
                // let updateNum = 1
                // if (oldBookData.update) { // if there is an updated book -- then give it a num and increase it each time a new updated data comes along  //*7 
                //     updateNum = oldBookData.update + 1
                // }

                // check which images users wants to keep and which to delete 
                oldBookData.imgs.forEach(img => {
                    if (oldImgsUrls.indexOf(img) >= 0) { // if the image doesn't exist i need to push it to deleted images 
                        keepImgs.push(img) // if the img url contains the image we want to keep then push it into keep-
                    } else {

                        deletedImgs.push(img)
                    }
                })
                // save new images to file system and to array to be saved to db
                const newImgsUrlsArr = []
                newImgs.forEach((img, idx) => {
                    const imgExt = img.name.substr(img.name.lastIndexOf('.')) // getting the extension
                    // set the new name for the image
                    const newImgName = newBookTitle.trim().replace(/ /g, '_') + '_' + userId + '_' + idx + '_' + (oldBookData.__v + 1) + imgExt
                    newImgsUrlsArr.push('/uploadedfiles/' + newImgName)
                    img.mv('./public/uploadedfiles/' + newImgName)
                })
                // delete the deleted images files from the system
                deletedImgs.forEach(file => {
                    // before deleting make sure the file exists
                    if (fs.existsSync('./public' + file)) {
                        fs.unlinkSync('./public' + file)
                    }
                })
                // check if the user uploaded a new pdf file and move it to the same place of the old one so it will OVERWRITE it
                // if the title shall be changed too, because the user is able to upload more than one pdf, we have to do the same thing as for the images
                if (newPdfBook) {
                    newPdfBook.mv('./public' + oldBookData.pdfUrl)
                }
                //await connectFcn()
        
                 await Books.updateOne({
                    _id: bookId
                }, 
                {
                        title: newBookTitle,
                        description: bookDescription,
                        imgs: [...keepImgs, ...newImgsUrlsArr], // the three ... will merge two arrays together to one// first array of images is : keepImgs, second array of images is : newImgsArr. tg
                        $inc:{__v: 1} // increase the version number
                    
                })
              
                resolve()
            })()

        } catch (error) {
            reject(error)
        }

    })

}

//NOTE we use the user id validation as well, to make sure that book belongs to that user, to  prevent browser side attacks 
function deleteBook(bookId, userId) {
    return new Promise((resolve, reject) => {
        getBook(bookId).then(book => {
            //check if book belong to the current login user
            if (book.userid === userId) {
                //delete book images
                book.imgs.forEach(img => {
                    if (fs.existsSync('./public' + img)) {
                        fs.unlinkSync('./public' + img)
                    }
                })
                //delete pdf file
                //check if pdf file is exist then delete it
                if (fs.existsSync('./public' + book.pdfUrl)) {
                    fs.unlinkSync('./public' + book.pdfUrl)
                }
               
                    Books.deleteOne({
                        _id: bookId
                    }).then(() => {
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
               
            } else {
                reject(new Error('hacking try..not this time'))
            }
        }).catch(error => {
            reject(error)
        })
    })
}



module.exports = {
    registerUser,
    checkUser,
    addBook,
    getAllBooks,
    getBook,
    userBooks,
    updatedBooks,
    deleteBook
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

//*3 //REVIEW
// find() will return an array if there is no results it will return an empty array
// findOne() will return an object. . if there is no result it will return null
//i can also use both with more than one condition