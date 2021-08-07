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
        <el-button type="primary" @click.native="getAllData">识别</el-button>
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
    }
  },
  methods: {
    fillData() {
      this.tableData = []
      let links = this.textarea.trim().split(/[\s\n]/);
      links.forEach(link => {
        this.tableData.push({link: link})
      })
    },
    getAllData() {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item, index) => {
          console.log(item.link)
          console.log(index)
          this.getData(item.link,index)
        })
      }
    },
    getData(url,index) {
      let that = this;
      //http://www.chexun.com/2021-08-05/113623283.html
      //http://m.chexun.com/2021-08-05/113623283.html
      if(url.indexOf('chexun.com') > -1){
        url = url.replace('www.','m.')
      }
      console.log('replaced url ',url)

      this.$http.get(url)
          .then(function (response) {
            console.log('response:', response)
            if (url.indexOf('aikahao.xcar.com.cn/item') > -1) {
              // type = 'aikahao';
              that.handleAikaHao(response,index)
            }else if(url.indexOf('aikahao.xcar.com.cn/video') > -1) {
              // type = 'aikahao_video'
              that.handleAikaHaoVideo(response,index)
            }else if(url.indexOf('acfun.cn') > -1) {
              // type = 'acfun'
            }else if(url.indexOf('iqiyi.com') > -1) {
              // type = 'iqiyi'
            }else if(url.indexOf('cheshihao.cheshi.com/news') > -1) {
              that.cheShiHao(response,index)
            }else if(url.indexOf('cheshihao.cheshi.com/video') > -1) {
              that.cheShiHao(response,index)
            }else if(url.indexOf('chexun.com') > -1) {
              that.cheXun(response, index)
            }else if(url.indexOf('v.ifeng.com/c') > -1) {
              // type = 'ifeng_video'
            }else if(url.indexOf('hj.pcauto.com.cn') > -1) {
              // type = 'hj'
            }
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .finally(function () {
            // always executed pageViewN

            console.log('done');
          })
    },
    cheXun(response, index){
      let html = this.$dom.load(response.data)
      let read = html('.works-txtimg-liulan').first().text()
      this.$set(this.tableData[index], 'read',read)
      let author = html('.v-a-name').text().trim();
      this.$set(this.tableData[index], 'author',author)
    },
    handleAikaHao(response,index){
      let html = this.$dom.load(response.data)
      let read = html('.browse_number').text().replace(/[^\d.]/g, "");
      this.$set(this.tableData[index], 'read',read)
      let author = html('.detail_txt_lf').children('a').text().trim();
      this.$set(this.tableData[index], 'author',author)
    },

    handleAikaHaoVideo(response,index){
      let html = this.$dom.load(response.data)
      let read = html('.browse_number').text().replace(/[^\d.]/g, "");
      this.$set(this.tableData[index], 'read',read)
      let author = html('.detail_txt_lf').children('a').text().trim();
      this.$set(this.tableData[index], 'author',author)
    },
    cheShiHao(response,index){
      let html = this.$dom.load(response.data)
      let read = html('.icon_browse').parent().text()
      this.$set(this.tableData[index], 'read',read)
      let author = html('.name').text().trim();
      this.$set(this.tableData[index], 'author',author)
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
