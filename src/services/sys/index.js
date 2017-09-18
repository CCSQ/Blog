import api from '@/api'

export default {

	getNavList(){
		return api.get('after/sys/nav/data',{})
	},

}