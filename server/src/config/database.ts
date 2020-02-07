import mongodb, { MongoClient, Db } from 'mongodb'

let client: MongoClient
let db: Db
let collMapping = {}

const connect = (cb: Function) => {
  mongodb.MongoClient.connect(process.env.MONGO_URL, (err, mongoclient) => {
    if (err) {
      console.log('err: ', err)
      return
    }

    
    client = mongoclient
    db = mongoclient.db()

    collMapping = {
      matchScout: db.collection('matchScout')
    }
    
    console.log('MONGO Connected')
    cb()
  })
}

export {
  connect,
  client,
  db,
  collMapping,
}