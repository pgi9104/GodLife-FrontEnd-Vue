<style scoped>

#main {
  margin-top: 20px;
}

@media (min-width: 360px) {
  /* 모바일 */
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

@media (min-width: 768px) {
  /* 테블릿 */
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

@media (min-width: 1024px) {
  /* 데스크탑 */
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

<template>
  <div class="min-width">
    <header>

    </header>
  
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">{{ title }}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">{{ title }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <form class="d-flex mt-3" role="search">
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-success" type="submit">Search</button>
            </form>
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3" id="menu">
              
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <RouterView id="main"/>
  </div >
</template>

<script lang="ts">
import { RouterView } from 'vue-router'
import { Menu, MenuBuilder } from './api/menu/types/menu';

export default {
  data: () => {
    return {
      title: "슬기로운 개발자 생활",
      routeList: [
        new MenuBuilder().path("/").name("HOME").build(),
        new MenuBuilder().path("/about").name("ABOUT").build(),
        new MenuBuilder().path("/opensource").name("OpenSource")
          .addChild(new MenuBuilder().path(import.meta.env.VITE_APP_REDMINE_URI as string).name("RedMine").build())
          .addChild(new MenuBuilder().path(import.meta.env.VITE_APP_GRAFANA_URI as string).name("Grafana").build())
          .addChild(new MenuBuilder().path(import.meta.env.VITE_APP_GITLAB_URI as string).name("Gitlab").build())
          .addChild(new MenuBuilder().path(import.meta.env.VITE_APP_HARBOR_URI as string).name("Harbor").build())
          .addChild(new MenuBuilder().path(import.meta.env.VITE_APP_JENKINS_URI as string).name("Jenkins").build())
          .build(),
        new MenuBuilder().path("/database").name("DATABASE")
          .addChild(new MenuBuilder().path("/database/oracle").name("Oracle").build())
          .addChild(new MenuBuilder().path("/database/mysql").name("Mysql").build())
          .addChild(new MenuBuilder().path("/database/mssql").name("Mssql").build())
          .addChild(new MenuBuilder().path("/database/postgres").name("Postgres").build())
          .build()
      ]
    };
  },
  methods: {
    makeMenu(upMenu: HTMLUListElement, menus: Menu[]){
      // 라우팅의 매핑여부를 확인하는 유효성체크
      if(upMenu == null || !(upMenu instanceof HTMLUListElement) ) return console.log('is Not Valid parents');
      if(menus.length < 0) return console.log('menuList is Empty');

      menus.forEach(menu => {
        let children = menu.getChildren() as Menu[];
        let hasChildren = typeof children !== 'undefined' && children != null && children.length > 0;

        let li = document.createElement('li');
        li.className = 'nav-item';

        if(hasChildren){
          li.className = 'nav-item dropdown';

          let a = document.createElement('a');
          a.className='nav-link dropdown-toggle';
          if(a instanceof HTMLAnchorElement){
            a.href='#';
            a.setAttribute('data-bs-toggle', 'dropdown');
            a.ariaExpanded = 'false';
            a.role='butten';
            a.textContent=menu.getName();
          }

          let ul = document.createElement('ul');
          ul.className = 'dropdown-menu dropdown-menu-dark';

          li.appendChild(a);
          li.appendChild(ul);

          this.makeMenu(ul, children);
        } else {
          let routerLink = document.createElement('a');
          routerLink.className = 'nav-link';
          routerLink.textContent = menu.getName();
          routerLink.href=menu.getPath();
          routerLink.ariaCurrent='page';

          li.appendChild(routerLink);      
        }

        upMenu.appendChild(li);
      })
    },

    getId(id:string){
      return document.getElementById(id);
    }
  },
  mounted(){
      this.makeMenu(this.getId('menu') as HTMLUListElement, this.routeList as Menu[]);
  }
}
</script>