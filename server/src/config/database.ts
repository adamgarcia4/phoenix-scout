import mongodb, { MongoClient, Db } from 'mongodb'

let client: MongoClient
let db: Db
let collMapping = {}

const mongoOptions: mongodb.MongoClientOptions = {
  useUnifiedTopology: true,
}

const mongoCallback = cb => (err, mongoclient) => {
  if (err) {
    console.log('Error connecting to mongo: ', err)
    return
  }

  client = mongoclient
  db = mongoclient.db()

  collMapping = {
    matchScout: db.collection('matchScout')
  }
  
  console.log('MONGO Connected')
  cb()
}

const connect = (cb: Function) => {
  mongodb.MongoClient.connect(
    process.env.MONGO_URL, 
    mongoOptions,
    mongoCallback(cb)
  )
}

export {
  connect,
  client,
  db,
  collMapping,
}