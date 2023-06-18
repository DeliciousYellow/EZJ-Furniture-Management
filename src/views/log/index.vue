<template>
  <div>
    <h1>日志查询</h1>

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
        prop="logId"
        label="日志ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="logTime"
        label="日志时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="operationType"
        label="操作类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="adminId"
        label="操作来源(AdminId)"
        width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetLogAllPage } from '@/api/table'
export default {
  data() {
    return {
      tableData: [],
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
      GetLogAllPage(this.page,this.pageSize).then((response) => {
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