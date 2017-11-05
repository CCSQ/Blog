<template>
	<div id="demo">
		<text-edit :config="editorOption" :toolbar="toolbar" v-model="content"></text-edit>
	</div>
</template>

<script>
	import TextEdit from '@/components/app/TextEdit'

	export default {
		data(){
			return {
				editorOption: {
					placeholder: "输入任何内容，支持html",
					theme: 'snow',

					// 自定义
					preview: 'bottom',	// 预览，right、bottom

					// 模块加载
					modules: {
						// 自定义模块
						imageImport: true,
						imageResize: {
							displaySize: true
						},
						codeSelector: true
					},
				},

				toolbar: [
					// ['bold', 'italic', 'underline', 'strike'],
					['blockquote', 'code-block'],
					// [{ 'header': 1 }, { 'header': 2 }, ],
					// [{ 'list': 'ordered'}, { 'list': 'bullet' }],
					// [{ 'script': 'sub'}, { 'script': 'super' }],
					// [{ 'indent': '-1'}, { 'indent': '+1' }],
					// [{ 'direction': 'rtl' }],
					// [{ 'size': ['small', false, 'large', 'huge'] }],
					// [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
					// [
					// 	{ 'color': ['selected','#e60000','#ff9900','#ffff00','#008a00','#0066cc','#9933ff','#ffffff','#facccc','#ffebcc','#ffffcc','#cce8cc','#cce0f5','#ebd6ff','#bbbbbb','#f06666','#ffc266','#ffff66','#66b966','#66a3e0','#c285ff','#888888','#a10000','#b26b00','#b2b200','#006100','#0047b2','#6b24b2','#444444','#5c0000','#663d00','#666600','#003700','#002966','#3d1466',] },
					// 	{ 'background': ['selected','#e60000','#ff9900','#ffff00','#008a00','#0066cc','#9933ff','#ffffff','#facccc','#ffebcc','#ffffcc','#cce8cc','#cce0f5','#ebd6ff','#bbbbbb','#f06666','#ffc266','#ffff66','#66b966','#66a3e0','#c285ff','#888888','#a10000','#b26b00','#b2b200','#006100','#0047b2','#6b24b2','#444444','#5c0000','#663d00','#666600','#003700','#002966','#3d1466',] },
					// ],
					// [{ 'font': ['selected','serif','monospace',] }],
					// [{ 'align': ['center','right','justify',] }],
					// ['clean','link'],
					// [{'image': 'upload'}],
					// [{'video': 'http://localhost:3000/uploadVideo'}],
				],

				content: '<pre class="ql-syntax" spellcheck="false">1\n1\n1\n1\n1\n1\n11\n</pre>',







				
				imageModal: false,
				file: null,
			}
		},

		methods: {
			onEditorBlur(editor) {
				// console.log('editor blur!', editor)
			},
			onEditorFocus(editor) {
				// console.log('editor focus!', editor)
			},
			onEditorReady(editor) {
				// console.log('editor ready!', editor)
			},
			onEditorChange({
				editor,
				html,
				text
			}) {
				// console.log('editor change!', editor, html, text)
				// editor.register('modules/CodeSelector', CodeSelector)
				// editor.options.modules.CodeSelector = true
				// this.content = html
				// console.log(html)
				// console.log(text)
				// hljs.initHighlightingOnLoad()
			},

			handleUpload: function (file) {
				this.file = file
				this.imageModal = true

				let image = new Image()
				image.src = URL.createObjectURL(file)
				image.style.maxHeight = '200px'
				this.$refs.image.appendChild(image)

				// let canvas = this.$refs.imageCanvas

				// image.onload = () => {
				// 	canvas.getContext('2d').drawImage(image,0,0,400,200)
				// }

				// smartcrop.crop(canvas, {width: 200, height: 100}).then(function(result){
				// 	canvas.getContext('2d').clearRect(0,0,400,200)
				// 	canvas.getContext('2d').drawImage(image,result.x,result.y,result.height,result.width)
				// 	console.log(result);
				// });

				return false
			},

			uploadImg: function () {
				console.log(123)
				this.imageModal = false
			}
		},

		mounted: function() {
		},

		components: { TextEdit },

		watch: {
			
		}
	}
</script>

<style scoped lang="less">

	.upload-height {
		height: 24px;
	}

	.image-edit {
		text-align: center;
	}

</style>

