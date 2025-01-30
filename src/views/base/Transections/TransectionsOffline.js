import React, { useState, useEffect } from 'react'
import axios from 'axios'
import initSqlJs from 'sql.js'

const Transactions = () => {
  const [db, setDb] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [transactions, setTransactions] = useState([])
  const [salesmen, setSalesmen] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [fees, setFees] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])

  useEffect(() => {
    initSqlJs().then((SQL) => {
      const db = new SQL.Database()
      setDb(db)
      createTables(db)
      loadDatabaseFromIndexedDB(SQL)
    })
  }, [])

  const createTables = (db) => {
    db.run(`CREATE TABLE IF NOT EXISTS salesmen (id INTEGER PRIMARY KEY, name TEXT);`)
    db.run(`CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY, name TEXT);`)
    db.run(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price REAL);`)
    db.run(`CREATE TABLE IF NOT EXISTS fees (id INTEGER PRIMARY KEY, name TEXT, amount REAL);`)
    db.run(`CREATE TABLE IF NOT EXISTS payment_methods (id INTEGER PRIMARY KEY, name TEXT);`)

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
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
    );`)

    db.run(`CREATE TABLE IF NOT EXISTS tbl_transaction_item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      outlet_code INTEGER NULL,
      shop INTEGER NULL,
      invoice_code TEXT NULL,
      sku TEXT NULL,
      invoice_item_code TEXT UNIQUE NULL,
      quantity TEXT NULL,
      rate TEXT NULL,
      gross_total TEXT NULL,
      per_discount TEXT NULL,
      discounted_value TEXT NULL,
      item_total TEXT NULL,
      status TEXT NULL,
      created_at TEXT NULL,
      created_by TEXT NULL,
      updated_at TEXT NULL,
      updated_by TEXT NULL,
      FOREIGN KEY (invoice_code) REFERENCES transactions(invoice_code) ON DELETE CASCADE
    );`)
  }

  const syncTransactionsWithServer = async () => {
    const stmt = db.prepare('SELECT * FROM transactions WHERE status = "pending"')
    const transactionsToSync = []

    while (stmt.step()) {
      transactionsToSync.push(stmt.getAsObject())
    }
    stmt.free()

    if (transactionsToSync.length > 0) {
      try {
        const response = await axios.post('API_URL/sync-transactions', transactionsToSync)
        if (response.status === 200) {
          db.run('DELETE FROM transactions WHERE status = "pending"')
          saveDatabaseToIndexedDB(db)
          console.log('Transactions synced successfully')
        }
      } catch (error) {
        console.error('Error syncing transactions:', error)
      }
    }
  }

  useEffect(() => {
    const handleOnline = () => {
      console.log('Online - syncing transactions...')
      if (db) {
        syncTransactionsWithServer()
      }
    }

    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [db])

  const handlePayment = async (transaction, items) => {
    if (navigator.onLine) {
      try {
        const response = await axios.post('API_URL/transactions', transaction)
        if (response.status === 200) {
          console.log('Transaction synced successfully')
        }
      } catch (error) {
        console.error('Error syncing transaction:', error)
      }
    } else {
      const insertTransactionQuery = `INSERT INTO transactions (invoice_code, outlet_code, shop, cust_code, salesman_code, quantity, gross_total, per_discount, discounted_value, items_discount, grand_total, advanced_payment, due_amount, additional_fees, total_pay, status, created_at, created_by, updated_at, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`
      db.run(insertTransactionQuery, [
        transaction.invoice_code,
        transaction.outlet_code,
        transaction.shop,
        transaction.cust_code,
        transaction.salesman_code,
        transaction.quantity,
        transaction.gross_total,
        transaction.per_discount,
        transaction.discounted_value,
        transaction.items_discount,
        transaction.grand_total,
        transaction.advanced_payment,
        transaction.due_amount,
        transaction.additional_fees,
        transaction.total_pay,
        transaction.created_at,
        transaction.created_by,
        transaction.updated_at,
        transaction.updated_by,
      ])

      const insertItemQuery = `INSERT INTO tbl_transaction_item (outlet_code, shop, invoice_code, sku, invoice_item_code, quantity, rate, gross_total, per_discount, discounted_value, item_total, status, created_at, created_by, updated_at, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`
      items.forEach((item) => {
        db.run(insertItemQuery, [
          item.outlet_code,
          item.shop,
          item.invoice_code,
          item.sku,
          item.invoice_item_code,
          item.quantity,
          item.rate,
          item.gross_total,
          item.per_discount,
          item.discounted_value,
          item.item_total,
          item.created_at,
          item.created_by,
          item.updated_at,
          item.updated_by,
        ])
      })
      saveDatabaseToIndexedDB(db)
    }
  }

  return (
    <div>
      <h2>Transactions</h2>
      <button onClick={syncTransactionsWithServer}>Sync Transactions</button>
    </div>
  )
}

export default Transactions
