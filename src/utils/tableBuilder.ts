import { isNotEmpty, isEmpty, getId, getTags, mkElmt , equalsThenExcute} from './common.js'
/**
	작성자 : Park GyuIl
	작성일자 : 2023-06-11
	목적 : 일좀 줄이자...
 */

const defaultTextWitdh	 = '100px';
const defaultHeight		 = '40px';
const defaultTableClass = ['table','table-bordered', 'table-hover'];

export const DataType = {
	TEXT	  : "TEXT",
	TEXTAREA  : "TEXTAREA",
	READ_ONLY : "READ_ONLY",
	SELECT	  : "SELECT",
	COMBO	  : "COMBO",
	CHECK	  : "CHECKBOX",
	RADIO	  : "RADIO",
	HIDDEN	  : "HIDDEN",
	BUTTON	  : "BUTTON"
}

export const ALIGN = {
	CENTER	: "CENTER",
	LEFT	: "LEFT",
	RIGHT	: "RIGHT"
}

const defaultDataType  	 = DataType.TEXT;
const cspan = '#cspan';
const rspan = '#rspan';

export class HeaderInfo{
	private _colId: string ='';
	private _width: string = defaultTextWitdh;
	private _height: string = defaultHeight;
	private _dtType: string = DataType.TEXT;
	private _colIdx: number = -1;
	private _align: string = ALIGN.CENTER;

	constructor(){}

	public getColId(): string{
		return this._colId;
	}

	public setColId(colId: string): void{
		this._colId = colId;
	}

	public getWidth(): string {
		return this._width;
	}

	public setWidth(width: string): void{
		if(this._width == "*"){
			this._width = "100%";
		}else{
			this._width = width;
		}
	}

	public getHeight(): string {
		return this._height;
	}

	public setHeight(height: string): void{
		this._height = height;
	}

	public getDtType(): string {
		return this._dtType;
	}

	public setDtType(dtType: string): void{
		this._dtType = dtType;
	}

	public getColIdx(): number {
		return this._colIdx;
	}

	public setColIdx(colIdx: number): void{
		this._colIdx = colIdx;
	}

	public getAlign(): string{
		return this._align;
	}

	public setAlign(align: string): void{
		this._align = align;
	}
}

export class HeaderInfoBuilder{
	private colId: string ='';
	private width: string = defaultTextWitdh;
	private height: string = defaultHeight;
	private dtType: string = DataType.TEXT;
	private colIdx: number = -1;
	private align: string = ALIGN.CENTER;

	public setColId(id: string){
		if(isNotEmpty(id)){
			this.colId = id;
		}
		return this;
	}

	public setWidth(w: string){
		if(isNotEmpty(w)){
			this.width = w;
		}
		return this;
	}

	public setHeight(h: string) {
		if(isNotEmpty(h)){
			this.height = h;
		}
		return this;
	}

	public setDateType(dt: string) {
		this.dtType = defaultDataType;
		if(isNotEmpty(dt) && dt.toUpperCase().trim() != defaultDataType){
			this.dtType = dt;
		}
		return this;
	}

	public setAlign(a: string) {
		this.align = ALIGN.CENTER;
		if(isNotEmpty(a)){
			this.align = a;
		}
		return this;
	}

	public setColIdx(idx: number) {
		if(isNotEmpty(idx)){
			if(idx > -1){
				this.colIdx = idx;
			}else{
				alert('colIdx는 음수로 설정할 수 업습니다.');
			}
		}else{
			alert('유효하지 않은 colIndex:'+idx);
		}
		return this;
	}

	public build(): HeaderInfo {
		var info = new HeaderInfo() as HeaderInfo;
		info.setColId(this.colId);
		info.setColIdx(this.colIdx);
		info.setAlign(this.align);
		info.setDtType(this.dtType);
		info.setWidth(this.width);
		info.setHeight(this.height);

		return info;
	}
}

/* */
export const GRID_MSG = {
	INSERT	: '추가',
	UPDATE	: '수정',
	DELETE	: '삭제'
}

export class SelectInfo{
	private _options: Map<string, OptionInfo[]> = new Map<string, OptionInfo[]>();
	private _emptyOpt: boolean = false;

	get options(){
		return this._options;
	}

	get emptyOpt(){
		return this._emptyOpt;
	}

	set emptyOpt(emptyOpt: boolean){
		this._emptyOpt = emptyOpt;
	}

	public optionInfoList(cellId:string): OptionInfo[]{
		if(!this._options.has(cellId)){
			const opts = [] as OptionInfo[];
			this._options.set(cellId, opts);
		}

		return this._options.get(cellId) as OptionInfo[];
	}

	public addOptions(cellId:string, opt: OptionInfo){
		this.optionInfoList(cellId).push(opt);
	}

	public createSelectBox(cellId: string): HTMLSelectElement{
		let selectBox = mkElmt('SELECT') as HTMLSelectElement

		if(this.emptyOpt){
			let totalOpt = mkElmt('OPTION') as HTMLOptionElement;
			totalOpt.text = '';
			totalOpt.value = '';
			selectBox.options.add(totalOpt);
		}

		this.optionInfoList(cellId).forEach((option: OptionInfo)=>{
			let opt = option.createOption();
			selectBox.options.add(opt);
		});

		return selectBox;
	}
}

export class OptionInfo{
	private _value: string = "";
	private _text: string = "";

	get value(){
		return this._value;
	}

	set value(value: string){
		this._value = value;
	}

	get text(){
		return this._text;
	}

	set text(text: string){
		this._text = text;
	}

	public createOption(): HTMLOptionElement{
		const opt = mkElmt('OPTION') as HTMLOptionElement;
		opt.text = this.text;
		opt.value = this.value
		return opt;
	}
}

export class TableBuilder{
	idToIndex: Map<string, number> = new Map<string, number>();;
	headTxts: string[][] = [];
	headers: HeaderInfo[] = [];
	parentId: string;
	selectInfo: SelectInfo = new SelectInfo();

	constructor(_parentId:string){
		this.parentId = _parentId;
	}
	
	getIdToIndex(){
		return this.idToIndex;
	}

	getParentId(): string{
		return this.parentId;
	}

	getHeadTxts(): string[][]{
		return this.headTxts;
	}

	getHeaders(): HeaderInfo[]{
		return this.headers;
	}

	public clear(){
		var tbody = this.getTbody();
		tbody.innerHTML = '';
		return this;
	}

	public setGridId(id: string){
		this.parentId = id;
		return this;
	}

	public setIdToIndex (_headers: HeaderInfo[]){
		var self = this;
		_headers.forEach(function(headInfo){
			self.getIdToIndex().set(headInfo.getColId(), headInfo.getColIdx());
		});
	}

	public setHeaders (_headers: HeaderInfo[]){
		if(isNotEmpty(_headers)){
			this.headers = _headers;
			this.setIdToIndex(_headers);
		}
		return this;
	}

	public getTable(): HTMLTableElement|null{
		let table = getTags('TABLE', getId(this.getParentId()) as HTMLElement);
		return table?.item(0) as HTMLTableElement | null;
	}

	public setHeadText(_headerText: string[][]){
		if(isNotEmpty(_headerText) && Array.isArray(_headerText) && _headerText.length > 0){
			var firstRow = _headerText[0];
			if(isNotEmpty(firstRow) && Array.isArray(firstRow)){
				this.headTxts = _headerText;
			}
		}
		return this;
	}

	public build() {
		var table = mkElmt('TABLE') as HTMLTableElement;
		
		var tHead = mkElmt('THEAD');
		var tBody = mkElmt('TBODY');
		var tFoot = mkElmt('TFOOT');
		table.appendChild(tHead);
		table.appendChild(tBody);
		table.appendChild(tFoot);
		defaultTableClass.forEach(function(_class){
			table.classList.add(_class);
		});
		var parentElement = document.getElementById(this.getParentId()) as HTMLElement;
		parentElement.appendChild(table);
		this.setHeader();
		return this;
	}

	public setHeader(){
		var headerInfo = this.getHeadTxts();
		var colInfo = this.getHeaders();
		var tHead = this.getTHead() as HTMLTableSectionElement;
		var ths = [] as HTMLTableCellElement[][];
		var self = this;
		//유효성체크
		if(isNotEmpty(tHead) && isNotEmpty(headerInfo) && isNotEmpty(colInfo)){
			headerInfo.forEach(function(headList, rowIdx){
				var headers = [] as HTMLTableCellElement[];
				headList.forEach(function (headTxt, colIdx){
					var isCspan = equalsThenExcute(headTxt, cspan, function(){
						let beforeCell = headers[headers.length - 1] as HTMLTableCellElement;
						let colSpan:number = beforeCell.colSpan;
						beforeCell.colSpan = colSpan + 1;
					});
					
					var isRspan = equalsThenExcute(headTxt, rspan, function(){
						let beforeRowCell = ths[rowIdx-1][colIdx];
						let rowSpan:number = beforeRowCell.rowSpan;
						beforeRowCell.rowSpan = rowSpan + 1;
					});
					
					var allCheck = function(){
						var rows = self.getRows();

						for(var rowIdx = 0; rowIdx < rows.length; rowIdx++){
							var checkbox = self.getCellChild(rowIdx, colIdx) as HTMLInputElement;
							var value = (headers[colIdx].children[0] as HTMLInputElement).checked;
							checkbox.checked = value;
						}
					};
					
					if(!isCspan && !isRspan){
						var th = mkElmt('TH') as HTMLTableCellElement;
						th.style.width = colInfo[colIdx].getWidth();
						th.style.height = '90%';
						th.style.verticalAlign = 'middle';
						th.classList.add('th');
						if(headTxt == 'chkbox'){
							let checkbox = mkElmt('INPUT') as HTMLInputElement;
							checkbox.type = 'CHECKBOX';
							checkbox.onclick = allCheck;
						}else{
							let input = mkElmt('INPUT') as HTMLInputElement|HTMLLabelElement|HTMLSelectElement;
							let dataType = self.getCellTypeByIndex(colIdx);
							if(dataType == DataType.HIDDEN){
								input = input as HTMLInputElement
								input.type = 'TEXT';
								input.value = headTxt;
								input.setAttribute("disabled", 'disabled');
								th.hidden = true;
							}else if(dataType == DataType.CHECK){
								input = input as HTMLInputElement
								input.type = 'CHECKBOX';
								input.onclick = allCheck;
							}else{
								input = document.createElement('LABEL') as HTMLLabelElement;
								input.textContent = headTxt;
								th.appendChild(input);
								th.hidden = false;
							}
							
							input.style.width = '100%';
							input.style.margin = 'auto';
							input.style.padding = 'auto';
							self.setAlign(colInfo[colIdx], th, input);
							th.appendChild(input);
						}
						headers[colIdx] = th;
					}
				});
				ths.push(headers);
			});
		}
		//헤더 셋팅
		ths.forEach((item, index)=>{
			var tr = mkElmt('TR');
			ths[index].forEach((y, tidx)=>{
				tr.appendChild(ths[index][tidx]);				
			})
			tHead.appendChild(tr);
		})
	}

	getTHead(): HTMLTableSectionElement | null | undefined{
		return this.getTable()?.tHead;
	}

	public remakeFromJSONListToData(data:[]){
		var builder = this;
		data.forEach(function(item){
			builder.addRowData(item);
		});
	}
		
	public makeTree(data: any){
		var row = (this.getTbody() as HTMLTableSectionElement).insertRow(-1) as HTMLTableRowElement;
		var self = this;

		this.getHeaders().forEach(function(header, idx){
			self.setCell(header, idx, row, data);
		});
		
		data.children.forEach(function(item: any){
			self.makeTree(item);
		});
		return this;
	}
	
	public setCell(header: HeaderInfo, idx: number, row: HTMLTableRowElement, data: any){
		var cell = row.insertCell(idx) as HTMLTableCellElement;
		cell.style.alignContent= "center";
		cell.style.width = header.getWidth();
		let child = this.setType(header);
		this.setAlign(header, cell, child);
		this.setValue(child, header, data);
		cell.appendChild(child);
		
		if(this.getCellTypeByIndex(idx) == DataType.HIDDEN){
			cell.hidden = true;
		}
	}
	
	public setType(header: HeaderInfo){
		var dataType = header.getDtType();
		if(dataType == DataType.HIDDEN){
			const child = mkElmt('INPUT') as HTMLInputElement
			child.type = 'HIDDEN';
			return child;
		}else if(dataType == DataType.READ_ONLY){
			const child = mkElmt('INPUT') as HTMLInputElement
			child.setAttribute("disabled","disabled");
			return child;
		}else if(dataType == DataType.TEXTAREA){
			const child = mkElmt('TEXTAREA') as HTMLTextAreaElement;
			return child;
		}else if(dataType == DataType.CHECK){
			const child = mkElmt('INPUT') as HTMLInputElement
			child.type = 'CHECKBOX';
			child.value = "0";
			child.checked = false;
			return child;
		}else if(dataType == DataType.BUTTON){
			const child = mkElmt('INPUT') as HTMLInputElement
			child.type	= 'BUTTON';
			return child;
		}else if(dataType == DataType.SELECT){
			const child = this.createSelectBox(header.getColId()) as HTMLSelectElement;
			return child;
		}else{
			const child = mkElmt('INPUT') as HTMLInputElement
			child.type = 'TEXT';
			return child;
		}
	}
	
	public setAlign (header: HeaderInfo, cell: HTMLTableCellElement, child: HTMLElement){
		var align = header.getAlign();
		cell.style.alignContent = 'center';
		if(align == ALIGN.LEFT){
			child.style.textAlign = "start";
		}else if(align == ALIGN.CENTER){
			child.style.textAlign = "center";
		}else{
			child.style.textAlign = "end";
		}
	}
	
	public setValue(child: HTMLElement, header: HeaderInfo, data: any){
		var id = header.getColId();
		var rowCnt = this.getRows().length;
		if(id == 'no'){
			(child as HTMLInputElement).value = rowCnt+"";
		}else{
			var value = data[id];
			if(isEmpty(value)){
				value = '';
			}else{
				if(header.getDtType() == DataType.CHECK){
					if(value == 1){
						(child as HTMLInputElement).checked = true;
					}else{
						(child as HTMLInputElement).checked = false;
						value == 0;
					}
				}
				
				if(header.getDtType() == DataType.SELECT){
					var length = (child as HTMLSelectElement).options.length;
					for(var i = 0; i < length; i++){
						if((child as HTMLSelectElement).options[i].value == value){
							(child as HTMLSelectElement).options[i].selected = true;
						}
					}
				}else{
					(child as HTMLInputElement).value = value;
				}
			}
		}
		child.style.width = header.getWidth() == '*' || header.getWidth() == '' || header.getWidth() == null ? '100%': header.getWidth();
	}
	
	public getTbody(): HTMLTableSectionElement{
		return this.getTable()?.tBodies[0] as HTMLTableSectionElement;
	}
	
	public getRows(): HTMLCollectionOf<HTMLTableRowElement>{
		return this.getTbody().rows as HTMLCollectionOf<HTMLTableRowElement>;
	}
	
	public getRow(idx: number): HTMLTableRowElement{
		return this.getRows().item(idx) as HTMLTableRowElement;
	}
	
	public getCells(rowIdx: number): HTMLCollectionOf<HTMLTableCellElement>{
		return this.getRow(rowIdx).cells;
	}
	
	public getCell(rowIdx: number, cellIdx: number): HTMLTableCellElement{
		return this.getCells(rowIdx).item(cellIdx) as HTMLTableCellElement;
	}
	
	public getCellById(rowIdx: number,cellId: string): HTMLTableCellElement{
		return this.getCell(rowIdx, this.getColIndex(cellId));
	}
	
	public getCellValueById(rowIdx:number, cellId:string): string{
		return this.getCellValue(rowIdx, this.getColIndex(cellId));
	}
	
	public getCellChild(rowIdx: number ,cellIndex: number): HTMLElement{
		return this.getCell(rowIdx,cellIndex).children[0] as HTMLElement;
	}
	
	public getCellChildById(rowIdx: number,cellId:string): HTMLElement{
		return this.getCellChild(rowIdx, this.getIdToIndex().get(cellId) as number);
	}
	
	public setCellChildById(rowIdx: number ,cellId: string, element: HTMLElement): HTMLInputElement|HTMLTextAreaElement{
		return this.setCellChild(rowIdx,this.getIdToIndex().get(cellId) as number, element);
	}
	
	public setCellChild(rowIdx: number,cellIndex: number, element: HTMLElement): HTMLInputElement|HTMLTextAreaElement{
		this.getCell(rowIdx,cellIndex).innerHTML = '';
		this.getCell(rowIdx,cellIndex).append(element);
		return this.getCell(rowIdx,cellIndex).lastChild as HTMLInputElement|HTMLTextAreaElement;
	}
	
	public getCellValue(rowIdx: number, cellIndex: number): string {
		return (this.getCell(rowIdx,cellIndex).firstChild as HTMLInputElement|HTMLTextAreaElement).value;
	}
	
	public setCellValueById(rowIdx: number, cellId: string, _value: string): void{
		(this.getCell(rowIdx,this.getColIndex(cellId)).firstChild as HTMLInputElement|HTMLTextAreaElement).value=_value;
	}
	
	public setCellValue(rowIdx: number,cellIndex: number, _value: any): void{
		this.getCell(rowIdx,cellIndex).children[0].nodeValue = _value;
	}
	
	public getColId(cellIndex: number): string{
		return this.getHeaders()[cellIndex].getColId();
	}
	
	public getColIndex(cellId: string): number{
		return this.getIdToIndex().get(cellId) as number;
	}
	
	public getRowData(rowIdx: number): any{
		var data = {} as any;
		var cells = this.getCells(rowIdx);
		for(var cell of cells){
			let c = (cell as HTMLTableCellElement);
			data[this.getColId(c.cellIndex)] = this.getCellValue(rowIdx, c.cellIndex);
		};
		return data;
	}
	
	public getCellTypeByIndex(cellIndex: number): string{
		return this.headers[cellIndex].getDtType();
	}
	
	public getCellTypeById(cellId: string): string{
		return this.getCellTypeByIndex(this.getIdToIndex().get(cellId) as number);
	}
	
	public addRowData(item: any): void{
		var tr = this.getTbody().insertRow(-1);
		var builder = this;
		this.getHeaders().forEach(function(col){
			builder.setCell(col, col.getColIdx(), tr, item);
		});
	}
	
	/**
		writer	: gyuil
		date	: 2023-07-22
		목적		: 테이블의 값 비활성화
		파라미터 : {
			rowIdx	: 행의 인덱스
			cellId : 열의 ID
		}
	 */
	public disabledCellById(rowIdx: number, cellId: string): void{
		this.disabledCell(rowIdx, this.getColIndex(cellId));
	}
	/**
		writer	: gyuil
		date	: 2023-05-28
		목적		: 테이블의 값의 비활성화 여부 확인
		파라미터 : {
			rowIdx	: 행의 인덱스
			cellIdx : 열의 인덱스
		}
	 */
	public isDisabledCell(rowIdx: number, cellIdx: number):boolean {
		return (this.getCell(rowIdx, cellIdx).firstChild as HTMLInputElement|HTMLTextAreaElement).disabled;
	}
	/**
		writer	: gyuil
		date	: 2023-05-28
		목적		: 테이블의 값의 비활성화 여부 확인
		파라미터 : {
			rowIdx	: 행의 인덱스
			cellId : 열의 식별자
		}
	 */
	public isDisabledCellById(rowIdx: number, cellId: string):boolean {
		let cellIdx = this.idToIndex.get(cellId) as number;
		return this.isDisabledCell(rowIdx, cellIdx);
	}

	/**
		writer	: gyuil
		date	: 2023-07-22
		목적		: 테이블의 값 비활성화
		파라미터 : {
			rowIdx	: 행의 인덱스
			cellIdx : 열의 인덱스
		}
	 */
	public disabledCell(rowIdx: number, cellIdx: number): void{
		(this.getCell(rowIdx, cellIdx).firstChild as HTMLInputElement|HTMLTextAreaElement).disabled=true;
	}
	/**
		writer	: gyuil
		date	: 2023-07-22
		목적		: 테이블의 값 활성화
		파라미터 : {
			rowIdx	: 행의 인덱스
			cellId : 열의 ID
		}
	 */
	public notDisabledCellById(rowIdx: number, cellId: string): void{
		this.notDisabledCell(rowIdx, this.getColIndex(cellId));
	}
	
	/**
		writer	: gyuil
		date	: 2023-07-22
		목적		: 테이블의 값 활성화
		파라미터 : {
			rowIdx	: 행의 인덱스
			cellIdx : 열의 인덱스
		}
	 */
	public notDisabledCell(rowIdx: number, cellIdx: number): void{
		(this.getCell(rowIdx, cellIdx).firstChild as HTMLInputElement|HTMLTextAreaElement).disabled=false;
	}
	
	/**
		writer	: gyuil
		date	: 2023-07-22
		목적		: 셀의 이벤트 추가.
		파라미터 : {
			rowIdx	: 행의 인덱스
			cellIdx : 열의 인덱스
			type	: 이벤트 타입
			fn		: 액션
		}
	 */
	public addEventCell(rowIdx: number, cellIdx: number, type: string, fn: any){
		this.getCell(rowIdx, cellIdx).addEventListener(type, fn);
	}
	
	/**
		writer	: gyuil
		date	: 2023-07-22
		목적		: 셀의 이벤트 추가.
		파라미터 : {
			rowIdx	: 행의 인덱스
			cellId	: 열의 ID
			type	: 이벤트 타입
			fn		: 액션
		}
	 */
	public addEventCellById(rowIdx:number, cellId: string, type: string, fn:any): void{
		this.addEventCell(rowIdx, this.getIdToIndex().get(cellId) as number, type, fn);
	}
	
	/**
		writer	: gyuil
		date	: 2023-07-22
		목적		: 셀의 이벤트 추가.
		파라미터 : {
			rowIdx	: 행의 인덱스
			type	: 이벤트 타입
			fn		: 액션
		}
	 */
	public addEventRow(rowIdx: number, type: string, fn: any | null){
		var cells = this.getCells(rowIdx);
		
		for(var i = 0; i < cells.length; i++ ){
			(cells[i].lastChild as HTMLInputElement|HTMLTextAreaElement).addEventListener(type, fn);
		}
	}
	
	/**
		writer	: gyuil
		date	: 2023-08-06
		목적		: 셀의 버튼 추가.
		파라미터 : {
			rowIdx	: 버튼생성
			type	: 이벤트 타입
			fn		: 액션
		}
	 */
	public getBtnById(rowIdx: number, cellId: string, btnName: string, fn: any):void{
		var cell = this.getBtn(rowIdx, this.getIdToIndex().get(cellId) as number, btnName, fn);
	}
	
	/**
		writer	: gyuil
		date	: 2023-08-06
		목적		: 셀의 버튼 추가.
		파라미터 : {
			rowIdx	: 버튼생성
			type	: 이벤트 타입
			fn		: 액션
		}
	 */
	public getBtn(rowIdx: number, cellIdx: number, btnName: string, fn: any): void{
		var btn = this.getCellChild(rowIdx,cellIdx) as HTMLInputElement;
		if(isEmpty(btn)){
			btn = mkElmt('INPUT') as HTMLInputElement;
		}
		btn.type = 'BUTTON';
		btn.value=btnName;
		btn.onclick= fn;
	
		this.setCellChild(rowIdx, cellIdx, btn);
	}
	/**
		작성자	: gyuil
		목적		: 팝업창 열기
		파라미터 : {
			rowIdx	: row의 인덱스
			cellId  : cell의 id
			btnName : 버튼명
			fn		: 버튼을 클릭시 수행되는 함수
		}
	 */	
	public getBtnPopById(rowIdx: number, cellId: string, btnName:string, fn: any): void{
		var cell = this.getBtnPop(rowIdx, this.getIdToIndex().get(cellId) as number, btnName, fn);
	}
	
	/**
		writer	: gyuil
		date	: 2023-08-06
		목적		: 셀의 버튼 추가.
		파라미터 : {
			rowIdx	: 버튼생성
			type	: 이벤트 타입
			fn		: 액션
		}
	 */
	public getBtnPop(rowIdx: number, cellIdx: number, btnName: string, fn: any): void{
		var btn = this.getCellChild(rowIdx,cellIdx) as HTMLInputElement;
		if(isEmpty(btn)){
			btn = mkElmt('INPUT')  as HTMLInputElement;
		}
		btn.type = 'BUTTON';
		btn.value=btnName;
		btn.setAttribute("target", '_blank');
		btn.onclick=fn;
		this.setCellChild(rowIdx, cellIdx, btn);
	}
	/**
		작성자	: gyuil
		목적		: 특정 행 삭제
		파라미터 : {
			rowIdx	:  row의 인덱스
		}
	 */
	public deleteRow(rowIdx: number): void{
		this.getTbody().deleteRow(rowIdx);
	}
	/**
		작성자	: gyuil
		목적		: 선택박스의 옵션을 추가
	 */
	public addSelectOptions(cellId: string, opt: OptionInfo){
		this.selectInfo.addOptions(cellId, opt);
	}

	public createSelectBox(cellId: string): HTMLSelectElement{
		return this.selectInfo.createSelectBox(cellId);
	}

	public setEmptyOption(){
		this.selectInfo.emptyOpt = true;
	}
}