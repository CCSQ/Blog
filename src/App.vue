<template>
	<div id="app">
		<template v-if="isLogin">
			<header-nav></header-nav>
			<left-nav v-if="leftNavShow"></left-nav>
			<router-view></router-view>
			<!-- <div style="border: 1px solid; height:100px">
				<div>nihao</div>
			</div> -->
			<foot></foot>
			<music></music>
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
import Music from '@/components/app/Music'
import Login from '@/components/app/Login'
import store from '@/vuex/store'
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'app',
	components: { HeaderNav, LeftNav, Foot, Music, Login },
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
		display: inline-block;
		height: 90%;
	}

	#foot {
		bottom: 0px;
		width: 100%;
		height: 10%;
		position: fixed;
	}

	#music {
		right: 10px;
		bottom: 10px;
		position: fixed;
	}
</style>
