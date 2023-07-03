<template>
  <div class="box">
    <h1>个人设置</h1>
    <el-row :gutter="20">
      <el-col :span="10" :offset="2">
        <div class="dashboard-text">姓名: {{ name }}</div>
      </el-col>
      <el-col :span="12">
        <div class="dashboard-text">工号: {{ code }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'name',
      'code'
    ])
  },
}
</script>

<style>
.box{
  margin: 30px;
}
</style>