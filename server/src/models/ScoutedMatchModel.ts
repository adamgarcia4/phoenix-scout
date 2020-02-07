import { ScoutedMatch } from '@shared/Interfaces'
import mongoose, { Schema, model, Model, Document } from 'mongoose'

export interface IScoutedMatchModel extends ScoutedMatch, Document {

}

const matchScoutSchema: Schema = new Schema({
	key: String,
	status: String,
	match: String,
	team: String,
	time: Number,
	compLevel: String,
	side: String,
	data: {
		numHighAuto: Number,
    numLowAuto: Number,
    numHighTele: Number,
    numLowTele: Number,
    isColorWheel: Boolean,
    didClimb: Boolean,
	},
	assignedTo: String,
})

// import { ScoutedMatch } from '@shared/Interfaces';
// import mongoose from 'mongoose'

const ScoutedMatch: Model<IScoutedMatchModel> = model<IScoutedMatchModel>('ScoutedMatch', matchScoutSchema)

export default ScoutedMatch
// // mongoose.connect(process.env.MONGO_URL as string, {useNewUrlParser: true})

// // const db = mongoose.connection

// // db.on('error', console.error.bind(console, 'connection error:'))

// // db.once('open', () => {
// // 	console.log('connected')

// // 	const kittySchema = new mongoose.Schema({
// // 		name: String
// // 	})

// // 	const kitten = mongoose.model('MatchScout', kittySchema)
// // 	const yooo = new kitten({
// // 		name: 'HIIIya'
// // 	})
	
// // 	yooo.save((err, fluffy) => {
// // 		if (err) return console.error(err)

// // 		console.log('fluffy:', fluffy)
// // 	})
// // })

// const get = (filterFunction?: (x: ScoutedMatch) => boolean) => {
	
// 	return filterFunction ? data.filter(filterFunction): data
// }

// const set = (scoutedMatches: ScoutedMatch[]) => {
// 	for (const match of scoutedMatches) {
// 		data.push(match)
// 	}
// }
// export default {
// 	get,
// 	set,
// }