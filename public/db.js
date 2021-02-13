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
    // open a transaction on your pending db
    const transaction = db.transaction(["pending"], "readwrite");
    // access your pending object store
    const store = transaction.objectStore("pending");
    // get all records from store and set to a variable
    const getAll = store.getAll();
  
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(() => {
            // if successful, open a transaction on your pending db
            const transaction = db.transaction(["pending"], "readwrite");
  
            // access your pending object store
            const store = transaction.objectStore("pending");
  
            // clear all items in your store
            store.clear();
          });
      }
    };
  }

window.addEventListener("online", checkDatabase);