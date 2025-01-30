// import initSqlJs from 'sql.js';

// const DB_NAME = 'POS_DB';

// /**
//  * Initializes the database and stores it in IndexedDB for persistence.
//  */
// // export async function initDatabase() {
// //     try {
// //         console.log("Loading sql.js...");
// //         const SQL = await initSqlJs({});
// //         console.log("sql.js loaded!");

// //         let db;

// //         // Check if IndexedDB contains a saved database
// //         const savedDb = await loadDatabaseFromIndexedDB(DB_NAME);
// //         if (savedDb) {
// //             console.log("Loaded database from IndexedDB!");
// //             db = new SQL.Database(savedDb);
// //         } else {
// //             console.log("Creating a new database...");
// //             db = new SQL.Database();
            
// //             // Create table
// //             db.run(`
// //                 CREATE TABLE IF NOT EXISTS transactions (
// //                     id INTEGER PRIMARY KEY AUTOINCREMENT,
// //                     invoice_code TEXT UNIQUE,
// //                     outlet_code INTEGER,
// //                     shop INTEGER,
// //                     cust_code INTEGER,
// //                     salesman_code INTEGER,
// //                     quantity TEXT,
// //                     gross_total TEXT,
// //                     per_discount TEXT,
// //                     discounted_value TEXT,
// //                     items_discount TEXT,
// //                     grand_total TEXT,
// //                     advanced_payment TEXT,
// //                     due_amount TEXT,
// //                     additional_fees TEXT,
// //                     total_pay TEXT,
// //                     status TEXT,
// //                     created_at TEXT,
// //                     created_by TEXT,
// //                     updated_at TEXT,
// //                     updated_by TEXT
// //                 );
// //             `);

// //             console.log("Transactions table created!");
// //             await saveDatabaseToIndexedDB(DB_NAME, db);
// //         }

// //         return db;
// //     } catch (error) {
// //         console.error("Error initializing database:", error);
// //     }
// // }


// export async function initDatabase() {
//     try {
//         console.log("Loading sql.js...");
//         const SQL = await initSqlJs({
//             locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
//         });
//         console.log("sql.js loaded!");

//         let db;
//         const savedDb = await loadDatabaseFromIndexedDB(DB_NAME);
//         if (savedDb) {
//             console.log("Loaded database from IndexedDB!");
//             db = new SQL.Database(savedDb);
//         } else {
//             console.log("Creating a new database...");
//             db = new SQL.Database();

//             db.run(`
//                 CREATE TABLE IF NOT EXISTS transactions (
//                     id INTEGER PRIMARY KEY AUTOINCREMENT,
//                     invoice_code TEXT UNIQUE,
//                     outlet_code INTEGER,
//                     shop INTEGER,
//                     cust_code INTEGER,
//                     salesman_code INTEGER,
//                     quantity TEXT,
//                     gross_total TEXT,
//                     per_discount TEXT,
//                     discounted_value TEXT,
//                     items_discount TEXT,
//                     grand_total TEXT,
//                     advanced_payment TEXT,
//                     due_amount TEXT,
//                     additional_fees TEXT,
//                     total_pay TEXT,
//                     status TEXT,
//                     created_at TEXT,
//                     created_by TEXT,
//                     updated_at TEXT,
//                     updated_by TEXT
//                 );
//             `);

//             console.log("Transactions table created!");
//             await saveDatabaseToIndexedDB(DB_NAME, db);
//         }

//         // Verify table creation
//         const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table';");
//         console.log("Tables in database:", tables);

//         return db;
//     } catch (error) {
//         console.error("Error initializing database:", error);
//     }
// }


// /**
//  * Saves the database to IndexedDB.
//  */
// async function saveDatabaseToIndexedDB(dbName, db) {
//     try {
//         const dbData = db.export(); // Uint8Array format
//         const request = indexedDB.open(dbName, 1);

//         request.onsuccess = function (event) {
//             const idb = event.target.result;
//             const transaction = idb.transaction(["database"], "readwrite");
//             const store = transaction.objectStore("database");
//             store.put(dbData, "db"); // Store as Uint8Array, not Blob
//             console.log("Database saved to IndexedDB!");
//         };

//         request.onerror = function (event) {
//             console.error("IndexedDB error:", event.target.error);
//         };

//         request.onupgradeneeded = function (event) {
//             const idb = event.target.result;
//             idb.createObjectStore("database");
//         };
//     } catch (error) {
//         console.error("Error saving database to IndexedDB:", error);
//     }
// }


// async function loadDatabaseFromIndexedDB(dbName) {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open(dbName, 1);

//         request.onsuccess = function (event) {
//             const idb = event.target.result;
//             const transaction = idb.transaction(["database"], "readonly");
//             const store = transaction.objectStore("database");
//             const getRequest = store.get("db");

//             getRequest.onsuccess = function () {
//                 if (getRequest.result) {
//                     console.log("Database found in IndexedDB!");
//                     resolve(new Uint8Array(getRequest.result)); // Convert back to Uint8Array
//                 } else {
//                     console.log("No existing database in IndexedDB.");
//                     resolve(null);
//                 }
//             };

//             getRequest.onerror = function () {
//                 reject("Failed to load database from IndexedDB.");
//             };
//         };

//         request.onerror = function (event) {
//             reject("IndexedDB error: " + event.target.error);
//         };

//         request.onupgradeneeded = function (event) {
//             const idb = event.target.result;
//             idb.createObjectStore("database");
//         };
//     });
// }

import initSqlJs from 'sql.js';

const DB_NAME = 'POS_DB';

/**
 * Initializes the database and stores it in IndexedDB for persistence.
 */
export async function initDatabase() {
    try {
        console.log("Loading sql.js...");
        const SQL = await initSqlJs({
            locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm`
        });

        if (!SQL) {
            throw new Error("Failed to load sql.js.");
        }

        console.log("sql.js loaded!");

        let db;

        // Check if IndexedDB contains a saved database
        const savedDb = await loadDatabaseFromIndexedDB(DB_NAME);
        if (savedDb) {
            console.log("Loaded database from IndexedDB!");
            try {
                db = new SQL.Database(new Uint8Array(savedDb)); // Ensure correct format
            } catch (error) {
                console.error("Corrupt database detected! Resetting IndexedDB...");
                await clearIndexedDB();
                db = new SQL.Database();
            }
        } else {
            console.log("Creating a new database...");
            db = new SQL.Database();
        }

        if (!db) {
            throw new Error("Database instance is undefined.");
        }

        console.log("Initializing transactions table...");

        // Ensure that the database instance is valid before executing queries
        db.run(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_code TEXT UNIQUE,
                outlet_code INTEGER,
                shop INTEGER,
                cust_code INTEGER,
                salesman_code INTEGER,
                quantity TEXT,
                gross_total TEXT,
                per_discount TEXT,
                discounted_value TEXT,
                items_discount TEXT,
                grand_total TEXT,
                advanced_payment TEXT,
                due_amount TEXT,
                additional_fees TEXT,
                total_pay TEXT,
                status TEXT,
                created_at TEXT,
                created_by TEXT,
                updated_at TEXT,
                updated_by TEXT
            );
        `);

        console.log("Transactions table created!");
        await saveDatabaseToIndexedDB(DB_NAME, db);
        return db;
    } catch (error) {
        console.error("Error initializing database:", error);
        return null; // Return null to prevent undefined errors
    }
}

/**
 * Clears IndexedDB to reset corrupt data.
 */
async function clearIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME);
        request.onsuccess = () => {
            console.log("IndexedDB cleared successfully!");
            resolve();
        };
        request.onerror = (event) => {
            console.error("Error clearing IndexedDB:", event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Saves the database to IndexedDB.
 */
async function saveDatabaseToIndexedDB(dbName, db) {
    try {
        const dbData = db.export();
        const request = indexedDB.open(dbName, 1);

        request.onsuccess = function (event) {
            const idb = event.target.result;
            const transaction = idb.transaction(["database"], "readwrite");
            const store = transaction.objectStore("database");
            store.put(dbData, "db");
            console.log("Database saved to IndexedDB!");
        };

        request.onerror = function (event) {
            console.error("IndexedDB error:", event.target.error);
        };

        request.onupgradeneeded = function (event) {
            const idb = event.target.result;
            idb.createObjectStore("database");
        };
    } catch (error) {
        console.error("Error saving database to IndexedDB:", error);
    }
}

/**
 * Loads the database from IndexedDB.
 */
async function loadDatabaseFromIndexedDB(dbName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onsuccess = function (event) {
            const idb = event.target.result;
            const transaction = idb.transaction(["database"], "readonly");
            const store = transaction.objectStore("database");
            const getRequest = store.get("db");

            getRequest.onsuccess = function () {
                if (getRequest.result) {
                    resolve(getRequest.result);
                } else {
                    resolve(null);
                }
            };

            getRequest.onerror = function () {
                reject("Failed to load database from IndexedDB.");
            };
        };

        request.onerror = function (event) {
            reject("IndexedDB error: " + event.target.error);
        };

        request.onupgradeneeded = function (event) {
            const idb = event.target.result;
            idb.createObjectStore("database");
        };
    });
}
