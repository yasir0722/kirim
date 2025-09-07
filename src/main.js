import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import GroceryList from './components/GroceryList.vue'
import AddItem from './components/AddItem.vue'
import Settings from './components/Settings.vue'

const routes = [
  { path: '/', redirect: '/groceries' },
  { path: '/groceries', component: GroceryList, meta: { title: 'Grocery List' } },
  { path: '/add', component: AddItem, meta: { title: 'Add Item' } },
  { path: '/settings', component: Settings, meta: { title: 'Settings' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - Grocery Tracker` : 'Grocery Tracker'
})

const app = createApp(App)
app.use(router)
app.mount('#app')
