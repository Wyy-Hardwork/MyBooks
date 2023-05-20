<template>
  <div class="st-table">
    <div style="font-size: 25px; color: #4c4c4c;padding:20px" class="el-icon-edit-outline">
      书籍编辑
    </div>
<div class="table-edit">
    <el-table :data="tableData" border class="border-edit">
      <el-table-column prop="id" label="ID" width="90" align="center">
        <template slot-scope="scope">
          <!-- <el-input type="text" v-model="scope.row.id" v-show="scope.row.iseditor" /> -->
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="书名" align="center">
        <template slot-scope="scope">
          <el-input type="text" v-model="scope.row.name" v-show="scope.row.iseditor" />
          <span v-show="!scope.row.iseditor">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格/元" width="80" align="center">
        <template slot-scope="scope">
          <el-input type="text" v-model="scope.row.price" v-show="scope.row.iseditor" />
          <span v-show="!scope.row.iseditor">{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" align="center">
        <template slot-scope="scope">
          <el-input type="text" v-model="scope.row.author" v-show="scope.row.iseditor" />
          <span v-show="!scope.row.iseditor">{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="publisher" label="出版社" align="center">
        <template slot-scope="scope">
          <el-input type="text" v-model="scope.row.publisher" v-show="scope.row.iseditor" />
          <span v-show="!scope.row.iseditor">{{scope.row.publisher}}</span>
        </template>
      </el-table-column>      
      <el-table-column prop="date" label="出版日期" width="100" align="center">
        <template slot-scope="scope">
          <el-input type="text" v-model="scope.row.date" v-show="scope.row.iseditor" />
          <span v-show="!scope.row.iseditor">{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tag3" label="三级标签" align="center">
        <template slot-scope="scope">
          <el-input type="text" v-model="scope.row.tag3" v-show="scope.row.iseditor" />
          <span v-show="!scope.row.iseditor">{{scope.row.tag3}}</span>
        </template>
      </el-table-column>    
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button v-show="!scope.row.iseditor" type="warning" @click="edit(scope.row, scope)">编辑</el-button>
          <el-button v-show="scope.row.iseditor" type="danger" @click="save(scope.row)">保存</el-button>
        </template>
      </el-table-column>        
    </el-table>
    </div>
  </div>
</template>
<script>
import request from "../api/request";
import { useStore } from "@/store/index";
export default {
  data() {
    return {
      tableData:[]
    };
  },
  methods: {
    edit(row, index) {
      row.iseditor = true;
    },
    async save(row, index) {
      row.iseditor = false;
      let result = await request.post('/base/admin/2',{
        id : row.id,
        name : row.name,
        price : row.price,
        author : row.author,
        publisher : row.publisher,
        date : row.date,
        tag3 : row.tag3,
      })
      if(result.data == 'edit success'){
        this.$message.success('修改成功')
      }else{
        this.$message.error(result.data)
      }
      this.getBook()
    },
    // 完成编辑以及input为空时默认
    async getBook(){
      let mainStore = useStore()
      if (mainStore.search == ''){
      let result = await request('/base/admin/0')
      for (let key of result.data) {
        key['iseditor'] = false
        key.date = key.date.replace('T16:00:00.000Z','')
      }
      this.tableData = result.data
      }else{
      let result = await request.post('/base/admin/1',{search:mainStore.search})
      for (let key of result.data) {
        key['iseditor'] = false
        key.date = key.date.replace('T16:00:00.000Z','')
      }
      this.tableData = result.data
      }
    },
    async editBook(row){
      // let result = await request('/base/admin/2')
    }
  },
  mounted() {
    this.getBook()
  },
  computed:{
    tableData1:{
      get() {
        let mainStore = useStore();
        return mainStore.tableData1;
      },
      set(val) {},
    }
  },
  watch:{
    tableData1(){
      this.tableData = []
      this.tableData = this.tableData1
    }
  }
};
</script>
<style>
/* 标题和table大盒子 */
.st-table {
  display: inline-block;
  width: calc(100% - 12vw);
  margin-left: 1%;
}
/* table盒子 */
.table-edit{
 width: calc(100% - 1vw);
 margin-left: 1%;
}
/* 改table样式找我 */
.border-edit{
 border-radius: 5px;
}
@media (max-width: 736px) {
.st-table {
  width: calc(100% - 94px);
  margin-left: 84px;
}
}
</style>