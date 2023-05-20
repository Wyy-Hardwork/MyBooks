import axios from 'axios'

let request = axios.create({
    maxRedirects:0,
    baseURL:'http://localhost:8080',
    timeout:20000,
})

export default request