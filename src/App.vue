<template>
	<div id="app">
		<header-nav></header-nav>
		<left-nav v-show="!isXs"></left-nav>
		<!-- <router-view></router-view> -->
		<!-- <div style="border: 1px solid; height:100px">
			<div>nihao</div>
		</div> -->
		<foot></foot>
	</div>
</template>

<script>
import HeaderNav from '@/components/app/Header'
import LeftNav from '@/components/app/LeftNav'
import Foot from '@/components/app/Foot'
import store from '@/vuex/store'
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'app',
	components: { HeaderNav, LeftNav, Foot },
	store,

	data() {
		return {
			// screenWidth: document.body.clientWidth
		}
	},

	methods: {
		...mapActions({
			setScreenWidth: 'setScreenWidth'
		}),
	},

	computed: mapGetters({
		isXs: 'getIsXs',
	}),

	mounted: function() {
		this.setScreenWidth(document.body.clientWidth)
		var that = this
		window.onresize = () => {
			setTimeout(function () {
				that.setScreenWidth(document.body.clientWidth)
			}, 400)
		}
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
</style>
