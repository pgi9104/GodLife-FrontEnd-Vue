<script setup lang="ts">
import BtnAdd from '@/components/elements/button/BtnAdd.vue'
import BtnDel from '@/components/elements/button/BtnDel.vue'
import BtnSave from '@/components/elements/button/BtnSave.vue'
import BtnGet from '@/components/elements/button/BtnGet.vue'

const props = defineProps(['add','get','save','del', 'menuName']);
</script>

<template>
  <header class="fnbox">
    <div class="col-6 left-box">
      <label>{{ menuName }}</label>
    </div>
    <div class="col-6 right-box">
      <input type="text" id="searchTxt" :on-keydown="get"/>
      <BtnGet :onclick=get></BtnGet>
      <BtnAdd :onclick=add></BtnAdd>
      <BtnDel :onclick=del></BtnDel>
      <BtnSave :onclick=save></BtnSave>
    </div>
  </header>
</template>

<style>

.fnbox{
  padding: 1px;
  border: 10px;;
  border-color: black;
  margin-bottom: 16px;
}

.left-box {
  display: flex;
  justify-content: flex-start;
}

.right-box {
  display: flex;
  justify-content: flex-end;
}

.right-box > button, input{
  margin-right: 2px;
  margin-left: 2px;
}
</style>