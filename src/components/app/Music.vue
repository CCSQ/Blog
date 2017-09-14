<template>
	<div id="music">
		<div id="max-card" v-if="isMax">
			<Card>
				<div @click="isMax = !isMax" slot="extra"><Icon class="menu-top" type="arrow-shrink"></Icon></div>
				
				<Progress class="music-pro" :percent="45" :hide-info="true" status="active" :stroke-width="2"></Progress>
			</Card>
		</div>

		<div id="min-card" v-else>
			<Card>
				<div @click="isMax = !isMax" slot="extra"><Icon class="menu-top" type="arrow-expand"></Icon></div>

				<div class="infor">
					<p class="title">{{audio.fileName || '无文件'}}</p>
				</div>

				<div class="menu-control">
					<Icon type="ios-arrow-back"></Icon>
					<a href="#" @click="pause"><Icon :type="audio.status === 0 ? 'stop' : audio.status === 1 ? 'pause' : pauseIco" @click="pause()"></Icon></a>
					
					<Icon type="ios-arrow-forward"></Icon>
				</div>

				<Progress class="music-pro" :percent="audio.pro" :hide-info="true" status="active" :stroke-width="1"></Progress>
			</Card>
		</div>
	</div>
</template>

<script>
	import api from '@/api'
	import audio_visualizer from '@/utils/utils'
	import { mapGetters, mapActions } from 'vuex'
	export default {
		data(){
			return {
				musicInfor: {
					img: '',
					url: '../../assets/music/demo.mp3'
				},
				pauseIco: 'pause',
				isMax: false,
				audio: new this.audio_visualizer(),

			}
		},

		methods: {
			pause: function (event) {
				if (this.audio.audioContext.state === 'running') {
					this.audio.audioContext.suspend().then(() => {
						this.pauseIco = 'play'
					})
				} else if (this.audio.audioContext.state === 'suspended') {
					this.audio.audioContext.resume().then(() => {
						this.pauseIco = 'pause'
					})
				}
			},
			getMusic: function (url) {
				api.getByXMLHttpRequest('http://localhost:8088/static/media/demo.65b341f.mp3', {
					responseType:'arraybuffer'
				}, (xhr) => {
					if (xhr != null && xhr.statusText == 'OK') {
						this.audio.setFile(xhr.response)
					}
				})
			}
		},

		computed: mapGetters({
			musicList: 'getMusicList',
		}),

		mounted: function() {
			this.audio.init()
			this.getMusic()
		},

		watch: {
			audio: function () {
				console.log(111)
				// console.log(new)
			}
		}

	}
</script>

<style scoped lang="less">
	@min-music-width-height:100px;
	@max-music-width-height:300px;

	#music {
		#min-card {
			width: @min-music-width-height;
			.ivu-card {
				width: @min-music-width-height;
				height: @min-music-width-height;
				&:hover {
					.menu-top {
						display: inline-block;
					}
				}
				.menu-top {
					cursor: pointer;
					display: none;
				}
				.music-pro {
					height: 1px;
					position: absolute;
					// cursor: pointer;
					bottom: 9px;
				}
				.infor {
					height: 60px;
					padding-top: 20px;
					text-align: center;
					overflow:hidden;
					.title{
						margin-left: 10px;
						width: 80px;
						line-height: 12px;
						font-size: 5px;

						overflow: hidden;
						white-space: nowrap;
						text-overflow: hidden;
					}
				}
				.menu-control {
					// margin-top: 40px;
					margin-left: 10px;
					.ivu-icon {
						margin-left: 11px;
						// &:hover{
						// 	font-size: 20px;
						// }
					}
				}
			}
		}

		#max-card {
			width: @max-music-width-height;
			.ivu-card {
				width: @max-music-width-height;
				height: @max-music-width-height;
				&:hover {
					.menu-top {
						display: inline-block;
					}
				}
				.menu-top {
					cursor: pointer;
					display: none;
				}
				.music-pro {
					height: 2px;
					position: absolute;
					// cursor: pointer;
					bottom: 9px;
				}
			}
		}
	}
</style>