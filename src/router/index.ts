import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MenuView from '@/views/menu/MenuView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/loginView.vue'
import RedirectView from '@/views/RedirectView.vue'
import OracleView from '@/views/script/database/OracleView.vue'
import MssqlView from '@/views/script/database/MssqlView.vue'
import PostgresView from '@/views/script/database/PostgresView.vue'
import MysqlView from '@/views/script/database/MysqlView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/token',
      name: 'token',
      component: RedirectView
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuView
    },
    {
      path: '/database',
      name: 'DataBase',
      children: [
        {
          path: '/database/oracle',
          name: 'Oracle',
          component: OracleView
        },
        {
          path: '/database/mssql',
          name: 'Mssql',
          component: MssqlView
        },
        {
          path: '/database/postgres',
          name: 'Postgres',
          component: PostgresView
        },
        {
          path: '/database/mysql',
          name: 'Mysql',
          component: MysqlView
        },
      ]
    }
  ]
})

export default router
