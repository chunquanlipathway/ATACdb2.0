import { createApp } from 'vue';
// Import custom global variables
import setGlobalProperties from '@/service/util/base';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

// Add plugin
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

