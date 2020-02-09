import { ScoutedMatch } from '@shared/Interfaces';
import { Router } from 'express'

import { db } from '../config/database'

const router = Router()

const getColl = () => {
	return db.collection('matchScout')
}

const initData: ScoutedMatch[] = [
	{
		key: 'match1',
		status: 'toBeAssigned',
		compLevel: 'qm',
		match: 'match1',
		side: 'blue',
		team: 'frc4',
		time: new Date().valueOf(),
		assignedTo: {
			name: 'Adam Garcia'
		}
	},
	{
		key: 'match2',
		status: 'toBeAssigned',
		compLevel: 'qm',
		match: 'match2',
		side: 'red',
		team: 'frc254',
		time: new Date().valueOf(),
		assignedTo: {
			name: 'Daniel'
		}
	},
]

router.get('/', async(req, res) => {
	const coll = getColl()
	const data = await coll.find({}).toArray()
	
	res.send(data)
})

router.post('/', async({ body: { data } }, res) => {
	
	const coll = getColl()

	if (!data || data.length === 0) {
		return res.json({
			data: []
		})
	}

	await coll.insertMany(data)
	return res.send('success')
})


/**
 * This resets all the data in this collection
 */
router.post('/seed', async(req, res) => {
	const coll = getColl()
	
	try {
		await coll.drop()
	} catch (err) {
		
	}
	await coll.insertMany(initData)
	res.send('Done')
})



export default router