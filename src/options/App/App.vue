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
          this.getData(item.link)
        })
      }
    },
    getData(url) {
      this.judgeSiteByUrl(url)
    },

    judgeSiteByUrl(url) {
      let type = '';
      if (url.indexOf('aikahao.xcar.com.cn/item') > -1) {
        type = 'aikahao';
      }else if(url.indexOf('aikahao.xcar.com.cn/video') > -1) {
        type = 'aikahao_video'
      }else if(url.indexOf('acfun.cn') > -1) {
        type = 'acfun'
      }else if(url.indexOf('iqiyi.com') > -1) {
        type = 'iqiyi'
      }else if(url.indexOf('cheshihao.cheshi.com/news') > -1) {
        type = 'cheshihao'
      }else if(url.indexOf('cheshihao.cheshi.com/video') > -1) {
        type = 'cheshihao_video'
      }else if(url.indexOf('chexun.com') > -1) {
        type = 'chexun'
      }else if(url.indexOf('v.ifeng.com/c') > -1) {
        type = 'ifeng_video'
      }else if(url.indexOf('hj.pcauto.com.cn') > -1) {
        type = 'hj'
      }
      console.log("type: ", type);
    }
  },
  mounted() {
    let that = this;
    this.$http.get('http://hj.pcauto.com.cn/article/903912')
        .then(function (response) {
          console.log('response:', response)
          // let html = that.$dom.load(response.data)
          // let read = html('.browse_number').text().replace(/[^\d.]/g, "");
          // console.log('read：',read);
          // let author = html('.detail_txt_lf')
          //     .children('a')
          // .text().trim();
          // console.log('author',author)
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
          console.log('done');
        })
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
