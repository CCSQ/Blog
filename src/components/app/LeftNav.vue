<template>
	<div id="leftNav">
		<Menu theme="light" active-name="1" accordion v-if="navList.length > 0" width="180px">
			<MenuItem name="default" id="title">
				<router-link :to="'/systemErr/404'"><h4><Icon type="ios-paper" class="menu-icon"></Icon>站点主页页页页页页</h4></router-link>
			</MenuItem>
			<template v-for="(item, index) in navList">
				<MenuItem :key="item.id" :name="index" v-if="item.child.length === 0">
					<router-link :to="item.url"><Icon :type="item.icon" class="menu-icon"></Icon>{{ item.name }}</router-link>
				</MenuItem>
				<Submenu :name="index" v-else>
					<template slot="title">
						<Icon :type="item.icon" class="menu-icon"></Icon>{{ item.name }}
					</template>
					<MenuItem v-for="(itemChild, indexChild) in item.child" :key="itemChild.id" :name="'s-' + indexChild">
						<router-link :to="itemChild.url"><Icon :type="itemChild.icon" class="menu-icon"></Icon>{{ itemChild.name }}</router-link>
					</MenuItem>
				</Submenu>
			</template>
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

		},

		computed: mapGetters({
			navList: 'getNavList',
		}),

	}
</script>

<style scoped lang="less">

	#title {
		height: 50px;
		width: 180px;
		line-height: 50px;
		padding-top: 0;
		border-right: 1px solid #dbdbdb;
		border-bottom: 1px solid #dbdbdb;
		&:hover {
			background-color: #FFF;
		}
	}
	.ivu-menu-item-active#title{
		background: #fff;
	}
	.menu-icon {
		margin-right: 5px;
	}

</style>