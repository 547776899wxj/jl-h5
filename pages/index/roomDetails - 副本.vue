<template>
	<view>
		<view class="content" @longpress="open" @click="open">
			<image class="bg" src="../../static/bg.png"></image>
			<view class="header">
				<image class="logo" src="../../static/logo.png" mode=""></image>
				<view class="header-time">{{ date }}</view>
			</view>
			<view class="room">{{ data.clinicName || text }}</view>
			<view class="info">
				<view style="display: flex;height: 456px;">
					<view class="userimg" v-if="doctor.doctorPicture"><image class="dataImg" :src="doctor.doctorPicture" mode=""></image></view>
					<view class="userimg" v-else><image src="../../static/user.png" mode=""></image></view>
					<view class="info-content">
						<!-- <view class="name">
							<text class="info-title">姓名：</text>
							<text  class="text">{{doctor.doctorName}}</text>
						</view>
						<view class="name">
							<text class="info-title">职称：</text>
							<text  class="text">{{doctor.doctorTitle}}</text>
						</view>
						<view class="name expertise">
							<text class="info-title">专长：</text>
							<text  class="text">{{doctor.doctorExpertise}}</text>
						</view> -->
						<view class="doctor-name text" style="font-size: 110px;color: rgb(12,109,221);">{{ doctor.doctorName }}</view>
						<view class="doctor-title" style="font-size: 80px;color: rgb(12,109,221);">{{ doctor.doctorTitle }}</view>
					</view>
				</view>
				<view class="doctor-details">
					<view class="name " style="height: 345px;">
						<view class="info-title" style="padding-bottom: 10px;">擅长：</view>
						<view class="text" style="text-indent:2em">{{ doctor.doctorInfo }}</view>
					</view>
					<view class="name ">
						<text class="info-title">坐诊时间：</text>
						<text class="text">下午就诊</text>
					</view>
				</view>
				<view class="data">
					<view class="w-50">
						<view class="data-title"><view>正在就诊</view></view>
						<view class="data-number">
							<view>
								<text style="padding-right: 15px;">{{ data.patientNo }}</text>
								<text>{{ data.hideName }}</text>
							</view>
						</view>
					</view>
					<view class="w-50 ">
						<view class="data-title wait">等待就诊</view>
						<view class="data-number wait">
							<view v-for="(item, index) in data.waitingList" :key="index">
								<text style="padding-right: 15px;">{{ item.patientNo }}</text>
								<text>{{ item.hideName }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="wait-number">
				<image src="../../static/icon_wait.png" mode=""></image>
				<view>
					<text>当前等待人数：</text>
					<text>{{ data.waitingNumber }}人</text>
				</view>
			</view>
			<view class="footer"><uni-notice-bar scrollable="true" single="true" :text="tips" fontSize="38px" height="38px" color="#095dbf"></uni-notice-bar></view>
			<popupSet ref="popupSet" @confirm="confirm" @close="close" :dataInit="dataPopup" :showTitle="true" :showPlaySound="true"></popupSet>
		</view>
	</view>
</template>

<script>
import popupSet from '../../components/popup-set/popup-set.vue';
import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue';
export default {
	components: { popupSet, uniNoticeBar },
	data() {
		return {
			date: '',
			text: '',
			data: {},
			tips: '感谢您的耐心等待',
			dataPopup: {
				title: '',
				iType: '',
				screenNumber: '',
				playSound: false,
				text: ''
			},
			iType: '',
			roomCode: '',
			doctor: {},
			voiceData: [],
			testNubmer: 0,
			voiceDataInit: [],
			interval: 5000,
			voicePlayTiems: 3,
			voicePlayNumber: 0,
			playSound: false
		};
	},
	onLoad() {
		let dataInit = uni.getStorageSync('dataInit') || {};
		this.dataPopup = dataInit;
		this.playSound = dataInit.playSound || false;
		this.text = dataInit.title;
		this.roomCode = dataInit.text;
		this.init();
	},
	methods: {
		// 打开设置
		open() {
			this.$refs.popupSet.open();
			this.popupShow = true;
		},
		// 关闭设置
		close() {
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
		init() {
			if (this.popupShow) {
				return false;
			}
			let res = {"doctor": {"doctorId": "10001","doctorName": "张三","doctorTitle": "医生","doctorPicture": "/photos/4ba67f79-447d-4264-a67a-94bd1d13fc1d.jpg","doctorInfo": "这是张三的简介","doctorExpertise": "专长","doctorEquipmentId": "1001","doctorScheduling": "周一上午,周二下午,周三上午,周三下午,周五上午,周六下午,周日上午","equipmentName": "CT1","departmentCode": "CT"},"msg": "成功","reload": false,"data": {"patientNo": "A001","patientName": "张三","waitingList": [{"queueId": null,"departmentName": "CT","clinicName": "CT1","patientNo": "A002","patientName": "李四","queueTime": null,"queueCallTime": null,"queuePassTime": null,"doctorId": null,"queueStatus": null},{"queueId": null,"departmentName": "CT","clinicName": "CT1","patientNo": "A003","patientName": "王五","queueTime": null,"queueCallTime": null,"queuePassTime": null,"doctorId": null,"queueStatus": null}],"waitingNumber": 4,"departmentName": "CT","clinicName": "CT1"},"serverTime": "2021-05-28 11:39:18"}
			
				let datas = res;
				try {
					let datas = res;
					// #ifdef H5
					if (datas.reload == 'true' || datas.reload == true) {
						console.log(datas.reload);
						setTimeout(() => {
							location.reload();
							return;
						}, 10000);
					}
					if (datas.isRestartAndroid == 'true' || datas.isRestartAndroid == true) {
						this.$tui.webView.postMessage({
							data: {
								isRestartAndroid: datas.isRestartAndroid
							}
						});
						return;
					}
					// #endif
					let serverTime = res.serverTime.split(':');
					this.date = serverTime[0] + ':' + serverTime[1];
					this.doctor = res.doctor;
					res.data.hideName = res.data.patientName ? this.$util.hideName(res.data.patientName) : '';
					res.data.waitingList.forEach(item => {
						item.hideName = item.patientName ? this.$util.hideName(item.patientName) : '';
					});
					this.data = res.data;
					let voiceDataInit = [];
					if (this.data.patientName && this.playSound) {
						let number = this.data.patientNo ? this.$util.chineseNumeral(this.data.patientNo + '号') : '';
						let speakText = `请,${number}${this.data.patientName}到,${this.data.clinicName}就诊`;
						voiceDataInit = voiceDataInit.concat(speakText);
					}
					if (voiceDataInit.length > 0) {
						this.voiceData = this.$util.findDifferentElements(voiceDataInit, this.voiceDataInit);
						this.voiceDataInit = voiceDataInit;
						if (this.data.queueIsReCall == 1) {
							this.voiceData.unshift(voiceDataInit[0]);
						}
					}
			
					if (this.voiceData.length > 0) {
						this.voiceQueue();
					} else {
						setTimeout(() => {
							this.init();
						}, this.interval);
					}
				} catch (e) {
					//TODO handle the exception
					console.error(e);
					setTimeout(() => {
						this.init();
					}, this.interval);
				}
			
			// this.$request({
			// 	url: 'Queue/getQueueInfo',
			// 	method: 'POST',
			// 	success: res => {
			// 		let datas = res;
			// 		try {
			// 			let datas = res;
			// 			// #ifdef H5
			// 			if (datas.reload == 'true' || datas.reload == true) {
			// 				console.log(datas.reload);
			// 				setTimeout(() => {
			// 					location.reload();
			// 					return;
			// 				}, 10000);
			// 			}
			// 			if (datas.isRestartAndroid == 'true' || datas.isRestartAndroid == true) {
			// 				this.$tui.webView.postMessage({
			// 					data: {
			// 						isRestartAndroid: datas.isRestartAndroid
			// 					}
			// 				});
			// 				return;
			// 			}
			// 			// #endif
			// 			let serverTime = res.serverTime.split(':');
			// 			this.date = serverTime[0] + ':' + serverTime[1];
			// 			this.doctor = res.doctor;
			// 			res.data.hideName = res.data.patientName ? this.$util.hideName(res.data.patientName) : '';
			// 			res.data.waitingList.forEach(item => {
			// 				item.hideName = item.patientName ? this.$util.hideName(item.patientName) : '';
			// 			});
			// 			this.data = res.data;
			// 			let voiceDataInit = [];
			// 			if (this.data.patientName && this.playSound) {
			// 				let number = this.data.patientNo ? this.$util.chineseNumeral(this.data.patientNo + '号') : '';
			// 				let speakText = `请,${number}${this.data.patientName}到,${this.data.clinicName}就诊`;
			// 				voiceDataInit = voiceDataInit.concat(speakText);
			// 			}
			// 			if (voiceDataInit.length > 0) {
			// 				this.voiceData = this.$util.findDifferentElements(voiceDataInit, this.voiceDataInit);
			// 				this.voiceDataInit = voiceDataInit;
			// 				if (this.data.queueIsReCall == 1) {
			// 					this.voiceData.unshift(voiceDataInit[0]);
			// 				}
			// 			}

			// 			if (this.voiceData.length > 0) {
			// 				this.voiceQueue();
			// 			} else {
			// 				setTimeout(() => {
			// 					this.init();
			// 				}, this.interval);
			// 			}
			// 		} catch (e) {
			// 			//TODO handle the exception
			// 			console.error(e);
			// 			setTimeout(() => {
			// 				this.init();
			// 			}, this.interval);
			// 		}
			// 	},
			// 	fail: res => {
			// 		setTimeout(() => {
			// 			this.init();
			// 		}, this.interval);
			// 	}
			// });
		},
		// 语音队列
		voiceQueue() {
			let text = this.voiceData[0];
			console.log(text);
			this.$tui.webView.postMessage({
				data: {
					text: text
				}
			});
			if (this.voiceData.length > 1) {
				this.onDone(this.voiceData[1]);
			} else {
				this.onDone(this.voiceData[0]);
			}
		},
		// 播放完执行
		onDone(data) {
			let date = 4300;
			if (data.length > 12) {
				date = date + (data.length - 12) * 300;
			}
			setTimeout(() => {
				this.voicePlayNumber++;
				if (this.voicePlayNumber >= this.voicePlayTiems) {
					this.voiceData.shift();
					this.voicePlayNumber = 0;
					this.init();
					return;
				} else if (this.voiceData.length > 0) {
					this.voiceQueue();
				}
			}, date);
		}
	}
};
</script>

<style lang="scss">
.wait-number {
	display: flex;
	font-size: 50px;
	color: #095dbf;
	letter-spacing: 5px;
	padding: 0 60px;
	image {
		width: 70px;
		height: 70px;
	}
}
.content {
	height: 1366px;
	width: 768px;
}
.w-50 {
	width: 50%;
}
.footer {
	padding-top: 26px;
}
.bg {
	position: absolute;
	height: 1366px;
	width: 768px;
	z-index: -1;
}
.header {
	height: 110px;
	display: flex;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 30px;
	.logo {
		height: 70px;
		width: 382px;
	}
	.header-time {
		color: #ffffff;
		font-size: 35px;
		line-height: 3;
	}
}
.room {
	color: rgb(9, 93, 191);
	font-size: 65px;
	margin-top: 37px;
	line-height: 93px;
	text-align: center;
	height: 136px;
}
.info {
	padding: 10px 38px 0 38px;
	.doctor-details {
		padding: 14px 27px;
	}
	.text {
		font-size: 39px;
		line-height: 1.7;
	}
	.name {
		color: rgb(12, 109, 221);
		margin-bottom: 30px;
		letter-spacing: 2px;

		.info-title {
			color: rgb(9, 93, 191);
			font-weight: bold;
			font-size: 30px;
		}
	}
	.info-content {
		margin-left: 102px;
		width: 603px;
		margin-top: 45px;
		.expertise {
			overflow: hidden;
			height: 123px;
		}
		text {
			font-size: 30px;
		}
	}
	.info-time {
		font-size: 30px;
	}
	.data {
		display: flex;
		padding: 0 20px;
		.data-title {
			font-size: 70px;
			text-align: center;
			letter-spacing: 5px;
			line-height: 120px;
			color: rgb(255, 249, 0);
			&.wait {
				color: rgb(9, 93, 191);
			}
		}
		.data-number {
			text-align: center;
			font-size: 60px;
			font-weight: bolder;
			height: 339px;
			color: #fff900;
			line-height: 372px;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			&.wait {
				color: rgb(9, 93, 191);
				line-height: 100px;
			}
		}
		.data-number.size {
			text-align: center;
			font-size: 39px;
			height: 80px;
			line-height: 80px;
		}
	}

	.userimg {
		margin-left: 79px;
		height: 399px;
		margin-top: 36px;
		width: 288px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
	}
}
@media screen and (min-width: 100px) and (max-width: 800px) {
	
}
@media screen and (min-width: 1000px) and (max-width: 2000px) {
	.content {
		width: 1080px !important;
		height: 1920px !important;
		.bg {
			height: 1920px;
			width: 1080px;
		}
		.logo {
			height: 111px;
			width: 554px;
		}
		.room {
			font-size: 75px;
			margin-top: 90px;
			line-height: 136px;
		}
		.info {
			.name {
				.info-title {
					font-size: 42px;
				}
			}
		}
	}
}
</style>
