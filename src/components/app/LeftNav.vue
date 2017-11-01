<template>
	<div id="leftNav">
		<div id="title">
			<router-link :to="'/systemErr/404'"><h4><Icon type="ios-paper" class="menu-icon"></Icon><template v-if="!toggelfMenu">站点主页页页页</template></h4></router-link>
		</div>
		<div id="toggel" @click="toggelMenu">
			<Icon type="navicon-round" :class="{ 'rotate-90':!toggelfMenu }"></Icon>
			</Tooltip>
		</div>
		<Menu ref="leftMenu" theme="light" :active-name="activeName" :open-names="openNames" accordion v-if="navList.length > 0" :width="menuWidth">
			<template v-for="(item, index) in navList">
				<MenuItem :key="item.id" :name="item.id" v-if="item.child.length === 0">
					<router-link :to="item.url">
						<template v-if="toggelfMenu">
							<Tooltip :content="item.name" placement="right">
								<Icon :type="item.icon" class="menu-icon"></Icon>
							</Tooltip>
						</template>
						<template v-else>
							<Icon :type="item.icon" class="menu-icon"></Icon>{{ item.name }}
						</template>
					</router-link>
				</MenuItem>
				<Submenu :name="item.id" v-else>
					<template slot="title">
						<template v-if="toggelfMenu">
							<Tooltip :content="item.name" placement="right">
								<Icon :type="item.icon" class="menu-icon"></Icon>
							</Tooltip>
						</template>
						
						<template v-else>
							<Icon :type="item.icon" class="menu-icon"></Icon>{{ item.name }}
						</template>
					</template>
					<MenuItem v-for="(itemChild, indexChild) in item.child" :key="itemChild.id" :name="itemChild.id">
						<router-link :to="item.url + itemChild.url">
							<template v-if="toggelfMenu">
								<Tooltip :content="itemChild.name" placement="right">
									<Icon :type="itemChild.icon" class="menu-icon"></Icon>
								</Tooltip>
							</template>
							<template v-else>
								<Icon :type="itemChild.icon" class="menu-icon"></Icon>{{ itemChild.name }}
							</template>
						</router-link>
					</MenuItem>
				</Submenu>
			</template>
		</Menu>

		<!-- <div id="search" v-if="!toggelfMenu">
			<AutoComplete clearable :placeholder="$t('sys.search_menu')" :transfer="true" @on-search="filterMethod">
				<Option v-for="(itemChild, indexChild) in searchList" :value="itemChild.name" :key="itemChild.id">{{ itemChild.name }}</Option>
			</AutoComplete>
		</div> -->
	</div>
</template>

<script>
	import local from '@/local/index'
	import { mapGetters, mapActions } from 'vuex'
	export default {
		data(){
			return {
				searchList: [],	// 搜索菜单
				toggelfMenu: false,
				menuWidth: '180px',
				activeName: '',
				openNames: [],
			}
		},

		methods: {
			...mapActions({
				setNavList: 'setNavList',
			}),

			// 搜索过滤条件
			// filterMethod: function(value) {
			// 	if (this.utils.isEmpty(value)) {
			// 		this.searchList = []
			// 		// 关闭菜单
			// 		return
			// 	}

			// 	let searchArr = new Array()
			// 	this.openNames = new Array()
			// 	this.navList.forEach((item) => {
			// 		if (item.child.length !== 0) {
			// 			item.child.forEach((itemChild) => {
			// 				if (itemChild.name.indexOf(value) !== -1) {
			// 					searchArr.push(itemChild)
			// 					this.openNames.push(item.id)
			// 				}
			// 			})
			// 		}
			// 	})
			// 	this.searchList = searchArr
			// 	this.$nextTick(() => {
			// 		// 关闭菜单
			// 		this.$refs.leftMenu.updateOpened()
			// 	})
			// },

			// 菜单响应
			toggelMenu: function () {
				this.toggelfMenu = ! this.toggelfMenu
				if (this.toggelfMenu) {
					this.menuWidth = '90px'
				} else {
					this.menuWidth = '180px'
				}
				this.$emit('menuToggel', this.toggelfMenu)
				local.saveToLocalStorage('toggelfMenu',this.toggelfMenu)
			},

			// 刷新后默认选中的保留
			openMenu: function () {
				let paths = this.$route.path.split('/')
				this.navList.forEach((item) => {
					let index = this.utils.itemInArray('/' + paths[2], item.child, 'url')
					if (item.url === '/' + paths[1] && index) {
						this.openNames.push(item.id)
						this.activeName = item.child[index].id
					}
				})

				if (this.openNames && this.openNames.length > 0) {
					this.$nextTick(() => {
						this.$refs.leftMenu.updateOpened()
					})
				}
			}
		},

		computed: mapGetters({
			navList: 'getNavList',
		}),

		// 挂载前
		beforeMount: function () {
			this.setNavList()	// 获取菜单
		},

		mounted: function() {
			this.toggelfMenu = !local.getByLocalStorage('toggelfMenu')
			this.toggelMenu()
			this.openMenu()
		},

		updated: function () {
		},

		watch: {
			'navList' (to, from) {
				let routers = new Array()
				to.forEach((item) => {
					if (!this.utils.isEmpty(item.child)) {
						item.child.forEach((childItem) => {
							routers.push({ path: item.url + childItem.url, name: childItem.id, component: (resolve) => require(['@/components/' + childItem.component], resolve), })
						})
					}
				})
				this.$router.addRoutes(routers)
			},
		}
	}
</script>

<style scoped lang="less">

	#leftNav{
		background-color: #fff;
	}

	#title {
		height: 50px;
		line-height: 50px;
		padding-top: 0;
		border-right: 1px solid #dbdbdb;
		border-bottom: 1px solid #dbdbdb;
		text-align: center;
	}

	#toggel {
		height: 25px;
		text-align: center;
		border-right: 1px solid #dbdbdb;
		border-bottom: 1px solid #dbdbdb;
		cursor: pointer;
		.ivu-icon {
			line-height: 25px;
			font-size: 18px;
		}
	}

	// #search {
	// 	height: 50px;
	// 	position: absolute;
	// 	bottom: 0px;
	// 	padding: 0px 30px;
	// }

	.menu-icon {
		margin-right: 5px;
	}
</style>