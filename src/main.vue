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
		<div :class="['calendar-weekly',{ fixed: fConfig.headerFixed }]" v-if="fLabels.weeks && fLabels.weeks.length > 0 && fConfig.spread">
			<ul class="calendar-week">
				<li v-for="item in fLabels.weeks" :key="item">{{ item }}</li>
			</ul>
		</div>
		<div class="calendar-body">
			<div class="calendar-content" v-if="fConfig.spread">
				<div class="calendar-item" v-for="(date,i) in dates" :key="i">
					<div class="calendar-item-header">
						<span>{{ date.year }}{{ fLabels.year }}{{ date.month }}{{ fLabels.month }}</span>
					</div>
					<ul class="days">
						<li :class="{ selected: day.selected, disabled: day.disabled, other: day.month !== date.month }" v-for="(day,idx) in date.days" :key="idx" @click="selectChange(day)">
							<div v-if="fConfig.fill">{{ day.date }}</div>
							<div v-else>{{ day.month == date.month ? day.date : '' }}</div>
							<div class="desc ignore" v-html="day.desc || ''"></div>
						</li>
					</ul>
				</div>
			</div>
			<div class="calendar-content" v-else>
				<div class="calendar-item">
					<div class="calendar-item-header">
						<div class="left iconfont icon-arrow-left" @click="monthChange(-1)"></div>
						<div class="center">{{ currentYear }}{{ fLabels.year }}{{ currentMonth }}{{ fLabels.month }}</div>
						<div class="right iconfont icon-arrow-right" @click="monthChange(1)"></div>
					</div>
					<ul class="calendar-week">
						<li v-for="item in fLabels.weeks" :key="item">{{ item }}</li>
					</ul>
					<ul class="days">
						<li :class="{ selected: day.selected, disabled: day.disabled, other: day.month !== currentMonth }" v-for="(day,idx) in dateMaps[`${currentYear}-${currentMonth}`] || []" :key="idx" @click="selectChange(day)">
							<div v-if="fConfig.fill">{{ day.date }}</div>
							<div v-else>{{ day.month == currentMonth ? day.date : '' }}</div>
							<div class="desc ignore" v-html="day.desc || ''"></div>
						</li>
					</ul>
				</div>
				
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: "vmCalendar",
	data (){
		return {
			fLabels: {},
			fConfig: {},
			dates: [],
			currentYear: new Date().getFullYear(),
			currentMonth: new Date().getMonth() + 1,
			dateMaps: {},
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
			spread: true,
			fill: false,
			multipleSelect: false,
			headerFixed: true,
			startYearMonth: `${nowYear}-${nowMonth}`,   // 2018-08 、2018/8、 2018,08
			endYearMonth: `${nowYear + 1}/${nowMonth}`,
			defaultYearMonth: `${nowYear},${nowMonth}`,
			customDays: [],
			cancelBtnColor:'#F58400',
			confirmBtnColor:'#F58400',
			globalDesc: ''
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
			let { startYearMonth, endYearMonth, defaultYearMonth, globalDesc, customDays, spread, fill } = config;
			let starts = this.dateTransform(startYearMonth),
				ends = this.dateTransform(endYearMonth),
				defaults = this.dateTransform(defaultYearMonth),
				sy = Number(starts[0]),
				sm = Number(starts[1]),
				ey = Number(ends[0]),
				em = Number(ends[1]),
				dir = ey != sy ? (ey - sy)/Math.abs(ey - sy) : ((em - sm)/Math.abs(em - sm) || 1);
			this.currentYear = Number(defaults[0]);
			this.currentMonth = Number(defaults[1]);
			
			(function buildDates(y,m,dr){
				let days = [],
					pr = m - dr, 
					nr = m + dr,
					py = pr >= 13 || pr <= 0 ? y - dr : y, 
					pm = pr >= 13 ? 1 : (pr <= 0 ? 12 : pr), 
					ny = nr >= 13 || nr <= 0 ? y + dr : y, 
					nm = nr >= 13 ? 1 : (nr <= 0 ? 12 : nr),
				    day = new Date(`${y},${m},1`).getDay();
				for(let i = 0;i < day;i++){
					days.push({
						year: py,
						month: pm,
						date: _t.getDays(py,pm) - (day - i - 1)
					});
				}
				for(let i = 1;i <= _t.getDays(y,m);i++){
					days.push({
						year: y,
						month: m,
						date: i
					});
				}
				let last = days.length % 7 == 0 ? 0 : (7 - days.length % 7);
				for(let i = 1;i <= last;i++){
					days.push({
						year: ny,
						month: nm,
						date: i
					});
				}
				days = days.reduce((res, cur) => {
					cur.desc = globalDesc;
					cur.disabled = false;
					cur.selected = false;
					customDays.forEach(d => {
						if(d.year == cur.year && d.month == cur.month && d.date == cur.date){
							cur.desc = d.desc;
							cur.disabled = !!d.disabled;
							cur.selected = !!d.selected;
						}
					});
					res.push(cur);
					return res;
				}, []);
				_t.dates.push({
					year: y,
					month: m,
					days: days
				});
				_t.dateMaps[`${y}-${m}`] = days;
				!(y == ey && m == em) && buildDates(ny, nm, dr);
			})(sy,sm,dir);
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
		monthChange(n){
			let dr = this.currentMonth + n;
			let nm = dr >= 13 ? 1 : (dr <= 0 ? 12 : dr);
			let ny = dr >= 13 ? (this.currentYear + 1) : (dr <= 0 ? (this.currentYear - 1) : this.currentYear)
			if(this.dateMaps[`${ny}-${nm}`]){
				this.currentYear = ny;
				this.currentMonth = nm;
			}
		},
		selectChange(day){
			if(!day.disabled){
				let _selected = {};
				this.selected = [];
				if(!this.fConfig.multipleSelect){
					this.dates.forEach(m => {
						m.days && m.days.forEach(d => {
							d.selected = false;
						});
					});
					for(let m in this.dateMaps){
						this.dateMaps[m].forEach(d => {
							d.selected = false;
						});
					}
				}
				if(this.fConfig.spread){
					this.dates.forEach(m => {
						m.days && m.days.forEach(d => {
							if(d.year == day.year && d.month == day.month && d.date == day.date){
								d.selected = !d.selected;
							}
							if(d.selected && !_selected[`${d.year}-${d.month}-${d.date}`]){
								_selected[`${d.year}-${d.month}-${d.date}`] = 1;
								this.selected.push(d);
							}
						});
					});
				}else{
					for(let m in this.dateMaps){
						this.dateMaps[m].forEach(d => {
							if(d.year == day.year && d.month == day.month && d.date == day.date){
								d.selected = !d.selected;
							}
							if(d.selected && !_selected[`${d.year}-${d.month}-${d.date}`]){
								_selected[`${d.year}-${d.month}-${d.date}`] = 1;
								this.selected.push(d);
							}
						});
					}
				}
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
		position: relative;
	}
	.calendar-fixed{
		padding-top: 160px;
	}
	.calendar ul{
		list-style: none;
	}
	.calendar-header,
	.calendar-week{
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
		padding: 16px 20px;
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
		min-height: 40px;
		padding: 1px;
		box-sizing: border-box;
		border-radius: 6px;
	}
	.calendar-item .days li .desc{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	.calendar-item .days li .ignore{
		bottom: -10px;
		font-size: 12px;
	}
	.calendar-item .days li.disabled{
		color: #666;
	}
	.calendar-item .days li.other{
		color: #ccc;
	}
	.calendar-item .days li.selected{
		background: #0084D7;
		color: #fff;
	}
	.calendar-item{
		margin-bottom: 20px;
	}
	.calendar-item-header{
		display: flex;
		padding-bottom: 10px;
		color: #999;
		border-bottom: 1px solid #f3f3f3;
	}
	.calendar-item-header .center{
		flex: 1;
		text-align: center;
	}
</style>