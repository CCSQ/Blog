<template>
	<div id="foot">
		<div id="block" class="ivu-menu-light" v-if="!isXs"></div>
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
			isXs: 'getIsXs',
		}),

	}
</script>

<style scoped>
	#block {
		width: 180px;
		height: 100%;
	}
</style>