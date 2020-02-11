import { AxiosResponse } from 'axios';
import { Router } from 'express';
import { TeamInterface } from '@shared/Interfaces'

import tbaAxios from '../config/tbaAxios'
import { db } from "../config/database";

const router = Router()

const getColl = () => {
	return db.collection('teams')
}

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

router.post('/seed', async(req, res) => {
	const {
		eventId,
	} = req.body
	
	console.log('eventId:', eventId)
	
	if (!eventId) {
		return res.status(404).json({
			error: 'cannot find eventId'
		})
	}
	
	try {
		const response: AxiosResponse<TeamInterface[]> = await tbaAxios.get(`event/${eventId}/teams/simple`)

		const coll = getColl()

		// Try to drop collection
		// await coll.drop()
		await coll.insertMany(response.data)
		return res.send('Done!')
	} catch (err) {
		console.log('err:', err)
		
		return res.status(404).send('cannot enter teams into database')
	}
})

export default router