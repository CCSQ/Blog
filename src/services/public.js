// 公共模块，未登陆也能获取数据
import api from '@/api'
import md5 from 'js-md5'

export default {

	// 获取登陆背景json数据
	getParticlesSet: () => {
		return api.getStaticSources('view/staticSources/sets/particles.json')
	},

	// 登陆接口
	login: ({
		name = '',
		password = '',
	}) => {
		return api.post('view/user/login', {
			userName: name,
			password: md5(password),
		})
	},

}