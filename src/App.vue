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
            <div id="menu">
              
            </div>
          </div>
        </div>
      </div>
    </nav>
    <RouterView id="main"/>
  </div >
</template>

<script lang="ts">
import { RouterView } from 'vue-router'
import { callAPI, Http } from './utils/common';

export default {
  data: () => {
    return {
      authServer: import.meta.env.VITE_APP_AUTH_URI,
      title: "슬기로운 개발자 생활",
      routeList: []
    };
  },
  methods: {
    makeMenu(upMenu: HTMLDivElement, data: any){
      let childrenCount = data.children.length;
      let level = data.level;

      if(childrenCount > 0){
        let div =  document.createElement('DIV') as HTMLDivElement;
        let check = document.createElement('INPUT') as HTMLInputElement;
        let label = document.createElement('LABEL') as HTMLLabelElement;
        let child = document.createElement('DIV') as HTMLDivElement;

        check.type = 'CHECKBOX';
        check.id = data.menuCd;
        check.name = data.menuCd;
        label.htmlFor = data.menuCd;
        label.textContent = data.menuName +"("+childrenCount+")";
        child.classList.add('childrenMenu');
        child.classList.add('row');

        div.appendChild(check);
        div.appendChild(label);
        div.appendChild(child);
        upMenu.append(div);
        upMenu.classList.add('parentMenu');
        upMenu.classList.add('row');

        data.children.forEach((item: any)=>{
          this.makeMenu(child, item);
        });
      }else{
        let label = document.createElement('LABEL') as HTMLLabelElement;
        let li = document.createElement('LI') as HTMLLIElement;
        let a = document.createElement('A') as HTMLAnchorElement;
        
        label.htmlFor=data.menuCd;
        label.textContent = data.menuName;
        a.href=data.url;
        a.id = data.menuCd;
        
        a.appendChild(label);
        li.appendChild(a);
        upMenu.appendChild(li);
      }
    }, getMenu(){
      let http = new Http();
      http.setParam(null);
      http.setUrl(this.authServer+'/api/menu/menuRoot.ajax');
      http.get();
      http.setSuccess((data: any)=>{
        this.makeMenu(document.getElementById("menu") as HTMLDivElement, data.menuRoot);
      });
      callAPI(http);
    }
  }, mounted(){
    this.getMenu();
  }
}
</script>

<style>

#main {
  margin-top: 20px;
}

.parentMenu{
  display: flex;
  flex-direction: column;
}

#menu INPUT[TYPE="CHECKBOX"]{
  display: none;
}


#menu INPUT[TYPE="CHECKBOX"]:checked~.childrenMenu{
  display: block;
}

.childrenMenu{
  display:none;
  margin-left: 1%;
}

.parentMenu li{
  list-style-type : none 
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