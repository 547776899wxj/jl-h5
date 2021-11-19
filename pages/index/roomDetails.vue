<template>
	<view>
		<view class="content" @longpress="open" @click="open">
			<image class="bg" src="../../static/bg.png"></image>
			<view class="header">
				<image class="logo" src="../../static/logo.png" mode=""></image>
				<view class="header-time">{{ date }}</view>
			</view>
			<view class="room">{{ queueTitle}}</view>
			<view class="info">
				<view class="info-item">
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
						<view class="doctor-name text" style="font-size: 77px;color: rgb(12,109,221);">{{ doctor.doctorName }}</view>
						<view class="doctor-title" style="font-size: 56px;color: rgb(12,109,221);">{{ doctor.doctorTitle }}</view>
					</view>
				</view>
				<view class="doctor-details" >
					<view v-if="status!=200">
						<view class="name appName">
							<view class="info-title" style="padding-bottom: 10px;">擅长：</view>
							<!-- <view class="text doctorInfo" style="text-indent:2em">{{doctor.doctorInfo}}</view> -->
							<view class="text doctorInfo" style="text-indent:2em">
								<scrollingHTML :text="doctor.doctorInfo"></scrollingHTML>
							</view>
						</view>
						<view class="name " style="height: 44px;overflow: hidden;">
							<text class="info-title">坐诊时间：</text>
							<text class="text">{{doctor.doctorScheduling}}</text>
						</view>
					</view>
					<view class="name" style="font-size: 70px; text-align: center;" v-else>
						未开诊
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
import scrollingHTML from '@/components/scrollingHTML.vue';
// #ifdef APP-PLUS
	var FvvUniTTS = uni.requireNativePlugin('Fvv-UniTTS');
// #endif
export default {
	components: { popupSet, uniNoticeBar, scrollingHTML },
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
				playSound: true,
				text: ''
			},
			iType: '',
			roomCode: '',
			doctor: {
			},
			voiceData: [],
			testNubmer: 0,
			voiceDataInit: [],
			interval: 3000,
			voicePlayTiems: 3,
			voicePlayNumber: 0,
			playSound: true,
			queueTitle:'',
			status:0,
		};
	},
	onLoad() {
		let dataInit = uni.getStorageSync('dataInit') || {};
		this.dataPopup = dataInit;
		this.playSound = dataInit.playSound || true;
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
			
			// let res = {status:0,"doctor": {"doctorId": "10001","doctorName": "张三","doctorTitle": "医生","doctorPicture": "../../static/test.JPG","doctorInfo": "撑着油纸伞，独自彷徨在悠长、悠长又寂寥的雨巷我希望逢着一个丁香一样的结着愁怨的姑娘她是有丁香一样的颜色丁香一样的芬芳丁香一样的忧愁在雨中哀怨哀怨又彷徨她彷徨在这寂寥的雨巷撑着油纸伞像我一样徨她彷徨在这寂寥的雨巷撑着油纸伞像我一样","doctorExpertise": "专长","doctorEquipmentId": "1001","doctorScheduling": "周一上午,周二下午,周三上午,周三下午,周五上午,周六下午,周日上午","equipmentName": "CT1","departmentCode": "CT"},"msg": "成功","reload": false,"data": {"patientNo": "A001","patientName": "张三","waitingList": [{"queueId": null,"departmentName": "CT","clinicName": "CT1","patientNo": "A002","patientName": "李四","queueTime": null,"queueCallTime": null,"queuePassTime": null,"doctorId": null,"queueStatus": null},{"queueId": null,"departmentName": "CT","clinicName": "CT1","patientNo": "铁性收费","patientName": "王王五五","queueTime": null,"queueCallTime": null,"queuePassTime": null,"doctorId": null,"queueStatus": null}],"waitingNumber": 4,"departmentName": "CT","clinicName": "CT1"},"serverTime": "2021-05-28 11:39:18"}
			this.$request({
				url: 'Queue/getQueueInfo',
				method: 'POST',
				success: res => {
					try {
						let datas = res;
						this.status = res.status;
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
						this.queueTitle = res.queueTitle;
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
							if (this.data.isReCall == "1") {
								this.voiceData.unshift(voiceDataInit[0]);
								this.$request({
									url: 'Queue/reCall',
									data:{
										examNo:this.data.examNo,
										isReCall: '0'
									},
									success: res => {
										console.log(res);
									}
								})
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
				},
				fail: res => {
					setTimeout(() => {
						this.init();
					}, this.interval);
				}
			});
		},
		// 语音队列
		voiceQueue() {
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
.footer{
	margin-top: 4px;
}
.info-item{
	display: flex;
	height: 319.2px;
}
.wait-number {
	margin-top: 13.2px;
	display: flex;
	font-size: 35px;
	color: #095dbf;
	letter-spacing: 3.5px;
	padding: 0 42px;
	image {
		width: 49px;
		height: 49px;
	}
}
.content {
	height: 1366px;
	width: 768px;
}
.w-50 {
	width: 50%;
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
		font-size: 24.5px;
		line-height: 3; 
	}
}
.room{
	color: rgb(9,93,191);
	font-size: 65px;
	margin-top: 37px;
	line-height: 95px;
	text-align: center;
	height: 95.2px;
}
.info {
	padding:10px 26.6px 0 26.6px;
	.doctor-details{
		padding: 14px 27px;
		height: 353px;
		box-sizing: border-box;
	}
	.appName{
		height: 281px;
		overflow: hidden;
	}
	.text {
		font-size: 27.3px;
		line-height: 1.7;
		height: 177px;
		&.doctorInfo{
			height: 220px;
		}
	}
	.name {
		color: rgb(12, 109, 221);
			
		letter-spacing: 2px;

		.info-title {
			color: rgb(9, 93, 191);
			font-weight: bold;
			font-size: 30px;
		}
	}
	.info-content {
		margin-left: 71.4px;
		width: 422.1px;
		margin-top: 31.5px;
		.expertise {
			overflow: hidden;
			height: 86.1px;
		}
		text {
			font-size: 21px;
		}
	}
	.info-time {
		font-size: 21px;
	}
	.data {
		display: flex;
		padding: 0 14px;
		.data-title {
			font-size: 49px;
			text-align: center;
			letter-spacing: 3.5px;
			line-height: 84px;
			color: rgb(255, 249, 0);
			&.wait {
				color: rgb(9, 93, 191);
			}
		}
		.data-number {
			text-align: center;
			font-size: 42px;
			font-weight: bolder;
			height: 237.3px;
			color: #fff900;
			line-height: 237.3px;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			&.wait {
				color: rgb(9, 93, 191);
				line-height: 70px;
			}
		}
		.data-number.size {
			text-align: center;
			font-size: 27.3px;
			height: 56px;
			line-height: 56px;
		}
	}

	.userimg {
		margin-left: 58.3px;
		height: 284px;
		margin-top: 19.2px;
		width: 222.6px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		.dataImg{
			width: 100%;
			height: 100%;
		}
	}
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
