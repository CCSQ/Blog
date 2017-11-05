<template>
	<div id="sys">
		<div class="page-body">
			<Row>
				<Col span="6">
					<Card>
						<p slot="title">{{ $t('sets.sys.personalizedSettings') }}</p>
						<Form :model="local" :label-width="40">
							<div class="padding-div">
								<FormItem :label="$t('sets.sys.lang')">
									<Select v-model="local.personalizedSettings.lang" @on-change="changLang">
										<Option v-for="item in langs" :value="item.lang" :key="item.lang">{{ item.name }}</Option>
									</Select>
								</FormItem>
							</div>
						</Form>
					</Card>
				</Col>
				<Col span="18">
					
				</Col>
			</Row>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import local from '@/local/index'
	export default {
		data() {
			return {
				local: {
					personalizedSettings: {
						lang: 'zh-CN'
					}
				},

				langs: [
					{ lang: 'zh-CN', name: '中文' },
					{ lang: 'en-US', name: 'English' },
				]
			}
		},

		methods: {
			changLang: function (value) {
				// console.log(this.$store)
				Vue.config.lang = value
				// this.$store.commit('switchLang', value)
			}
		},

		beforeMount: function () {
			if (local.isExitLocalStorage('personalizedSettings')) this.local = local.getByLocalStorage('personalizedSettings')
		},

		mounted: function() {
			
		},

		watch: {
			local: {
				handler (curVal, oldVal) {
					local.saveToLocalStorage('personalizedSettings', curVal)
				},
				deep:true,
			},
		}
	}
</script>

<style scoped>



</style>