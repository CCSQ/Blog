// 用户模块模块
import api from '@/api'
import md5 from 'js-md5'

const loginUrl = 'view/sys/user/login'

export default {
	// 登陆接口
	login: ({
		name = '',
		password = '',
	}) => {
		return api.post(loginUrl, {
			userName: name,
			password: md5(password),
		})
	},

}