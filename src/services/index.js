/* 封装fetch */
function parseResponse (response) {
	return Promise.all([response.status,response.statusText, response.json()])
}

function checkStatus ([status,statusText,data]) {
	if(status >= 200 && status < 300){
		return data
	} else {
		let error = new Error(statusText)
		error.status = status
		error.error_message = data
		return Promise.reject(error)
	}
}

// 请求服务端逻辑
export default{

	/*
		url 二级地址
		param 参数
		headers 头部消息，兼容
		process.env 指向config下的配置
	 */
	get (url, param = {}, headers = {}, host = process.env.api) {
		console.log(param)
		let reqHeaders = new Headers()
		reqHeaders.append('Content-Type', 'application/json')
		reqHeaders.append('Accept', 'application/json')

		var query = []	// 请求的参数
		Object.keys(param).forEach((item) => {
			query.push(`${item}=${encodeURIComponent(param[item].replace(/[^\u4E00-\u9FA5\w]+/,''))}`)
		})
		var params = query.length ? '?' + query.join('&') : ''

		url = host + url + params	// 拼接成请求的地址
		console.log('请求的地址', url)

		var init = {	// fatch请求的第二个参数
			method: 'GET',
			headers: reqHeaders,
			credentials:"include",
			cache: 'default',
			// mode:'no-cors',
		}

		fetch(url,init).then(function (res) {
			console.log(res)
		}, function (e) {
			console.log(e)
		})
		// // 用于访问和操纵HTTP管道的部分，例如请求和响应。
		// return fetch(url, init)
		// 	.then(parseResponse)
		// 	.then(checkStatus)
	},
}