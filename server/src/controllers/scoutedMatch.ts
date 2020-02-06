import { ScoutedMatch } from '@shared/Interfaces';
import { Router } from 'express'
import model from '../models/ScoutedMatchModel'
const router = Router()

router.get('/', async(req, res) => {
	
	res.send(await model.find({}))
})

router.post('/', async({ body: {
	scoutedMatches
} }, res) => {

	console.log('hi')
	// TODO: Add data validation
	// TODO: Replace with Mongoose
	// model.set(scoutedMatches)
	// res.send('hi')
	const test = new model({
		test: 'hi'
	})

	await test.save()
	res.send('yay')
	// res.send(model.get())
})

export default router