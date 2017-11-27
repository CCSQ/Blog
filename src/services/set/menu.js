
import api from '@/api'

export default {
	list: (param = {}, pd) => {
		if (pd) {
			param.pageIndex = pd.pageIndex
			param.pageSize = pd.pageSize
		}
		return api.get('after/sys/menu/list', param)
	},

	deletes: (ids) => {
		return api.delete('after/sys/menu/deletes', { ids: ids })
	},

	save: (object) => {
		return api.put('after/sys/menu/save', object)
	},

}