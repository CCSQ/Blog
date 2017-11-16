<template>
	<div id="login">
		<div id="particles"></div>
		<Card :bordered="false" id="login-card">
			<Form ref="formData" :model="formData" :rules="formDataRule">
				<FormItem prop="name">
					<Input type="text" v-model="formData.name" :placeholder="$t('form.account')"></Input>
				</FormItem>
				<FormItem prop="password">
					<Input type="password" v-model="formData.password" :placeholder="$t('form.password')"></Input>
				</FormItem>
				<FormItem>
					<span class="float-left help-font">{{$t('form.remember_me')}}</span><i-switch size="small" v-model="isRemember"></i-switch>
					<Button class="float-right" type="primary" @click="login('formData')">{{$t('form.login')}}</Button>
				</FormItem>
			</Form>
		</Card>
	</div>
</template>

<script>

	import { mapGetters, mapActions } from 'vuex'
	import particles from 'particles.js'
	import publicServices from '@/services/public'
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
						{ type: "string", required: true, max: 20, message: this.utils.replaceString(this.$t('help.user_name'), 20), },
					],
					password: [
						{ type: "string", required: true, max: 20, message: this.utils.replaceString(this.$t('help.user_password'), 20), },
					],
				},
			}
		},

		methods: {
			...mapActions({
				setTestIsLogin: 'setTestIsLogin',
				setIsLogin: 'setIsLogin',
			}),

			login: function (name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						if (this.isRemember) {
							local.saveToLocalStorage('user', { name: this.formData.name })
						} else {
							local.deleteByLocalStorage('user')
						}
						publicServices.login(this.formData).then((res) => {
							if (res.body.code === 1002) {
								local.saveToLocalStorage('token', res.body.data.token)	// 登陆成功，保存token
								this.setIsLogin(true)	// 设置登陆
							}
						})
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

			publicServices.getParticlesSet().then((res) => {
				particlesJS('particles', res.body)
			})
		},

		watch: {
			'isRemember' (to, from) {
				// 取消记住我，去除localStorage的记录
				if (!to) {
					local.deleteByLocalStorage('user')
				}
			}
		}
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

	#particles {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.menu {
		float: right;
		margin-right: 40px;
	}
</style>