//open a db
//create object store
// make transaction
let db;
let openRequest = indexedDB.open("myDB");

//db success
openRequest.addEventListener("success", (e) =>{
    console.log("db success");
    db = openRequest.result; //if db exists
})
//db error
openRequest.addEventListener("error", (e) =>{
    console.log("db error");
})
//db upgraded
openRequest.addEventListener("upgradeneeded",(e) =>{
    console.log("db upgraded + initial db creation");
    db = openRequest.result; //if db upgraded

    db.createObjectStore("video" , {keyPath: "id"});
    db.createObjectStore("image", {keyPath: "id"});

})