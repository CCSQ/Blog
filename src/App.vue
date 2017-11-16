<template>
	<div id="app">
		<template v-if="isLogin">
			<left-nav v-on:menuToggel="toggelMenu"></left-nav>
			<header-nav></header-nav>

			<Card id="main-body" :class="toggelMenuFlag ? 'left-90-px': 'left-180-px'" dis-hover>
				<div id="breadcrumb">
					<Breadcrumb>
						<BreadcrumbItem v-for="(item, index) in urlPaths" :key="index">
							{{ $t('router.' + item) }}
						</BreadcrumbItem>
					</Breadcrumb>
				</div>
				<Card :bordered="false" dis-hover>
					<!-- <transition :name="transitionName"> -->
					<transition name="fold">
						<router-view></router-view>
					</transition>
				</Card>
			</Card>
			<foot :class="toggelMenuFlag ? 'left-90-px': 'left-180-px'"></foot>
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
import Vue from 'vue'


export default {
	name: 'app',
	components: { HeaderNav, LeftNav, Foot, Login },
	store,
	data() {
		return {
			toggelMenuFlag: false,
			urlPaths: [],
		}
	},

	methods: {
		...mapActions({
			setScreenWidth: 'setScreenWidth',
			setIsLogin: 'setIsLogin',
		}),

		toggelMenu: function (value) {
			this.toggelMenuFlag = value
		},
	},

	computed: mapGetters({
		isXs: 'getIsXs',
		leftNavShow: 'getLeftNavShow',
		isLogin: 'getIsLogin'
	}),

	// 挂载前
	beforeMount: function () {
		// 挂载到全局window对象上
		window.$Message = this.$Message
		window.$Loading = this.$Loading
		
	},

	// 挂载后
	mounted: function() {
		this.setScreenWidth(document.body.clientWidth)
		window.onresize = () => {
			setTimeout(() => {
				this.setScreenWidth(document.body.clientWidth)
			}, 400)
		}

		this.setIsLogin()
		if (!this.utils.isEmpty(this.$route.path.substring(1))) {
			this.urlPaths = this.$route.path.substring(1).split('/')
		}
	},

	watch: {
		'$route' (to, from) {
			// 切割地址，用于面包屑导航
			if (!this.utils.isEmpty(to.path.substring(1))) {
				this.urlPaths = to.path.substring(1).split('/')
			}

			// 切换路由效果
			// const toDepth = to.path.split('/').length
			// const fromDepth = from.path.split('/').length
			// this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
		}
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
		z-index: 1;
		height: 100%;
	}

	#breadcrumb {
		padding: 10px 0px;
	}

	#main-body {
		position: absolute;
		top: 50px;
		right: 0px;
		min-height: 85%;
		background: #f5f7f9;
		padding: 10px 15px;
		padding-bottom: 0;
		margin-bottom: 5%;
		border: 0;
	}

	#foot {
		float: left;
		position: fixed;
		right: 0px;
		bottom: 0px;
		height: 5%;
	}

	.left-90-px {
		left: 90px;
	}
	.left-180-px {
		left: 180px;
	}

	.fold-enter-active {
		animation-name: fold-in;
		animation-duration: .5s;
	}
	.fold-leave-active {
		animation-name: fold-out;
		animation-duration: .5s;
	}
	@keyframes fold-in {
		0% {
			transform: translate3d(0, 100%, 0);
		}
		50% {
			transform: translate3d(0, 50%, 0);
		}
		100% {
			transform: translate3d(0, 0, 0);
		}
	}
	@keyframes fold-out {
		0% {
			transform: translate3d(0, 0, 0);
		}
		50% {
			transform: translate3d(0, 50%, 0);
		}
		100% {
			transform: translate3d(0, 100%, 0);
		}
	}
</style>
