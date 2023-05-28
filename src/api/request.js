import axios from 'axios'

let request = axios.create({
    maxRedirects:0,
    baseURL:'http://h.jixiaob.cn',
    timeout:5000,
})

export default request