import Vue from 'vue'
import App from './App'
import util from './common/util'

import request from 'common/request/index.js'

Vue.config.productionTip = false

App.mpType = 'app'

// #ifdef H5
	import tui from './common/webview.js'
	Vue.prototype.$tui = tui
// #endif

Vue.prototype.$util = util
Vue.prototype.$request = request

const app = new Vue({
	...App
})
app.$mount()
