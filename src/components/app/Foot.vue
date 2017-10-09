<template>
	<div id="foot">
		<music></music>
	</div>
</template>

<script>
	import Music from '@/components/app/Music'
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

		components: { Music },

	}
</script>

<style scoped>
	#foot {
		border-top: 1px solid #dbdbdb;
		background-color: #FFF;
	}
</style>