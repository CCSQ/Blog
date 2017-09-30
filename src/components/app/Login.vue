<template>
	<div id="login">
		<div style="padding: 20px">
			<Card :bordered="false">
				<p slot="title">
					登陆
				</p>
				<Form ref="formData" :model="formData" :rules="ruleInline">

					<FormItem label="姓名" prop="name">
			            <Input v-model="formData.name" placeholder="请输入姓名"></Input>
			        </FormItem>

					<FormItem prop="user">
						<Input type="text" v-model="formData.user" placeholder="Username">
					</Input>
				</FormItem>
				<FormItem prop="password" label="文本" label-width="100px">
					<Input type="password" v-model="formData.password" placeholder="Password">
				</Input>
			</FormItem>
			<FormItem>
				<Button type="primary" @click="handleSubmit('formData')">登录</Button>
			</FormItem>
		</Form>
	</Card>
</div>
</div>
</template>

<script>
	export default {
		data(){
			return {
				formData: {
					user: '',
					password: '',
				}
			}
		},

		methods: {

		},


	}
</script>

<style scoped>
	#block {
		width: 180px;
		height: 100%;
	}
</style>