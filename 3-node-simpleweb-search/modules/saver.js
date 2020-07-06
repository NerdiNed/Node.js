
const fs = require('fs')

// short way:
function saveContent(content, path) {
   // fs.writeFileSync(path, content) //!writeFileSync requires this order and this to parameters
    //* fs.writeFileSync will write the data everytime new.wont add it
   fs.appendFileSync(path, content) //! 3 params : 1.filepath  2. data-content 3. options ( they are optional.. like the language)
    //* appendFileSync will add new data to the file

  }

  // long way to append data
//   function saveContent(content, path) {
//    let oldData = fs.readFileSync(path)
//    let newData = oldData + content
//    fs.writeFileSync(path, newData)

//    }


  module.exports = {
      saveContent

  }