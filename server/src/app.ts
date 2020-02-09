
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { scoutedMatchController, teamsController } from './controllers'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

app.use('/scoutedMatch', scoutedMatchController)
app.use('/teams', teamsController)

export default app