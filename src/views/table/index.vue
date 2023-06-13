<template>
  <div class="app-container">
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
    <el-table
      height="600px"
      :stripe="true"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="35">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="ID" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.furnitureId }}
        </template>
      </el-table-column>

      <el-table-column label="家具缩略图" width="110" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.furnitureUrl"
            fit="fill">
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="家具名称" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.furnitureName }}
        </template>
      </el-table-column>
      <el-table-column label="原价" width="100" align="center">
        <template slot-scope="scope">
          <span>￥{{ scope.row.originPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="现价" width="100" align="center">
        <template slot-scope="scope">
          <span>￥{{ scope.row.furniturePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存量" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.furnitureQuantity }}
        </template>
      </el-table-column>
      <el-table-column label="商品描述" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.detailedInformation }}
        </template>
      </el-table-column>

      <el-table-column label="商品标签" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="OpenDialog(scope.row)" icon='el-icon-rank'>查看商品标签</el-button>
          <el-dialog :title="Nowtitle" :visible.sync="ArrVisible[scope.row.furnitureId]" width="65%">
              <el-transfer class="dialog-box"
                  style="text-align: left; display: inline-block; height: 400px;"
                  v-model="nowTag"
                  filterable
                  :titles="['可选标签', '拥有标签']"
                  :button-texts="['移到左边', '移到右边']"
                  :format="{
                    noChecked: '0/${total}',
                    hasChecked: '${checked}/${total}'
                  }"
                  @change="TagChange"
                  @left-check-change="leftCheckChange"
                  :data="ArrayTagInfo[scope.row.furnitureId]">
                  <span slot-scope="{ option }">{{ option.label }}</span>
                  <div slot="left-footer" class="button">
                    <el-button class="transfer-footer" @click="innerVisible = true" size="small" type="primary" icon="el-icon-plus">添加更多标签</el-button>
                    <el-button class="transfer-footer" @click="DeleteTag(scope.row)" size="small" type="danger" icon="el-icon-plus">删除已选标签</el-button>
                  </div>
                  <div slot="right-footer" class="button">
                    <el-button class="transfer-footer" @click="SaveTag(scope.row)" size="small" type="primary" icon="el-icon-check">保存标签</el-button>
                  </div>
                  <!-- <el-button class="transfer-footer" slot="right-footer" size="small" type="primary" icon="el-icon-check">重置</el-button> -->
              </el-transfer>
              <el-dialog
                width="30%"
                title="添加标签"
                :visible.sync="innerVisible"
                append-to-body>
                <el-form label-position="right" label-width="80px" :model="formLabelAlign" :rules="rules" ref="ruleForm">
                  <el-form-item label="标签名称" prop="tagName">
                    <el-input v-model="formLabelAlign.tagName"></el-input>
                  </el-form-item>
                  <el-form-item label="标签类型" prop="tagType">
                    <el-input v-model="formLabelAlign.tagType"></el-input>
                  </el-form-item>
                </el-form>
                <div class="button">
                  <el-button type="primary" @click="AddTag('ruleForm',scope.row)">提交这个标签</el-button>
                </div>
              </el-dialog>
          </el-dialog>
        </template>
      </el-table-column>
      
      <el-table-column label="基本信息操作" width="365" align="center"> 
        <template slot-scope="scope">
          <el-button type="primary" @click="AddImgById(scope.row)" icon="el-icon-circle-plus-outline">添加图片</el-button>
          <el-button type="warning" @click="UpdateById(scope.row)" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" @click="DeleteById(scope.row.furnitureId)" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog :title="title" :visible.sync="dialogPictureVisible">
      <span class="block" v-for="picture in pictures" :key="picture.pictureId">
        <el-image
          style="width: 100px; height: 100px; margin: 10px;"
          :src="picture.pictureUrl"
          :preview-src-list="pictureList"
          fit="fill"></el-image>
      </span>
        <el-form ref="form" label-width="80px">
          <el-row>
          <el-col :span="10">
            <el-upload class="avatar-uploader"
            action="自定义上传时无效，但保留该属性"
            accept=".jpg"
            auto-upload
            :http-request="Upload"
            :show-file-list="false">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { GetAllTag, GetList, GetTagById, SaveMapping, AddTag, DeleteTag, DeleteFurniture, AddPictureById, GetPictureById} from '@/api/table'

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
      listLoading: true,
      //是否显示添加图片的模态框
      dialogPictureVisible: false,
      title:"为XX添加图片",
      //当前模态框所属商品
      furnitureRow:null,
      //用户添加的图片file
      file:null,
      pictures:[
        {
          pictureId:'1',
          furnitureId:'1',
          pictureUrl:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          pictureId:'2',
          furnitureId:'1',
          pictureUrl:'https://delicious-blood.oss-cn-chengdu.aliyuncs.com/EB-furnitures/371edba9 40c9 47e9 819e c1593c566643-猫咪.jpg'
        },
        {
          pictureId:'3',
          furnitureId:'1',
          pictureUrl:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          pictureId:'4',
          furnitureId:'1',
          pictureUrl:'https://delicious-blood.oss-cn-chengdu.aliyuncs.com/EB-furnitures/371edba9 40c9 47e9 819e c1593c566643-猫咪.jpg'
        },
        {
          pictureId:'5',
          furnitureId:'1',
          pictureUrl:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          pictureId:'6',
          furnitureId:'1',
          pictureUrl:'https://delicious-blood.oss-cn-chengdu.aliyuncs.com/EB-furnitures/371edba9 40c9 47e9 819e c1593c566643-猫咪.jpg'
        },
      ],
      pictureList:[
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        'https://delicious-blood.oss-cn-chengdu.aliyuncs.com/EB-furnitures/371edba9 40c9 47e9 819e c1593c566643-猫咪.jpg',
        "https://delicious-blood.oss-cn-chengdu.aliyuncs.com/EB-furnitures/4aa0e81d 3c66 4ad8 aa43 4f2ad25c5e95-H.jpg"
      ],
      //是否显示模态框
      // dialogTableVisible: false,  会有同时所有模态框都打开的BUG，使用后面的ArrVisible数组来解决
      //是否显示内层模态框
      innerVisible: false,
      //当前模态框title
      Nowtitle: null,
      //分页查询的备选页面大小
      ArraySize:[3,4,5,10,50,100,300,500],
      //分页查询的页码、每页的大小、总记录条数
      page: 1,
      pageSize: 3,
      total: null,

      //所有的标签信息
      ArrayTagInfo :[],
      //打开模态框时查询到的拥有的Tag，可用于重置操作
      // haveTag:[],
      //当前含有的Tag，跟随页面当前情况变化
      nowTag:[],
      //每一个商品对应的模态框的是否开启属性都存在这里面
      ArrVisible:[],
      //手动记录左侧已勾选的元素，在下一次打开时，把他们对应类型的其他tag变为禁用，以解决的重新打开dialog之后上次勾选依然保留而带来的BUG
      //这里应该是一个嵌套数组
      Checked:[],

      //记录添加Tag时的数据
      formLabelAlign:{
        tagName:"",
        tagType:""
      },
      rules:{
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        tagType: [
          { required: true, message: '请输入标签类型', trigger: 'blur' }
        ],
      }
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
      GetList(this.page,this.pageSize).then(response => {
        // console.log(response)
        const furnitures = response.data.furnitures
        this.list = furnitures

        //类似哈希数组的思想，索引为ID值的空间内存，该ID对应的模态框的值
        const ArrVisible = []
        furnitures.forEach(F => {
          ArrVisible[F.furnitureId] = false
        })
        this.ArrVisible = ArrVisible

        this.total = response.data.total
        //记录总结果条数
        //结果返回之后不转圈了
        this.listLoading = false
      })
    },
    handleSizeChange(val){
      // console.log(`分页大小发生了改变=>${val}`)
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val){
      // console.log(`当前页码发生了改变=>${val}`)
      this.page = val
      this.fetchData()
    },



    UpdateById(){
      alert("修改")
    },
    DeleteById(furnitureId){
      var msg = "您真的确定要删除吗?请确认！"; 
      if (confirm(msg)==true){ 
        alert("删除")
        console.log(furnitureId)
        DeleteFurniture(furnitureId).then((response) => {
          console.log(response)
          this.fetchData()
        })
      }else{ 
        return
      }
    },

    //查询图片
    GetPictureData(){
      GetPictureById(this.furnitureRow.furnitureId).then((response) => {
        // console.log(response)
        this.pictures = response.data
        response.data.forEach(item => {
          this.pictureList.push(
            item.pictureUrl
          )
        })
      })
    },

    AddImgById(row){
      this.dialogPictureVisible = true
      this.furnitureRow = row
      this.title = `为<${row.furnitureName}>添加图片`
      //这里调用查询方法，查询该商品所有的图片
      this.GetPictureData()
    },

    Upload(upload){
      // alert("upload触发")
      console.log(this.furnitureRow)
      // console.log(upload)
      this.file = upload.file
      // console.log(this.file)
      if(this.file == null){
        alert("家具图片为空")
        this.$message({
        message: "请添加家具图片",
        type: 'error' 
        })
        return false
      }
      // alert("正在提交")
      let  formData = new FormData()
      formData.append("furnitureId", this.furnitureRow.furnitureId)
      formData.append("picture", this.file)
      AddPictureById(formData).then((response) => {
        console.log(response)
        this.$message({
        message: response.message,
        type: 'success'
        })
        // this.dialogPictureVisible = false
        this.GetPictureData()
      })
    },




    OpenDialog(row){
      //显示状态的变量更改
      this.ArrVisible[row.furnitureId] = true
      this.Nowtitle = row.furnitureName+"的标签"
      this.Checked = null
      // console.log(this.nowTag)
      // console.log(this.ArrayTagInfo)
      
      GetAllTag()
      .then(response => {
        //打补丁之，每个模态框定义独立的数据数组
        const trueIndex = this.ArrVisible.findIndex((item) => item === true);
        // console.log("当前打开的模态框ID:"+trueIndex)
        
        const data = response.data
        const ArrayTagInfo = [];
        for (let i = 0; i < data.length; i++) {
          ArrayTagInfo.push({
            key: data[i].tagId,
            label: `${ data[i].tagType }：${ data[i].tagName }`,
            disabled: false
          });
        }
        this.ArrayTagInfo[trueIndex] = ArrayTagInfo;
        //这里需要把nowtag先填满，这样每次切换模态框时，左侧的已勾选项都会被清除掉（因为左侧的勾的元素如果移动到右边，那么勾会消失）
        ArrayTagInfo.forEach(i=>{
          this.nowTag.push(i.key)
        })
      })
      //等查询到标签信息全部存储好之后，再进行操作
      .then(() => {
        // console.log(this.ArrayTagInfo)
        //查询该商品所拥有的标签，然后赋值给haveTag
        GetTagById(row.furnitureId).then(response => {
          const data = response.data
          // console.log(data)
          const Tags = [];
          //返回结果是商品所拥有的标签，遍历每一个标签拿到标签的ID
          //然后遍历ArrayTagInfo数组的每一个元素，每当这个元素的tagtype等于返回结果中的tagtype，就把这个标签设为不可点击
          //需要注意的是当前标签会移到右侧去，所以不应该设为不可点击
          // alert(1)
          for (let i = 0; i < data.length; i++) {
            Tags[i] = data[i].tagId
            //修改标签的是否禁用属性 disabled
            // const Items = this.ArrayTagInfo.filter(one => one.key === data[i].tagId)
            const trueIndex = this.ArrVisible.findIndex((item) => item === true);
            this.ArrayTagInfo[trueIndex].forEach(item => {
              // console.log(item.label)
              //截串到冒号之前
              const end = item.label.indexOf("：")//中文冒号
              var tagType = item.label.substring(0, end)
              if(tagType === data[i].tagType && item.key !== data[i].tagId){
                //默认情况所有数组是可选false，取反为true
                item.disabled = true
              }
            })
          }
          const trueIndex = this.ArrVisible.findIndex((item) => item === true);
          // console.log("当前模态框ID："+trueIndex)
          
          this.nowTag = Tags
          // console.log("当前value数组："+this.nowTag)
          // console.log(this.nowTag[trueIndex])
          // console.log(this.nowTag[row.furnitureId])
          
          // this.haveTag = Tags
          //优化左侧的显示
          this.TagLast(Tags)
        })
      })
      //最后处理二次打开模态框之后出现的BUG
      // .then(()=>{
      //   //先加入nowtag
      //   const trueIndex = this.ArrVisible.findIndex((item) => item === true);
      //   // console.log(this.Checked[trueIndex])
      //   // this.nowTag = this.nowTag.concat(this.Checked[trueIndex])
      //   for(var i in this.Checked[trueIndex]){
      //     this.nowTag.push(this.Checked[trueIndex][i]);
      //   }
      //   // console.log("当前value数组："+this.nowTag)
      //   // console.log(this.Checked[trueIndex])

      //   // console.log("当前打开的模态框ID:"+trueIndex)
      //   const checkedbox = this.Checked[trueIndex]
      //   console.log("此时的已选数组"+checkedbox)
      //   if(checkedbox!=null){
      //     checkedbox.forEach(B =>{
      //       console.log("nowTag"+this.nowTag)
      //       const X = this.nowTag.findIndex((item) => item === B)
      //       console.log("X"+X)
      //       if(X==-1){
      //         const Index = this.ArrayTagInfo[trueIndex].findIndex(i => i.key == B)
      //         const checkedTag = this.ArrayTagInfo[trueIndex][Index]
      //         //此次被选中的tag元素
      //         const end = checkedTag.label.indexOf("：")//中文冒号
      //         const checkedTagType = checkedTag.label.substring(0, end)
      //         // console.log("当前选中的TagType"+checkedTagType)
      //         //与此次勾选的标签类型相同的其他标签全部设为不可点击true
      //         this.ArrayTagInfo[trueIndex].forEach(item => {
      //           //截串到冒号之前
      //           // console.log(item.label)
      //           const end = item.label.indexOf("：")//中文冒号
      //           const tagType = item.label.substring(0, end)
      //           // console.log(item.key+"==="+item.disabled)
      //           if(tagType === checkedTagType && item.key !== checkedTag.key){
      //             item.disabled = true
      //           }
      //         })
      //       }
      //     })
      //   }

      //   //从nowtag移除，并恢复可选状态splice
      //   if(this.Checked[trueIndex]!=null){
      //     this.Checked[trueIndex].forEach(c=>{
      //       console.log(c)
      //       const Index = this.nowTag.findIndex(i => i == c)
      //       // console.log("Index:"+Index)
      //       if(Index!==-1){
      //         this.nowTag.splice(Index,1)
      //       }
      //     })
      //   }
      //   console.log(this.nowTag)
      // })
    },
    TagChange(A,B,C){
      // console.log("当前右侧的Key数组"+A)
      // console.log("数据移动的方向"+B)
      // console.log("发生移动的数据 key 数组"+C)
      const trueIndex = this.ArrVisible.findIndex((item) => item === true);
      if(B==="left"){
        //如果向左移动，就把所对应的封印的标签解开
        C.forEach(key => {
          const Index = this.ArrayTagInfo[trueIndex].findIndex(i => i.key == key)
          //根据Key依次获取每一个新加入左侧的的tag
          const newTag = this.ArrayTagInfo[trueIndex][Index].label
          const end = newTag.indexOf("：")//中文冒号
          const newTagType = newTag.substring(0, end)
          this.ArrayTagInfo[trueIndex].forEach(item => {
            //截串到冒号之前
            const end = item.label.indexOf("：")//中文冒号
            const tagType = item.label.substring(0, end)
            //拿到tagType
            if(tagType === newTagType){
              item.disabled = false
            }
          })
        })
      }else{
        this.Checked[trueIndex] = []
        // console.log(this.ArrayTagInfo)
        //如果向右移动，为了让操作更加人性化，在这里把已被封印的tag在ArrayTagInfo中移动到靠后的位置
        //用A可以轻松解决，右侧初始拥有的tag的类型，在左侧对应的tag没有后置的问题
        this.TagLast(A)
        // console.log(this.ArrayTagInfo)
      }
    },
    leftCheckChange(A,B){
      // console.log("已被勾选的标签的Key数组"+A)
      // console.log("此次勾选的标签的Key"+B)
      //存储已选的数组
      const trueIndex = this.ArrVisible.findIndex((item) => item === true);
      // console.log("当前打开的模态框ID:"+trueIndex)
      this.Checked = A
      console.log(this.Checked)
      //找到数组中key等于B的索引
      const Index = this.ArrayTagInfo[trueIndex].findIndex(i => i.key == B)
      const checkedTag = this.ArrayTagInfo[trueIndex][Index]
      //此次被选中的tag元素
      const end = checkedTag.label.indexOf("：")//中文冒号
      const checkedTagType = checkedTag.label.substring(0, end)
      // console.log("当前选中的TagType"+checkedTagType)
      //与此次勾选的标签类型相同的其他标签全部设为不可点击true
      this.ArrayTagInfo[trueIndex].forEach(item => {
        //截串到冒号之前
        // console.log(item.label)
        const end = item.label.indexOf("：")//中文冒号
        const tagType = item.label.substring(0, end)
        if(tagType === checkedTagType && item.key !== checkedTag.key){
          item.disabled = !item.disabled
          // console.log(item)
        }
      })
    },

    //把标签放到最后面
    TagLast(value){
      value.forEach(c => {
          // console.log(c)
          const trueIndex = this.ArrVisible.findIndex((item) => item === true);
          let index = this.ArrayTagInfo[trueIndex].findIndex(item => item.key === c)
          if (index !== -1) {
            let theTag = this.ArrayTagInfo[trueIndex][index]
            let end = theTag.label.indexOf("：")//中文冒号
            let theTagType = theTag.label.substring(0, end)
            // console.log(theTagType)
            //这里使用逆向循环，是因为splice方法删除该元素之后会影响后面所有元素的索引值(-1)
            for(let i = this.ArrayTagInfo[trueIndex].length-1; i>=0; i--){
              let item = this.ArrayTagInfo[trueIndex][i]
              // console.log(item)
              //截串到冒号之前
              let end = item.label.indexOf("：")//中文冒号
              let tagType = item.label.substring(0, end)
              //拿到tagType
              if(tagType === theTagType){
                let element = this.ArrayTagInfo[trueIndex].splice(i, 1)[0]; // 移除该元素并获取它
                // console.log(element)
                this.ArrayTagInfo[trueIndex].push(element); // 将该元素放到数组的末尾
              }
            }
          }
        })
    },

    AddTag(formName,row){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('提交成功!');
          //验证通过
          AddTag(this.formLabelAlign).then((response) => {
            console.log(response)
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.innerVisible = false
            this.ArrVisible[row.furnitureId] = false
            this.OpenDialog(row)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },

    DeleteTag(row){
      console.log(this.Checked)
      DeleteTag(this.Checked).then((response) => {
        console.log(response)
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.ArrVisible[row.furnitureId] = false
        this.OpenDialog(row)
      })
    },

    SaveTag(row){
      //需要额外写一个判断，如果nowtag跟havetag不同，才允许保存信息
      const trueIndex = this.ArrVisible.findIndex((item) => item === true);
      SaveMapping(row.furnitureId,this.nowTag).then((response) => {
        console.log(response)
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
  }
}
</script>

<style>
.button{
  display: flex;
  justify-content: center;
}

/*穿梭框内部展示列表的高宽度*/
.el-transfer-panel__list.is-filterable{
    width:300px;
    height:260px;
}
/*穿梭框外框高宽度*/
.el-transfer-panel{
    width: 300px;
    height: 600px;
}

.el-transfer-panel:first-child .el-checkbox{
  /*
    隐藏穿梭框左侧列表的全选框所在的容器，否则会出BUG，
    原因在于，我在leftCheckChange()里实现了同类型单选，导致全选会勾选多个同类型而出错
  */
  display: none;
}
</style>