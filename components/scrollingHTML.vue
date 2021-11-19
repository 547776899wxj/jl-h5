<template>
	<view class="h-100 w-100 ">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="h-100 w-100" @scrolltolower="lower">
			<view id="demo1" class="scroll-view-item">
				<!-- <rich-text :nodes="text"></rich-text> -->
				<text>{{text}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop:0,
				timeoutID:'',
			};
		},
		props:{
			text:{
				type:String,
				default:''
			}
		},
		created() {
			this.setScrollTop();
		},
		methods:{
			lower(){
				clearInterval(this.timeoutID);
				setTimeout(()=>{
					this.scrollTop = 0
					this.setScrollTop();
				},1000)
			},
			setScrollTop(){
				this.timeoutID = setInterval(()=>{
					this.scrollTop += 1;
				},100)
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-item {
		padding-bottom: 60px;
	}
	.h-100{
		height: 100%;
	}
	.w-100{
		width: 100%;
	}
</style>
