<template>
	<div id="header">
		<Menu id="topMenu" mode="horizontal" theme="light" active-name="default" @on-select="selectMenu">
			<Submenu name="user-name">
				<template slot="title">
					name
					<Badge dot>
						<Avatar>N</Avatar>
					</Badge>
				</template>
				<MenuItem name="exit">退出</MenuItem>
			</Submenu>
		</Menu>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	export default {
		data(){
			return {
			}
		},

		methods: {
			...mapActions({
				setTestIsLoginOut: 'setTestIsLoginOut',
			}),

			selectMenu: function (index) {
				if (index === 'exit') {
					this.setTestIsLoginOut()
				}

			},

		},


		mounted: function() {

		}
	}
</script>

<style scoped lang="less">

	#header {
		background: #FFF;
		width: 100%;
		height: 50px;
		border-bottom: 1px solid #dbdbdb;
		padding: 0px 60px;
	}

	.menu-icon {
		margin-right: 10px;
	}

	#topMenu {
		float: right;
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