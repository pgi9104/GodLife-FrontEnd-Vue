<template>
  <div class="container">
		<div id = "btnBox">
			<button class="btn btn-primary btn-sm" id="btn_sch">조회</button>
			<button class="btn btn-primary btn-sm" id="btn_add">추가</button>
			<button class="btn btn-primary btn-sm" id="btn_del">삭제</button>
			<button class="btn btn-primary btn-sm" id="btn_save">저장</button>
		</div>
		<br>
		<div id="projectGrid">
		</div>
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

<script lang="ts">
import { isNotEmpty, getId, isEmpty, callAPI, Http } from '@/utils/common'
import { ALIGN, DataType, GRID_MSG, HeaderInfoBuilder, TableBuilder } from '@/utils/tableBuilder';

export default{
	data(){
		return{
			grid: new TableBuilder('projectGrid'),
			authServer: import.meta.env.VITE_APP_AUTH_URI,
			saveAPI: {} as any,
			listAPI: {} as any
		} 
	},
	methods:{
		getApi(){
			let api = new Http();
			api.setUrl(this.$data.authServer+"/api/project");
			api.setSuccess((data:any)=>{
				this.saveAPI = data._links.save;
				this.listAPI = data._links.self;
			});
			api.setFail((data:any)=>{
				console.log(data);
			});
			callAPI(api);
		}
		, getGridData(){
			let http = new Http();
			http.setParam(null);
			http.setUrl(this.listAPI.href);
			http.method(this.listAPI.type);
			let grid = this.grid;
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
		},

		buildGrid(){
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
			headers.push(createHeaderInfo(	 'projectComment',		'*',	 DataType.TEXT,      colIndex++, ALIGN.LEFT));
			headers.push(createHeaderInfo(			'sortSeq',		'80px',	 DataType.TEXT,      colIndex++, ALIGN.CENTER));
			
			let grid = this.grid;
			grid.setGridId('projectGrid')
			grid.setHeadText(headerInfo);
			grid.setHeaders(headers)
			grid.build();
		},

		addListener(){
			let grid = this.grid;
			let setRemoveList = this.setRemoveList;
			let getGridData = this.getGridData;
			let saveAPI = this.saveAPI;

			(getId('btn_sch') as HTMLElement).onclick = getGridData;

			(getId('btn_del') as HTMLElement).onclick = function(){
				setRemoveList();
			}

			let btnAdd = getId('btn_add') as HTMLButtonElement;
			btnAdd.onclick = function(){
				let param = {} as any;
				param['no'] = grid.getRows().length+1;
				param['chkbox'] = 0;
				param['status'] = GRID_MSG.INSERT;
				param['projectCode'] = '';
				param['projectName'] = '';
				param['projectComment'] = '';
				param['sortSeq'] = grid.getRows().length+1;
				grid.addRowData(param);
			}

			let btnSave = getId('btn_save') as HTMLButtonElement;
			btnSave.onclick = function(){
				let param	= {
					addList		: [],
					deleteList	: [],
					updateList	: [],
				} as any;
				
							
				let list = grid.getRows();
				for(let idx =0; idx<list.length;idx++){
					let status = (list[idx].children[2].children[0] as HTMLInputElement|HTMLTextAreaElement).value;
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
							let projectCode = grid.getCellValueById(idx, 'projectCode');
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
					http.setUrl(saveAPI.href);
					http.contentTypeJson();
					http.method(saveAPI.type);
					http.setSuccess(function(){
						getGridData();
					});
					http.setFail(getGridData);

					callAPI(http);
				}
			}
		},
		
		setRemoveList(){
			let list = this.grid.getRows();

			for(let rowIdx=0; rowIdx< list.length; rowIdx++){
				let row = (list.item(rowIdx) as HTMLTableRowElement);
				let check = (row.children[1].children[0] as HTMLInputElement);
				let status = (row.children[2].children[0] as HTMLInputElement);

				if(check.checked==true){
					status.value = GRID_MSG.DELETE;
					check.value = "0";
					check.checked = false;
				}			
			}
		}
	},
	mounted(){
		this.getApi();
		this.buildGrid();
		this.getGridData();
		this.addListener();
	}
}
</script>