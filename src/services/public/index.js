// 公共模块，未登陆也能获取数据
import api from '@/api'

export default {

	// 获取登陆背景json数据
	getParticlesSet: () => {
		return api.getStaticSources('staticSources/sets/particles.json')
	},

	// 登陆接口
	login: ({
		name = '',
		password = '',
	}) => {
		return api.post('public/login', {
			userName: name,
			password: password,
		})
	},

}