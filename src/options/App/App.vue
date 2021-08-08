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
        <el-button type="primary" @click.native="exportExcel">导出Excel</el-button>
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
        <el-table-column
            prop="status"
            label="状态">
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
    exportExcel(){
      import('./Export2Excel').then(excel => {
        console.log('Export2Excel')
        const tHeader = ['链接', '作者', '阅读数', '状态']
        const filterVal = [ 'link', 'author', 'read', 'status']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },

    fillData() {
      this.tableData = []
      let links = this.textarea.trim().split(/[\s\n]/);
      links.forEach(link => {
        this.tableData.push({link: link})
      })
    },
    async getAllData() {
      if (this.tableData.length > 0) {
        for (let i = 0; i < this.tableData.length; i++) {
          console.log(this.tableData[i].link)
          let result = await this.getData(this.tableData[i].link, i)
          this.$set(this.tableData[result.index], 'status', result.done)
          console.log('result', result)
          await this.sleeeep(5000)
          // console.log('next')
        }
      }
    },
    sleeeep(ms){
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    getData: function (url, index) {
      let that2 = this;
      return new Promise((resolve, reject) => {
        let that = that2;
        if (url.indexOf('chexun.com') > -1) {
          url = url.replace('www.', 'm.')
        }
        this.$http.get(url).then(function (response) {
          console.log('response:', response)
          if (url.indexOf('aikahao.xcar.com.cn/item') > -1) {
            that.handleAikaHao(response, index)
          } else if (url.indexOf('aikahao.xcar.com.cn/video') > -1) {
            that.handleAikaHaoVideo(response, index)
          } else if (url.indexOf('acfun.cn') > -1) {
            // TODO
          } else if (url.indexOf('iqiyi.com') > -1) {
            // TODO
          } else if (url.indexOf('cheshihao.cheshi.com/news') > -1) {
            that.cheShiHao(response, index)
          } else if (url.indexOf('cheshihao.cheshi.com/video') > -1) {
            that.cheShiHao(response, index)
          } else if (url.indexOf('chexun.com') > -1) {
            that.cheXun(response, index)
          } else if (url.indexOf('v.ifeng.com/c') > -1) {
            // TODO
          } else if (url.indexOf('hj.pcauto.com.cn') > -1) {
            that.hangjia(response, index)
          } else if (url.indexOf('toutiao.com') > -1) {
            //TODO
          } else if (url.indexOf('qctt.cn/news') > -1) {
            that.qctt(response, index)
          } else if (url.indexOf('qctt.cn/video') > -1) {
            that.qcttVideo(response, index)
          } else if (url.indexOf('auto-first.cn/news/') > -1) {
            // TODO
          } else if (url.indexOf('dripcar.com') > -1) {
            // TODO
          } else if (url.indexOf('sohu.com') > -1) {
            that.sohu(response, index)
          } else if (url.indexOf('yidianzixun.com') > -1) {
            // that.yidianzixun(response,index)
            //TODO
          } else if (url.indexOf('chejiahao.m.autohome.com.cn/partner/yidian') > -1) {
            that.yidianzixun(response, index)
          } else if (url.indexOf('youcheyihou.com') > -1) {
            that.youcheyihou(response, index)
          }
          resolve({index, done: '完成'})
        }).catch(function (error) {
          reject({index, done: '失败'})
          console.log(error);
        }).finally(function () {
          console.log('done');
        })
      })
    },
    youcheyihou(response, index) {
      let html = this.$dom.load(response.data)
      let author = html('.editor-title').text();
      this.$set(this.tableData[index], 'author', author)
    },
    yidianzixun(response, index) {
      let html = this.$dom.load(response.data)
      let author = html('.yidian-info').children().eq(0).text();
      this.$set(this.tableData[index], 'author', author)
    },
    sohu(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('.read-num').text().replace(/[^\d.]/g, "");
      this.$set(this.tableData[index], 'read', read)
      let author = html('.name.l').last().text()
      this.$set(this.tableData[index], 'author', author)
    },
    qcttVideo(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('.author-info').children().eq(1).text().replace(/[^\d.]/g, "");
      this.$set(this.tableData[index], 'read', read)
      let author = html('.author-info').children().eq(0).text()
      this.$set(this.tableData[index], 'author', author)
    },
    qctt(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('.author-info').children().eq(1).text().replace(/[^\d.]/g, "");
      this.$set(this.tableData[index], 'read', read)
      let author = html('.author-info').children().eq(0).text()
      this.$set(this.tableData[index], 'author', author)
    },
    hangjia(response, index) {

      let html = this.$dom.load(response.data)
      let read = html('.view').text().trim().replace('浏览：', '');
      this.$set(this.tableData[index], 'read', read)
      if (!read) {
        let read2 = html('.v-view').parent().text().trim()
        this.$set(this.tableData[index], 'read', read2)
      }


      let author = html('.name').text().trim();
      this.$set(this.tableData[index], 'author', author)

      if (!author) {
        let author2 = html('.channel').text().trim();
        this.$set(this.tableData[index], 'author', author2)
      }
    },
    cheXun(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('.works-txtimg-liulan').first().text()
      this.$set(this.tableData[index], 'read', read)
      let author = html('.v-a-name').text().trim();
      this.$set(this.tableData[index], 'author', author)
    },
    handleAikaHao(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('.browse_number').text().replace(/[^\d.]/g, "");
      this.$set(this.tableData[index], 'read', read)
      let author = html('.detail_txt_lf').children('a').text().trim();
      this.$set(this.tableData[index], 'author', author)
    },

    handleAikaHaoVideo(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('.browse_number').text().replace(/[^\d.]/g, "");
      this.$set(this.tableData[index], 'read', read)
      let author = html('.detail_txt_lf').children('a').text().trim();
      this.$set(this.tableData[index], 'author', author)
    },
    cheShiHao(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('.icon_browse').parent().text()
      this.$set(this.tableData[index], 'read', read)
      let author = html('.name').text().trim();
      this.$set(this.tableData[index], 'author', author)
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
