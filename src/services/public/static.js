// 静态模块，用于获取静态文件数据
import api from '@/api'

export default {

	// 获取登陆背景json数据
	getParticlesSet: () => {
		return api.getStaticSources('view/staticSources/sets/particles.json')
	},
}