import { AxiosResponse } from 'axios';
import { Router } from 'express';
import { TeamInterface } from '@shared/Interfaces'

import tbaAxios from '../config/tbaAxios'
import { db } from "../config/database";

const router = Router()

const getColl = () => {
	return db.collection('teams')
}

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