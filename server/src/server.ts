import * as dotenv from "dotenv";
import path from 'path'
import app from './app'
import mongoose from 'mongoose'
dotenv.config({
	path: path.resolve(__dirname, '../../../../.env')
})

const connect = () => {
  mongoose.connect(process.env.MONGO_URL, { 
		keepAlive: true, 
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
  return mongoose.connection;
}

const connection = connect()

connection.once('open', () => {
	console.log('MONGO CONENCTED')
	/**
	 * Start Express server.
	 */
	app.listen(process.env.SERVER_PORT, () => {
		console.log(
				"App is running at http://localhost:%d",
				process.env.SERVER_PORT
		);
		console.log("  Press CTRL-C to stop\n");
	});
})


if (module.hot) {
	module.hot.accept()
	module.hot.dispose(() => console.log('Module Disposed. '))
}