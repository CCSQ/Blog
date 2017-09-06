<template>
	<div id="leftNav">
		<Menu theme="dark" active-name="1" accordion v-if="childNavList.length > 0" width="180px">
			<template v-for="(item, index) in childNavList">
				<MenuItem :key="item.id" :name="index" v-if="item.child.length === 0">
					<router-link :to="item.url"><Icon :type="item.icon"></Icon>{{ item.name }}</router-link>
				</MenuItem>
				<Submenu :name="index" v-else>
					<template slot="title">
						<Icon :type="item.icon"></Icon>{{ item.name }}
					</template>
					<MenuItem v-for="(itemChild, indexChild) in item.child" :key="itemChild.id" :name="indexChild">
						<router-link :to="itemChild.url"><Icon :type="itemChild.icon"></Icon>{{ itemChild.name }}</router-link>
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
			childNavList: 'getChildNavList',
		}),

	}
</script>

<style scoped>

</style>