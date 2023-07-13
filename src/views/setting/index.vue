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
      <el-col :offset="2" :span="18" style="margin-top:100px">
        <div class="dashboard-text">
          头像：{{ avatar }}
          <el-upload
            class="avatar-uploader"
            :action="url"
            :headers="token"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            accept=".jpg,.jpeg,.png">
            <img v-if="imageUrl" :src="avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import { getInfo } from '@/api/user'
export default {
  computed: {
    ...mapGetters([
      'name',
      'code',
      'avatar'
    ]),
  },
  data() {
    return {
      url:`${process.env.VUE_APP_BASE_API}/Admin/UpdataAdminAvatar`,
      imageUrl: '',
      token:{
        'X-Token':getToken()
      }
    }
  },
  mounted(){
    this.imageUrl = this.avatar
  },
  methods:{
    ...mapMutations(['SET_NAME', 'SET_CODE', 'SET_AVATAR']),
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log(res)
      getInfo(getToken()).then((response) => {
        // 更新 Vuex 中的值
        // 更新 name、code、avatar 的值
        this.$store.commit('user/SET_NAME', response.data.adminName)
        this.$store.commit('user/SET_CODE', response.data.adminCode)
        this.$store.commit('user/SET_AVATAR', response.data.adminAvatarUrl)
        Message({
          message: '修改头像成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style>
.box{
  margin: 30px;
}
.dashboard-text{
  font-size: 30px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>