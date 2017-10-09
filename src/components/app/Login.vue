<template>
	<div id="login">
		<div id="particles"></div>
		<Card :bordered="false" id="login-card">
			<Form ref="formData" :model="formData" :rules="formDataRule">
				<FormItem prop="name">
					<Input type="text" v-model="formData.name" placeholder="账户"></Input>
				</FormItem>
				<FormItem prop="password">
					<Input type="password" v-model="formData.password" placeholder="密码"></Input>
				</FormItem>
				<FormItem>
					<span class="float-left help-font">记住密码</span><i-switch size="small" v-model="isRemember"></i-switch>
					<Button class="float-right" type="primary" @click="login('formData')">登录</Button>
				</FormItem>
			</Form>
		</Card>
	</div>
</template>

<script>

	import { mapGetters, mapActions } from 'vuex'
	import particles from 'particles.js'
	import staticResource from '@/utils/staticResource'
	import local from '@/local/index'

	export default {
		data(){
			return {
				formData: {
					name: '',
					password: '',
				},

				isRemember: false,

				formDataRule: {
					name: [
						{ type: "string", required: true, max: 20, message: '请填写不大于20个字符的用户名', },
					],
					password: [
						{ type: "string", required: true, max: 20, message: '请填写不大于20个字符的密码', },
					],
				},
			}
		},

		methods: {
			...mapActions({
				setTestIsLogin: 'setTestIsLogin',
			}),

			login: function (name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						if (this.isRemember) {
							local.saveToLocalStorage('user',this.formData)
						} else {
							local.deleteByLocalStorage('user')
						}
						this.setTestIsLogin()
					}
				})
			}
		},

		mounted: function() {
			let localData = local.getByLocalStorage('user')
			if (localData) {
				this.formData = localData
				this.isRemember = true
			}
			particlesJS('particles', staticResource.particles)
		},


	}
</script>

<style scoped>
	#login-card {
		position: absolute;
		bottom: 40%;
		right: 20%;
		padding: 20px;
		width: 500px;
		background-color: rgba(255,255,255,0.6);
	}

	.menu {
		float: right;
		margin-right: 40px;
	}
</style>