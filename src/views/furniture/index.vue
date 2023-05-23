<template>
  <div class="box">
    <h1>家具操作</h1>
    <Atable></Atable>
  </div>
</template>

<script>
import Atable from "@/views/table"
export default {
    components:{
      Atable
    }
}
</script>

<style>
.box{
  margin: 30px;
}
</style>