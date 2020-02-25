
import { AxiosResponse } from 'axios'
import { ScoutedMatch, MatchAPIResponse } from '@shared/Interfaces'
import { Router } from 'express'
import { ObjectID, ReplaceWriteOpResult } from 'mongodb'

import { db } from '../config/database'

import tbaAxios from '../config/tbaAxios'

const router = Router()

const getColl = () => {
	return db.collection('matchScout')
}

const initData: ScoutedMatch[] = [
	{
		key: 'match1',
		// status: 'toBeAssigned',
		compLevel: 'qm',
		match: 'match1',
		side: 'blue',
		team: 'frc4',
		// time: new Date().valueOf(),
		// assignedTo: {
		// 	name: 'Adam Garcia',
		// },
	},
	{
		key: 'match2',
		// status: 'toBeAssigned',
		compLevel: 'qm',
		match: 'match2',
		side: 'red',
		team: 'frc254',
		// time: new Date().valueOf(),
		// assignedTo: {
		// 	name: 'Daniel',
		// },
	},
]

router.get('/', async (req, res) => {
	const coll = getColl()
	const data = await coll.find({}).toArray()

	res.send(data)
})

interface IPostReq {
	body: {
		data: ScoutedMatch[]
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
		let res: Promise<ReplaceWriteOpResult> | undefined

		// Document exists, so need to update the doc.
		if (doc._id) {
			const { _id } = doc
			delete doc._id

			res = coll.replaceOne({
				_id: new ObjectID(_id),
			}, doc, {
				upsert: true,
			})
		} else {
			// Document does not exist, so
			res = coll.replaceOne({
				key: doc.key,
			}, doc, {
				upsert: true,
			})
		}
		updatesArr.push(res)
	}

	await Promise.all(updatesArr)

	return res.send('success')
})


/**
 * This resets all the data in this collection
 */
router.post('/seed', async (req, res) => {
	const coll = getColl()

	try {
		await coll.drop()
	} catch (err) {

	}
	await coll.insertMany(initData)
	res.send('Done')
})

router.post('/seedEvent', async (req, res) => {
	const {
		eventId,
	} = req.body

	console.log('eventId:', eventId)
	if (!eventId) {
		return res.status(404).send('error')
	}

	try {
		const response: AxiosResponse<MatchAPIResponse[]> = await tbaAxios.get(`/event/${eventId}/matches`)

		await db.collection('matches').bulkWrite(response.data.filter((match) => match.comp_level === 'qm').map((match) => {
			return {
				replaceOne: {
					filter: {
						key: match.key,
					},
					replacement: match,
					upsert: true,
				},
			}
		}))
		res.send('good')
	} catch (error) {
		res.status(400).send('Something happened!')
	}
})


export default router
