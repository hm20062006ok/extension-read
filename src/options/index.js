import Vue from "vue";
import AppComponent from "./App/App.vue";
import axios from 'axios'
// import cheerio from 'cheerio'
const cheerio = require('cheerio');

import 'element-ui/lib/theme-chalk/index.css';
Vue.component("app-component", AppComponent);
import {  Input,  Row,  Button,  Table, TableColumn,  Message,
  Col } from 'element-ui'
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use( Table)
Vue.use( TableColumn)
Vue.prototype.$http = axios
Vue.prototype.$dom = cheerio
Vue.prototype.$message = Message;
new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});

