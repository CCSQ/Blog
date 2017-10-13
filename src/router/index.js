import Vue from 'vue'
import Router from 'vue-router'
import systemErr from '@/components/sys/systemErr'
import setIndex from '@/components/set/index'

Vue.use(Router)

export default new Router({
	routes: [
		{ path: '/systemErr/:type', name: 'systemErr', component: systemErr },
		{ path: '/to', name: 'setIndex', component: setIndex },
	]
})
