import Vue from 'vue'
import Router from 'vue-router'
import systemErr from '@/components/sys/systemErr'

Vue.use(Router)

export default new Router({
	routes: [
		{ path: '/systemErr/:type', name: 'systemErr', component: systemErr },
		// { path: '/', name: 'Index', component: Index },
	]
})
