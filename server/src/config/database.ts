const mongoose = require("mongoose")

const databaseName = "dbName"

class Database {
  constructor() {
    console.log('yoos')
    this._connect()
  }

  _connect() {
    mongoose
      .connect(`${process.env.MONGO_URL}/${databaseName}`)
      .then(() => {
        console.log("Database connection successful")
      })
      .catch(err => {
        console.error("Database connection error")
      })
  }
}

module.exports = new Database()
