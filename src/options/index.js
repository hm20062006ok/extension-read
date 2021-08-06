import Vue from "vue";
import AppComponent from "./App/App.vue";

import 'element-ui/lib/theme-chalk/index.css';
Vue.component("app-component", AppComponent);
import {  Input,  Row,  Button,  Table, TableColumn,
  Col } from 'element-ui'
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use( Table)
Vue.use( TableColumn)
new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
