<template>
  <div>
    <h1>订单查询</h1>

    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="ArraySize"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-table :stripe="true" class="table" 
      height="568"
      :border="true"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="orderId"
        label="订单ID"
        width="70">
      </el-table-column>
      <el-table-column
        prop="orderCode"
        label="订单编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="creatTime"
        label="创建日期"
        width="160">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="订单数量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="orderState"
        label="订单状态"
        width="80">
      </el-table-column>

      <el-table-column
        prop="furnitureId"
        label="家具ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="addressId"
        label="地址ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="userId"
        label="用户ID"
        width="80">
      </el-table-column>

      <el-table-column
        prop="orderComment"
        label="用户备注"
        width="180">
      </el-table-column>
      
    </el-table>
  </div>
</template>

<script>
import { GetOrderAllPage } from '@/api/table'
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      //分页查询的备选页面大小
      ArraySize:[5,7,10,50,100,300,500],
      //分页查询的页码、每页的大小、总记录条数
      page: 1,
      pageSize: 7,
      total: null,
    }
  },
  created() {
    //dom创建时触发请求数据的方法
    this.onload()
  },
  methods:{
    onload(){
      GetOrderAllPage(this.page,this.pageSize).then((response) => {
        console.log(response)
        const tableData = response.data.orders
        this.total = response.data.total
        this.tableData = tableData  
      })
    },
    handleSizeChange(val){
      // console.log(`分页大小发生了改变=>${val}`)
      this.pageSize = val
      this.onload()
    },
    handleCurrentChange(val){
      // console.log(`当前页码发生了改变=>${val}`)
      this.page = val
      this.onload()
    },
  }
}
</script>

<style>

</style>