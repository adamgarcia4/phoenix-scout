import { ScoutedMatch } from '@shared/Interfaces';
import { Router } from 'express'
import model from '../models/ScoutedMatchModel'
const router = Router()

router.get('/scoutedMatch', (req, res) => {
	res.send(model.get())
})

router.post('/scoutedMatch', ({ body: {
	scoutedMatches
} }, res) => {
	
	console.log('scoutedMatches:', scoutedMatches)
	
	model.set(scoutedMatches)
	
	res.send(model.get())
	
	// res.send(model.get())
})

export default router