import App from '@/App.vue'
import { createApp } from 'vue'
// Load the UI library, and the components will be registered global after the introduction. We can use it directly in any component
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import '@5a.css/reset';
import '@5a.css/helpers';
// import '@/assets/iconfont/iconfont.css'

// import * as a from './lib'
// console.log(a);
const app = createApp(App);
// Load UI
app.use(Antd);
app.mount('#app');
