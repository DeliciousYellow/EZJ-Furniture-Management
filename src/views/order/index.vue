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

    <div class="table">
      <el-table :stripe="true" class="table" 
      height="568"
      :border="true"
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
      <!-- 展开后的显示 -->
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="家具缩略图">
            <el-image
            style="width: 100px; height: 100px"
            :src="props.row.furnitureUrl"
            fit="fill">
          </el-image>
          </el-form-item>
          <el-form-item label="家具名称">
            <span>{{ props.row.furnitureName }}</span>
          </el-form-item>
          <el-form-item label="收货人姓名">
            <span>{{ props.row.consigneeName }}</span>
          </el-form-item>
          <el-form-item label="收货人电话">
            <span>{{ props.row.consigneeNumber }}</span>
          </el-form-item>
          <el-form-item label="收货人地址">
            <span>{{ props.row.address }}</span>
          </el-form-item>
          <el-form-item label="下单用户">
            <span>{{ props.row.nickName }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <!-- 展开前的显示 -->
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
  </div>
</template>

<script>
import { GetOrderAllPage, GetFurnitureById, GetAddressById, GetUserById } from '@/api/table'
export default {
  data() {
    return {
      //查询的订单数据
      orderData: [],
      //渲染表格的数据
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
    onload() {
      GetOrderAllPage(this.page, this.pageSize)
        .then((response) => {
          console.log(response);
          this.total = response.data.total;

          const orderData = response.data.orders;
          this.orderData = orderData;

          const furniturePromises = orderData.map((item) => {
            return GetFurnitureById(item.furnitureId)
              .then((res) => {
                item.furnitureName = res.data.furnitureName;
                item.furnitureUrl = res.data.furnitureUrl;
              });
          });

          const addressPromises = orderData.map((item) => {
            return GetAddressById(item.addressId)
              .then((res) => {
                // console.log(res)
                if(res.data!=null){
                  item.consigneeName = res.data.consigneeName
                  item.consigneeNumber = res.data.consigneeNumber
                  item.address = res.data.addressRegion + res.data.addressDetail
                }
              })
          });

          const userPromises = orderData.map((item) => {
            return GetUserById(item.userId)
              .then((res) => {
                item.nickName = res.data.nickName
              });
          });

          const allPromises = [...furniturePromises, ...addressPromises, ...userPromises]

          return Promise.all(allPromises)
        })
        .then(() => {
          console.log('循环查询结束')
          this.tableData = this.orderData;
          console.log(this.tableData);
        })
        .catch((error) => {
          console.log('出错')
          console.error(error);
        });
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

.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>