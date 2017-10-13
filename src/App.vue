<template>
	<div id="app">
		<template v-if="!isLogin">
			<left-nav></left-nav>
			<header-nav></header-nav>
			<Card id="main-body" dis-hover>
				<router-view></router-view>
			</Card>
			<foot></foot>
			<BackTop :bottom="60"></BackTop>
		</template>
		<template v-else>
			<login></login>
		</template>
	</div>
</template>

<script>
import HeaderNav from '@/components/app/Header'
import LeftNav from '@/components/app/LeftNav'
import Foot from '@/components/app/Foot'
import Login from '@/components/app/Login'
import store from '@/vuex/store'
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'app',
	components: { HeaderNav, LeftNav, Foot, Login },
	store,
	data() {
		return {
		}
	},

	methods: {
		...mapActions({
			setScreenWidth: 'setScreenWidth',
			setIsLogin: 'setIsLogin',
		}),
	},

	computed: mapGetters({
		isXs: 'getIsXs',
		leftNavShow: 'getLeftNavShow',
		isLogin: 'getIsLogin'
	}),

	mounted: function() {
		this.setScreenWidth(document.body.clientWidth)
		window.onresize = () => {
			setTimeout(() => {
				this.setScreenWidth(document.body.clientWidth)
			}, 400)
		}

		this.setIsLogin()
	}
}
</script>

<style>
	#app {
		height: 100%;
	}

	#leftNav {
		float: left;
		position: fixed;
		z-index: 100;
		height: 100%;
	}

	#main-body {
		position: absolute;
		top: 50px;
		left: 180px;
		right: 0px;
		min-height: 90%;
		background: #eee;
		padding: 10px 10px;
		padding-right: 0;
		margin-bottom: 4%;
	}

	#foot {
		position: fixed;
		right: 0px;
		bottom: 0px;
		left: 181px;
		height: 5%;
	}
</style>
