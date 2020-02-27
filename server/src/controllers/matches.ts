import { AxiosResponse } from "axios"
import { Router } from "express"
import { MatchAPIResponse } from "@shared/Interfaces"
import { ObjectID, ReplaceWriteOpResult } from "mongodb"

import tbaAxios from "../config/tbaAxios"

import { db } from "../config/database"

const router = Router()

const getColl = () => db.collection("matches")

router.get("/", async (req, res) => {
  const coll = getColl()
  const data = await coll.find({}).toArray()

  res.send(data)
})

interface IPostReq {
  body: {
    data: MatchAPIResponse[]
  }
}

router.post("/", async (req: IPostReq, res) => {
  const coll = getColl()

  const { data } = req.body

  if (!data || data.length === 0) {
    return res.json({
      data: []
    })
  }

  console.log("data12:", data)

  const updatesArr: Promise<ReplaceWriteOpResult>[] = []

  for (const doc of data) {
    let response: Promise<ReplaceWriteOpResult> | undefined

    // Document exists, so need to update the doc.
    if (doc._id) {
      const { _id } = doc
      delete doc._id

      response = coll.replaceOne(
        {
          _id: new ObjectID(_id)
        },
        doc,
        {
          upsert: true
        }
      )
    } else {
      // Document does not exist, so
      response = coll.replaceOne(
        {
          key: doc.key
        },
        doc,
        {
          upsert: true
        }
      )
    }
    updatesArr.push(response)
  }

  await Promise.all(updatesArr)

  return res.send("success")
})

// router.post('/seed', async (req, res) => {
// 	const {
// 		eventId,
// 	} = req.body

// 	console.log('eventId:', eventId)

// 	if (!eventId) {
// 		return res.status(404).json({
// 			error: 'cannot find eventId',
// 		})
// 	}

// 	try {
// 		const response: AxiosResponse<TeamInterface[]> = await tbaAxios.get(`event/${eventId}/teams/simple`)

// 		const coll = getColl()

// 		// Try to drop collection
// 		// await coll.drop()
// 		await coll.insertMany(response.data)
// 		return res.send('Done!')
// 	} catch (err) {
// 		console.log('err:', err)

// 		return res.status(404).send('cannot enter teams into database')
// 	}
// })

export default router
