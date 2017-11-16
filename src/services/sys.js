import api from '@/api'

export default {

	getNavList: () => {
		return api.get('after/menu/getAllRoleMenu',{})
	},

	getMusicList: () => {
		return api.get('after/sys/music/data',{})
	},

	uploadTextImg: ({ url = '#', formData = {}, onProgress = (event) => {}}) => {
		return api.imgPost(url, formData, onProgress)
	},
}