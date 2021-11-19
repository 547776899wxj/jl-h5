export default class Http{
	constructor(options) {
		//跨域使用api 配置manifest proxy
		// let ip = '/api/';
		let ip = 'http://192.168.100.111:8019/';
		// let ip = 'http://192.168.0.159:8019/';
		// 参数
		this.options = options;
		// 请求参数
		this.params = {}
		// 请求方法
		this.options.method = this.options.method || 'GET'
		if(this.options.method == 'POST'){
			this.options.header = {
				'content-type': 'application/x-www-form-urlencoded',
			}
		}
		// 请求地址
		let url = this.options.url.toLocaleString(this.options.url)
		//  非完整地址则使用设置好的ip地址
		if(url.indexOf('http://') !== 1 && this.options.url.indexOf('https://') !== 1){
			this.options.url = ip + this.options.url;
		}
		//过滤
		let field =['url','data','header','method','dataType','responseType','sslVerify'];
		for(let i = 0; i < field.length; i++){
			if(this.options[field[i]]){
				this.params[field[i]] = this.options[field[i]]
			}
		}
	}
	// 运行
	run(){
		console.log('run');
		// 发新请求
		let runFn = this.send
		// 根据传参决定是否返回 Promise对象
		if(this.options.success || this.options.fail){
			return runFn(this.options.success,this.options.fail)
		}else{
			// 返回Promise对象
			return new Promise(runFn)
		}
	}
	// 发送请求
	send = (resolve, reject) => {
		return uni.request(this.params).then(res =>{
			let [err,data] = res;
			if(err){
				console.error(this.options);
				// 请求失败1 无返回或请求超时
				// 统一异常处理
				let msg = ''
				switch(err.errMsg) {
					case 'request:fail request connect error': msg = '网络连接失败';break;
					case 'request:fail timeout' : msg = '网络连接超时';break;
					default: msg = '网络错误';
				}
				uni.showToast({
					icon: 'none',
					title: msg,
					duration: 3000
				})
				reject && reject(err)
				return 
			}
			if(data.statusCode != 200) {
				uni.showToast({
					icon: 'none',
					title: '接口错误',
					duration: 3000
				})
				reject && reject(err);
				return 
			}
			if(data.data.status == -1){
				uni.showModal({
					content: '授权到期，请联系管理员',
					showCancel: false,
				});
				return;
			}
			// 回调函数
			let callBack = resolve;
			callBack && callBack(data.data)
		})
		
	}
}