<template>
	<div id="setIndex">
		<Card>
			<p slot="title">demo</p>

			<Row :gutter="40">
				<Col span="8">
					<div class="particles-control">
						<Form :model="particles" :label-width="80">

							<!-- 原子相关 -->
							<div class="form-array-item">
								<FormItem :label="$t('sets.particles.particles_number')">
									<InputNumber v-model="particles.particles.number.value" :max="50" :min="10"></InputNumber>
								</FormItem>
								<FormItem :label="$t('sets.particles.particles_size')">
									<InputNumber v-model="particles.particles.size.value"></InputNumber>
								</FormItem>
								<FormItem :label="$t('sets.particles.particles_size_random')">
									<i-switch v-model="particles.particles.size.random"></i-switch>
								</FormItem>
								<FormItem :label="$t('sets.particles.particles_size_anim')">
									<i-switch v-model="particles.particles.size.anim.enable"></i-switch>
								</FormItem>
								<template v-if="particles.particles.size.anim.enable">
									<FormItem :label="$t('sets.particles.particles_size_anim_speed')">
										<InputNumber v-model="particles.particles.size.anim.speed"></InputNumber>
									</FormItem>
								</template>
								<FormItem :label="$t('sets.particles.particles_color')">
									<ColorPicker v-model="particles.particles.color.value"/>
								</FormItem>

								<FormItem :label="$t('sets.particles.particles_opacity_random')">
									<i-switch v-model="particles.particles.opacity.random"></i-switch>
								</FormItem>
								<FormItem :label="$t('sets.particles.particles_opacity_value')">
									<Slider v-model="particles.particles.opacity.opacity_value"></Slider>
								</FormItem>

								<FormItem :label="$t('sets.particles.particles_shape_type')">
									<Select v-model="particles.particles.shape.type" multiple>
										<Option v-for="item in shapeType" :value="item.value" :key="item.value">{{ item.label }}</Option>
									</Select>
								</FormItem>
								<template v-if="utils.itemInArray('polygon', particles.particles.shape.type)">
									<FormItem :label="$t('sets.particles.particles_shape_polygon_nb_sides')">
										<InputNumber v-model="particles.particles.shape.polygon.nb_sides"></InputNumber>
									</FormItem>
								</template>
								<template v-if="utils.itemInArray('image', particles.particles.shape.type)">
									<FormItem :label="$t('sets.particles.particles_shape_image_src')" >
										<Input v-model="particles.particles.shape.image.src"></Input>
									</FormItem>
										<!-- 								particles.shape.image.width	number 
										(for aspect ratio)    图片宽度	100
										particles.shape.image.height	number 
										(for aspect ratio) 图片高度	100 -->
								</template>
							</div>

							<!-- 描边相关 -->
							<div class="form-array-item">
								<FormItem :label="$t('sets.particles.stroke')">
									<InputNumber v-model="particles.particles.shape.stroke.width" :max="50" :min="0"></InputNumber>
								</FormItem>
								<template v-if="particles.particles.shape.stroke.width !== 0">
									<FormItem :label="$t('sets.particles.stroke_color')">
										<ColorPicker v-model="particles.particles.shape.stroke.color"/>
									</FormItem>
								</template>
							</div>

							<!-- 渐变相关 -->
							<div class="form-array-item">
								<FormItem :label="$t('sets.particles.particles_opacity_anim')">
									<i-switch v-model="particles.particles.opacity.anim.enable"></i-switch>
								</FormItem>
								<template v-if="particles.particles.opacity.anim.enable">
									<FormItem :label="$t('sets.particles.particles_opacity_anim_speed')">
										<InputNumber v-model="particles.particles.opacity.anim.speed"></InputNumber>
									</FormItem>
									<FormItem :label="$t('sets.particles.particles_opacity_anim__min')">
										<Slider v-model="particles.particles.opacity.anim.anim_opacity_min"></Slider>
									</FormItem>
								</template>
							</div>

							<!-- 连接线相关 -->
							<div class="form-array-item">
								<FormItem :label="$t('sets.particles.particles_line_linked_enable')">
									<i-switch v-model="particles.particles.line_linked.enable"></i-switch>
								</FormItem>
								<template v-if="particles.particles.line_linked.enable">
									<FormItem :label="$t('sets.particles.particles_line_linked_distance')">
										<InputNumber v-model="particles.particles.line_linked.distance"></InputNumber>
									</FormItem>
									<FormItem :label="$t('sets.particles.particles_line_linked_width')">
										<InputNumber v-model="particles.particles.line_linked.width"></InputNumber>
									</FormItem>
									<FormItem :label="$t('sets.particles.line_linked_opacity')">
										<Slider v-model="particles.particles.line_linked.line_linked_opacity"></Slider>
									</FormItem>
								</template>
							</div>

							

							<!-- 移动相关 -->
							<div class="form-array-item">
								<!-- <FormItem label="移动">
									<i-switch v-model="particles.particles.move.enable"></i-switch>
								</FormItem> -->
								<template v-if="particles.particles.move.enable">
									<FormItem :label="移动方向">
										<Select v-model="particles.particles.move.direction">
											<Option v-for="item in moveDirection" :value="item.value" :key="item.value">{{ item.label }}</Option>
										</Select>
									</FormItem>
									<FormItem :label="速度">
										<InputNumber v-model="particles.particles.move.speed"></InputNumber>
									</FormItem>
									<FormItem :label="随机">
										<i-switch v-model="particles.particles.move.random"></i-switch>
									</FormItem>
									<!-- <FormItem label="直接移动">
										<i-switch v-model="particles.particles.move.straight"></i-switch>
									</FormItem> -->
									<FormItem :label="能否移出">
										<i-switch v-model="particles.particles.move.out_mode_flag"></i-switch>
									</FormItem>
									<FormItem :label="碰撞">
										<i-switch v-model="particles.particles.move.bounce"></i-switch>
									</FormItem>
								</template>
							</div>

							<FormItem label="原子间吸引">
								<i-switch v-model="particles.particles.move.attract.enable"></i-switch>
							</FormItem>
							<template v-if="particles.particles.move.attract.enable">
								<FormItem label="吸引X水平距离">
									<InputNumber v-model="particles.particles.move.attract.rotateX"></InputNumber>
								</FormItem>
								<FormItem label="吸引Y垂直距离">
									<InputNumber v-model="particles.particles.move.attract.rotateY"></InputNumber>
								</FormItem>
							</template>

							<!-- <FormItem label="鼠标互动检测类型">
								<Select v-model="particles.interactivity.detect_on">
									<Option v-for="item in detectOnType" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</FormItem> -->

							<FormItem label="悬停">
								<i-switch v-model="particles.interactivity.events.onhover.enable"></i-switch>
							</FormItem>
							<template v-if="particles.interactivity.events.onhover.enable">
								<FormItem label="悬停模式">
									<Select v-model="particles.interactivity.events.onhover.mode" multiple>
										<Option v-for="item in onhoverMode" :value="item.value" :key="item.value">{{ item.label }}</Option>
									</Select>
								</FormItem>
							</template>

							<FormItem label="点击">
								<i-switch v-model="particles.interactivity.events.onclick.enable"></i-switch>
							</FormItem>
							<template v-if="particles.interactivity.events.onclick.enable">
								<FormItem label="点击效果">
									<Select v-model="particles.interactivity.events.onclick.mode">
										<Option v-for="item in onclickMode" :value="item.value" :key="item.value">{{ item.label }}</Option>
									</Select>
								</FormItem>
								<!-- <FormItem label="回归尺寸？">
									<i-switch v-model="particles.interactivity.events.resize"></i-switch>
								</FormItem> -->
							</template>

							<!-- 互动类型设置 -->
							<template v-if="particles.interactivity.events.onhover.enable || particles.interactivity.events.onclick.enable">
								<!-- 抓取 -->
								<template v-if="(particles.interactivity.events.onhover.enable && utils.itemInArray('grab', particles.interactivity.events.onhover.mode)) || (particles.interactivity.events.onclick.enable && utils.itemInArray('grab', particles.interactivity.events.onclick.mode))">
									<FormItem label="抓取距离">
										<InputNumber v-model="particles.interactivity.modes.grab.distance"></InputNumber>
									</FormItem>
									<FormItem label="抓取距离连线不透明度">
										<Slider v-model="particles.interactivity.modes.grab.line_linked.line_linked_opacity"></Slider>
									</FormItem>
								</template>

								<!-- 泡沫效果 -->
								<template v-if="(particles.interactivity.events.onhover.enable && utils.itemInArray('bubble', particles.interactivity.events.onhover.mode)) || (particles.interactivity.events.onclick.enable && utils.itemInArray('bubble', particles.interactivity.events.onclick.mode))">
									<FormItem label="泡沫距离">
										<InputNumber v-model="particles.interactivity.modes.bubble.distance"></InputNumber>
									</FormItem>
									<FormItem label="泡沫大小">
										<InputNumber v-model="particles.interactivity.modes.bubble.size"></InputNumber>
									</FormItem>
									<FormItem label="泡沫持续时间">
										<InputNumber v-model="particles.interactivity.modes.bubble.duration"></InputNumber>
									</FormItem>
								</template>

								<!-- 击退效果 -->
								<template v-if="(particles.interactivity.events.onhover.enable && utils.itemInArray('repulse', particles.interactivity.events.onhover.mode)) || (particles.interactivity.events.onclick.enable && utils.itemInArray('repulse', particles.interactivity.events.onclick.mode))">
									<FormItem label="击退距离">
										<InputNumber v-model="particles.interactivity.modes.repulse.distance"></InputNumber>
									</FormItem>
									<FormItem label="击退持续时间">
										<InputNumber v-model="particles.interactivity.modes.repulse.duration"></InputNumber>
									</FormItem>
								</template>

								<!-- 增加效果 -->
								<template v-if="(particles.interactivity.events.onhover.enable && utils.itemInArray('push', particles.interactivity.events.onhover.mode)) || (particles.interactivity.events.onclick.enable && utils.itemInArray('push', particles.interactivity.events.onclick.mode))">
									<FormItem label="增加数量">
										<InputNumber v-model="particles.interactivity.modes.push.particles_nb"></InputNumber>
									</FormItem>
								</template>
							</template>
							<FormItem>
								<Button type="primary">提交</Button>
								<Button type="ghost" style="margin-left: 8px">取消</Button>
							</FormItem>
						</Form>
					</div>
				</Col>
				<Col span="16">
					<Affix :offset-top="50">
					<div id="particles"></div>
					</Affix>
				</Col>
			</Row>

			
			
		</Card>
	</div>
</template>

<script>
	import particles from 'particles.js'
	import staticResource from '@/utils/staticResource'
	export default {
		data(){
			return {
				particles: staticResource.particles,
				shapeType: [
					{ value: 'circle',	 label: '圆形',		 },
					{ value: 'edge',	 label: '正方形',	 },
					{ value: 'triangle', label: '三角形',	 },
					{ value: 'polygon',	 label: '多边形',	 },
					{ value: 'star',	 label: '星星',		 },
					{ value: 'image',	 label: '图片',		 },
				],
				moveDirection: [
					{ value: "none",		 label:'随机',	 },
					{ value: "top",			 label:'上',	 },
					{ value: "top-right",	 label:'右上',	 },
					{ value: "right",		 label:'右',	 },
					{ value: "bottom-right", label:'下右',	 },
					{ value: "bottom",		 label:'下',	 },
					{ value: "bottom-left",	 label:'下左',	 },
					{ value: "left",		 label:'左',	 },
					{ value: "top-left",	 label:'上左',	 },
				],
				detectOnType: [
					{ value: "canvas",		 label:'canvas', },
					{ value: "window",		 label:'window', },
				],
				onhoverMode: [
					{ value: "grab",	 label: "抓取临近的",	},
					{ value: "bubble",	 label: "泡沫球效果",	},
					{ value: "repulse",	 label: "击退效果",		},
				],
				onclickMode: [
					{ value: "push",	 label: "添加",			},
					{ value: "remove",	 label: "移除",			},
					{ value: "bubble",	 label: "泡沫球效果",	},
					{ value: "repulse",	 label: "击退效果",		},
				],
			}
		},







		methods: {
			
		},

		mounted: function() {
			particlesJS('particles', this.particles)
		},

		watch: {
			particles: {
				handler (curVal,oldVal) {
					this.particles.particles.opacity.value = this.particles.particles.opacity.opacity_value / 100
					this.particles.particles.opacity.anim.opacity_min = this.particles.particles.opacity.anim.anim_opacity_min / 100
					this.particles.particles.line_linked.color = this.particles.particles.color.value	// 连接线颜色
					this.particles.particles.line_linked.opacity = this.particles.particles.line_linked.line_linked_opacity / 100
					this.particles.interactivity.modes.grab.line_linked.opacity = this.particles.interactivity.modes.grab.line_linked.line_linked_opacity / 100
					this.particles.particles.move.out_mode = this.particles.particles.move.out_mode_flag ? 'out' : 'bounce'
					particlesJS('particles', this.particles)
				},
				deep:true,
			},
		}
	}
</script>

<style scoped lang="less">



</style>