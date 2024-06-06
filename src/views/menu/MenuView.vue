<template>
  <div class="container">
	<CommonHeader :menuName="state.menuName" :add :get :del :save/>
	<BaseTable :id="gridId">
	</BaseTable>
	</div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

<script setup lang="ts">
import { isNotEmpty, isEmpty} from '@/utils/common'
import { ALIGN, DataType, GRID_MSG, HeaderInfoBuilder, TableBuilder , OptionInfo} from '@/utils/tableBuilder';
import { onMounted } from 'vue';
import CommonHeader from '@/components/common/header/CommonHeader.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import { callAPI, Http } from '@/utils/http';

const gridId = 'menuGrid';

const state = {
	menuName: '메뉴 등록',
	grid: new TableBuilder(gridId),
	authServer: import.meta.env.VITE_APP_AUTH_URI,
}

const get = () =>{
	let http = new Http();
	http.setParam(null);
	http.setUrl(state.authServer+'/api/menu/menuList.ajax');
	http.get();
	let grid = state.grid;
	http.setSuccess(function(data: any){
		grid.clear();
		grid.remakeFromJSONListToData(data.menuList as []);
		
		let list = grid.getRows();
		for(let idx = 0; idx < list.length; idx++){
			if(isNotEmpty(grid.getCellValueById(idx, 'menuCd'))){
				grid.disabledCellById(idx, 'menuCd');
			};

			grid.addEventRow(idx, 'keydown', function(){
				grid.setCellValueById(idx, 'status', GRID_MSG.UPDATE);
			});

			grid.addEventRow(idx, 'change', function(){
				grid.setCellValueById(idx, 'status', GRID_MSG.UPDATE);
			});
		}
	});

	callAPI(http);
}

const buildGrid = () => {
	let headerInfo = [
		['no','','상태','메뉴','#cspan','#cspan','url','사용여부','정렬순번'],
		['#rspan','#rspan','#rspan','상위메뉴코드','메뉴코드','메뉴명','#rspan','#rspan','#rspan']
	];
	
	let headers = [
		{colId: 'no', width: '50px', dtType: DataType.READ_ONLY, align: ALIGN.CENTER},
		{colId: 'chkbox', width: '50px', dtType: DataType.CHECK, align: ALIGN.CENTER},
		{colId: 'status', width: '50px', dtType: DataType.READ_ONLY, align: ALIGN.CENTER},
		{colId: 'upMenuCd', width: '120px', dtType: DataType.TEXT, align: ALIGN.LEFT},
		{colId: 'menuCd', width: '100px', dtType: DataType.TEXT, align: ALIGN.LEFT},
		{colId: 'menuName', width: '200px', dtType: DataType.TEXT, align: ALIGN.LEFT},
		{colId: 'url', width: '300px', dtType: DataType.TEXT, align: ALIGN.LEFT},
		{colId: 'useYn', width: '100px', dtType: DataType.SELECT, align: ALIGN.CENTER},
		{colId: 'sortSeq', width: '100px', dtType: DataType.TEXT, align: ALIGN.CENTER}
	].map((head, idx) => {
		return new HeaderInfoBuilder()
					.setColId(head.colId)
					.setWidth(head.width)
					.setDateType(head.dtType)
					.setColIdx(idx)
					.setAlign(head.align)
					.build()
	});
	
	let grid = state.grid;
	grid.setGridId(gridId)
	grid.setHeadText(headerInfo);
	grid.setHeaders(headers);
	
	[
		{text: 'Yes', value: 'Y'},
		{text: 'No', value: 'N'}
	].forEach((item)=>{
		const opt = new OptionInfo();
		opt.text = item.text;
		opt.value = item.value;
		grid.addSelectOptions('useYn', opt);
	});

	grid.build();	
}

const add = () => {
	let param = {} as any;
	param['no'] = state.grid.getRows().length+1;
	param['chkbox'] = 0;
	param['status'] = GRID_MSG.INSERT;
	param['upMenuCd'] = '';
	param['menuCd'] = '';
	param['url'] = '';
	param['useYn'] = 'Y';
	param['sortSeq'] = state.grid.getRows().length+1;
	state.grid.addRowData(param);
}

const del = () => {
	let list = state.grid.getRows();
	let deleteRows = [];

	for(let rowIdx=0; rowIdx< list.length; rowIdx++){
		let row = (list.item(rowIdx) as HTMLTableRowElement);

		if((row.children[1].children[0] as HTMLInputElement).checked==true){

			(row.children[2].children[0] as HTMLInputElement).value = GRID_MSG.DELETE;
			(row.children[1].children[0] as HTMLInputElement).value = "0";
			(row.children[1].children[0] as HTMLInputElement).checked = false;
			if(!state.grid.isDisabledCellById(rowIdx, 'menuCd')){
				deleteRows.push(rowIdx);
			}
		}			
	}

	deleteRows.reverse().forEach(item => {
		state.grid.deleteRow(item);
	});
}

const save = () => {
	let param	= {
		addList		: [],
		deleteList	: [],
		updateList	: [],
	} as any;	
				
	let list = state.grid.getRows();
	for(let idx =0; idx<list.length;idx++){
		let status = (list[idx].children[2].children[0] as HTMLInputElement|HTMLTextAreaElement).value;
		if(status == GRID_MSG.DELETE){
			param.deleteList.push(state.grid.getRowData(idx));
		}else if(status == GRID_MSG.INSERT){
			param.addList.push(state.grid.getRowData(idx));
		}else if(status == GRID_MSG.UPDATE){
			param.updateList.push(state.grid.getRowData(idx));
		}
	}

	let isVaild	= function(){
		let valid = true;
		
		if(param.addList.length == 0 
				&& param.deleteList.length == 0 
				&& param.updateList.length == 0){
			alert("변경사항이 없습니다.");
			valid = false;
		}else{
			let rowList = state.grid.getRows();
			let dupChecker = {} as any;

			for(let idx = 0; idx < rowList.length && valid; idx++){
				let menuCd = state.grid.getCellValueById(idx, 'menuCd');
				if(isEmpty(dupChecker[menuCd])){
					dupChecker[menuCd] = menuCd;
					valid = true;
				}else{
					alert("["+menuCd+"]가 중복되었습니다.");
					valid = false;
				}
			}
		}
		
		return valid;
	}
	
	if(!isVaild()){
		return false;
	}
	
	if(confirm("적용하시겠습니까?")){
		let http = new Http();
		http.setParam(param);
		http.setUrl(state.authServer+'/api/menu/saveMenu.ajax');
		http.contentTypeJson();
		http.post();
		http.setSuccess(function(){
			get();
		});

		callAPI(http);
	}
}

onMounted(()=>{
	buildGrid();
	get();
});
</script>