<template>
	<view class="content">
		<view class="header">
			<view class="state">
				<view class="line"></view>
				<view class="state-text">在线</view>
			</view>
			<view class="header-title">{{popupData.title}}</view>
			<view style="display: flex;">
				<view class="refresh" @click="open()">修改</view>
				<view class="refresh" @click="refresh()">刷新</view>
			</view>
		</view>
		<view class="container">
			<view class="queue" style="height: 40%;">
				<view class="container-left h-100">
					<view class="table h-100">
						<view class="table-title">
							排队列表
						</view>
						<view class="box" style="max-height: calc(100% - 60px);overflow-y: auto;">
							<t-table @change="change">
								<t-tr>
									<t-th>序号</t-th>
									<t-th>号码</t-th>
									<t-th>时间</t-th>
									<t-th>状态</t-th>
								</t-tr>
								<view  v-for="(item,index) in tableList" :key="index" 
								:class="{trFirst:item.queueId==chooseQueueId.queueId}" @click="chooseQueueId = item">
									<t-tr>
										<t-td>{{ item.queueId }} </t-td>
										<t-td>{{ item.queueNo }}</t-td>
										<t-td>{{ item.queueGetNoTime }}</t-td>
										<t-td>排队</t-td>
									</t-tr>
								</view>
							</t-table>
						</view>
					</view>
				</view>
				<view class="container-right">
					<button class="bottom " @click="call" :disabled="isDisabled"> 呼叫 </button>
				</view>
			</view>
			<view class="queue " style="height: 60%;">
				<view class="container-left h-100">
					<view class="table h-100">
						<view class="table-title">
							已叫号列表
						</view>
						<view class="box" style="max-height: calc(100% - 60px);overflow-y: auto;">
							<t-table @change="change">
								<t-tr>
									<t-th>序号</t-th>
									<t-th>号码</t-th>
									<t-th>时间</t-th>
									<t-th>状态</t-th>
								</t-tr>
								<view  v-for="(item,index) in alreadyCalled" :key="index" 
								:class="{trFirst:item.queueId==chooseAlreadQueueId.queueId}" @click="chooseAlreadQueueId = item">
									<t-tr>
										<t-td>{{ item.queueId }}</t-td>
										<t-td>{{ item.queueNo }}</t-td>
										<t-td>{{ item.queueGetNoTime }}</t-td>
										<t-td>已叫号</t-td>
									</t-tr>
								</view>
								
							</t-table>
						</view>
					</view>
				</view>
				<view class="container-right">
					<button class="bottom " @click="recall" :disabled="isDisabled"> 重呼 </button>
				</view>
			</view>
		</view>
		<popupSet ref="popupSet" @confirm="confirm" @close="close" :showwText="true" :dataInit="dataPopup"  :showTitle="true"></popupSet>
	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
    import tTh from '@/components/t-table/t-th.vue';
    import tTr from '@/components/t-table/t-tr.vue';
    import tTd from '@/components/t-table/t-td.vue';
	import popupSet from '../../components/popup-set/popup-set.vue';
	export default {
		components: {tTable,tTh,tTr,tTd,popupSet},
		data() {
			return {
				tableList: [],
				alreadyCalled: [],
				dataPopup:{
					title:'',
					iType:'',
					screenNumber:'',
					playSound:false,
					text:'',
				},
				popupData:{
					iType:'',
					text:'',
					title:'',
				},
				popupShow:true,
				isDisabled:false,
				chooseQueueId:0,
				chooseAlreadQueueId:0,
			};
		},
		onLoad(){
			this.popupData = uni.getStorageSync('dataInit');
			this.dataPopup = uni.getStorageSync('dataInit');
			this.init();
			
		},
		methods:{
			// 打开设置
			open(){
				this.$refs.popupSet.open();
				this.popupShow = true;
			},
			// 关闭设置
			close(){
				this.popupShow = false;
				if(this.iType){
					this.init();
				}
			},
			//确定设置
			confirm(res) {
				this.popupData = res;
				this.popupShow = false;
				this.init();
			},
			change(e) {
                console.log(e.detail);
            },
			refresh(){
				location.reload();
			},
			call(){
				if(!this.tableList.length){
					uni.showToast({
						icon: 'none',
						title: `暂无排队人数`,
						duration: 3000
					})
					return;
				}
				this.isDisabled = true;
				uni.showLoading({
				    title: '加载中'
				});
				this.$request({
					url:'Queue/callQueueForPharmacy',
					data:{
						queueEquipmentId: this.popupData.text,
						queueId: this.chooseQueueId.queueId,
					},
					method: 'POST',
					success: res => {
						this.init();
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: `呼叫号码${this.chooseAlreadQueueId.queueNo}成功`,
							showCancel: false,
							success: res => {
							},
						});
						this.isDisabled = false;
					},
					fail: res => {
						this.isDisabled = false;
					}
				})
			},
			recall(item){
				if(!this.alreadyCalled.length){
					uni.showToast({
						icon: 'none',
						title: `暂无排队人数`,
						duration: 3000
					})
					return;
				}
				this.isDisabled = true;
				uni.showLoading({
				    title: '加载中'
				});
				this.$request({
					url:'Queue/QueueRecall',
					data:{
						queueId: this.chooseAlreadQueueId.queueId,
						queueEquipmentId: this.popupData.text,
					},
					method: 'POST',
					success: res => {
						this.init();
						uni.hideLoading();
						// uni.showToast({
						// 	icon: 'success',
						// 	title: `重呼${this.chooseAlreadQueueId.queueNo}成功`,
						// 	duration: 3000
						// });
						uni.showModal({
							title: '提示',
							content: `重呼号码${this.chooseAlreadQueueId.queueNo}成功`,
							showCancel: false,
							success: res => {
							},
						});
						this.isDisabled = false;
					},
					fail: res => {
						this.isDisabled = false;
					}
				})
			},
			init(){
				// let res = {data:[{"queueId": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","queueNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"queueId": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","queueNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"queueId": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","queueNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"queueId": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","queueNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"queueId": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","queueNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},
				// {"queueId": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","queueNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"queueId": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","queueNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"queueId": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","queueNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"queueId": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","queueNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"queueId": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","queueNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null}
				// ]}
				// this.tableList = res.data;
				// this.alreadyCalled = res.data;
				
				this.$request({
					url:'Queue/getAllQueueForCallers',
					data:{
						queueEquipmentId: this.popupData.text,
					},
					method: 'POST',
					success: res => {
						this.tableList = res.waitList;
						this.alreadyCalled = res.callList;
						if(this.alreadyCalled.length>0){
							this.chooseAlreadQueueId = this.alreadyCalled[0]
						}
						if(this.tableList.length>0){
							this.chooseQueueId = this.tableList[0]
						}
					},
					fail: err => {
						setTimeout(() => {
							this.init();
						}, 6000);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.trFirst{
	// background-color: #e0ecff;
	background-color: #e8e8e8;
}
body,page{
	height: 100%;
}
.h-100{
	height: 100%;
}
.content{
	height: 100%;
}
.header{
	color: #FFFFFF;
	background-color: #5599fe;
	padding: 0 20px;
	height: 60px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	.state{
		display: flex;
		.line{
			background-color: #00ff00;
			height: 20px;
			width: 20px;
		}
		.state-text{
			padding-left: 10px;
			font-size: 20px;
		}
	}
	.header-title{
		font-size: 30px;
		font-weight: bold;
		position: absolute;
		right: 52%;
	}
	.refresh{
		padding: 0 20px;
		cursor: pointer;
		position: relative;
		z-index: 100;
		font-size: 20px;
	}
}
.container{
	padding-top: 20px;
	width: 100%;
	max-width: 960px;
	height: calc(100% - 100px);
	margin: auto;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	.queue{
		display: flex;
		justify-content: center;
	}
	.container-left{
		width: 80%;
		.table{
			// border: 1px solid #d8d8d8;
			.table-title{
				color: #FFFFFF;
				text-align: center;
				height: 35px;
				line-height: 35px;
				background-color: #5599fe;
			}
		}
	}
	.container-right{
		width: 20%;
		display: flex;
		justify-content: center;
		.bottom{
			padding: 0px 35px;
			border-radius: 5px;
			height: 50px;
			line-height: 50px;
			font-size: 20px;
			background-color: #FFFFFF;
			&:hover{
				background-color: #5599fe;
				color: #FFFFFF;
			}
		}
	}
}
body{
	background-color: #f4f5f5;
}
</style>
