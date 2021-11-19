<template>
	<view class="content">
		<view class="popup" >
			<view class="popup-header">
				设置
			</view>
			<view>
				<view class="uni-form-item ">
					<button type="default" @click="navTo('./roomDetails')">竖屏</button>
				</view>
				<view class="uni-form-item ">
					<button type="default" @click="navTo('./pharmacy')">横屏</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pageSet:'',
			failText:'测试',
			pageSetBoolean:true,
		};
	},
	onShow() {
		this.pageSet = uni.getStorageSync('pageSet')||'';
		this.pageSetBoolean = uni.getStorageSync('pageSetBoolean');
		if(this.pageSet && this.pageSetBoolean){
			this.navTo(this.pageSet);
		}
	},
	methods: {
		navTo(data){
			uni.setStorageSync('pageSetBoolean',true);
			uni.redirectTo({
				url: data,
				success: res => {
					console.log('redirectTo');
					uni.setStorageSync('pageSet',data);
				},
				fail: (res) => {
					this.failTextr = JSON.stringify(res);
					console.log(this.failTextr);
				},
				complete: () => {}
				
				
				
			});
		}
	}
};
</script>

<style>
.content{
	background-color: rgba(0, 0, 0, 0.4);
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
page {
	height: 100%;
}
.popup-btn{
		font-size: 30px;
		color: #fff;
		padding-left: 40px;
		padding-right: 40px;
		background-color: rgb(68,114,196);
		margin-left: 40px;
		margin-right: 40px;
	}
	.popup{
		background-color: #fff;
		width: 600px;
		min-width: 500px;
		font-size: 40px;
		z-index: 100;
		max-height: 85%;
		overflow: scroll;
	}
	.popup-header{
		background-color: rgb(68,114,196);
		text-align: center;
		padding: 20px 0 ;
	}
	.uni-form-item{
		display: flex;
		align-items: center;
		padding: 40px;
		justify-content: center;
	}
	.uni-form-item button{
		font-size: 40px;
		background-color: rgb(68,114,196);
		color: #fff;
		width: 60%;
	}
</style>
