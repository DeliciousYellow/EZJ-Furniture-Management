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

    <div class="table">
      <el-table :stripe="true" class="table" 
      height="568"
      :border="true"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="logId"
        label="日志ID"
        width="200">
      </el-table-column>
      <el-table-column
        prop="logTime"
        label="日志时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="operationType"
        label="操作类型"
        width="200">
      </el-table-column>
      <el-table-column
        prop="adminCode"
        label="操作员工号"
        width="200">
      </el-table-column>
      <el-table-column
        prop="adminName"
        label="操作员姓名"
        width="200">
      </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import { GetLogAllPage, GetAdminById } from '@/api/table'
export default {
  data() {
    return {
      //查询的日志表信息
      logData: [],
      tableData: [],
      //分页查询的备选页面大小
      ArraySize:[5,7,10,50,100,300,500],
      //分页查询的页码、每页的大小、总记录条数
      page: 1,
      pageSize: 10,
      total: null,
    }
  },
  created() {
    //dom创建时触发请求数据的方法
    this.onload()
  },
  methods:{
    onload(){
      GetLogAllPage(this.page, this.pageSize)
      .then((response) => {
        console.log(response);
        this.total = response.data.total;
        this.logData = response.data.orders;
        
        const promises = this.logData.map((item) => {
          return GetAdminById(item.adminId).then((res) => {
            item.adminName = res.data.adminName
            item.adminCode = res.data.adminCode
            item.adminAvatarUrl = res.data.adminAvatarUrl
          })
        })
        
        return Promise.all(promises)
      })
      .then(() => {
        this.tableData = this.logData;
        console.log(this.tableData);
      })
      .catch((error) => {
        console.error(error);
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
.block{
  margin-left: 40px;
}

.table{
  margin-left: 20px;
}
</style>