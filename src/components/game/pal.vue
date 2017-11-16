<template>
	<div id="pal" class="page-body">
		<canvas id="pal-canvas" ref="pal"></canvas>
		<!-- <img src="" ref="demo"> -->
	</div>
</template>

<script>
	import { lxy } from '@/utils/staticResource'
	export default {
		data() {
			return {
				
			}
		},

		methods: {
			
		},

		beforeMount: function () {
			
		},

		mounted: function() {
			let pal = new this.canvas_draw({
				element: this.$refs.pal
			})
			pal.init()
			pal.drawImg(lxy[0])
		},

		watch: {
			
		}
	}
</script>

<style scoped>
	#pal-canvas {
		width: 640px;
		height: 400px;
		border: 1px solid;
	}


</style>