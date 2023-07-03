<template>
  <div class="parent">
    <el-row :gutter="20" class="child-1">
      <el-col :offset="1" :span="17"><h2 class="head">家具操作</h2></el-col>
      <el-col :span="6"><el-button class="head" type="primary" @click="dialogFormVisible=true" style="margin:30px 0 0 0">添加家具</el-button></el-col>
      <el-dialog title="添加家具" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="家具名称" prop="furnitureName">
            <el-input v-model="form.furnitureName"></el-input>
          </el-form-item>
          <el-form-item label="家具原价" prop="originPrice">
            <el-input v-model="form.originPrice"></el-input>
          </el-form-item>
          <el-form-item label="家具现价" prop="furniturePrice">
            <el-input v-model="form.furniturePrice"></el-input>
          </el-form-item>
          <el-form-item label="库存量" prop="furnitureQuantity">
            <el-input v-model="form.furnitureQuantity"></el-input>
          </el-form-item>
          <el-form-item label="家具描述" prop="detailedInformation">
            <el-input v-model="form.detailedInformation"></el-input>
          </el-form-item>
          <el-row>
          <el-col :span="3">
            <h3>家具缩略图</h3>
          </el-col>
          <el-col :span="9">
            <el-upload class="avatar-uploader"
            action="自定义上传时无效，但保留该属性"
            accept=".jpg,.jpeg,.png"
            auto-upload
            :http-request="Upload"
            :on-change="handleFileChange"
            :show-file-list="false">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
          <el-col :span="10" :offset="2" style="margin-top:10%">
            <el-form-item>
              <el-button type="primary"  @click="onSubmit('form')">立即添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        </el-form>
      </el-dialog>
    </el-row>
    <Atable class="child" ref="atable"></Atable>
  </div>
</template>

<script>
import Atable from "@/views/table"
import { AddFurniture } from "@/api/table"
export default {
    components:{
      Atable
    },
    data(){
      return{
        dialogFormVisible:false,
        form: {
          furnitureName:'',
          originPrice:null,
          furniturePrice:null,
          furnitureQuantity:null,
          detailedInformation:'',
        },
        file:null,
        rules: {
          furnitureName: [
            { required: true, message: '请输入家具名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          originPrice: [
            { required: true, message: '请输入家具原价', trigger: 'blur' },
            {
              pattern: /^(\d+(\.\d{1,2})?|\d+)$/,
              message: '请输入有效的数字',
              trigger: 'blur'
            }
          ],
          furniturePrice: [
            { required: true, message: '请输入家具现价', trigger: 'blur' },
            {
              pattern: /^(\d+(\.\d{1,2})?|\d+)$/,
              message: '请输入有效的数字',
              trigger: 'blur'
            }
          ],
          furnitureQuantity: [
            { required: true, message: '请输入家具库存量', trigger: 'blur' },
            {
              pattern: /^(\d+(\.\d{1,2})?|\d+)$/,
              message: '请输入有效的数字',
              trigger: 'blur'
            }
          ],
          detailedInformation: [
            { required: true, message: '请输入家具描述信息', trigger: 'blur' },
          ]
        },
        //这个Url用来渲染界面
        imageUrl:""
      }
    },
    methods:{
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.file == null){
              // alert("家具图片为空")
              this.$message({
              message: "请添加家具图片",
              type: 'error' 
              })
              return false
            }
            console.log('submit!')
            let  formData = new FormData()
            formData.set("img", this.file)
            formData.set("furnitureName", this.form.furnitureName)
            formData.set("originPrice", this.form.originPrice)
            formData.set("furniturePrice", this.form.furniturePrice)
            formData.set("furnitureQuantity", this.form.furnitureQuantity)
            formData.set("detailedInformation", this.form.detailedInformation)

            // formData.forEach(function(value,key){
            //     console.log(key,value);
            // })
            // console.log("----------------------------------");
            AddFurniture(formData).then((response) => {
              console.log(response)
              this.$message({
              message: response.message,
              type: 'success'
              })
              this.dialogFormVisible = false
              this.$refs.atable.fetchData()
            })
            .catch((error) => {
              this.$message({
              message: "请检查家具信息格式是否正确",
              type: 'error'
              })
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      Upload(upload){
        // alert("upload触发")
        // console.log(upload); // 完整的File对象
      },
      handleFileChange(file) {
        // alert("change触发")
        console.log(file); // 完整的File对象
        this.file = file.raw

        if(window.FileReader) {
          var fr = new FileReader();
          fr.readAsDataURL(this.file);
          fr.onload = (e) => {
            // console.log(e.target); // e.target返回FileReader对象,里面包含：事件，状态，属性，结果等

            // console.log(e.target.result); // 读取的结果，dataURL格式的
            
            this.imageUrl = e.target.result; // 图片可显示出来
          }
        } else {
          alert('暂不支持FileReader')
        }
      }
    }
}
</script>

<style>

body {
  overflow: hidden;
}

.parent {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 设置父组件的高度为视窗高度 */
}

.child-1{
  height: 45px;
}

.child {
  flex: 1; /* 共同占满父组件的剩余空间 */
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