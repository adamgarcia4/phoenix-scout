import * as dotenv from "dotenv";
import path from 'path'
import app from './app'
import {connect} from './config/database'

dotenv.config({
	path: path.resolve(__dirname, '../../../../.env')
})

const startServer = () => {
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
}

connect(startServer)


if (module.hot) {
	module.hot.accept()
	module.hot.dispose(() => console.log('Module Disposed. '))
}