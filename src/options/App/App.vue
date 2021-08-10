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
            prop="isVideo"
            label="类型">
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
    exportExcel() {
      import('./Export2Excel').then(excel => {
        console.log('Export2Excel')
        const tHeader = ['链接', '作者', '阅读数', '状态']
        const filterVal = ['link', 'author', 'read', 'status']
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
          let result = await this.getData(this.tableData[i].link, i).catch(err => {
            this.$set(this.tableData[result.index], 'status', err.done)
          })
          this.$set(this.tableData[result.index], 'status', result.done)
          console.log('result', result)
          await this.sleeeep(5000)
          // console.log('next')
        }
      }
    },
    sleeeep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    getData: function (url, index) {
      let that2 = this;
      return new Promise((resolve, reject) => {
        let that = that2;
        if (url.indexOf('chexun.com') > -1) {
          url = url.replace('www.', 'm.')
        } else if (url.indexOf('iqiyi.com') > -1) {
          url = url.replace('www.', 'm.')
        } else if (url.indexOf('toutiao.com') > -1) {
          url = url.replace('www.', 'm.')
        }


        this.$http.get(url).then(function (response) {
          console.log('response:', response)
          if (url.indexOf('aikahao.xcar.com.cn/item') > -1) {
            that.handleAikaHao(response, index)
          } else if (url.indexOf('aikahao.xcar.com.cn/video') > -1) {
            that.handleAikaHaoVideo(response, index)
          } else if (url.indexOf('acfun.cn') > -1) {
            that.acfun(response, index)
          } else if (url.indexOf('iqiyi.com') > -1) {
            that.iqiyi(response, index)
          } else if (url.indexOf('cheshihao.cheshi.com/news') > -1) {
            that.cheShiHao(response, index)
          } else if (url.indexOf('cheshihao.cheshi.com/video') > -1) {
            that.cheShiHao(response, index)
          } else if (url.indexOf('chexun.com') > -1) {
            that.cheXun(response, index)
          } else if (url.indexOf('v.ifeng.com') > -1) {
            // TODO
          } else if (url.indexOf('hj.pcauto.com.cn') > -1) {
            that.hangjia(response, index)
          } else if (url.indexOf('toutiao.com') > -1) {
            that.toutiao(response, index)
          } else if (url.indexOf('qctt.cn/news') > -1) {
            that.qctt(response, index)
          } else if (url.indexOf('qctt.cn/video') > -1) {
            that.qcttVideo(response, index)
          } else if (url.indexOf('auto-first.cn/news/') > -1) {
            // TODO
          } else if (url.indexOf('www.sohu.com') > -1) {
            that.sohu(response, index,url)
          } else if (url.indexOf('yidianzixun.com') > -1) {
            // that.yidianzixun(response,index)
            //TODO
          } else if (url.indexOf('chejiahao.m.autohome.com.cn/partner/yidian') > -1) {
            that.yidianzixun(response, index)
          } else if (url.indexOf('youcheyihou.com') > -1) {
            that.youcheyihou(response, index)
          } else if (url.indexOf('v.qq.com') > -1) {
            that.Vqq(response, index)
          } else if (url.indexOf('dripcar.com') > -1) {
            that.dripcar(response, index)
          } else if (url.indexOf('myzaker.com') > -1) {
            that.myzaker(response, index)
          } else if (url.indexOf('laosiji.com') > -1) {
            that.laosiji(response, index)
          }else if (url.indexOf('chejiahao.autohome.com.cn') > -1) {
            that.chejiahao(response, index)
          }else if (url.indexOf('3g.k.sohu.com') > -1) {
            that.sohu3g(response, index)
          }else if (url.indexOf('k.sina.cn') > -1) {
            that.sina(response, index)
          }
          resolve({index, done: '完成'})
        }).catch(function () {
          reject({index, done: '失败'})
        }).finally(function () {
          console.log('done');
        })
      })
    },

    sina(response, index) {
      let html = this.$dom.load(response.data)
      let author = html('.weibo_user').text()
      this.$set(this.tableData[index], 'author', author)
      // let read = html('.articleTag').children().eq(1).text().replace(/[^\d.]/g, "");
      // this.$set(this.tableData[index], 'read', read)
    },
    sohu3g(response, index) {
      let html = this.$dom.load(response.data)
      let author = html('.name').children().eq(0).text()
      this.$set(this.tableData[index], 'author', author)
      // let read = html('.articleTag').children().eq(1).text().replace(/[^\d.]/g, "");
      // this.$set(this.tableData[index], 'read', read)
    },
    chejiahao(response, index) {
      let html = this.$dom.load(response.data)
      let author = html('.articleTag').children().eq(0).text()
      this.$set(this.tableData[index], 'author', author)
      let read = html('.articleTag').children().eq(1).text().replace(/[^\d.]/g, "");
      this.$set(this.tableData[index], 'read', read)
    },
    laosiji(response, index) {
      let html = this.$dom.load(response.data)
      let author = html('.author-name').children().eq(0).text()
      this.$set(this.tableData[index], 'author', author)
    },
    myzaker(response, index) {
      let html = this.$dom.load(response.data)
      let author = html('.article-auther').text()
      this.$set(this.tableData[index], 'author', author)
    },
    dripcar(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('.middle').children().eq(1).text()
      this.$set(this.tableData[index], 'read', read)
      let author = html('.time').text().split('|')[0]
      this.$set(this.tableData[index], 'author', author)
    },
    toutiao(response, index) {
      //TODO
      let html = this.$dom.load(response.data)
      let read = html('.videoDesc__videoStatics').children().eq(0).text()
      // let read = html('.short-video-mask-bottom-name').children().eq(0).text()
      this.$set(this.tableData[index], 'read', read)
      // let author = html('.user__name').text()
      let author = html('.short-video-mask-bottom-name').text()
      this.$set(this.tableData[index], 'author', author)
    },
    iqiyi(response, index) {
      //TODO  还不行
      let html = this.$dom.load(response.data)
      let read = html('.c-num').text()
      this.$set(this.tableData[index], 'read', read)
      let author = html('.data-userName').text()
      this.$set(this.tableData[index], 'author', author)
    },
    acfun(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('.viewsCount').text()
      this.$set(this.tableData[index], 'read', read)
      let author = html('.up-name').text()
      this.$set(this.tableData[index], 'author', author)
    },
    Vqq(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('#mod_cover_playnum').text()
      this.$set(this.tableData[index], 'read', read)
    },
    youcheyihou(response, index) {
      let html = this.$dom.load(response.data)
      // let author = html('.editor-title').text();
      let author = html('.news-detail__summary').children().eq(0).text();
      this.$set(this.tableData[index], 'author', author)
    },
    yidianzixun(response, index) {
      let html = this.$dom.load(response.data)
      let author = html('.yidian-info').children().eq(0).text();
      this.$set(this.tableData[index], 'author', author)
    },
    sohu(response, index,url) {
      let html = this.$dom.load(response.data)
      let read = html('.read-num').text().replace(/[^\d.]/g, "");
      this.$set(this.tableData[index], 'read', read)
      console.log('sohu read', read)
      // debugger
      if(!read){
        let read = html('.l.read-num').text().replace(/[^\d.]/g, "");
        this.$set(this.tableData[index], 'read', read)
      }

      let author = html('.name.l').last().text()
      this.$set(this.tableData[index], 'author', author)
      if(!author){
        let author = html('user-info').children().eq(1).children().eq(0).text()
        this.$set(this.tableData[index], 'author', author)
      }
      let id = html('#sohuVideoBox').attr('id')
      if (id){
        this.$set(this.tableData[index], 'isVideo', '视频')
      }else{
        this.$set(this.tableData[index], 'isVideo', '文章')
      }

      if(!read){
        // this.requestAgain(this,index,url.replace('www.','m.'))
        // let read = html('.read-num').children().first().text()
        // this.$set(this.tableData[index], 'read', read)
      }
      console.log('id',id)
    },
    requestAgain(that, index,url){
      let that2 = that;
      return new Promise((resolve, reject) => {
        let that = that2;
        this.$http.get(url).then(function (response) {
          let html = that.$dom.load(response.data)
          let author = html('#authorWrapper').children().eq(1).text()
          that.$set(that.tableData[index], 'author', author)
          let read = html('#videoPv').text()
          that.$set(that.tableData[index], 'read', read)
          that.$set(that.tableData[index], 'isVideo', '视频')
          resolve({index, done: '完成'})
        }).catch(function () {
          reject({index, done: '失败'})
        }).finally(function () {
          console.log('done');
        })
      })
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
