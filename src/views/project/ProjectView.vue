<template>
  <div class="container">
	<CommonHeader :menuName="state.menuName" :add :get :del :save/>
	<BaseTable :id="gridId">
	</BaseTable>
  </div>
</template>

<style>
</style>

<script setup lang="ts">
import { isNotEmpty, isEmpty } from '@/utils/common'
import { ALIGN, DataType, GRID_MSG, HeaderInfoBuilder, TableBuilder } from '@/utils/tableBuilder';
import CommonHeader from '@/components/common/header/CommonHeader.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import { onMounted, reactive } from 'vue';
import { Http, callAPI } from '@/utils/http';

const gridId = 'projectGrid';

const state = reactive({
	menuName: '프로젝트 등록',
	grid:  new TableBuilder(gridId),
	authServer: import.meta.env.VITE_APP_AUTH_URI,
	saveAPI: {} as any,
	listAPI: {} as any
});

const getApi = () => {
	let api = new Http();
	api.setUrl(state.authServer+"/api/project");
	api.setSuccess((data:any)=>{
		state.saveAPI = data._links.save;
		state.listAPI = data._links.list;
	});
	api.setFail((data:any)=>{
		console.log(data);
	});
	callAPI(api);
}

const get = () => {
	let http = new Http();
	http.setParam(null);
	http.setUrl(state.listAPI.href);
	http.method(state.listAPI.type);
	let grid = state.grid;
	http.setSuccess(function(data: any){
		console.log(data);
		grid.clear();
		grid.remakeFromJSONListToData(data._embedded.projectVOes as []);
		
		let list = grid.getRows();
		for(let idx = 0; idx < list.length; idx++){
			if(isNotEmpty(grid.getCellValueById(idx, 'projectCode'))){
				grid.disabledCellById(idx, 'projectCode');
			};
			
			grid.addEventRow(idx, 'keydown', function(){
				grid.setCellValueById(idx, 'status', GRID_MSG.UPDATE);
			});
		}
	});

	callAPI(http);
}

const buildGrid = () => {
	let headerInfo = [];
	let headerList = function(text: string){
		let head = [] as string[];
		if(isNotEmpty(text)){
			let heads = text.split(',');
			heads.forEach(function(headTxt){
				head.push(headTxt);
			});
		}
		return head;
	}
	
	headerInfo.push(headerList('no,,상태,프로젝트코드,프로젝트명,프로젝트설명,정렬순번'));
	
	let createHeaderInfo = function(colId: string, width: string, dtType: string, colIdx: number, align: string){
		return new HeaderInfoBuilder()
					.setColId(colId)
					.setWidth(width)
					.setDateType(dtType)
					.setColIdx(colIdx)
					.setAlign(align)
					.build();
	}
	
	let headers = [];
	let colIndex = 0;
	headers.push(createHeaderInfo(				 'no',		 '50px',     DataType.READ_ONLY, colIndex++, ALIGN.CENTER));
	headers.push(createHeaderInfo(			 'chkbox',		 '50px',	 DataType.CHECK,     colIndex++, ALIGN.CENTER));
	headers.push(createHeaderInfo(			 'status',		 '50px',     DataType.READ_ONLY, colIndex++, ALIGN.CENTER));
	headers.push(createHeaderInfo(		'projectCode',		'120px',	 DataType.TEXT,      colIndex++, ALIGN.LEFT));
	headers.push(createHeaderInfo(		'projectName',		'150px',	 DataType.TEXT,      colIndex++, ALIGN.LEFT));
	headers.push(createHeaderInfo(	 'projectComment',			'*',	 DataType.TEXT,      colIndex++, ALIGN.LEFT));
	headers.push(createHeaderInfo(			'sortSeq',		 '80px',	 DataType.TEXT,      colIndex++, ALIGN.CENTER));
	
	let grid = state.grid;
	grid.setGridId('projectGrid')
	grid.setHeadText(headerInfo);
	grid.setHeaders(headers)
	grid.build();
};
		
const del = () => {
	let list = state.grid.getRows();
	let deleteRows = [];

	for(let rowIdx=0; rowIdx< list.length; rowIdx++){
		let row = (list.item(rowIdx) as HTMLTableRowElement);
		let check = (row.children[1].children[0] as HTMLInputElement);
		let status = (row.children[2].children[0] as HTMLInputElement);

		if(check.checked==true){
			status.value = GRID_MSG.DELETE;
			check.value = "0";
			check.checked = false;
			if(!state.grid.isDisabledCellById(rowIdx, 'projectCode')){
				deleteRows.push(rowIdx);
			}
		}			
	}

	deleteRows.reverse().forEach(item => {
		state.grid.deleteRow(item);
	});
}

const add = () => {
	let param = {} as any;
	param['no'] = state.grid.getRows().length+1;
	param['chkbox'] = 0;
	param['status'] = GRID_MSG.INSERT;
	param['projectCode'] = '';
	param['projectName'] = '';
	param['projectComment'] = '';
	param['sortSeq'] = state.grid.getRows().length+1;
	state.grid.addRowData(param);
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
				let projectCode = state.grid.getCellValueById(idx, 'projectCode');
				if(isEmpty(dupChecker[projectCode])){
					dupChecker[projectCode] = projectCode;
					valid = true;
				}else{
					alert("["+projectCode+"]가 중복되었습니다.");
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
		http.setUrl(state.saveAPI.href);
		http.contentTypeJson();
		http.method(state.saveAPI.type);
		http.setSuccess(function(){
			get();
		});
		http.setFail(get);

		callAPI(http);
	}
}

onMounted(()=>{
	getApi();
	buildGrid();
	get();
});

</script>