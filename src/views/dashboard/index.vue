<template>
  <div>
    <div>
      <el-row :gutter="20">
        <el-col :span="10">
          <div style="width: 100%; display: inline-block; margin-top: 80px;">
            <el-statistic @finish="hilarity" :value="deadline1" time-indices title="限时秒杀剩余时间">
              <template slot="suffix">
                <div style ="margin-left: 30px"><el-button type="primary" size="small" @click="add">增加十秒</el-button></div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="sales-analytics" style="margin-left:200px">
            <div class="chart-container">
              <div style="margin-left:25%">
                <el-select v-model="value" placeholder="重新选择渲染类型" filterable @change="TagChange">
                  <el-option-group
                    v-for="group in options"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
                <el-button type="primary" icon="el-icon-thumb" @click="NextTag">切换</el-button>
              </div>
              <div class="chart" ref="pieChart"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="sales-analytics">
      <div class="chart-container">
        <div class="chart" ref="barChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
import { GetFurnitureByTag, GetTagByType , GetTypeAll, GetAllTag } from "@/api/table"

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'code'
    ])
  },
  data() {
    return {
      deadline1: Date.now() + 1000 * 60 * 60 * 8,
      deadline2: Date.now() + (new Date().setHours(23, 59, 59) - Date.now()),

      arrTag:[],//所有的标签
      responseData: [],
      pieData: [], // 饼图数据
      pieOptions: {}, // 饼图配置项

      //饼图和条形图的实例
      barChart:null,
      pieChart:null,

      xAxisData:null,
      salesData:null,
      stockData:null,
      amountData:null,

      options: [
        {
          label: '热门城市',
          options: [{
            value: 'Shanghai',
            label: '上海'
          }, {
            value: 'Beijing',
            label: '北京'
          }]
        },
        {
          label: '城市名',
          options: [{
            value: 'Chengdu',
            label: '成都'
          }, {
            value: 'Shenzhen',
            label: '深圳'
          }, {
            value: 'Guangzhou',
            label: '广州'
          }, {
            value: 'Dalian',
            label: '大连'
          }]
        }
      ],
      value: ''
    }
  },
  mounted() {
    this.renderBarChart()
    GetAllTag().then((response) => {
      console.log(response)
      // 创建一个哈希对象来存储分组后的数据
      const groupedData = []
      response.data.forEach((item) => {
        const label = item.tagType
        // 检查哈希对象中是否已经存在以 label 为键的数组
        if (!groupedData[label]) {
          // 如果不存在，则创建一个空数组
          groupedData[label] = []
        }
        // 将当前元素添加到对应的数组中
        groupedData[label].push({
          value: item.tagName,
          label: item.tagType+':'+item.tagName,
        })
        //在这里把所有的标签存到一个额外的数组里，用于切换按钮遍历，缺点是相同类型的标签并未严格相邻
        this.arrTag.push(item.tagName)
      })
      // // 将哈希对象转换为数组形式，以便在模板中使用
      this.options = Object.entries(groupedData).map(([label, options]) => ({
        label,
        options,
      }))
      // this.options = groupedData
      console.log(this.options)
    })
  },
  methods: {
    NextTag() {
      if(this.value == '' || this.value == null || this.value == undefined) {
        this.value = "促销"
      }
      let index = this.arrTag.indexOf(this.value)
      // 随机值
      // this.value = this.arrTag[Math.floor(Math.random() * this.arrTag.length) + 0];
      // 逐个遍历
      this.value = this.arrTag[index+1 >= this.arrTag.length ? 1 : index+1]
      this.TagChange()
    },
    TagChange() {
      console.log(this.value)
      this.renderBarChart()
    },
    hilarity() {
      this.$notify({
        title: '提示',
        message: '限时秒杀已结束',
        duration: 0,
      })
    },
    add() {
      this.deadline1 = this.deadline1 + 1000 * 10;
    },
    renderPieChart() {
      if (this.pieChart) {
        this.pieChart.dispose()
      }
      let quantity1 = 0
      let quantity2 = 0
      let quantity3 = 0
      let quantity4 = 0
      let quantity5 = 0
      this.responseData.forEach((item) => {
        // console.log(item)
        const price = item.furniturePrice
        const count = item.salesVolume
        if(0<price && price<=100){
          quantity1 += count
        }else if(100<price && price<=300){
          quantity2 += count
        }else if(300<price && price<=1000){
          quantity3 += count
        }else if(1000<price && price<=3000){
          quantity4 += count
        }else{
          quantity5 += count
        }
      })
      const priceRanges = [
        { range: '0-100', quantity: quantity1 },
        { range: '101-300', quantity: quantity2 },
        { range: '301-1000', quantity: quantity3 },
        { range: '1001-3000', quantity: quantity4 },
        { range: '3000以上', quantity: quantity5 },
      ];

      // 构造饼图数据
      this.pieData = priceRanges.map(item => ({
        value: item.quantity,
        name: item.range,
      }))

      const allZero = this.pieData.every(item => item.value === 0);
      // 创建饼图的配置项
      const pieOptions = {
        title: {
          text: '各价位家具销量分布',
          subtext: '该饼图表示不同价格区间的销量情况',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: 0,
          top: 10,
          data: this.pieData.map(item => item.name),
        },
        series: [
          {
            name: '价格区间占比',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            selected: {
              0: false, // 将第一个扇区设置为不选中
            },
            itemStyle: {
              color: allZero ? 'gray' : '' // 如果所有部分的值都为0，则将颜色设置为灰色
            },
          },
        ],
      };

      // 使用 options 对象来渲染饼图
      const chart = echarts.init(this.$refs.pieChart);
      chart.setOption(pieOptions);
    },
    
    renderBarChart() {
      if (this.barChart) {
        this.barChart.dispose()
      }
      let tag = '促销'
      if(this.value !== '' && this.value !== null && this.value !== undefined) {
        tag = this.value
      }
      GetFurnitureByTag(tag).then((response) => {
        console.log(response.data)
        this.responseData = response.data
        const data = response.data
        this.renderPieChart()
        // 准备数据
        this.xAxisData = data.map(item => item.furnitureName)
        this.salesData = data.map(item => item.salesVolume)
        this.stockData = data.map(item => item.furnitureQuantity)
        this.amountData = data.map(item => item.furniturePrice * item.salesVolume)

        // 初始化和配置图表
        const barChart = echarts.init(this.$refs.barChart)
        const options = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['销量', '库存', '销售金额']
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              formatter: function(value) {
                if (value.length > 6) {
                  return value.substring(0, 6) + '...';
                }
                return value;
              }
            },
            data: this.xAxisData
          },
          yAxis: [
            {
              type: 'value',
              name: '销量',
              min: 0,
              max: 1800,
              interval: 200, // 设置数值区间的间隔为50
              nameTextStyle: {
                fontSize: 20,
              },
            },
            {
              type: 'value',
              name: '库存',
              min: 0,
              max: 1800,
              interval: 200, // 设置数值区间的间隔为50
              nameTextStyle: {
                fontSize: 20,
              },
            },
            {
              type: 'value',
              name: null,
              min: 0,
              axisLabel: {
                rotate: 45,
                show: false // 隐藏折线图边缘的数值显示
              },
            }
          ],
          series: [
            {
              name: '销量',
              type: 'bar',
              data: this.salesData,
              label: {
                show: true,
                position: 'top',
                formatter: '{c}',
              },
            },
            {
              name: '库存',
              type: 'bar',
              yAxisIndex: 1,
              data: this.stockData,
              label: {
                show: true,
                position: 'top',
                formatter: '{c}',
              },
            },
            {
              name: '销售金额',
              type: 'line',
              yAxisIndex: 2,
              data: this.amountData,
              label: {
                show: true,
                position: 'top',
                formatter: '{c}',
              },
            }
          ]
        }
        // 根据数据数量调整图表显示
        if (data.length > 10) {
          options.dataZoom = {
            type: 'slider',
            show: true,
            start: 50,
            end: 90,
            xAxisIndex: [0],
            handleSize: 12,
            height: '10%',
            bottom: '10%'
          }
        }
        // 渲染图表
        barChart.setOption(options)
        this.barChart = barChart
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}
.sales-analytics {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 340px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
