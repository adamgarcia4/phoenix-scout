import axios from 'axios'

const instance = axios.create({
  baseURL: `http://backend:${process.env.SERVER_PORT}`,
})

export default instance
