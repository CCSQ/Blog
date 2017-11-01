<template>
	<div id="text-edit">
		<quill-editor
			ref="textEditor"
			:options="initConfig(config)"
			:class="{'half-div': config.preview ==='right'}"
			v-model="content"
		>
			<div id="toolbar" slot="toolbar">
				<template v-for="(item, index) in toolbar">
					<span class="ql-formats" v-for='(childItem, childIndex) in item'>
						<button type="button" :class="'ql-' + childItem" v-if="utils.isString(childItem)"></button>
						<template v-else-if="utils.isObject(childItem)">
							<!-- 上传图片事件 -->
							<Upload id="imgUpload"
								v-if="Object.keys(childItem)[0] === 'image'"
								:before-upload="handleBeforUpload"
								:action="childItem[Object.keys(childItem)[0]]"
								accept="image/*"
								:data-url="childItem[Object.keys(childItem)[0]]"
								:show-upload-list="false"
								>
								<Button>
									<svg viewBox="0 0 18 18">
										<rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
										<circle class="ql-fill" cx="6" cy="7" r="1"></circle>
										<polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
									</svg>
								</Button>
							</Upload>

							<!-- 上传视频事件 -->
							<Upload id="videoUpload"
								v-else-if="Object.keys(childItem)[0] === 'video'"
								accept="video/*"
								:action="childItem[Object.keys(childItem)[0]]"
								:show-upload-list="false"
								:before-upload="handleVideoBeforUpload"
								:on-progress="handleVideoOnProgress"
								:on-success="handleVideoOnSuccess"
								:on-error="handleVideoOnError"
								>
								<Button>
									<svg viewbox="0 0 18 18">
										<rect class="ql-stroke" height="12" width="12" x="3" y="3"/>
										<rect class="ql-fill" height="12" width="1" x="5" y="3"/>
										<rect class="ql-fill" height="12" width="1" x="12" y="3"/>
										<rect class="ql-fill" height="2" width="8" x="5" y="8"/>
										<rect class="ql-fill" height="1" width="3" x="3" y="5"/>
										<rect class="ql-fill" height="1" width="3" x="3" y="7"/>
										<rect class="ql-fill" height="1" width="3" x="3" y="10"/>
										<rect class="ql-fill" height="1" width="3" x="3" y="12"/>
										<rect class="ql-fill" height="1" width="3" x="12" y="5"/>
										<rect class="ql-fill" height="1" width="3" x="12" y="7"/>
										<rect class="ql-fill" height="1" width="3" x="12" y="10"/>
										<rect class="ql-fill" height="1" width="3" x="12" y="12"/>
									</svg>
								</Button>
							</Upload>

							<button type="button" :class="'ql-' + Object.keys(childItem)[0]" :value="childItem[Object.keys(childItem)[0]]" v-else-if="utils.isString(childItem[Object.keys(childItem)[0]])"></button>
							<select :class="'ql-' + Object.keys(childItem)[0]" v-else-if="utils.isArray(childItem[Object.keys(childItem)[0]])">
								<option :value="optionItem" v-for="(optionItem, optionIndex) in childItem[Object.keys(childItem)[0]]"></option>
							</select>
						</template>
					</span>
				</template>
			</div>
		</quill-editor>

		<div v-if="config.preview && !utils.isEmpty(content)" :class="['html', 'ql-editor', {'half-div': config.preview ==='right'}]" v-html="content" v-hljs></div>

		<!-- 图片编辑模态框 -->
		<Modal v-model="imageModal" width="1000" :mask-closable="false" :loading="true" @on-ok="uploadImg" class-name="vertical-center-modal">
			<div class="editImg">
				<img ref="originalImg" src="" alt="">
			</div>

			<div class="previewImg">
				<div id="preview" @click="previewImg"></div>
			</div>

			<div class="imgEditTools" inline>
				<Row>
					<Col span="4">
						<Form :label-width="40">
							<FormItem :label="$t('sys.width')">
								<Input v-model="imgInfor.imgWidth"><span slot="append">px</span></Input>
							</FormItem>
						</Form>
					</Col>
				</Row>
			</div>
		</Modal>

		<!-- 图片预览框 -->
		<Modal v-model="previewImgModal" width="1000" class-name="vertical-center-modal vertical-foot-hidden preImgModa">
			<center>
				<img ref="previewImgModal" src="" alt="">
			</center>
		</Modal>

		<!-- 视频编辑模态框 -->
		<Modal v-model="videoModal" width="1000" :mask-closable="false" @on-ok="insertVideo" class-name="vertical-center-modal">
			<div class="previewVideo">
				<video ref="previewVideo" src="" controls="controls" :width="videoInfor.videoWidth"></video>
				<i-circle :percent="videoInfor.uploadPercent" :stroke-color="videoInfor.uploadCircleColor" :size="20">
					<Icon v-if="videoInfor.uploadSuccess && videoInfor.uploadPercent == 100" type="ios-checkmark-empty" size="10" style="color:#5cb85c"></Icon>
					<Icon v-if="!videoInfor.uploadSuccess" type="ios-close-empty" size="10" style="color:#ff5500"></Icon>
				</i-circle>
			</div>
			<div>
			</div>

			<div class="videoEditTools" inline>
				<Row>
					<Col span="4">
						<Form :label-width="40">
							<FormItem :label="$t('sys.width')">
								<Input v-model="videoInfor.videoWidth"><span slot="append">px</span></Input>
							</FormItem>
						</Form>
					</Col>
				</Row>
			</div>
		</Modal>

	</div>
</template>

<script>
	import 'cropperjs/dist/cropper.css'
	import Cropper from 'cropperjs'
	import sysServer from '@/services/sys'

	export default {
		props: {
			config: {
				type: Object,
				required: false
			},

			toolbar: {
				type: Array,
				required: false
			},

			value: {	// v-model 实际绑定为 value
				type: String,
				required: true
			},
		},
		data(){
			return {
				file: null,
				imgEdit: null,
				imageModal: false,
				previewImgModal: false,
				textEditor: null,
				imgInfor: {
					imgWidth: 200,
				},
				videoModal: false,
				videoInfor: {
					videoWidth: 800,
					uploadPercent: 0,
					uploadCircleColor: '#2db7f5',
					uploadSuccess: true,
					uploadUrl: ''
				}
			}
		},

		methods: {
			initConfig: function (config) {
				this.config.modules.toolbar = '#toolbar'
				return config
			},

			handleBeforUpload: function (file) {
				this.file = file

				// 初始化图片信息
				this.imgInfor = {
					imgWidth: 200,
				},

				// let img = this.$refs.originalImg
				// img.src = this.utils.object2Url(this.file)

				this.imgEdit.replace(this.utils.object2Url(this.file))

				this.imageModal = true
				return false
			},

			uploadImg: function () {
				let dataUrl = this.imgEdit.getCroppedCanvas().toDataURL()
				let blob = this.utils.dataURL2Blob(dataUrl)
				// 上传文件
				let formDataImg = new FormData()
				formDataImg.append('multipart', blob)
				// TODO Token信息

				var url = document.getElementById("imgUpload").getAttribute('data-url')
				sysServer.uploadTextImg({
					url: url,
					formData: formDataImg,
					onProgress: (event) => {	// 进度 TODO
						// console.log(event.loaded,event.total * 100)
					}
				}).then((res) => {
					let resBody = res.body
					if (resBody.success) {
						this.textEditor.quill.insertEmbed(this.value.length, 'image', resBody.data.filePath)
						let insertImgNode = document.querySelector('img[src="' + resBody.data.filePath + '"]')
						// 设置宽度
						if (this.imgInfor.imgWidth) {
							insertImgNode.width = this.imgInfor.imgWidth
						}
						
						this.imageModal = false
					} else {

					}
					
				})
			},

			previewImg: function () {
				this.previewImgModal = true
				this.$refs.previewImgModal.src = this.imgEdit.getCroppedCanvas().toDataURL()
				// 设置宽度
				if (this.imgInfor.imgWidth) {
					this.$refs.previewImgModal.width = this.imgInfor.imgWidth
				}
			},

			handleVideoBeforUpload: function (file) {
				this.videoModal = true
				this.videoInfor = {
					videoWidth: 800,
					uploadPercent: 0,
					uploadCircleColor: '#2db7f5',
					uploadSuccess: true,
					uploadUrl: '',
				}

				this.$refs.previewVideo.src = this.utils.object2Url(file)
			},

			handleVideoOnProgress: function (event, file, fileList) {
				this.videoInfor.uploadPercent = parseInt(event.percent)
			},

			handleVideoOnSuccess: function (response, file, fileList) {
				this.videoInfor.uploadSuccess = response.success
				if (response.success) {
					this.videoInfor.uploadCircleColor = '#00d1b2'
					this.videoInfor.uploadUrl = response.data.filePath
					this.$Message.success(response.msg)
				} else {
					this.$Message.error(response.msg)
				}
			},

			handleVideoOnError: function (response, file, fileList) {
				this.videoInfor.uploadSuccess = false
			},

			insertVideo: function () {
				if (!this.utils.isEmpty(this.videoInfor.uploadUrl)) {
					this.textEditor.quill.insertEmbed(this.value.length, 'video', this.videoInfor.uploadUrl)
					let insertVideoNode = document.querySelector('[src="' + this.videoInfor.uploadUrl + '"]')

					// 设置宽度
					if (this.videoInfor.videoWidth) {
						insertVideoNode.width = this.videoInfor.videoWidth
					}
				}


			}
		},

		computed:{
			content: {
				get: function () {
					return this.value
				},

				// vue model 实际上是监听input事件
				set: function (val) {
					this.$emit('input', val)
				}
			}
		},

		mounted: function() {
			this.textEditor = this.$refs.textEditor
			// TODO 优化，判断是否需要加载图片模块
			let img = this.$refs.originalImg
			this.imgEdit = new Cropper(img, {
				dragMode: 'move',
				preview: '#preview',
				restore: false,
				center: false,
				highlight: false,
				cropBoxMovable: false,
				toggleDragModeOnDblclick: false
			})
		},

		watch: {
			
		}
	}
</script>

<style scoped lang="less">

	.half-div {
		margin-left: 10px;
		width: 48%;
		display: inline-block;
		&[class~='html']{
			border: 1px solid #ccc;
		}
	}

	#imgUpload, #videoUpload {
		height: 24px;
	}

	.editImg {
		width: 480px;
		height: 200px;
		border: 1px solid #c3c3c3;
		display: inline-block;
		box-sizing: border-box;
		img {
			min-height: 100%;

		}
	}

	.previewImg {
		display: inline-block;
		float: right;
		width: 480px;
		height: 200px;
		border: 1px solid #c3c3c3;
		#preview {
			width: 100%;
			height: 100%;
			margin:0 auto;
			overflow: hidden;
			cursor: pointer;
		}
	}

	.preImgModa {
		text-align: center;
		img {
			max-width: 960px;
			max-height: 500px;
			border: 1px solid #c3c3c3;
		}
	}

	.previewVideo {
		text-align: center;
	}


</style>