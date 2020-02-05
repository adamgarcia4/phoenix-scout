
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import scoutedMatchController from './controllers/scoutedMatch'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(scoutedMatchController)

export default app