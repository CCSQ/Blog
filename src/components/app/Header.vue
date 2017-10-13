<template>
	<div id="header">
		<Menu id="topMenu" mode="horizontal" theme="light" active-name="default" @on-select="selectMenu">
			<Submenu name="user-name">
				<template slot="title">
					{{user.name}}
					<Badge dot :count="user.message.toString()">
						<Avatar :src="user.avatarUrl">{{user.name[0]}}</Avatar>
					</Badge>
				</template>
				<MenuItem name="message">{{$t('sys.message')}}<Badge class="float-right" :count="user.message.toString()"></Badge></MenuItem>
				<router-link to="/to"><MenuItem name="set">{{$t('sys.sets')}}<Icon class="float-right" type="android-options"></Icon></MenuItem></router-link>
				<MenuItem name="exit">{{$t('sys.exit')}}</MenuItem>
			</Submenu>
		</Menu>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	export default {
		data(){
			return {
				user: {
					name: 'all index',
					avatarUrl: '',
					message: 10,
				}
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
</style>