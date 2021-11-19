<template>
	<view class="content">
		<view class="header">
			<view class="state">
				<view class="line"></view>
				<view class="state-text">在线</view>
			</view>
			<view class="header-title">{{popupData.title}}</view>
			<view style="display: flex;">
				<view class="refresh" @click="refresh()">刷新</view>
				<view v-if="loginState" style="display: flex;">
					<view class="refresh" @click="logout()" >注销</view>
					<view class="refresh" @click="changePassword()" >修改密码</view>
				</view>
				<view class="refresh" @click="open()" v-else>登录</view>
			</view>
		</view>
		<view class="container">
			<view class="queue" style="height: 50%;">
				<view class="container-left ">
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
								:class="{trFirst:item.examNo==chooseQueueId.examNo}" @click="chooseQueueId = item">
									<t-tr>
										<t-td>{{ item.examNo }} </t-td>
										<t-td>{{ item.patientNo }}</t-td>
										<t-td>{{ item.queueTime }}</t-td>
										<t-td>排队</t-td>
									</t-tr>
								</view>
							</t-table>
						</view>
					</view>
				</view>
				<view class="container-right">
					<button class="bottom" @click="call" :disabled="isDisabled"> 呼叫 </button>
					<button class="bottom" @click="recall" :disabled="isDisabled"> 重呼 </button>
					<button class="bottom" @click="pass" :disabled="isDisabled"> 过号 </button>
				</view>
			</view>
			<view class="queue " style="height: 50%;">
				<view class="container-left twoTable">
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
								:class="{trFirst:item.examNo==chooseAlreadQueueId.examNo}" @click="chooseAlreadQueueId = item">
									<t-tr>
										<t-td>{{ item.examNo }}</t-td>
										<t-td>{{ item.patientNo }}</t-td>
										<t-td>{{ item.queueCallTime }}</t-td>
										<t-td>已叫号</t-td>
									</t-tr>
								</view>
								
							</t-table>
						</view>
					</view>
				</view>
				<view class="container-left twoTable">
					<view class="table h-100">
						<view class="table-title">
							已过号列表
						</view>
						<view class="box" style="max-height: calc(100% - 60px);overflow-y: auto;">
							<t-table @change="change">
								<t-tr>
									<t-th>序号</t-th>
									<t-th>号码</t-th>
									<t-th>时间</t-th>
									<t-th>状态</t-th>
								</t-tr>
								<view  v-for="(item,index) in passList" :key="index" >
									<t-tr>
										<t-td>{{ item.examNo }}</t-td>
										<t-td>{{ item.patientNo }}</t-td>
										<t-td>{{ item.queuePassTime }}</t-td>
										<t-td>已叫号</t-td>
									</t-tr>
								</view>
								
							</t-table>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="popup">
				<view class="popup-title">登录</view>
				<view class="popup-tip">请使用医生账号密码登录</view>
				<view>
					<uni-forms :value="formData" ref="form" label-width='50'>
						<uni-forms-item label="账号:" name="username">
							<input  type="text"  v-model="formData.username" autocomplete="off" placeholder="请输入账号"  />
						</uni-forms-item>
						<uni-forms-item label="密码:" name="password">
							<input  type="text" password v-model="formData.password" autocomplete="new-password" placeholder="请输入密码"  />
						</uni-forms-item>
						<button @click="submitForm">登录</button>
					</uni-forms>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupEdit" type="center">
			<view class="popup">
				<view class="popup-title">修改秘密</view>
				<view class="popup-tip">请输入新的登录密码</view>
				<view>
					<uni-forms :value="editData"  ref="editForm" label-width='70'>
						<uni-forms-item label="密码:" name="password">
							<input  type="text" password v-model="editData.password"  autocomplete="off" placeholder="请输入密码"  />
						</uni-forms-item>
						<uni-forms-item label="确认密码:" name="confirmPassword">
							<input  type="text"  password v-model="editData.confirmPassword" autocomplete="new-password" placeholder="请输入密码"  />
						</uni-forms-item>
						<view style="display: flex;">
							<button @click="closeEditForm" style="width: 100px; background-color: #FFFFFF; color: #000;">取消</button>
							<button @click="submitEditForm" style="width: 100px;">修改</button>
						</view>
					</uni-forms>
				</view>
			</view>
		</uni-popup>
		<!-- <popupSet ref="popupSet" @confirm="confirm" @close="close" :showwText="true" :dataInit="dataPopup"  :showTitle="true"></popupSet> -->
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
				formData:{
					username:'',
					password:''
				},
				loginState:false,
				editData: {
					password: '',
					confirmPassword: '', 
				},
				doctorId:'',
				passList:[],
			};
		},
		onLoad(){
			// this.popupData = uni.getStorageSync('dataInit');
			// this.dataPopup = uni.getStorageSync('dataInit');
			
		},
		onReady() {
			let user = sessionStorage.getItem("user");
			console.log(user);
			if(!user){
				this.$refs.popup.open();
				return;
			}
			user = JSON.parse(user);
			this.doctorId = user.doctorId;
			this.init();
			this.loginState = true;
			this.popupData.title = user.doctorName;
		},
		methods:{
			changePassword(){
				this.$refs.popupEdit.open();
			},
			open(){
				this.$refs.popup.open();
			},
			// 取消修改
			closeEditForm(){
				this.$refs.popupEdit.close();
				this.editData = {
					password: '',
					confirmPassword: '',
				}
			},
			submitEditForm(form){
				this.$refs.editForm.submit().then((res)=>{
					if(!res.password || !res.confirmPassword || res.confirmPassword!=res.password){
						uni.showToast({
							title: '请确认密码',
							icon: 'none'
						});
						return
					}
					this.$request({
						url:'Queue/updateDoctorPassword',
						data:{
							doctorId: this.doctorId,
							password: res.password,
						},
						method: 'POST',
						success: res => {
							this.$refs.popupEdit.close();
							this.editData = {
								password: '',
								confirmPassword: '', 
							}
						},
					})
				})
			},
			// 登录
			submitForm(form) {
				this.$refs.form.submit().then((res)=>{
					if(!res.username){
						uni.showToast({
							title: '请填写账号',
							icon: 'none'
						});
						return
					}
					if(!res.password){
						uni.showToast({
							title: '请填写密码',
							icon: 'none'
						});
						return
					}
					this.$request({
						url:'Queue/doctorLogin',
						data:{
							account: res.username,
							password: res.password,
						},
						method: 'POST',
						success: res => {
							if(!res.data){
								uni.showToast({
									title: res.msg,
									icon: 'none'
								});
								return
							}
							this.doctorId = res.data.doctorId;
							this.loginState = true ;
							sessionStorage.setItem("user", JSON.stringify(res.data));
							uni.showToast({
								title: '登录成功',
								icon: 'none'
							});
							this.popupData.title = res.data.doctorName;
							this.$refs.popup.close();
							this.init();
						},
					})
				})
			},
			logout(){
				uni.showModal({
					title: '提示',
					content: '是否注销',
					success: res => {
						if(res.confirm){
							this.formData = {
								username: '',
								password: ''
							}
							this.loginState = false;
							this.doctorId = '';
						}
					},
				});
				
			},
			change(e) {
                console.log(e.detail);
            },
			refresh(){
				location.reload();
			},
			// 呼叫
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
					url:'Queue/callQueueNo',
					data:{
						examNo: this.chooseQueueId.examNo,
					},
					method: 'POST',
					success: res => {
						this.init();
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: `呼叫号码${this.chooseQueueId.patientNo}成功`,
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
			// 重呼
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
					url:'Queue/callQueueNo',
					data:{
						examNo: this.chooseAlreadQueueId.examNo,
					},
					method: 'POST',
					success: res => {
						this.init();
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: `重呼号码${this.chooseAlreadQueueId.patientNo}成功`,
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
			// 过号
			pass(){
				if(!this.alreadyCalled.length){
					uni.showToast({
						icon: 'none',
						title: `暂无数据`,
						duration: 3000
					})
					return;
				}
				this.isDisabled = true;
				uni.showLoading({
				    title: '加载中'
				});
				this.$request({
					url:'Queue/passQueueNo',
					data:{
						examNo: this.chooseAlreadQueueId.examNo,
					},
					method: 'POST',
					success: res => {
						this.init();
						uni.hideLoading();
						uni.showModal({
							title: '提示',
							content: `已过号码${this.chooseAlreadQueueId.patientNo}成功`,
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
				// let res = {data:[{"examNo": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","patientNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"examNo": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","patientNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"examNo": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","patientNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"examNo": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","patientNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"examNo": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","patientNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},
				// {"examNo": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","patientNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"examNo": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","patientNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"examNo": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","patientNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"examNo": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","patientNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null},{"examNo": "1009","queueDepartmentCode": "CT","queueDepartmentRoomCode": "CT1","queueGetNoTime": "2021-01-24 16:03:21","queueApm": "1","patientNo": "CT1003","queueIndex": "100002","queueState": "2","queueIsReCall": null}
				// ]}
				if(!this.doctorId) {
					return
				}
				// this.tableList = res.data;
				// this.alreadyCalled = res.data;
				// if(this.alreadyCalled.length>0){
				// 	this.chooseAlreadQueueId = this.alreadyCalled[0]
				// }
				// if(this.tableList.length>0){
				// 	this.chooseQueueId = this.tableList[0]
				// }
				this.$request({
					url:'Queue/getCallersQueue',
					data:{
						doctorId: this.doctorId,
					},
					method: 'POST',
					success: res => {
						this.tableList = res.data.waitingList;
						this.alreadyCalled = res.data.callingList;
						this.passList = res.data.passList;
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
.popup{
	background-color: #FFFFFF;
	border-radius: 10px;
	width: 270px;
	padding: 20px;
	text-align: center;
	.popup-title{
		font-size: 25px;
	}
	.popup-tip{
		font-size: 14px;
		padding-top: 10px;
		padding-bottom: 30px;
	}
	input{
		border: 1px solid #d8d8d8;
		height: 2.1em;
		padding: 0 10px;
	}
	button{
		background-color: #5599fe;
		color: #FFFFFF;
	}
}
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
	height: 50px;
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
			font-size: 18px;
		}
	}
	.header-title{
		font-size: 27px;
		font-weight: bold;
		position: absolute;
		right: 52%;
	}
	.refresh{
		padding: 0 20px;
		cursor: pointer;
		position: relative;
		z-index: 100;
		font-size: 18px;
	}
}
.container{
	padding-top: 20px;
	width: 100%;
	max-width: 960px;
	height: calc(100% - 90px);
	margin: auto;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
	justify-content: space-around;

	.queue{
		display: flex;
		justify-content: space-between;
	}
	.container-left{
		width: 80%;
		border: 1px solid #d8d8d8;
		height: 95%;
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
		&.twoTable{
			width: 49%;
			
		}
	}
	.container-right{
		width: 20%;
		.bottom{
			border-radius: 5px;
			height: 50px;
			line-height: 50px;
			width: 120px;
			font-size: 17px;
			margin-bottom: 20px;
			background-color: #FFFFFF;
			border: 1px solid #d8d8d8;
			&:hover{
				background-color: #5599fe;
				color: #FFFFFF;
			}
			&:after{
				border: none;
			}
		}
	}
}
body{
	background-color: #f4f5f5;
}
</style>
