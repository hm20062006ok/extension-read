<template>
  <div class="main_app">
    <el-row>
      <el-col :span="16">
        <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 10}"
            placeholder="粘贴链接到此处，然后点击右侧填充按钮"
            v-model="textarea">
        </el-input>
      </el-col>
      <el-col :span="8">
        <div class="btn-wrapper">
          <el-button type="primary" @click.native="fillData">填充</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="20">
        <el-button type="primary">识别</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
          :data="tableData"
          stripe
          style="width: 100%">
        <el-table-column
            prop="link"
            label="链接"
            width="380">
        </el-table-column>
        <el-table-column
            prop="site"
            label="平台">
        </el-table-column>
        <el-table-column
            prop="author"
            label="作者">
        </el-table-column>
        <el-table-column
            prop="read"
            label="阅读数">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      textarea: '',
      tableData: []
      // tableData: [{
      //   link: '2016-05-02',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   link: '2016-05-04',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1517 弄'
      // }, {
      //   link: '2016-05-01',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1519 弄'
      // }, {
      //   link: '2016-05-03',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1516 弄'
      // }]
    }
  },
  methods: {
    fillData() {
      this.tableData = []
      let links = this.textarea.trim().split(/[\s\n]/);
      links.forEach(link => {
        this.tableData.push({link: link})
      })
    }
  }
}
</script>

<style>
.main_app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.btn-wrapper {
  width: 100%;
  padding-left: 15px;
  display: flex;
  align-items: center;
  justify-content: left;
}
</style>
