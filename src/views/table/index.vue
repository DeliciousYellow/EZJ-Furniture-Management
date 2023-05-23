<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="家具名称" width="110">
        <template slot-scope="scope">
          {{ scope.row.furnitureName }}
        </template>
      </el-table-column>
      <el-table-column label="原价" width="110" align="center">
        <template slot-scope="scope">
          <span>￥{{ scope.row.originPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="现价" width="110" align="center">
        <template slot-scope="scope">
          <span>￥{{ scope.row.furniturePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存量" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.furnitureQuantity }}
        </template>
      </el-table-column>

      <el-table-column label="商品标签" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.furnitureQuantity }}
        </template>
      </el-table-column>

      <el-table-column label="图片" width="110" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.furnitureUrl"
            fit="fill">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品描述" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.detailedInformation }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.furnitureId }}
          <el-button type="warning" @click="UpdateById">修改</el-button>
          <el-button type="danger" @click="DeleteById">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    //dom创建时触发请求数据的方法
    this.fetchData()
  },
  methods: {
    fetchData() {
      //发请求的时候显示转圈
      this.listLoading = true
      //发请求
      getList().then(response => {
        console.log(response)
        this.list = response.data
        //结果返回之后不转圈了
        this.listLoading = false
      })
    },
    UpdateById(){
      alert("修改")
    },
    DeleteById(){
      alert("删除")
    }
  }
}
</script>
