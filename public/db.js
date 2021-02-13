let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;

    //creates an object store called "pending" and set autoIncrement to true
    db.createObjectStore("pending", { autoIncrement: true });
}

request.onsuccess = function(event) {
    db = event.target.result;

    //this will check if the app is online before reading from the database 
    if (navigator.onLine) {
        checkDatabase();
    }
}

request.onerror = function(event) {
    console.log("Error", event.target.errorCode);
}

function saveRecord(record) {

    //this will create a transaction on the db with read/write access 
    const transaction = db.transaction(["pending"] , "readwrite")

    //access the pending object store
    const store = transaction.objectStore("pending");

    //adds a record to the store using the 'add' method
    store.add(record);
}

function checkDatabase() {

    //creates a transaction on the db with read/write access
    const transaction = db.transaction(["pending"], "readwrite");

    const store 
}

window.addEventListener("online", checkDatabase);