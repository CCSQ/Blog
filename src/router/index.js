import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
// import systemErr from '@/components/sys/systemErr'
// 懒加载
const systemErr = () => import('@/components/sys/systemErr')

Vue.use(Router)
Vue.use(iView)

var router = new Router({
	routes: [
		// 公共路由, 其余通过服务端加载
		{ path: '/systemErr/:type', name: 'systemErr', component: systemErr },
	]
})

router.beforeEach((to, from, next) => {
	iView.LoadingBar.start()
	next()
})

router.afterEach(route => {
	iView.LoadingBar.finish()
})

export default router
