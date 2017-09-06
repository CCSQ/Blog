import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from '@/vuex/actions'
import * as getters from '@/vuex/getters'
import modules from '@/vuex/modules'

Vue.use(Vuex)

export default new Vuex.Store({
	actions,
	getters,
	modules,
	strict: true
})

