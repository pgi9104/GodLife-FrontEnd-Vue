<template>
  <div class="container">
		<div id = "btnBox">
			<button class="btn btn-primary btn-sm" id="btn_sch">조회</button>
			<button class="btn btn-primary btn-sm" id="btn_add">추가</button>
			<button class="btn btn-primary btn-sm" id="btn_del">삭제</button>
			<button class="btn btn-primary btn-sm" id="btn_save">저장</button>
		</div>
		<br>
		<div id="grid">
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
			grid: new TableBuilder('grid'),
			authServer: import.meta.env.VITE_APP_AUTH_URI,
		} 
	},
	methods:{
		getGridData(){
			let http = new Http();
			http.setParam(null);
			http.setUrl(this.authServer+'/api/menu/menuList.ajax');
			http.get();
			let grid = this.grid;
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
			
			headerInfo.push(headerList('no,,상태,메뉴,#cspan,#cspan,url,사용여부,정렬순번'));
			headerInfo.push(headerList('#rspan,#rspan,#rspan,상위메뉴코드,메뉴코드,메뉴명,#rspan,#rspan,#rspan'));
			
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
			headers.push(createHeaderInfo(	      'no',		 '50px',     DataType.READ_ONLY, colIndex++, ALIGN.CENTER));
			headers.push(createHeaderInfo(	  'chkbox',		 '50px',	 DataType.CHECK,     colIndex++, ALIGN.CENTER));
			headers.push(createHeaderInfo(	  'status',		 '50px',     DataType.READ_ONLY, colIndex++, ALIGN.CENTER));
			headers.push(createHeaderInfo(	'upMenuCd',		'120px',	 DataType.TEXT,      colIndex++, ALIGN.LEFT));
			headers.push(createHeaderInfo(	  'menuCd',		'100px',	 DataType.TEXT,      colIndex++, ALIGN.LEFT));
			headers.push(createHeaderInfo(	'menuName',		'200px',	 DataType.TEXT,      colIndex++, ALIGN.LEFT));
			headers.push(createHeaderInfo(		 'url',		'300px',	 DataType.TEXT,      colIndex++, ALIGN.LEFT));
			headers.push(createHeaderInfo(	   'useYn',		'100px',	 DataType.TEXT,      colIndex++, ALIGN.CENTER));
			headers.push(createHeaderInfo(	 'sortSeq',		'100px',	 DataType.TEXT,      colIndex++, ALIGN.CENTER));
			
			let grid = this.grid;
			grid.setGridId('grid')
			grid.setHeadText(headerInfo);
			grid.setHeaders(headers)
			grid.build();
		},

		addListener(){
			let grid = this.grid;
			let authServer = this.authServer;
			let setRemoveList = this.setRemoveList;
			let getGridData = this.getGridData;

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
				param['upMenuCd'] = '';
				param['menuCd'] = '';
				param['url'] = '';
				param['useYn'] = 'Y';
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
							let menuCd = grid.getCellValueById(idx, 'menuCd');
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
					http.setUrl(authServer+'/api/menu/saveMenu.ajax');
					http.contentTypeJson();
					http.post();
					http.setSuccess(function(){
						getGridData();
					});

					callAPI(http);
				}
			}
		},
		
		setRemoveList(){
			let list = this.grid.getRows();

			for(let rowIdx=0; rowIdx< list.length; rowIdx++){
				let row = (list.item(rowIdx) as HTMLTableRowElement);

				if((row.children[1].children[0] as HTMLInputElement).checked==true){

					(row.children[2].children[0] as HTMLInputElement).value = GRID_MSG.DELETE;
					(row.children[1].children[0] as HTMLInputElement).value = "0";
					(row.children[1].children[0] as HTMLInputElement).checked = false;
				}			
			}
		}
	},
	mounted(){
		this.buildGrid();
		this.getGridData();
		this.addListener();
	}
}
</script>