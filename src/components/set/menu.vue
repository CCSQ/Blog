<template>
	<div id="menu">
		<div class="page-body">
			<Table
				:columns="columns"
				:stripe="true"
				:show-header="true"
				:data="list"
				size="small"
				:loading="loading"
				@on-expand="expandCell"
			>
				<div slot="header">
					<div style="float: right; margin-right: 40px;">
						<Button type="primary" size="small" @click="addMenu()">{{ $t('sets.menu.add') }}</Button>
					</div>
				</div>
				<div slot="footer">
					<div style="float: right; margin-right: 40px;">
						<Page :total="pb.pageLimit" :current="pb.pageIndex" @on-change="changePage"></Page>
					</div>
				</div>
			</Table>
		</div>

		<!-- 增加 / 修改 -->
		<Modal
			v-model="editShow"
			:mask-closable="false"
			
			width="1000"
		>
			<p slot="header">
				<Icon type="navicon-round"></Icon>
				<span>{{editTitle}}</span>
			</p>

			<Form ref="formData" :model="formData" :label-width="80" :rules="formDataRule">
				<Row :gutter="16">
					<Col span="10">
						<FormItem :label="$t('sets.menu.ico')">
							<Select
								v-model="formData.icon"
							>
								<Option v-for="option in icoList" :value="option" :key="option">
									<Icon :type="option"></Icon> {{option}}
								</Option>
							</Select>
						</FormItem>
						<FormItem prop="name" :label="$t('sets.menu.name')">
							<Input v-model="formData.name"></Input>
						</FormItem>
						<FormItem prop="url" :label="$t('sets.menu.URL')">
							<Input v-model="formData.url"></Input>
						</FormItem>
						<FormItem prop="component" :label="$t('sets.menu.component')">
							<Input v-model="formData.component"></Input>
						</FormItem>
						<FormItem :label="$t('sets.menu.father_id')">
							<Select
								v-model="formData.fatherId"
								filterable
							>
								<Option v-for="option in list" :value="option.id" :key="option.id">
									{{option.name}}
								</Option>
							</Select>
						</FormItem>
						<FormItem prop="orderNumber" :label="$t('form.order_number')">
							<InputNumber v-model="formData.orderNumber" :max="99999"></InputNumber>
						</FormItem>
					</Col>
				</Row>
			</Form>

			<div slot="footer">
				<Button size="small" @click="editShow = false">{{ $t('sys.cancel') }}</Button>
				<Button type="primary" size="small" :loading="saveLoading" @click="save">{{ $t('sys.submit') }}</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import menuServices from '@/services/set/menu'
	export default {
		data() {
			return {
				loading: true,
				saveLoading: false,
				list: [],
				columns: [
					{ type: 'selection', width: 60, align: 'center' },
					{ type: 'expand', width: 20, render: (h, params) => {
						return h("Table", {
							props: {
								data: this.childMap[params.row.id],
								loading: !this.childMap[params.row.id],
								stripe: true,
								showHeader: false,
								size: "small",
								columns: [
									{ width: 80,},
									{ title: this.$t('sets.menu.ico'), key: 'icon', render: (h, params) => {
										return h('div', [
											h('Icon', {
												props: {
													type: params.row.icon
												}
											}),
										])
									}, },
									{ title: this.$t('sets.menu.name'), key: 'name' },
									{ title: this.$t('sets.menu.URL'), key: 'url' },
									{ title: this.$t('sets.menu.action'), key: 'action', align: 'center',render: (h, params) => {
										return h('div', [
											h('Button', {
												props: {
													type: 'primary',
													size: 'small'
												},
												style: {
													marginRight: '5px'
												},
												on: {},
											}, this.$t('sys.edit')),
											h('Button', {
												props: {
													type: 'error',
													size: 'small'
												},
												style: {},
												on: {},
											}, this.$t('sys.delete'))
										])
									} }
								],
							}
						})
					} },

					{ title: this.$t('sets.menu.ico'), key: 'icon', render: (h, params) => {
						return h('div', [
							h('Icon', {
								props: {
									type: params.row.icon
								}
							}),
						])
					}, },

					{ title: this.$t('sets.menu.name'), key: 'name' },
					{ title: this.$t('sets.menu.URL'), key: 'url' },

					{ title: this.$t('sets.menu.action'), key: 'action', align: 'center',render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'info',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.addMenu(params.row.id)
									},
								},
							}, this.$t('sets.menu.add')),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.editMenu(params.row.id, params.row.name)
									},
								},
							}, this.$t('sys.edit')),
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								style: {},
								on: {
									click: () => {
										this.deleteMenu(params.row.id, params.row.name, params.row.fatherId)
									},
								},
							}, this.$t('sys.delete')),
						])
					} },
				],
				pb: {
					pageLimit: 0,
					pageIndex: 1,
					pageSize: 10,
				},
				param: {},
				childMap: {},
				editShow: false,
				editTitle: '',
				formData: {},
				formDataRule: {
					name: [
						{ type: "string", required: true, max: 100, message: this.utils.replaceString(this.$t('sets.menu.menu_name_rule'), 100), },
					],
					url: [
						{ type: "string", required: true, max: 100, message: this.utils.replaceString(this.$t('sets.menu.menu_url_rule'), 100), },
					],
					component: [
						{ type: "string", required: false, max: 100, message: this.utils.replaceString(this.$t('sets.menu.menu_component_rule'), 100), },
					],
				},
				icoList: [
					'ios-checkmark-outline',
				]
			}
		},

		methods: {
			changePage: function (index) {
				console.log(index)
			},

			expandCell: function (row, status) {
				if (status) {
					menuServices.list({ fatherId: row.id }).then((result) => {
						this.childMap[row.id] = result.body.data
					})
				}
			},

			addMenu: function (fatherId) {
				this.editShow = true
				this.formData = {}
				console.log(this.$refs.formData)
				this.editTitle = this.$t('sys.add')
			},

			editMenu: function (id, name) {
				this.editShow = true
				this.editTitle = `${this.$t('sys.edit')}[ ${name} ]`
				console.log(id)
			},

			deleteMenu: function (id, name, fatherId) {
				this.$Modal.confirm({
					content: this.utils.replaceString(this.$t('sets.menu.delete_menu'), name) + (fatherId ? '' : this.$t('sets.menu.delete_child_menu')),
					okText: this.$t('sys.delete'),
					cancelText: this.$t('sys.cancel'),
					loading: true,
					onOk: () => {
						menuServices.deletes(id).then((result) => {
							if (result.body.success) {
								this.$Message.success(this.$t('sys.delete_success'))
								this.getData()
							} else {
								this.$Message.error(result.body.msg)
							}
							this.$Modal.remove()
						})
					},
				})
			},

			getData: function () {
				menuServices.list(this.param, this.pb).then((result) => {
					if (result.body.success) {
						this.list = result.body.data
						this.pb = result.body.pb
						this.loading = false
					}
				})
			},

			save: function () {
				this.saveLoading = true
				this.$refs.formData.validate((valid) => {
					if (!valid) {
						this.saveLoading = false
						return this.$Message.success(this.$t('sys.edit_success'))
					}
					menuServices.save(this.formData).then((result) => {
						this.editShow = false
						this.saveLoading = false

						if (result.body.success) {
							this.$Message.success(this.$t('sys.save_success'))
							this.getData()
						} else {
							this.$Message.error(result.body.msg)
						}
					})
				})
			},
		},

		mounted: function() {
			this.getData()
		},

		watch: {
			
		}
	}
</script>

<style scoped>



</style>