<template>
  <div class="container">
	<CommonHeader :menuName="initdata.menuName" :add :get :del :save/>
	<BaseTable :id="gridId">
	</BaseTable>
  </div>
  <div id="modalId" class="modal">
	  <div class="modal-content animate">
		<input id="code" type="hidden">
		<span v-on:click="hideModal" class="close" title="Close Modal">&times;</span>
		<br>
		<div class="container">
			<CommonHeader :menuName="initdata.menuDetailName" :add="addModal" :get="getModal" :del="delModal" :save="saveModal"/>
			<BaseTable :id="gridDetailId">
			</BaseTable>
		</div>
	</div>
  </div>
</template>

<style>
</style>

<script setup lang="ts">
import { isNotEmpty, getId, isEmpty} from '@/utils/common'
import { ALIGN, DataType, GRID_MSG, HeaderInfoBuilder, TableBuilder } from '@/utils/tableBuilder';
import { onMounted } from 'vue';
import CommonHeader from '@/components/common/header/CommonHeader.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import { useTokenStore } from '@/stores/tokenStore';
import { callAPI, Http } from '@/utils/http';

const store = useTokenStore();
const gridId = 'commonCodeGrid';
const gridDetailId = 'commonCodeDetailGrid';
const modalId = 'modalId';

console.log("tokenCheck: "+store.$state.storeToken);

const initdata = {
	menuName: '',
	menuDetailName: '',
	grid: new TableBuilder(gridId),
	gridDetail: new TableBuilder(gridDetailId),
	authServer: import.meta.env.VITE_APP_AUTH_URI,
	selectYn: [],
	linkGetListUrl: {
		href: '',
		type: '',
		media: '',
		rel: '',
	},
	linkSaveListUrl: {
		href: '',
		type: '',
		media: '',
		rel: '',
	},
	linkSaveDetailListUrl: {
		href: '',
		type: '',
		media: '',
		rel: '',
	},
	linkDetail:{
		href: '',
		type: '',
		media: '',
		rel: '',
	}
}

const getApi = () =>{
	let http = new Http();
	http.setParam(null);
	http.setUrl(initdata.authServer+'/sys/api/code');
	http.get();
	http.contentTypeJson();
	http.addHeader("Authorization", "Bearer "+store.$state.storeToken);
	http.setSuccess(function(res: any){
		//console.log(res);
		initdata.menuName = res.data.menuName;
		initdata.menuDetailName = res.data.menuDetailName;
		initdata.linkGetListUrl = res.data.get;
		initdata.linkSaveListUrl = res.data.save;
		initdata.linkSaveDetailListUrl = res.data.saveModal;
	});

	callAPI(http);
}

const get = () =>{
	let grid = initdata.grid;

	let http = new Http();
	http.setParam(null);
	http.setUrl(initdata.linkGetListUrl.href);
	http.method(initdata.linkGetListUrl.type);
	http.setContentType(initdata.linkGetListUrl.media);
	http.addHeader("Authorization", "Bearer "+store.$state.storeToken);
	http.setSuccess(function(data: any){
		console.log(data);
		grid.clear();
		grid.remakeFromJSONListToData(data.selectCodeList);
		
		let list = grid.getRows();
		for(let idx = 0; idx < list.length; idx++){
			if(isNotEmpty(grid.getCellValueById(idx, 'code'))){
				grid.disabledCellById(idx, 'code');
			};
			
			grid.getBtnPopById(idx, 'pop', '버튼', function(){
				let codeValue = grid.getCellValueById(idx, 'code');
				(getId('code') as HTMLInputElement).value = codeValue;
				let link = null;
				let flag = true;
				for(let i = 0; i<data.selectCodeList[idx].links.length && flag; i++){
					if(data.selectCodeList[idx].links[i].rel == 'getModal'){
						link = data.selectCodeList[idx].links[i];
						flag = false;
					}
				}

				initdata.linkDetail = link;
				getModal(link);
			});

			grid.addEventRow(idx,'keydown', function(){
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
	
	headerInfo.push(headerList('no,,상태,공통코드,코드명,설명, 정렬순번, 상세코드'));
	
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
	headers.push(createHeaderInfo(				  'no',	 '50px',	DataType.READ_ONLY, colIndex++, ALIGN.CENTER));
	headers.push(createHeaderInfo(			  'chkbox',	 '50px',		DataType.CHECK, colIndex++, ALIGN.CENTER));
	headers.push(createHeaderInfo(			  'status',	 '50px',	DataType.READ_ONLY, colIndex++, ALIGN.CENTER));
	headers.push(createHeaderInfo(			    'code',	 '80px',		 DataType.TEXT, colIndex++, ALIGN.LEFT));
	headers.push(createHeaderInfo(			'codeName',	'100px',		 DataType.TEXT, colIndex++, ALIGN.LEFT));
	headers.push(createHeaderInfo(			'codeDesc',	    '*',		 DataType.TEXT, colIndex++, ALIGN.LEFT));
	headers.push(createHeaderInfo(			 'sortSeq',	 '80px',		 DataType.TEXT, colIndex++, ALIGN.CENTER));
	headers.push(createHeaderInfo(			 	 'pop',	 '80px',	   DataType.BUTTON, colIndex++, ALIGN.CENTER));
	
	initdata.grid = new TableBuilder(gridId);
	initdata.grid.setGridId(gridId)
	initdata.grid.setHeadText(headerInfo);
	initdata.grid.setHeaders(headers)
	initdata.grid.build();
}

const add = () => {
	let param = {} as any;
	param['no'] 		= initdata.grid.getRows().length+1;
	param['chkbox'] 	= 0;
	param['status']	 	= GRID_MSG.INSERT;
	param['code'] 		= '';
	param['codeName'] 	= '';
	param['codeDesc'] 	= '';
	param['sortSeq'] 	= initdata.grid.getRows().length+1;
	param['pop'] 		= '';
	initdata.grid.addRowData(param);
}

const del = () => {
	let list = initdata.grid.getRows();
	let deleteRows = [];

	for(let rowIdx=0; rowIdx< list.length; rowIdx++){
		let row = (list.item(rowIdx) as HTMLTableRowElement);

		if((row.children[1].children[0] as HTMLInputElement).checked==true){

			(row.children[2].children[0] as HTMLInputElement).value = GRID_MSG.DELETE;
			(row.children[1].children[0] as HTMLInputElement).value = "0";
			(row.children[1].children[0] as HTMLInputElement).checked = false;
			if(!initdata.grid.isDisabledCellById(rowIdx, 'code')){
				deleteRows.push(rowIdx);
			}
		}			
	}

	deleteRows.reverse().forEach(item => {
		initdata.grid.deleteRow(item);
	});
}

const save = () => {
	let param: any	= {
		addList		: [],
		deleteList	: [],
		updateList	: []
	};
	
	let grid = initdata.grid;

	let list = grid.getRows() as HTMLCollectionOf<HTMLTableRowElement>;
	for(let idx =0; idx<list.length;idx++){
		let status = grid.getCellValueById(idx,'status');
		if(status == GRID_MSG.DELETE){
			param.deleteList.push(grid.getRowData(idx));
		}else if(status == GRID_MSG.INSERT){
			param.addList.push(grid.getRowData(idx));
		}else if(status == GRID_MSG.UPDATE){
			param.updateList.push(grid.getRowData(idx));
		}
	}

	let isVaild	= function(){
		let valid = true;
		
		if(param.addList.length == 0 
				&& param.deleteList.length == 0 
				&& param.updateList == 0){
			alert("변경사항이 없습니다.");
			valid = false;
		}else{
			let rowList = grid.getRows();
			let dupChecker = {} as any;

			for(let idx = 0; idx < rowList.length && valid; idx++){
				let code = grid.getCellValueById(idx, 'code');
				if(isEmpty(dupChecker[code])){
					dupChecker[code] = code;
					valid = true;
				}else{
					alert("["+code+"]가 중복되었습니다.");
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
		http.setUrl(initdata.linkSaveListUrl.href);
		http.contentTypeJson();
		http.method(initdata.linkSaveListUrl.type);
		http.addHeader("Authorization", "Bearer "+store.$state.storeToken);
		http.setSuccess(function(){
			get();
		});
		http.setFail(get);

		callAPI(http);
	}
}

const showModal = () => {
	(document.getElementById(modalId) as HTMLDivElement).style.display="block";
}

const hideModal = () => {
	(document.getElementById(modalId) as HTMLDivElement).style.display="none";
}

const getModal = (url: any) =>{
	let grid = initdata.gridDetail;
	let http = new Http();
	http.setParam(null);
	http.setUrl(url.href);
	http.method(url.type);
	http.setContentType(url.media);
	http.addHeader("Authorization", "Bearer "+store.$state.storeToken);
	http.setSuccess(function(res: any){
		console.log(res);
		grid.clear();
		grid.remakeFromJSONListToData(res.selectCodeDetailList);
		
		let list = grid.getRows();
		for(let idx = 0; idx < list.length; idx++){
			if(isNotEmpty(grid.getCellValueById(idx, 'code'))){
				grid.disabledCellById(idx, 'code');
			}

			if(isNotEmpty(grid.getCellValueById(idx, 'codeDetailCd'))){
				grid.disabledCellById(idx, 'codeDetailCd');
			}
			
			grid.addEventRow(idx,'keydown', function(){
				grid.setCellValueById(idx, 'status', GRID_MSG.UPDATE);
			});
		}
	});

	callAPI(http);
	showModal();
}

const buildGridModal = () => {
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
	
	headerInfo.push(headerList('no,,상태,공통코드,상세코드코드,상세코드명, 설명, 정렬순번'));
	
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
	headers.push(createHeaderInfo(				  'no',	 '50px',	DataType.READ_ONLY, colIndex++, ALIGN.CENTER));
	headers.push(createHeaderInfo(			  'chkbox',	 '50px',		DataType.CHECK, colIndex++, ALIGN.CENTER));
	headers.push(createHeaderInfo(			  'status',	 '50px',	DataType.READ_ONLY, colIndex++, ALIGN.CENTER));
	headers.push(createHeaderInfo(			 	'code',	 '80px',	   DataType.HIDDEN, colIndex++, ALIGN.LEFT));
	headers.push(createHeaderInfo(	    'codeDetailCd',	'100px',		 DataType.TEXT, colIndex++, ALIGN.LEFT));
	headers.push(createHeaderInfo(	  'codeDetailName',	'100px',		 DataType.TEXT, colIndex++, ALIGN.LEFT));
	headers.push(createHeaderInfo(	  		'codeDesc',		'*',		 DataType.TEXT, colIndex++, ALIGN.LEFT));
	headers.push(createHeaderInfo(			 'sortSeq',	 '80px',		 DataType.TEXT, colIndex++, ALIGN.CENTER));
	
	initdata.gridDetail = new TableBuilder(gridDetailId);
	initdata.gridDetail.setHeadText(headerInfo);
	initdata.gridDetail.setHeaders(headers);
	initdata.gridDetail.build();
}

const addModal = () => {
	let grid = initdata.gridDetail;
	let param = {} as any;
	param['no'] 			= grid.getRows().length+1;
	param['chkbox'] 		= 0;
	param['status'] 		= GRID_MSG.INSERT;
	param['code'] 			= (getId('code') as HTMLInputElement).value;
	param['codeDetailCd'] 	= '';
	param['codeDetailName'] = '';
	param['codeDesc'] 		= '';
	param['sortSeq'] = grid.getRows().length+1;
	grid.addRowData(param);
}

const delModal = () => {
	let grid = initdata.gridDetail;
	let list = grid.getRows();
	let deleteRows = [];

	for(let rowIdx=0; rowIdx< list.length; rowIdx++){
		let row = (list.item(rowIdx) as HTMLTableRowElement);

		if((row.children[1].children[0] as HTMLInputElement).checked==true){

			(row.children[2].children[0] as HTMLInputElement).value = GRID_MSG.DELETE;
			(row.children[1].children[0] as HTMLInputElement).value = "0";
			(row.children[1].children[0] as HTMLInputElement).checked = false;
			if(!grid.isDisabledCellById(rowIdx, 'codeDetailCd')){
				deleteRows.push(rowIdx);
			}
		}			
	}

	deleteRows.reverse().forEach(item => {
		grid.deleteRow(item);
	});
}

const saveModal = () => {
	let grid = initdata.gridDetail;
	let param: any	= {
		addCodeDetailList		: [],
		deleteCodeDetailList	: [],
		updateCodeDetailList	: []
	};
	
	let list = initdata.gridDetail.getRows();
	for(let idx =0; idx<list.length;idx++){
		let status = grid.getCellValueById(idx, 'status');
		if(status == GRID_MSG.DELETE){
			param.deleteCodeDetailList.push(grid.getRowData(idx));
		}else if(status == GRID_MSG.INSERT){
			param.addCodeDetailList.push(grid.getRowData(idx));
		}else if(status == GRID_MSG.UPDATE){
			param.updateCodeDetailList.push(grid.getRowData(idx));
		}
	}

	let isVaild	= function(){
		let valid = true;
		
		if(param.addCodeDetailList.length == 0 
				&& param.deleteCodeDetailList.length == 0 
				&& param.updateCodeDetailList == 0){
			alert("변경사항이 없습니다.");
			valid = false;
		}else{
			let rowList = initdata.gridDetail.getRows();
			let dupChecker = {} as any;

			for(let idx = 0; idx < rowList.length && valid; idx++){
				let codeDetailCd = initdata.gridDetail.getCellValueById(idx, 'codeDetailCd');
				if(isEmpty(dupChecker[codeDetailCd])){
					dupChecker[codeDetailCd] = codeDetailCd;
					valid = true;
				}else{
					alert("["+codeDetailCd+"]가 중복되었습니다.");
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
		http.setUrl(initdata.linkSaveDetailListUrl.href);
		http.contentTypeJson();
		http.method(initdata.linkSaveDetailListUrl.type);
		http.addHeader("Authorization", "Bearer "+store.$state.storeToken);
		http.setSuccess(function(){
			getModal(initdata.linkDetail);
		});
		http.setFail(get);

		callAPI(http);
	}
}

onMounted(()=>{
	getApi();
	buildGrid();
	get();
	buildGridModal();
});
</script>