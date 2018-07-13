import  axios from "axios";
import CryptoJS from 'crypto-js/crypto-js'
console.log(CryptoJS.MD5('123456').toString())

axios.defaults.timeout = 5000;
let url = '';
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
	config.headers['Content-Type'] =  'application/json';
    // 在发送请求之前做些什么
    url = config.url;
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return url.indexOf('json') > -1 ? response : response.data;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export default (url, data = {}, method = 'POST')=>{
	return new Promise((resolve, reject) => {
		axios({
			method,
			data,
			url
		}).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        });
	});
};



// C.axios(C.api('login'), { account: values.account, password: values.account }).then(res=> {
//     C.utils.data(C.constant.login, res.data);
//     Toast.success('登录成功')
//     this.props.history.push('/');
//   if (res.code == C.code.succees) {
//   } else {
//     Toast.success(res.msg)
//   }
// }).catch(error=> {
//   Toast.error('登录失败')
// })