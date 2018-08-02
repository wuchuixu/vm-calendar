# vm-calendar

> 这是一个基于vue 2.X的日历组件
> 
## 预览
![Alt text](https://github.com/wuchuixu/vm-calendar/blob/master/static/images/demo1.jpg)
![Alt text](https://github.com/wuchuixu/vm-calendar/blob/master/static/images/demo2.jpg)

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
<script>
import VmCalendar from "vm-calendar";

export default {
    components: {
        VmCalendar
    }
}
</script>
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

| 参数名称               | 类型    | 默认值               |说明                                                                             |
| --------------------- | ------- | ------------------- | ------------------------------------------------------------------------------- |
| labels                | object  |                     |                                                                                 |
| labels.year           | string  |     年              |                                                                                 |
| labels.month          | string  |     月              |                                                                                 |
| labels.confirm        | string  |     确认            |                                                                                 |
| labels.cancel         | string  |     取消            |                                                                                 |
| labels.title          | string  |     选择日期         |                                                                                 |
| labels.weeks          | array   | ['日','一','二','三','四','五','六']  |                                                                |
| config                | object  |                     |                                                                                 |
| config.spread         | boolean |      true            |  是否显示所有月份                                                                |
| config.fill           | boolean |      false           |  每月是否填充完整                                                                |
| config.multipleSelect | boolean |      false           |  是否多选                                                                       |
| config.headerFixed    | boolean |      true            |  头部固定定位                                                                   |
| config.startYearMonth | string  |      当前年月         |  开始日期   支持  yyyy-MM 、yyyy/MM、 yyyy,MM                                      |
| config.endYearMonth   | string  |      当前年月加一年   |   结束日期   支持  yyyy-MM 、yyyy/MM、 yyyy,MM                                      |
|config.defaultYearMonth| string  |      当前年月         |   默认日期   支持  yyyy-MM 、yyyy/MM、 yyyy,MM                                      |
| config.customDays     | array   |      []              |   自定义日期  { year: 2018,month: 8,date: 2,disabled: true,selected: false,desc: '禁用' }                                   |
| config.cancelBtnColor | string  |      #F58400         |   取消按钮颜色                                                                     |
| config.confirmBtnColor| string  |      #F58400         |   确认按钮颜色                                                                     |
| config.globalDesc     | string  |                      |   全局desc                                                                       |


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
