import { createApp } from 'vue';
// 导入自定义全局变量
import setGlobalProperties from '@/service/util/base';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

// 添加插件
import installElementPlus from './plugins/element';
import installFontawesomePlus from './plugins/fontawesome';
import './plugins/bootstrap';

const app = createApp(App);
installElementPlus(app);
installFontawesomePlus(app);
setGlobalProperties(app);
app.use(store)
  .use(router)
  .mount('#app');
