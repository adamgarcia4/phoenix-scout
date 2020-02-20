import axios from 'axios'

const instance = axios.create({
	baseURL: `http://localhost:${process.env.SERVER_PORT}`,
})

export default instance
