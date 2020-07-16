function foo1() {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('foo1 is done ')
        }, 1000)
    })
    
}

function foo2() {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('foo2 is done ')
        }, 2000)
    })
    
}

function foo3() {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('foo3 is done ')
        }, 3000)
    })
    
}

//NOTE with async await 

// (async()=>{
//     const result1 = await foo1()
//     console.log(result1)
//     const result2 = await foo2()
//     console.log(result2)
//     const result3 = await foo3()
//     console.log(result3)
    
// })()

//NOTE promise all : lets the first two run together and the last one after 

Promise.all()
