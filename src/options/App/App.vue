<template>

  <el-tabs v-model="activeName" type="border-card" tab-position="left">
    <el-tab-pane label="爬取阅读数" name="first">
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
              <el-button type="primary" @click.native="fillDataJSON">填充JSON数据</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="20">
            <el-button type="primary" @click.native="getAllData2">识别</el-button>
            <el-button type="primary" @click.native="exportExcel">导出Excel</el-button>
            <el-button type="primary" @click.native="manualGetData">手动获取数据</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-table
              :data="tableData"
              stripe
              style="width: 100%">
            <el-table-column
                prop="brand"
                label="品牌">
            </el-table-column>
            <el-table-column
                prop="model"
                label="车型">
            </el-table-column>
            <el-table-column
                prop="author"
                label="作者">
            </el-table-column>
            <el-table-column
                prop="platform"
                label="平台">
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题">
            </el-table-column>
            <!--<el-table-column-->
            <!--    prop="date"-->
            <!--    label="时间">-->
            <!--</el-table-column>-->
            <el-table-column
                prop="url"
                label="链接">
            </el-table-column>
            <el-table-column
                prop="read"
                label="阅读数">
            </el-table-column>
            <el-table-column
                prop="id"
                label="ID">
            </el-table-column>
          </el-table>
        </el-row>
      </div>
    </el-tab-pane>
    <el-tab-pane label="搜狗巡检" name="second">
      <el-row>
        <el-col :span="8">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
          </el-checkbox>
        </el-col>
        <el-col :span="4">补充关键字</el-col>
        <el-col :span="8" :offset="4" style=" display: flex; justify-content: center; align-items: center">开始</el-col>
      </el-row>

      <div style="margin: 15px 0;"></div>
      <el-row>
        <el-col :span="8">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="4">
          <el-input
              type="textarea"
              placeholder="输入要补充的关键字，有多个关键字时请以回车换行来分隔"
              :autosize="{ minRows: 4, maxRows: 10}"
              v-model="keywords">
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-edit"  @click="addKeyword">添加</el-button>
        </el-col>
        <el-col :span="8">
          <div style="height: 50px; display: flex; justify-content: center; align-items: center">
            <el-button type="primary" icon="el-icon-search" @click="startSpam">开始巡检</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="20">
          <el-button type="primary" @click.native="exportExcel2">导出Excel</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="soguoData" stripe style="width: 100%;margin-top: 40px">

          <el-table-column prop="keyword" label="关键字"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="summary" label="摘要"></el-table-column>
          <el-table-column prop="date" label="时间"></el-table-column>
          <el-table-column prop="url" label="链接"></el-table-column>

        </el-table>
      </el-row>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
const cityOptions = [
  'GL8', 'GL6', '微蓝6', '微蓝7', '昂科威', '昂科威plus', '昂科拉', '威朗', '昂科雷', '君越', '君威',
  '威朗pro', '英朗', '阅朗', '凯越', '畅巡', '开拓者', '科鲁泽', '科鲁兹',
  '科沃兹 ', '科尔维特', '库罗德', '科迈罗', '探界者', '迈锐宝XL', '沃兰多', '探界者 ', 'CT4',
  'CT5', 'CT6', 'XT4', 'XT5', 'XT6', '凯雷德', 'Lyriq', '上汽通用1.5T', '别克', '雪弗兰', '凯迪拉克'
];
export default {
  name: 'app',
  data() {
    return {
      keywords: '',
      activeName: 'first',
      textarea: '',
      tableData: [],
      soguoData: [],
      sendData: [],
      accessId: '',
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: false,
      sogouId: ''
    }
  },
  methods: {
    startSpam(){
      console.log(this.checkedCities)
      if( this. checkedCities.length > 0)
        this.$http.post('http://localhost:3000/', {keywords: JSON.stringify(this.checkedCities)}, {}).then(response => {
          console.log(response)
          if (response.data.success) {
            this.$message({
              message: response.data.msg,
              type: 'success'
            });
            this.sogouId = response.data.id
            setTimeout(function (obj) {
              let intervId = setInterval(function () {
                obj.that.$http.get('http://localhost:3000/query?id=' + obj.id).then(response => {
                  if (response.data.success) {
                    console.log('已完成' + response.data.data)
                    let arr = []
                    response.data.data.map(keywordData => {
                      keywordData.map(record => {
                        arr.push(record)
                      })
                    })
                    obj.that.soguoData = arr
                    // obj.that.tableData = arr.sort(function (pre, next) {
                    //   return pre.id - next.id
                    // })
                    clearInterval(intervId)
                    obj.that.$message({
                      message: response.data.msg,
                      type: 'success'
                    });

                  } else {
                    if (response.data.code === 201) {
                      let arr = []
                      response.data.data.map(keywordData => {
                        keywordData.map(record => {
                          arr.push(record)
                        })
                      })
                      obj.that.soguoData = arr
                      console.log("xxxxxxxxxxxxx" + response.data.msg + ": " + response.data.completed + "/" + response.data.total)
                      obj.that.$message(response.data.msg + ": " + response.data.completed + "/" + response.data.total);
                    } else {
                      obj.that.$message(response.data.msg);
                    }
                    console.log('未完成')
                  }
                })
                console.log('id: ', obj.id)
              }, 10 * 1000, obj)
            }, 30 * 1000, {that: this, id: response.data.id})
          } else {
            this.$message({
              message: response.data.msg
            });
          }
        })
    },
    addKeyword(){
      if (this.keywords.length > 0) {
        let keywordsArr = this.keywords.trim().split(/[\s\n]/);
        if(keywordsArr && keywordsArr.length > 0){
          this.checkedCities.push(...keywordsArr)
          this.cities.push(...keywordsArr)
        }
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },

    handleCheckedCitiesChange(value) {
      console.log(this.checkedCities)
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    manualGetData() {
      if (this.accessId) {
        this.$http.get('http://localhost:3000/users/query?id=' + this.accessId).then(response => {
          if (response.data.success) {
            console.log('已完成' + response.data.data)
            let arr = []
            response.data.data.map(record => {
              arr.push(record)
            })
            this.tableData = arr.sort(function (pre, next) {
              return pre.id - next.id
            })
          } else {
            if (response.data.code === 201) {
              let arr = []
              response.data.data.map(record => {
                arr.push(record)
              })
              this.tableData = arr.sort(function (pre, next) {
                return pre.id - next.id
              })
              this.$message(response.data.msg + ": " + response.data.completed + "/" + response.data.total);
            }
          }
        })
      } else {
        this.$message({
          message: '没有id',
          type: 'success'
        });
      }
    },
    getAllData2() {
      this.$http.post('http://localhost:3000/users', {urls: JSON.stringify(this.sendData)}, {}).then(response => {
        console.log('response', response)
        if (response.data.success) {
          this.$message({
            message: response.data.msg,
            type: 'success'
          });
          this.accessId = response.data.id
          setTimeout(function (obj) {
            let intervId = setInterval(function () {
              obj.that.$http.get('http://localhost:3000/users/query?id=' + obj.id).then(response => {
                if (response.data.success) {
                  console.log('已完成' + response.data.data)
                  let arr = []
                  response.data.data.map(record => {
                    arr.push(record)
                  })
                  obj.that.tableData = arr.sort(function (pre, next) {
                    return pre.id - next.id
                  })
                  clearInterval(intervId)
                  obj.that.$message({
                    message: response.data.msg,
                    type: 'success'
                  });

                } else {
                  if (response.data.code === 201) {
                    let arr = []
                    response.data.data.map(record => {
                      arr.push(record)
                    })
                    obj.that.tableData = arr.sort(function (pre, next) {
                      return pre.id - next.id
                    })
                    console.log("xxxxxxxxxxxxx" + response.data.msg + ": " + response.data.completed + "/" + response.data.total)
                    obj.that.$message(response.data.msg + ": " + response.data.completed + "/" + response.data.total);
                  } else {
                    obj.that.$message(response.data.msg);
                  }
                  console.log('未完成')
                }
              })
              console.log('id: ', obj.id)
            }, 10 * 1000, obj)
          }, 30 * 1000, {that: this, id: response.data.id})
        } else {
          this.$message({
            message: response.data.msg
          });
        }
      }).catch(error => {
        console.log('error', error)
      })
    },

    fillDataJSON() {
      this.tableData = JSON.parse(this.textarea).data.sort(function (pre, next) {
        return pre.id - next.id
      })
    },
    fillData() {
      this.sendData = this.textarea.trim().split(/[\s\n]/);
      let links = this.textarea.trim().split(/[\s\n]/);
      this.tableData = []
      links.forEach((link, index) => {
        this.tableData.push({url: link, id: index})
      })
      console.log(JSON.stringify(this.tableData))
    },
    exportExcel2(){
      import('./Export2Excel').then(excel => {
        const tHeader = ['关键字', '标题', '摘要', '时间', '链接']
        const filterVal = ['keyword', 'title', 'summary', 'date', 'url']
        const list = this.soguoData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'sogou_data',
          autoWidth: this.autoWidth
        })

      })
    },
    exportExcel() {
      import('./Export2Excel').then(excel => {
        console.log('Export2Excel')
        const tHeader = ['品牌', '车型', '作者', '平台', '标题', '链接', '阅读数', 'ID']
        // /    "url": "https://www.sohu.com/a/483131806_120369718",
        //     "read": "66",
        //     "author": "车车车",
        //     "platform": "搜狐自媒体",
        //     "title": "20万元内最速量产车 迈锐宝XL浙赛一战封神_雪佛兰",
        //     "brand": "",
        //     "model": "",
        //     "isVideo": false,
        //     "id": 0,
        //     "remark": ""
        const filterVal = ['brand', 'model', 'author', 'platform', 'title', 'url', 'read', 'id']
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
        } else if (url.indexOf('new.qq.com') > -1) {
          //http://new.qq.com/omn/20210810/20210810A0DLQ400
          //https://xw.qq.com/cmsid/20210811A02JG500?f=newdc
          let arr = url.split('/')
          let xxx = arr[arr.length - 1]
          url = "https://xw.qq.com/cmsid/" + xxx + "?f=newdc"
          console.log("requestUrl", url)
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
            // that.iqiyi(response, index)
          } else if (url.indexOf('cheshihao.cheshi.com/news') > -1) {
            that.cheShiHao(response, index)
          } else if (url.indexOf('cheshihao.cheshi.com/video') > -1) {
            that.cheShiHao(response, index)
          } else if (url.indexOf('chexun.com') > -1) {
            // that.cheXun(response, index)
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
            that.sohu(response, index, url)
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
          } else if (url.indexOf('chejiahao.autohome.com.cn') > -1) {
            that.chejiahao(response, index)
          } else if (url.indexOf('3g.k.sohu.com') > -1) {
            that.sohu3g(response, index)
          } else if (url.indexOf('k.sina.cn') > -1) {
            that.sina(response, index)
          } else if (url.indexOf('xw.qq.com') > -1) {
            // that.qqNews(response, index)
          }
          resolve({index, done: '完成'})
        }).catch(function () {
          reject({index, done: '失败'})
        }).finally(function () {
          console.log('done');
        })
      })
    },
    qqNews(response, index) {
      let html = this.$dom.load(response.data)
      let author = html('.media-name').text()
      this.$set(this.tableData[index], 'author', author)
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
    sohu(response, index) {
      let html = this.$dom.load(response.data)
      let read = html('.read-num').text().replace(/[^\d.]/g, "");
      this.$set(this.tableData[index], 'read', read)
      console.log('sohu read', read)
      // debugger
      if (!read) {
        let read = html('.l.read-num').text().replace(/[^\d.]/g, "");
        this.$set(this.tableData[index], 'read', read)
      }

      let author = html('.name.l').last().text()
      this.$set(this.tableData[index], 'author', author)
      if (!author) {
        let author = html('user-info').children().eq(1).children().eq(0).text()
        this.$set(this.tableData[index], 'author', author)
      }
      let id = html('#sohuVideoBox').attr('id')
      if (id) {
        this.$set(this.tableData[index], 'isVideo', '视频')
      } else {
        this.$set(this.tableData[index], 'isVideo', '文章')
      }

      if (!read) {
        // this.requestAgain(this,index,url.replace('www.','m.'))
        // let read = html('.read-num').children().first().text()
        // this.$set(this.tableData[index], 'read', read)
      }
      console.log('id', id)
    },
    requestAgain(that, index, url) {
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
