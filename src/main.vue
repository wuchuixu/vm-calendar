<template>
	<div :class="['calendar',{ 'calendar-fixed': fConfig.headerFixed }]">
		<div :class="['calendar-header',{ fixed: fConfig.headerFixed }]" v-if="!$slots.header">
			<template v-if="!$slots.header">
				<div class="left">
					<span @click="$emit('cancel')" :style="`color:${ fConfig.cancelBtnColor };`" v-html="fLabels.cancel"></span>
				</div>
				<div class="center">
					<span>{{ fLabels.title }}</span>
				</div>
				<div class="right">
					<span @click="confirm" :style="`color:${ fConfig.confirmBtnColor };`" v-html="fLabels.confirm"></span>
				</div>
			</template>
			<template v-else>
				<slot name="header" />
			</template>
		</div>
		<div :class="['calendar-weekly',{ fixed: fConfig.headerFixed }]" v-if="fLabels.weeks && fLabels.weeks.length > 0">
			<ul class="calendar-week">
				<li v-for="item in fLabels.weeks" :key="item">{{ item }}</li>
			</ul>
		</div>
		<div class="calendar-body">
			<div class="calendar-content">
				<div class="calendar-item" v-for="(date,i) in dates" :key="i">
					<div class="calendar-item-header">
						<span>{{ date.year }}{{ fLabels.year }}{{ date.month }}{{ fLabels.month }}</span>
					</div>
					<ul class="days">
						<li :class="{ selected: day.selected, disabled: day.disabled }" v-for="(day,idx) in date.days" :key="idx" @click="selectChange(day,date)">
							<div>{{ day.value }}</div>
							<span class="desc ">{{ day.desc }}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: "appCalendar",
	data (){
		return {
			fLabels: {},
			fConfig: {},
			dates: [],
			selected: []
		}
	},
	props: {
		config: Object, 
		labels: Object
	},
	created (){
		const nowDate = new Date(),
			  nowYear = nowDate.getFullYear(),
			  nowMonth = nowDate.getMonth() + 1;
		
		this.fLabels = Object.assign({
			year: '年',
			month: '月',
			confirm: '确认',
			cancel: '取消',
			title: '选择日期',
			weeks:['日','一','二','三','四','五','六']
		},this.labels);
		
		this.fConfig = Object.assign({
			multipleSelect: false,
			headerFixed: true,
			startYearMonth: `${nowYear}-${nowMonth}`,
			endYearMonth: `${nowYear + 1}-${nowMonth}`,
			disableDays: [],
			cancelBtnColor:'#F58400',
			confirmBtnColor:'#F58400',
			dayDesc: '可选'
		},this.config);
		
		this.initCalendar(this.fConfig);
	},
	computed: {
      	
  	},
	methods: {
		confirm (){
			this.$emit('confirm',{
				value: this.selected
			});
		},
		initCalendar (config = {}){
			let _t = this;
			let { startYearMonth, endYearMonth, dayDesc, disableDays } = config;
			let starts = this.dateTransform(startYearMonth),
				ends = this.dateTransform(endYearMonth),
				sy = Number(starts[0]),
				sm = Number(starts[1]),
				ey = Number(ends[0]),
				em = Number(ends[1]);
				
			let differ = (ey - sy)/Math.abs(ey - sy) || 1;
			
			buildDates(sy,sm,differ);
			function buildDates(y,m,differ){
				let days = [];
				let day = new Date(`${y},${m},1`).getDay();
				for(let i = 0;i < day;i++){
					days.push({
						value: '',
						desc: ''
					});
				}
				for(let i = 1;i <= _t.getDays(y,m);i++){
					days.push({
						value: i,
						desc: dayDesc,
						disabled: false,
						selected: false
					});
				}
				_t.dates.push({
					year: y,
					month: m,
					days: days
				});
				if(!(y == ey && m == em)){
					let r = m + differ;
					let nm = r >= 13 ? 1 : (r <= 0 ? 12 : r);
					let ny = r >= 13 || r <= 0 ? y + differ : y;
					buildDates(ny, nm, differ);
				}
			}
		},
		dateTransform (date){
			let reg = RegExp(/[-/,]/),
				separator = reg.exec(date) ? reg.exec(date)[0] : '';
			return date.split(separator) || []
		},
		getDays (y,m){
			let d = new Date(y, m, 0);
    		return d.getDate();
		},
		selectChange(day,date){
			if(!day.disabled){
				this.selected = [];
				!this.fConfig.multipleSelect && this.dates.forEach(v => {
					v.days && v.days.forEach(vv => {
						vv.selected = false;
					});
				});
				day.selected = !day.selected;
				this.dates.forEach(v => {
					v.days && v.days.forEach(vv => {
						vv.selected && this.selected.push({
							year: v.year,
							month: v.month,
							date: vv.value
						});
					});
				});
				this.$emit('change',{
					value: this.selected
				});
			}
		},
		getData(){
			return this.selected || [] ;
		}
	}
}
</script>
<style>
	.calendar{
		/*padding: 20px;*/
		/*background: #f2f2f2;*/
		position: relative;
	}
	.calendar-fixed{
		padding-top: 160px;
	}
	.calendar ul{
		list-style: none;
	}
	.calendar-header,.calendar-week{
		display: flex;
		align-items: center;
		text-align: center;
	}
	.calendar-header{
		width: 100%;
		padding: 20px;
		background: #fff;
		box-shadow: 0 0 2px #ccc;
		box-sizing: border-box;
	}
	.calendar-header.fixed{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
	}
	.calendar-header .center{
		flex: 1;
	}
	.calendar-weekly{
		width: 100%;
		padding: 16px 0;
		box-sizing: border-box;
	}
	.calendar-weekly.fixed{
		position: fixed;
		top: 80px;
		left: 0;
		background: #fff;
		z-index: 99;
	}
	.calendar-week li{
		flex: 1;
	}
	.calendar-body{
		padding: 0 20px;
	}
	.calendar-item .days{
		padding: 20px 0;
		overflow: hidden;
		text-align: center;
	}
	.calendar-item .days li{
		float: left;
		position: relative;
		width: 14.2857%;
		padding: 6px 0;
		border-radius: 6px;
	}
	.calendar-item .days li .desc{
		
	}
	.calendar-item .days li.disabled{
		color: #BCBCBC;
	}
	.calendar-item .days li.selected{
		background: #0084D7;
		color: #fff;
	}
	.calendar-item{
		margin-bottom: 20px;
	}
	.calendar-item-header{
		padding-bottom: 10px;
		color: #999;
		border-bottom: 1px solid #f3f3f3;
	}
	
</style>