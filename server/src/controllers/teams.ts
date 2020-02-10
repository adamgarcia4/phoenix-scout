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
	const coll = getColl()

	// Try to drop collection
	try {
		await coll.drop()
	} catch (err) {
	}

	// Get Team Response
	const response: AxiosResponse<TeamInterface[]> = await tbaAxios.get(`event/2019cala/teams/simple`)
	await coll.insertMany(response.data)

	res.send('Done')
})

export default router