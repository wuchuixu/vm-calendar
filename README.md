# vm-calendar

> 这是一个基于vue 2.X的日历组件
> 
<p align="center">
   <a href="https://www.npmjs.com/package/ve-calendar"><img src="https://img.shields.io/npm/v/ve-calendar.svg?style=flat" alt="npm"></a>
   <a href="https://www.npmjs.com/package/ve-calendar"><img src="https://img.shields.io/npm/dm/ve-calendar.svg?style=flat" alt="npm"></a>
 </p>
 

## <a href="#">查看在线demo</a>


# 目前功能:
>1、显示所有月份或者单月
>
>2、全局设定每天的描述，也可单独设置
>
>3、暂只支持头部插槽
>
>4、支持单选或多选



## 快速开始

### 第一步:
``` sh
npm install vm-calendar --save
```
### 第二步，在你的vue页面里
``` js
import VmCalendar from "vm-calendar";

// in your vue <script>
export default {
    components: {
        VmCalendar
    }
}
```

### 第三步，加载模板:
``` html
<vm-calendar 
    :labels="labels"
    :config="config"
    @change="calendarChange"
    @cancel="calendarCancel"
    @confirm="calendarConfirm"
/>

```


## props参数

| 参数名称            | 类型    | 默认值              | 说明                                                                                                                                  |
| ------------------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| labels              | object  |                 | 
label配置，   year: '年' , month: '月', confirm: '确认', cancel: '取消', title: '选择日期', weeks:['日','一','二','三','四','五','六']                                                                                         |
| config              | object  |                 | 
 {
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
 }                                                                                      |

## 事件
| 名字             | 参数                   | 说明                                                  |
| ---------------- | ---------------------- | ---------------------------------------------------- |
| change           | { value }              | 选中日期发生改变时触发                                 |
| cancel           |                        | 取消触发                                              |
| confirm          | { value }              | 确认触发                                              |


## 插槽
| 名字                 | 参数                                           | 说明                                                                                                                                                                                                  |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| header               | slot-scope="{header}"                          | 用来替换头部区域          |                                                                                                                                                                            


## demo
``` html
<template>
    <div class="panel-calendar">
        <vm-calendar 
            :labels="labels"
            :config="config"
            @change="calendarChange"
            @confirm="getSelectDate"
        />
    </div>
</template>

<script>
    import VmCalendar from "vm-calendar"
    export default {
        components: {
            VmCalendar
        },
        mixins: [],
        data (){
            return {
                labels:{
                    weeks: ['周日','周一','周二','周三','周四','周五','周六']
                },
                config:{
                    startYearMonth: '2019/02',
                    endYearMonth: '2018,07',
                    spread: true,
                    fill: false,
                    multipleSelect: true,
                    customDays: [
                        {
                            year: 2018,
                            month: 8,
                            date: 1,
                            disabled: true,
                            desc: '<span style="color:blue;">啊</span><span style="color:red;">哈</span>'
                        },
                        {
                            year: 2018,
                            month: 8,
                            date: 2,
                            disabled: true,
                            desc: '禁用'
                        },
                        {
                            year: 2018,
                            month: 8,
                            date: 31,
                            disabled: true,
                            desc: '哈哈'
                        }
                    ]
                }
            }
        },
        methods: {
            calendarChange(value){
                console.log(value)
            },
            getSelectDate(value){
                console.log(value)
            }
        }
    }
</script>

<style>
</style>

```



## License

[MIT]
