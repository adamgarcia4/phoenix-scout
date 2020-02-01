import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_TBA_URL,
  headers: {
    'X-TBA-Auth-Key': process.env.REACT_APP_TBA_KEY,
  },
})

export default instance
