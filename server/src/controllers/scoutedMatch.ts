import { ScoutedMatch } from '@shared/Interfaces';
import { Router } from 'express'
import model from '../models/ScoutedMatchModel'
const router = Router()

router.get('/', (req, res) => {
	res.send(model.get())
})

router.post('/', ({ body: {
	scoutedMatches
} }, res) => {

	// TODO: Add data validation
	// TODO: Replace with Mongoose
	model.set(scoutedMatches)
	
	res.send(model.get())
})

export default router