<template>
	<view class="content" @longpress="open" @click="open">
		<image class="bg" src="../../static/bgPharmacy.png"></image>
		<view class="header">
			<image class="logo" src="../../static/logo.png" mode=""></image>
			<view class="title">{{ queueTitle }}</view>
			<view class="header-time">
				<view class="pr-15">
					<text>{{ dateText.year }}年{{ dateText.month }}月{{ dateText.date }}日</text>
				</view>
				<view>
					<text>{{ dateText.day }} {{ dateText.time }}</text>
				</view>
			</view>
		</view>
		<view class="data">
			<view class="data-title">
				<view class="title-item col-1">诊室</view>
				<view class="title-item col-1">医生</view>
				<view class="title-item col-2">正在就诊</view>
				<view class="title-item col-2">等待就诊</view>
			</view>
			<view class="data-content">
				<view class="content-item" v-for="(item, index) in data" :key="index">
					<view class="col-1">{{ item.clinicName }}</view>
					<view class="col-1">{{ item.doctorName }}</view>
					<view class="col-2 calling">
						<text>{{ item.callingNo }}</text>
						<text>{{ item.hideName }}</text>
					</view>
					<view class="col-2">
						<text>{{ item.waitingNo }}</text>
						<text>{{ item.hideWaitingName }}</text>
					</view>
				</view>
			</view>
		</view>
		<popupSet ref="popupSet" @confirm="confirm" @close="close" :dataInit="dataPopup" :showTitle="true" :showwText="true"></popupSet>
	</view>
</template>

<script>
import popupSet from '../../components/popup-set/popup-set.vue';
// #ifdef APP-PLUS
	var FvvUniTTS = uni.requireNativePlugin('Fvv-UniTTS');
// #endif
export default {
	components: { popupSet},
	data() {
		return {
			text:'',
			data:[],
			tips:'感谢您的耐心等待',
			dataPopup:{
				title:'',
				iType:'',
				screenNumber:'',
				playSound:false,
				text:'',
			},
			dateText: {
				year: '',
				month: '',
				date: '',
				day: '',
				time: ''
			},
			voiceData:[],
			testNubmer:0,
			voiceDataInit:[],
			interval:3000,
			voicePlayTiems:2,
			voicePlayNumber:0,
			waitList:[],
			callListAndWaitList:[],
			callingText:'',
			playSound: true,
			roomCode:'',
			queueTitle:'',
		}
	},
	onLoad() {
		let dataInit = uni.getStorageSync('dataInit')||{};
		this.dataPopup = dataInit;
		this.text = dataInit.title;
		this.roomCode = dataInit.text;
		this.playSound = dataInit.playSound || true;
		this.init();
	},
	methods: {
		// 打开设置
		open(){
			this.$refs.popupSet.open();
			this.popupShow = true;
		},
		// 关闭设置
		close(){
			this.popupShow = false;
			this.init();
		},
		//确定设置
		confirm(res) {
			this.popupShow = false;
			this.playSound = res.playSound;
			this.text = res.title;
			this.roomCode = res.text;
			this.init();
		},
		init(){
			if(this.popupShow){
				return false;
			}
			// let res = {"msg": "成功","reload": false,"data": [{'isReCall':'1','examNo':'1',"clinicName": "在车上在车上上","doctorName": "张三","callingNo": "A001","callingName": "张三","waitingNo": "A002","waitingName": "李四","departmentName": "CT"},
			// {"clinicName": "CT2","doctorName": "","callingNo": "A004","callingName": "赵六","waitingNo": "A005","waitingName": "傻逼","departmentName": "CT"},{"clinicName": "CT3","doctorName": "","callingNo": "","callingName": "","waitingNo": "A003","waitingName": "王五","departmentName": "CT"},{"clinicName": "CT4","doctorName": "","callingNo": "","callingName": "","waitingNo": "","waitingName": "","departmentName": "CT"},{"clinicName": "CT5","doctorName": "","callingNo": "","callingName": "","waitingNo": "","waitingName": "","departmentName": "CT"}],"serverTime": "2021-05-28 11:43:45","queueTitle": "外科大屏"}
	
			this.$request({
				url:'Queue/getBigScreenQueue',
				data:{
					queueEquipmentId: this.roomCode,
				},
				method: 'POST',
				success: res => {
					try{
						let datas = res;
						// #ifdef H5
							if(datas.reload=='true' || datas.reload==true){
								location.reload();
								return;
							}
							if(datas.isRestartAndroid=='true' || datas.isRestartAndroid==true){
								this.$tui.webView.postMessage({
									data: {
										isRestartAndroid:datas.isRestartAndroid
									}
								})
								return;
							}
						// #endif
						this.dateText = this.$util.geteDateText(res.serverTime);
						this.queueTitle = res.queueTitle;
						let voiceDataInit = [];
						res.data.forEach((item) =>{
							let name = '';
							if(item.callingName && this.playSound){
								let number = '';
								if(item.callingNo){
									number = this.$util.chineseNumeral(item.callingNo+'号');
								}
								name = this.$util.hideName(item.callingName)
								let speakText = `请,${number}${item.callingName}到,${item.clinicName}就诊`;
								voiceDataInit = voiceDataInit.concat(speakText);
							}
							item.hideName = name;
							item.hideWaitingName = item.waitingName ? this.$util.hideName(item.waitingName) : '';
						})
						this.data = res.data;
						if(voiceDataInit.length>0){
							this.voiceData = this.$util.findDifferentElements(voiceDataInit,this.voiceDataInit);
							this.voiceDataInit = voiceDataInit;
							res.data.forEach((item,index) =>{
								if(item.isReCall == '1'){
									let number = '';
									if(item.callingNo){
										number = this.$util.chineseNumeral(item.callingNo+'号');
									}
									name = this.$util.hideName(item.callingName)
									let speakText = `请,${number}${item.callingName}到,${item.clinicName}就诊`;
									this.voiceData.unshift(speakText);
									this.$request({
										url: 'Queue/reCall',
										data:{
											examNo:item.examNo,
											isReCall: '0'
										},
										success: res => {
										}
									})
								}
							})
						}
						if(this.voiceData.length>0){
							this.voiceQueue();
						}else{
							setTimeout(() => {
								this.init()
							}, this.interval);
						}
					}catch(e){
						//TODO handle the exception
						setTimeout(() => {
							this.init();
						}, this.interval);
					}
					
				},
				fail: err => {
					setTimeout(() => {
						this.init();
					}, this.interval);
				}
			})
		},
		// 语音队列
		voiceQueue(){
			let text = this.voiceData[0];
			console.log(text);
			// #ifdef H5
				this.$tui.webView.postMessage({
					data: {
						text:text
					}
				})
			// #endif
			// #ifdef APP-PLUS
				FvvUniTTS.init((callback) => {
					FvvUniTTS.speak({
						text:text
					});
				});
			// #endif
			if(this.voiceData.length>1){
				this.onDone(this.voiceData[1]);
			}else{
				this.onDone(this.voiceData[0]);
			}
		},
		// 播放完执行
		onDone(data){
			let date = 4300;
			if(data.length>12){
				date = date + ((data.length - 12)*300 )
			}
			setTimeout(() => {
				this.voicePlayNumber++;

				if(this.voicePlayNumber>=this.voicePlayTiems){
					this.voiceData.shift();
					this.voicePlayNumber = 0;
				}
				if(this.voiceData.length>0){
					this.voiceQueue()
				}else{
					setTimeout(() => {
						this.init()
					}, this.interval);
				}
			}, date);

		},
	}
}
</script>

<style lang="scss">
view {
	box-sizing: border-box;
}

.data {
	padding: 0 54px;
	.data-title {
		display: flex;
		font-size: 68px;
		color: #095dbf;
		line-height: 150px;
		text-align: center;
	}
	.col-1 {
		width: 404px;
	}
	.col-2 {
		width: 500px;
	}
	.calling {
		color: rgb(255, 249, 0);
	}
	.data-content {
		.content-item {
			display: flex;
			font-size: 55px;
			color: #ffffff;
			text-align: center;
			height: 115px;
			align-items: center;
		}
	}
}
.header {
	display: flex;
	justify-content: space-between;
	height: 140px;
	align-items: center;
	padding: 0 80px;
	position: relative;
	margin-top: 40px;
	.title {
		font-size: 77px;
		position: absolute;
		letter-spacing: 7px;
		width: 100%;
		text-align: center;
		color: #095dbf;
	}
	.logo {
		height: 110px;
		width: 594px;
	}

	.header-time view {
		font-size: 40px;
		color: #fff;
	}
}
.content {
	height: 1080px;
	width: 1920px;
	overflow: hidden;
}
.w-50 {
	width: 50%;
}
.bg {
	position: absolute;
	height: 1080px;
	width: 1920px;
	z-index: -1;
}
@media screen and (min-width: 768px) and (max-width: 1400px) {
	.data {
		padding: 0 37.8px;
		.data-title {
			font-size: 47.6px;
			line-height: 105px;
		}
		.col-1 {
			width: 286.8px;
		}
		.col-2 {
			width: 356px;
		}
		.data-content {
			.content-item {
				font-size: 37.5px;
				height: 81px;
			}
		}
	}
	.header {
		height: 98px;
		padding: 0 56px;
		margin-top: 31px;
		.title {
			font-size: 53.9px;
			letter-spacing: 5px;
		}
		.logo {
			height: 77px;
			width: 415.8px;
		}
	
		.header-time view {
			font-size: 28px;
		}
	}
	.bg {
		position: absolute;
		height: 768px;
		width: 1366px; 
		z-index: -1;
	}
	.content {
		height: 768px;
		width: 1366px;
		overflow: hidden;
	}
	
}
@media screen and (min-width: 600px) and (max-width: 1281px) {
	.bg {
		position: absolute;
		height: 768px;
		width: 1280px; 
		z-index: -1;
	}
	.content {
		height: 768px;
		width: 1280px;
		overflow: hidden;
	}
	
}
</style>
