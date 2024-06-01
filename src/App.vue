<template>
  <header>
    <HeaderComponent :title="state.title"/>
  </header>

  <nav class="navbar navbar-dark bg-dark">
    <Nav :id="state.title"></Nav>
  </nav>
  <main>
    <RouterView id="main"/>
  </main>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { callAPI, Http } from './utils/common';
import HeaderComponent from '@/components/header/HeaderComponent.vue'
import Nav from '@/components/nav/Nav.vue'
import { onMounted, reactive } from 'vue';
import { useTokenStore } from './stores/tokenStore';

const router = useRouter();
const token = useTokenStore();
const state = reactive({
  authServer: import.meta.env.VITE_APP_AUTH_URI,
  title: "Portfolio",
  routeList: []
});

const makeMenu: any = (upMenu: HTMLDivElement, data: any) => {
  let childrenCount = data.children.length;

  if(childrenCount > 0){
    let div =  document.createElement('DIV') as HTMLDivElement;
    let check = document.createElement('INPUT') as HTMLInputElement;
    let label = document.createElement('LABEL') as HTMLLabelElement;
    let child = document.createElement('DIV') as HTMLDivElement;

    check.type = 'CHECKBOX';
    check.id = data.menuCd;
    check.name = data.menuCd;
    check.checked=true;
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
      makeMenu(child, item);
    });
  }else{
    let label = document.createElement('LABEL') as HTMLLabelElement;
    let li = document.createElement('LI') as HTMLLIElement;
    let a = document.createElement('A') as HTMLAnchorElement;
    
    label.htmlFor=data.menuCd;
    label.textContent = data.menuName;
    a.id = data.menuCd;
    a.onclick = () =>{
      router.push((data.url as string));
    }
    
    a.appendChild(label);
    li.appendChild(a);
    upMenu.appendChild(li);
  }
};

const getMenu = () => {
  let http = new Http();
  http.setParam(null);
  http.addHeader("Authorization","Bearer "+token.storeToken);
  http.setUrl(state.authServer+'/api/menu/menuRoot.ajax');
  http.get();
  http.setSuccess((data: any)=>{
    data.menuRoot.children.forEach((e: any) => {
      makeMenu(document.getElementById("menu") as HTMLDivElement, e);
    });
  });
  callAPI(http);
};

onMounted(() => {
  getMenu();
});
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
  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

@media (min-width: 768px) {
  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>