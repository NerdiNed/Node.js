const passwordHash = require('password-hash')
const {
    MongoClient,
    ObjectID
} = require('mongodb')
const fs = require('fs')
// URL connection string 
const connectionString = 'mongodb+srv://.....:......@cluster0..mongodb.net/.....?retryWrites=true&w=majority'


// create a connect function.. to connect or mongodbDataModule with our mongo db database
function connect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(client => {
            resolve(client)
        }).catch(error => {
            reject(error)
        })
    })
}

// transferring all the functions from our dataModule.js to this mongoDb module
// to be able to connect our page with our database 


function registerUser(email, password) {
    return new Promise((resolve, reject) => {
        connect().then(client => {
            // get the db of the client
            const db = client.db('planetNerd')
            // find if the user exists in that collection
            db.collection('users').findOne({
                email: email
            }).then(user => {
                // if user exists
                if (user) {
                    client.close()
                    reject('exists')
                } else { // if user doesn't exists insert email& password
                    db.collection('users').insertOne({
                        email: email,
                        password: passwordHash.generate(password)
                        //if all things are good
                    }).then(response => {
                        client.close()
                        if (response.result.ok) {
                            resolve()
                        } else {
                            reject('can not insert')
                        }
                    }).catch(error => {
                        client.close()
                        reject(error)
                    })
                }
            }).catch(error => {
                client.close()
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })

}

function checkUser(email, password) {
    //your code
    return new Promise((resolve, reject) => {
        connect().then(client => {
            const db = client.db('planetNerd')
            db.collection('users').findOne({
                email: email
            }).then(user => {
                client.close()
                if (user) {
                    if (passwordHash.verify(password, user.password)) {
                        resolve(user)
                    } else {
                        reject(3)
                    }
                } else {
                    reject(error)
                }
            }).catch(error => {
                client.close()
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}

function addBook(bookTitle, bookDescription, bookPdf, booksImgs, userId) {
    return new Promise((resolve, reject) => {
        connect().then(client => {

            const db = client.db('planetNerd') // add data to database
            db.collection('books').findOne({ // then add to the collection ('books')
                title: bookTitle,
                userid: userId
            }).then(findBook => {
                if (findBook) {
                    client.close()
                    reject(3)
                } else {
                    //create an empty images array to be saved in the database
                    try {


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

                        // put into the database
                        db.collection('books').insertOne({

                            title: bookTitle,
                            description: bookDescription,
                            imgs: imgsArr, // this is a list of URLs
                            pdfUrl: pdfNewUrl,
                            userid: userId
                        }).then(response => {
                            client.close()
                            if (response.result.ok) {
                                resolve()
                            } else {
                                reject(new Error(' can not insert the books'))
                            }
                        }).catch(error => {
                            reject(error)
                        })
                    } catch (error) {
                        reject(error)
                    }
                }
            }).catch(error => {
                client.close()
                reject(error)
            })

        }).catch(error => {
            reject(error)
        })
    })
}

function getAllBooks() {
    return new Promise((resolve, reject) => {
        connect().then(client => {
            const db = client.db('planetNerd')
            db.collection('books').find().toArray().then(books => {
                // add id property to each book instead of _id
                // this is how it is used in the ejs
                books.forEach(book => {
                    // change the old id with the new one
                    // book.id = book._id  same as below
                    book['id'] = book['_id'] // changing the object key['id']. change the old Id with underscroll into id without _: book['_id'] is the one to be replaced 
                })
                client.close()
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
        connect().then(client => {
            const db = client.db('planetNerd')
            db.collection('books').findOne({
                _id: new ObjectID(id)
            }).then(book => {
                client.close()
                if (book) {
                    book.id = book._id
                    resolve(book)
                } else {
                    reject(new Error("can not find a book with this id:" + id))
                }

            }).catch(error => {
                client.close()
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })

}

function userBooks(userid) {
    return new Promise((resolve, reject) => {
        connect().then(client => {
            const db = client.db('planetNerd')
            db.collection('books').find({
                userid: userid
            }).toArray().then(books => {
                // add id property to each book instead of _id
                // this is how it is used in the ejs
                books.forEach(book => {
                    // change the old id with the new one
                    // book.id = book._id  same as below
                    book['id'] = book['_id'] // changing the object key['id']. change the old Id with underscroll into id without _: book['_id'] is the one to be replaced 
                })
                client.close()
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
        try{

        // going to use iffy as this function will have many callings. and promises will be too nested. so i will use async await
        (async () => {

            let oldBookData = await getBook(bookId)
            // need to find the images that i need to delete
            const deletedImgs = []
            const keepImgs = []
            // get update version number of the property named update
            let updateNum = 1
            if (oldBookData.update) { // if there is an updated book -- then give it a num and increase it each time a new updated data comes along  //*7 
                updateNum = oldBookData.update + 1
            }

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
                const newImgName = newBookTitle.trim().replace(/ /g, '_') + '_' + userId + '_' + idx + '_' + updateNum + imgExt
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
            const client = await connect()
            const db = client.db('planetNerd')
            const result = await db.collection('books').updateOne({
                _id: new ObjectID(bookId)
                }, {
                $set: {
                    title: newBookTitle,
                    description: bookDescription,
                    imgs: [...keepImgs, ...newImgsUrlsArr], // the three ... will merge two arrays together to one// first array of images is : keepImgs, second array of images is : newImgsArr. tg
                    update: updateNum, //*7 see above 
                }
            })
            client.close()
            resolve()
        })()

      } catch (error){
        reject(error)
        }

    }) 

}

//NOTE we use the user id validation as well, to make sure that book belongs to that user, to  prevent browser side attacks 
function deleteBook(bookId,userId) {
    return new Promise((resolve, reject) => {
        getBook(bookId).then(book => {
           // check if the book images belong to the current login user
            if (book.userid === userId) {
                //delete book images
                book.imgs.forEach(img => {
                    if (fs.existsSync('./public' + img)) {
                        fs.unlinkSync('./public' + img)
                    }
                })
                // delete pdf file
                // check if the pdf file exists then delete it
                if (fs.existsSync('./public' + book.pdfUrl)) {
                    fs.unlinkSync('./public' + book.pdfUrl)
                }
                // delete the data from the database
                connect().then(client => {
                    const db = client.db('planetNerd')
                    db.collection('books').deleteOne({_id: new ObjectID(bookId)}).then(()=>{
                        client.close()
                        resolve()
                    }).catch(error => {
                        client.close()
                        reject(error)
                    })
                }).catch(error => {
                    reject(error)
                })
            } else {
                reject(new Error('hacking try, not this time baby'))
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