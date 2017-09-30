<template>
	<div id="header">
		<Menu mode="horizontal" theme="light" active-name="default" @on-select="selectMenu">
			<!-- <template v-if="!isXs"> -->
			<template>
				<MenuItem name="default">
					<router-link :to="'/systemErr/404'"><Icon type="ios-paper" class="menu-icon"></Icon>站点主页</router-link>
				</MenuItem>
				<MenuItem v-for="(item, index) in navList" :key="item.id" :name="index">
					<router-link :to="item.url"><Icon :type="item.icon" class="menu-icon"></Icon>{{ item.name }}</router-link>
				</MenuItem>
			</template>

			<!-- 小屏操作 -->
			<!-- <template v-if="isXs">
				<MenuItem name="openMenu"><Icon type="close-round" id="closeButton" :class="{ active: menuShow, close: !menuShow }"></Icon></MenuItem>
			</template> -->
		</Menu>

		<!-- 小屏处理 -->
		<!-- <transition name="slide-fade" v-if="isXs">
			<Menu class="xs-menu" v-show="menuShow" theme="dark" width="100%">
				<MenuGroup title="内容管理">
					<Submenu name="1">
						<template slot="title">
							<Icon type="ios-paper"></Icon>
							内容管理
						</template>
						<MenuItem name="1-1">文章管理</MenuItem>
						<MenuItem name="1-2">评论管理</MenuItem>
						<MenuItem name="1-3">举报管理</MenuItem>
					</Submenu>
				</MenuGroup>
			</Menu>
		</transition> -->
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	export default {
		data(){
			return {
				// menuShow : false,
			}
		},

		methods: {
			...mapActions({
				setNavList: 'setNavList',
				setChildNavList: 'setChildNavList',
			}),

			selectMenu: function (index) {
				if (index === 'openMenu') {
					this.menuShow = !this.menuShow
					return
				}
				this.setChildNavList(index)
			},

		},

		computed: mapGetters({
			navList: 'getNavList',
			isXs: 'getIsXs',
		}),

		mounted: function() {
			if (this.navList.length == 0) this.setNavList()
		}
	}
</script>

<style scoped lang="less">

	.menu-icon {
		margin-right: 10px;
	}
	// .xs-menu {
	// 	float: left;
	// 	z-index: 100;
	// }

	// /*过渡动效*/
	// .slide-fade-enter-active {
	// 	transition: all .3s ease;
	// }
	// .slide-fade-leave-active {
	// 	transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	// }
	// .slide-fade-enter, .slide-fade-leave-to {
	// 	transform: translateY(-10px);
	// 	opacity: 0;
	// }

	// #closeButton {
	// 	font-size: 20px;
	// 	transform: rotate(45deg);
	// }

	// .active {
	// 	animation: rotate(45deg) 0.5s;
	// 	/*-webkit-animation: deg45Rotate 0.5s;*/
	// }

	// .close {
	// 	/*animation-direction:reverse;
	// 	animation: deg45Rotate 0.5s;*/
	// }

	// @keyframes deg45Rotate
	// {
	// 	from {transform: rotate(45deg);}
	// 	to {transform: rotate(90deg);}
	// }

	// @-webkit-keyframes deg45Rotate /* Safari 与 Chrome */
	// {
	// 	from {transform: rotate(45deg);}
	// 	to {transform: rotate(90deg);}
	// }
</style>