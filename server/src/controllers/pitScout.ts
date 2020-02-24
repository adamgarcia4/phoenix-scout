import { AxiosResponse } from 'axios'
import { Router } from 'express'
import { PitScout } from '@shared/Interfaces'
import { ObjectID, ReplaceWriteOpResult } from 'mongodb'

import tbaAxios from '../config/tbaAxios'

import { db } from '../config/database'

const router = Router()

const getColl = () => db.collection('pitScout')

router.get('/', async (req, res) => {
	const coll = getColl()
	const data = await coll.find({}).toArray()

	res.send(data)
})

interface IPostReq {
	body: {
		data: PitScout[]
	}
}

router.post('/', async (req: IPostReq, res) => {
	const coll = getColl()

	const { data } = req.body

	if (!data || data.length === 0) {
		return res.json({
			data: [],
		})
	}

	const updatesArr: Promise<ReplaceWriteOpResult>[] = []

	for (const doc of data) {
		let response: Promise<ReplaceWriteOpResult> | undefined

		// Document exists, so need to update the doc.
		if (doc._id) {
			const { _id } = doc
			delete doc._id

			response = coll.replaceOne({
				_id: new ObjectID(_id),
			}, doc, {
				upsert: true,
			})
		} else {
			// Document does not exist, so
			response = coll.replaceOne({
				key: doc.key,
			}, doc, {
				upsert: true,
			})
		}
		updatesArr.push(response)
	}

	await Promise.all(updatesArr)

	return res.send('success')
})

export default router
