import api from '@/api'

export default {

	getNavList(){
		return api.get('public/getNavList',{})
	},

}