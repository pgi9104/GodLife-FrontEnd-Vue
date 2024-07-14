<template>
  <div class="container">
	<CommonHeader :menuName="initdata.menuName" :add :get :del :save/>
	<div class="row">
		<div class="col input-group mb-3">
			<label for="projectCodeSel" class="input-group-text">프로젝트 코드</label>
			<select id="projectCodeSel" name="projectCodeSel" class="form-select form-select-sm">
			</select>
		</div>
		<div class="col input-group mb-3">
			<label for="tableNameSel" class="input-group-text">테이블 명</label>
			<select id="tableNameSel" name="tableNameSel" class="form-select form-select-sm">
			</select>
		</div>
		<div class="col input-group mb-3">
			<label for="tableColSel" class="input-group-text">테이블 컬럼</label>
			<select id="tableColSel" name="tableColSel" class="form-select form-select-sm">
			</select>
		</div>
		<div class="col right-box">
			<button :onclick="script">
				테이블 추가
			</button>
			<button :onclick="alterAddScript">
				컬럼 추가
			</button>
			<button :onclick="alterModifyScript">
				컬럼 변경
			</button>
		</div>
	</div>
	<br>
	<BaseTable :id="gridId">
	</BaseTable>
	<PagingView
		:size="size"
		:pageNum="pageNum"
		:totalCnt="totalCnt"
		:showPageCnt="showPageCnt">
	</PagingView>
</div>
<div id="scriptModalId" class="modal">
	<div class="modal-content animate" style="height: 80vh;">
		<span v-on:click="hideModal" class="close" title="Close Modal">&times;</span>
		<div>
			<label>스크립트 결과</label>
		</div>
		<div>
			<select id="dbType" style="width: 20vw; margin: 8px;" :onchange="script">
				<option value="mysql">mysql</option>
				<option value="mariadb">mariadb</option>
				<option value="oracle">oracle</option>
				<option value="postgres">postgres</option>
				<option value="mssql">mssql</option>
			</select>
			<button v-on:click="copyScript">Copy</button>
		</div>
		<textarea id="scriptResult" style="height: 100vh;" disabled></textarea>
	</div>
  </div>
</template>

<style>
</style>

<script setup lang="ts">
import { isNotEmpty, isEmpty, getId} from '@/utils/common'
import { ALIGN, DataType, GRID_MSG, HeaderInfo, HeaderInfoBuilder, OptionInfo, TableBuilder, SORT, DATA_CLASS} from '@/utils/tableBuilder';
import { onMounted } from 'vue';
import CommonHeader from '@/components/common/header/CommonHeader.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import PagingView from '@/components/table/PagingView.vue';
import { useTokenStore } from '@/stores/tokenStore';
import { callAPI, Http } from '@/utils/http';

const store = useTokenStore();
const gridId = 'ddlGrid';
const showPageCnt = 5;
let size = 5;
let pageNum = 1;
let totalCnt = 50;

const initdata = {
	menuName: 'DDL 정보',
	grid: new TableBuilder(gridId),
	authServer: import.meta.env.VITE_APP_AUTH_URI+'/auth-server',
	pks: ['projectCode', 'tableName', 'tableCol'],
	projectCodeList: [],
	list: {
		href: '',
		type: '',
		media: '',
		rel: '',
	},
	save: {
		href: '',
		type: '',
		media: '',
		rel: '',
	},
	script: {
		href: '',
		type: '',
		media: '',
		rel: ''
	},
	alterScript: {
		href: '',
		type: '',
		media: '',
		rel: ''
	}
}

const getApi = () =>{
	let http = new Http();
	http.setParam(null);
	http.setUrl(initdata.authServer+'/api/init/ddl');
	http.get();
	http.contentTypeJson();
	http.setToken(store.storeToken);
	http.setSuccess(function(res: any){
		const data = res.data;

		//Link
		initdata.menuName = data.menuName;
		initdata.list = data.list;
		initdata.save = data.save;
		initdata.script = data.script;
		initdata.alterScript = data.alterScript;
		initdata.projectCodeList = data.projectCodeSel;
		//selectBox
		[
			{id: 'projectCodeSel', data: data.projectCodeSel},
			{id: 'tableNameSel', data: data.tableNameSel},
			{id: 'tableColSel', data: data.tableColSel},
		].forEach(( selData )=>{
			const sel = (getId(selData.id) as HTMLSelectElement);
			sel.innerHTML = '';
			selData.data.forEach((option: string)=>{
				const opt = new OptionInfo();
				opt.text = option;
				opt.value = option;
				sel.appendChild(opt.createOption());
			});
		})
	});

	(getId('searchTxt') as HTMLInputElement).onkeyup = (e: KeyboardEvent) =>{
		if(e.code === 'Enter' || e.code === 'NumpadEnter'){
			get();
		}
	}

	callAPI(http);
}

const get = () =>{
	let grid = initdata.grid;
	let url = initdata.list.href;
	url += "?projectCode="+(getId('projectCodeSel') as HTMLSelectElement).value;
	url += "&tableName="+(getId('tableNameSel') as HTMLSelectElement).value;
	url += "&tableCol="+(getId('tableColSel') as HTMLSelectElement).value;
	url += "&searchTxt="+(getId('searchTxt') as HTMLInputElement).value;

	let http = new Http();
	http.setParam(null);
	http.setUrl(url);
	http.method(initdata.list.type);
	http.setContentType(initdata.list.media);
	http.setToken(store.storeToken);
	http.setSuccess(function(res: any){
		const data = res.data;

		grid.clear();
		grid.remakeFromJSONListToData(data.list);
		let list = grid.getRows();
		for(let idx = 0; idx < list.length; idx++){
			initdata.pks.forEach((col) =>{
				if(isNotEmpty(grid.getCellValueById(idx, col))){
					grid.disabledCellById(idx, col);
				};
			});

			grid.addEventRow(idx,'keydown', function(){
				grid.setCellValueById(idx, 'status', GRID_MSG.UPDATE);
			});

			grid.addEventRow(idx, 'change', function(){
				grid.setCellValueById(idx, 'status', GRID_MSG.UPDATE);
			});
		}

		// paging
		totalCnt = res.data.totalCnt;
	});

	callAPI(http);
}

const buildGrid = () => {
	let grid = initdata.grid;

	const headerInfo =[
		['no','','상태','프로젝트코드','테이블명','테이블컬럼','컬럼 타입','컬럼 타입 제한','NULL 여부', 'PK 여부', '자동 증가', '기본값', '설명', '정렬 순번']
	];
	
	let headers: HeaderInfo[] = [
		{colId: 'no', width: '50px', dtType: DataType.READ_ONLY, align: ALIGN.CENTER, sort: SORT.DESC, dataClass: DATA_CLASS.NUMBER},
		{colId: 'chkbox', width: '20px', dtType: DataType.CHECK, align: ALIGN.CENTER, sort: SORT.NONE, dataClass: DATA_CLASS.NONE},
		{colId: 'status', width: '50px', dtType: DataType.READ_ONLY, align: ALIGN.CENTER, sort: SORT.ASC, dataClass: DATA_CLASS.STRING},
		{colId: 'projectCode', width: '80px', dtType: DataType.SELECT, align: ALIGN.LEFT, sort: SORT.ASC, dataClass: DATA_CLASS.STRING},
		{colId: 'tableName', width: '80px', dtType: DataType.TEXT, align: ALIGN.LEFT, sort: SORT.ASC, dataClass: DATA_CLASS.STRING},
		{colId: 'tableCol', width: '80px', dtType: DataType.TEXT, align: ALIGN.LEFT, sort: SORT.ASC, dataClass: DATA_CLASS.STRING},
		{colId: 'colType', width: '80px', dtType: DataType.SELECT, align: ALIGN.LEFT, sort: SORT.ASC, dataClass: DATA_CLASS.STRING},
		{colId: 'colTypeLmt', width: '100px', dtType: DataType.TEXT, align: ALIGN.RIGHT, sort: SORT.NONE, dataClass: DATA_CLASS.STRING},
		{colId: 'nullable', width: '80px', dtType: DataType.SELECT, align: ALIGN.LEFT, sort: SORT.ASC, dataClass: DATA_CLASS.STRING},
		{colId: 'colPk', width: '80px', dtType: DataType.SELECT, align: ALIGN.LEFT, sort: SORT.ASC, dataClass: DATA_CLASS.STRING},
		{colId: 'autoIncrease', width: '80px', dtType: DataType.SELECT, align: ALIGN.LEFT, sort: SORT.ASC, dataClass: DATA_CLASS.STRING},
		{colId: 'defaultValue', width: '80px', dtType: DataType.TEXT, align: ALIGN.LEFT, sort: SORT.ASC, dataClass: DATA_CLASS.STRING},
		{colId: 'comment', width: '80px', dtType: DataType.TEXT, align: ALIGN.LEFT, sort: SORT.ASC, dataClass: DATA_CLASS.STRING},
		{colId: 'sortSeq', width: '80px', dtType: DataType.TEXT, align: ALIGN.RIGHT, sort: SORT.ASC, dataClass: DATA_CLASS.NUMBER},
	].map((item, colIdx)=>{
		return new HeaderInfoBuilder()
				.setColId(item.colId)
				.setWidth(item.width)
				.setDateType(item.dtType)
				.setColIdx(colIdx)
				.setAlign(item.align)
				.setSort(item.sort)
				.setDataClass(item.dataClass)
				.build();
	});

	grid.setHeadText(headerInfo);
	[
		{text: 'Yes', value: '1'},
		{text: 'No', value: '0'}
	].forEach((item)=>{
		['nullable','colPk', 'autoIncrease'].forEach((yesNo)=>{
			const opt = new OptionInfo();
			opt.text = item.text;
			opt.value = item.value;
			grid.addSelectOptions(yesNo, opt);
		});
	});
	[
		{text: 'STRING', value: 'STRING'},
		{text: 'INT', value: 'INT'},
		{text: 'TIMESTAMP', value: 'TIMESTAMP'}
	].forEach((item)=>{
		const opt = new OptionInfo();
		opt.text = item.text;
		opt.value = item.value;
		grid.addSelectOptions('colType', opt);
	});

	initdata.projectCodeList.forEach((item: any)=>{
		const opt = new OptionInfo();
		opt.text = item;
		opt.value = item;
		grid.addSelectOptions('projectCode', opt);
	});

	grid.setHeaders(headers)
	grid.build();
}

const add = () => {
	let param = {} as any;
	param['no'] 			= initdata.grid.getRows().length+1;
	param['chkbox'] 		= 0;
	param['status']	 		= GRID_MSG.INSERT;
	param['projectCode'] 	= (getId('projectCodeSel') as HTMLSelectElement).value;
	param['tableName'] 		= '';
	param['tableCol'] 		= '';
	param['colType'] 		= '';
	param['colTypeLmt'] 	= '';
	param['nullable'] 		= '0';
	param['colPk'] 			= '0';
	param['autoIncrease']	= '0';
	param['defaultValue'] 	= '';
	param['comment'] 		= '';
	param['sortSeq'] 		= initdata.grid.getRows().length+1;
	initdata.grid.addRowData(param);
}

const del = () => {
	let list = initdata.grid.getRows();
	let deleteRows = [];

	for(let rowIdx=0; rowIdx< list.length; rowIdx++){
		if((initdata.grid.getCellChildById(rowIdx,'chkbox') as HTMLInputElement).checked==true){

			initdata.grid.setCellValueById(rowIdx,'status',GRID_MSG.DELETE);
			initdata.grid.setCellValueById(rowIdx,'chkbox',"0");
			(initdata.grid.getCellChildById(rowIdx,'chkbox') as HTMLInputElement).checked = false;

			let isDisabled = initdata.pks.every((colId) => {
				return !initdata.grid.isDisabledCellById(rowIdx, colId);
			});

			if(isDisabled){
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
				&& param.updateList.length == 0){
			alert("변경사항이 없습니다.");
			valid = false;
		}else{
			let rowList = grid.getRows();
			let dupChecker = {} as any;

			for(let idx = 0; idx < rowList.length && valid; idx++){
				let code = '';
				initdata.pks.forEach((colId)=>{
					code += grid.getCellValueById(idx, colId);
				});
				const empty = isEmpty(dupChecker[code]);
				if(empty){
					dupChecker[code] = grid.getCellValueById(idx, 'no');
					valid = true;
				}else{
					alert("[no"+dupChecker[code]+"]와 [no"+grid.getCellValueById(idx, 'no')+"]가 중복되었습니다.");
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
		http.setUrl(initdata.save.href);
		//http.setContentType(initdata.save.media);
		http.contentTypeJson();
		http.method(initdata.save.type);
		http.setToken(store.storeToken);
		http.setSuccess(function(){
			get();
		});
		http.setFail(get);

		callAPI(http);
	}
}


const scriptModalId = 'scriptModalId';

const script = () =>{
	let url = initdata.script.href;
	url += "?projectCode="+ (getId('projectCodeSel') as HTMLSelectElement).value;
	url += "&tableName="+ (getId('tableNameSel') as HTMLSelectElement).value;
	url += "&dbType="+(getId('dbType') as HTMLSelectElement).value;

	let http = new Http();
	http.setParam(null);
	http.setUrl(url);
	http.method(initdata.script.type);
	http.setContentType(initdata.script.media);
	http.setToken(store.storeToken);
	http.setSuccess(function(res: any){
		const data = res.data;
		const scriptResult = getId('scriptResult') as HTMLTextAreaElement;
		scriptResult.textContent = data.script;
	});

	callAPI(http);
	showModal();
}

const alterAddScript = () =>{
	let url = initdata.alterScript.href;
	url += "?projectCode="+ (getId('projectCodeSel') as HTMLSelectElement).value;
	url += "&tableName="+ (getId('tableNameSel') as HTMLSelectElement).value;
	url += "&dbType="+(getId('dbType') as HTMLSelectElement).value;
	url += "&alterType=ADD";

	let http = new Http();
	http.setParam(null);
	http.setUrl(url);
	http.method(initdata.alterScript.type);
	http.setContentType(initdata.alterScript.media);
	http.setToken(store.storeToken);
	http.setSuccess(function(res: any){
		const data = res.data;
		const scriptResult = getId('scriptResult') as HTMLTextAreaElement;
		scriptResult.textContent = data.script;
	});

	callAPI(http);
	showModal();
}

const alterModifyScript = () =>{
	let url = initdata.alterScript.href;
	url += "?projectCode="+ (getId('projectCodeSel') as HTMLSelectElement).value;
	url += "&tableName="+ (getId('tableNameSel') as HTMLSelectElement).value;
	url += "&dbType="+(getId('dbType') as HTMLSelectElement).value;
	url += "&alterType=MODIFY";

	let http = new Http();
	http.setParam(null);
	http.setUrl(url);
	http.method(initdata.alterScript.type);
	http.setContentType(initdata.alterScript.media);
	http.setToken(store.storeToken);
	http.setSuccess(function(res: any){
		const data = res.data;
		const scriptResult = getId('scriptResult') as HTMLTextAreaElement;
		scriptResult.textContent = data.script;
	});

	callAPI(http);
	showModal();
}

const showModal = () => {
	(document.getElementById(scriptModalId) as HTMLDivElement).style.display="block";
}

const hideModal = () => {
	(document.getElementById(scriptModalId) as HTMLDivElement).style.display="none";
}

const copyScript = () => {
	var copyText = (getId('scriptResult') as HTMLTextAreaElement);
	navigator.clipboard.writeText(copyText.value);
}

onMounted(()=>{
	getApi();
	buildGrid();
	get();
});
</script>