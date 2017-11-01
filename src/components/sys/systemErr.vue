<template>
	<div id="pageNotFind">
		<!-- <center> -->
			<canvas id="canvas" width="600px" height="200px"></canvas>
		<!-- </center> -->
		<!-- <div id="game"></div> -->
	</div>
</template>

<script>
	import canvas_particle from '@/utils/utils'
	import staticResource from '@/utils/staticResource'
	
	import { mapGetters, mapActions } from 'vuex'
	// import { Engine, Render, World, Bodies, MouseConstraint, Composites, Common } from 'matter-js'

	export default {
		data(){
			return {
				canvas: null,
			}
		},

		methods: {
			createMatterNode: function () {
				// 创建引擎
				var engine = Engine.create()

				// 创建渲染器
				var render = Render.create({
					element: document.getElementById('game'),
					engine: engine,
					options: {
						wireframes: true,	// 线框模式
					}
				})

				// 墙壁
				var offset = 5
				World.add(engine.world, [
					// Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
					Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
					// Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true }),
					// Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true })
				])

				// 鼠标约束
				var mouseConstraint = MouseConstraint.create(engine, {
					element: render.canvas
				})

				World.add(engine.world, mouseConstraint)

				// 运行引擎
				Engine.run(engine)
				Render.run(render)

				// 创建复合体
				var stack = Composites.stack(20, 20, 6, 4, 0, 0, function(x, y) {
					if (Common.random() > 0.35) {
						return Bodies.rectangle(x, y, 64, 64, {
							render: {
								stroke: "#000",
								// sprite: {
								// 	texture: "img/box.png"
								// }
							}
						});
					} else {
						return Bodies.circle(x, y, 46, {
							desity: 0.0005,
							frictionAir: 0.06,
							friction: 0.01,
							render: {
								// sprite: {
								// 	texture: "img/ball.png"
								// }
							}
						});
					}
				})

				World.add(engine.world, stack);

				// var renderOptions = render.options;

				// Engine.run(engine);
				// Render.run(render);
			},
		},

		mounted: function() {
			this.canvas = new this.canvas_particle({
				element: document.getElementById("canvas"),
				title: this.$route.params.type,
				mouseListrn: true,

				// imageUrl: staticResource.logo,
				textAlign: 'center',
				textBaseline: 'middle',
				font: '50px 微软雅黑',
				// color: '#000',
				particleSize_x: 1,
				particleSize_y: 1,
				tickTime: 10,
				v: 1500,
				mouseRadius: 50,
			})
			this.canvas.init()
		},

		watch: {
			'$route' (to, from) {
				console.log(to)
				this.canvas.setTitle(to.params.type)
			}
		}
	}
</script>

<style scoped lang="less">

	#canvas {
		display: block;
		margin: 0 auto;
	}

	#game {
		border: 1px solid;
		width: 200px;
		height: 200px;
	}

</style>