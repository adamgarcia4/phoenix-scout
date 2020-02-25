const path = require('path')
const express = require('express')

// https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
const app = express()
const DIST_DIR = path.join(__dirname, './dist')
const HTML_FILE = path.join(DIST_DIR, 'index.html')

app.use(express.static(DIST_DIR))

app.get('*', (req, res) => {
	res.sendFile(HTML_FILE)
})

app.listen(3000, () => {
	console.log('App listening to port 3000....')
	console.log('Press Ctrl+C to quit.')
})
