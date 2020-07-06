function getData(){
    let x;
    const somePromise = new Promise((resolve, reject)=>{
        setTimeout(() =>{
            try{
                x = 'i am data' +rr // the rr is simulating the error
                resolve(x)
            } catch(error){
                reject(error)
            }
        },2000)
    })
    return somePromise
}
// let result = getData()
//consol.log(result)
getData().then(data =>{  // then has to be added to the caller getData()
    console.log(data);   
}).catch(error =>{
    console.log(error);
    
})

async function normalFunction(){
    let something = await getData()
    console.log(something);
    
}

// iffie function is a Self-invoking function. it will be called by itself)
//  (async()=>{
//  let something = await getData()
//  console.log(something);
// })()

// we write the data that we want to run a-synchronic ( want to run before the other coming code ) 
//we write it into the promise scope. after that we need to add the .then(data =>{}) is always add4ed to the calling of the function/or promise
// i also can write the promise directly not into a function
// or directly return the promise
// following is for simulating an error in the delay(setTimeout):
//  try{
//     x = 'i am data' +rr // the rr is simulating the error
//     resolve(x)
// } catch(error){
//     reject(error)
// }
// try "this code"..when it runs resolve it and show it.. 
// if there is a problem (i added the +rr)..then catch the problem and show it : reject (error)
// when using try &catch the then is for the resolve it shows us the result of resolve
// and the catch for the reject.. it shows us the result of reject
// the second catch after the then is not necessarily needed.. but if you want to catch the reject you need it.
// with async await i cant see if there is an error, because i cant use reject

// when reject or resolve is running its like return.. the code is done. 
// it also doesn't matter if i use reject first or without resolve.

// async / await  will run the code asynchronously ... you put the code you want it to wait for inside.
// in this case example the promise function--- so it will run consol.log(something) when 
// the promise getData() is ready... like this it takes a second but it will run the code only when promise
// is ready to tun
