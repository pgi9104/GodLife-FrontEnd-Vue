
<script setup lang="ts">
import $ from 'jquery';

let props = defineProps(['size', 'totalCnt', 'pageNum', 'interval']);

let size = props.size != null && props.size > 0? props.size: 5;
let totalCnt = props.totalCnt != null && props.totalCnt > 0? props.totalCnt : 1;
let pageNum = props.pageNum != null && props.pageNum > 0? props.pageNum : 0;
let interval = props.interval != null && props.interval > 0? props.interval : 2;

let totalPageNum = Math.floor(totalCnt/size) + (totalCnt%size == 0? 0 : 1);

let startNum = pageNum;
let endNum = pageNum;
let limitNum = interval * 2 + 1;

if(pageNum <= interval){
  startNum = 1;
  endNum = startNum;

  for(let i = startNum; i < totalPageNum && i < limitNum; i++){
    endNum++;
  }

} else if(totalPageNum - interval <= pageNum){
  endNum = totalPageNum;
  startNum = endNum;

  for(let i = endNum; i > 0 && i > totalPageNum - limitNum; i--){
    startNum = i;
  }

} else {
  startNum = pageNum - interval;
  endNum = pageNum + interval;
}

let pageList:number[] = [];
for(let i = startNum; i <= endNum; i++){
  pageList.push(i);
}

$('.page').on('click', function(){
  $('#pagination').find('active').removeClass('active');
  $(this).addClass('active');
});

$('#first').on('click', function(){
  $('#pagination').find('active').removeClass('active');
  $('.page').first().addClass('active');
});

$('#last').on('click', function(){
  $('#pagination').find('active').removeClass('active');
  $('.page').last().addClass('activce');
});

$('#next').on('click', function(){
  $('#pagination').find('active').removeClass('active').next().addClass('active');
});

$('#prev').on('click', function(){
  $('#pagination').find('active').removeClass('active').prev().addClass('active');
});

</script>
<template>
   <div v-show=" size > 0 && totalCnt > 0 && pageNum != null">
    <div class="prevPage">
      <button id="first">처음</button>
      <button id="prev">이전</button>
    </div>
    <div id="pagination">
      <li class="page active" v-for="item in pageList">
        {{ item }}
      </li>
    </div>
    <div class="nextPage">
      <button id="next">다음</button>
      <button id="last">마지막</button>
    </div>
  </div>
</template>
<style>
.active{
  background-color: aqua;
}
</style>