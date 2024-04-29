/**
	작성자 : Park GyuIl
	작성일자 : 2023-06-11
	목적 : 일좀 줄이자...
 */

const defaultTextWitdh	 = '100px';
const defaultHeight		 = '40px';

const CheckType = {
	CHECK	: true,
	UNCHECK : false
}

const defaultTableClass = ['table','table-bordered', 'table-hover'];

const DataType = {
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

const ALIGN = {
	CENTER	: "CENTER",
	LEFT	: "LEFT",
	RIGHT	: "RIGHT"
}

const defaultDataType  	 = DataType.TEXT;
const cspan = '#cspan';
const rspan = '#rspan';

function HeaderInfoBuilder(){
	colId	 = '',
	width	 = defaultTextWitdh,
	heigth	 = defaultHeight,
	dtType	 = DataType.TEXT,
	colIdx	 = -1
}

HeaderInfoBuilder.prototype.setColId = function(id) {
	if(isNotEmpty(id)){
		this.colId = id;
	}
	return this;
}

HeaderInfoBuilder.prototype.setWidth = function(w) {
	if(isNotEmpty(w)){
		this.width = w;
	}
	return this;
}

HeaderInfoBuilder.prototype.setHeight = function(h) {
	if(isNotEmpty(h)){
		this.heaight = h;
	}
	return this;
}

HeaderInfoBuilder.prototype.setDateType = function(dt) {
	this.dtType = defaultDataType;
	if(isNotEmpty(dt) && dt.toUpperCase().trim() != defaultDataType){
		this.dtType = dt;
	}
	return this;
}

HeaderInfoBuilder.prototype.setAlign = function(a) {
	this.align = ALIGN.CENTER;
	if(isNotEmpty(a)){
		this.align = a;
	}
	return this;
}

HeaderInfoBuilder.prototype.setColIdx = function(idx) {
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

HeaderInfoBuilder.prototype.build = function() {
	var info = {};
	if(isEmpty(this.colId)){
		alert('colID를 설정해주세요.');
	}else{
		for(var key in this){
			info[key] = this[key];
		}
	}
	return info;
}
/* */
const GRID_MSG = {
	INSERT	: '추가',
	UPDATE	: '수정',
	DELETE	: '삭제'
}

function TableBuilder(){
	idToIndex	= {},
	currentRow	= null,
	currentCell	= null,
	headTxts	= [],
	headers		= [],
	parentId	= null
}

TableBuilder.prototype.setGridId = function(id){
	this.parentId = id;
	return this;
}

TableBuilder.prototype.setIdToIndex = function(_headers){
	var self = this;
	_headers.forEach(function(headInfo){
		this.idToIndex[headInfo.colId] = headInfo.colIdx;
		self.getIdToIndex()[headInfo.colId] = headInfo.colIdx;
	});
}

TableBuilder.prototype.getIdToIndex = function(){
	if(isEmpty(this.idToIndex)){
		this.idToIndex = {};
	}
	return this.idToIndex;
}

TableBuilder.prototype.setHeaders = function(_headers){
	if(isNotEmpty(_headers)){
		if(Array.isArray(_headers)){
			this.headers = _headers;
			this.setIdToIndex(_headers);
		}
	}
	return this;
}

TableBuilder.prototype.getTable = function(){
	return getTags('TABLE', getId(this.parentId))[0];
}

TableBuilder.prototype.setHeadText = function(_headerText){
	if(isNotEmpty(_headerText) && Array.isArray(_headerText) && _headerText.length > 0){
		var firstRow = _headerText[0];
		if(isNotEmpty(firstRow) && Array.isArray(firstRow)){
			this.headTxts = _headerText;
		}
	}
	return this;
}

TableBuilder.prototype.build = function() {
	var table = mkElmt('TABLE');
	table.width		= '90%';
	table.summary	= '테스트용 빌더';
	
	var tHead = mkElmt('THEAD');
	var tBody = mkElmt('TBODY');
	var tFoot = mkElmt('TFOOT');
	table.appendChild(tHead);
	table.appendChild(tBody);
	table.appendChild(tFoot);
	defaultTableClass.forEach(function(_class){
		table.classList.add(_class);
	});
	var parentElement = document.getElementById(this.parentId);
	parentElement.appendChild(table);
	this.setHeader();
	return this;
}

TableBuilder.prototype.remakeFromJSONListToData = function(data){
	var builder = this;
	data.forEach(function(item){
		builder.addRowData(item);
	});
}
	
TableBuilder.prototype.makeTree = function(data, tbody){
	var row = tbody.insertRow(-1);
	this.headers.forEach(function(header, idx){
		this.setCell(header, idx, row, data);
	});
	
	var self = this;
	
	data.children.forEach(function(item){
		self.makeTree(item, tbody);
	});
	return this;
}

TableBuilder.prototype.setCell = function(header, idx, row, data){
	var cell = row.insertCell(idx);
	cell.align = "center";
	var child = mkElmt('INPUT');
	this.setType(child, header);
	this.setAlign(header, cell, child);
	this.setValue(child, header,data);
	cell.appendChild(child);
	
	if(this.getCellTypeByIndex(idx) == DataType.HIDDEN){
		cell.hidden = true;
	}
}

TableBuilder.prototype.setType = function(child, header){
	var dataType = header.dtType
	child.type="TEXT";
	if(dataType == DataType.HIDDEN){
		child.type = 'HIDDEN';
	}else if(dataType == DataType.READ_ONLY){
		child.disabled = 'disabled';
	}else if(dataType == DataType.TEXTAREA){
		child = mkElmt('TEXTAREA');
	}else if(dataType == DataType.CHECK){
		child.type = 'CHECKBOX';
		child.value = 0;
		child.checked = false;
	}else if(dataType == DataType.BUTTON){
		child.type	= 'BUTTON';
	}else{
		child.type = 'TEXT';
	}
}

TableBuilder.prototype.setAlign = function (header, cell, child){
	var align = header.align;
	cell.align = 'center';
	if(align == ALIGN.LEFT){
		child.style.textAlign = "start";
	}else if(align == ALIGN.CENTER){
		child.style.textAlign = "center";
	}else{
		child.style.textAlign = "end";
	}
}

TableBuilder.prototype.setValue = function(child, header, data){
	var id = header.colId;
	var rowCnt = this.getRows().length;
	if(id == 'no'){
		child.value = rowCnt;
	}else{
		var value = data[header.colId];
		if(isEmpty(value)){
			value = '';
		}else{
			if(header.dtType == DataType.CHECK){
				if(value == 1){
					child.checked = true;
				}else{
					child.checked = false;
					value == 0;
				}
			}
		}
		child.value = value;
	}
	child.style.width = header.width;
}

TableBuilder.prototype.createChkbox = function(child){
	child.type = 'checkbox';
	if(data[header.colId] == '1'){
		child.checked = true;
		child.value = 1;
	}else{
		child.checked = false;
		child.value = 0;
	}
}

TableBuilder.prototype.setHeader = function(){
	var headerInfo = this.headTxts;
	var colInfo = this.headers;
	var tHead = this.getTHead();
	var ths = [];
	var self = this;
	//유효성체크
	if(isNotEmpty(tHead) && isNotEmpty(headerInfo) && isNotEmpty(colInfo)){
		headerInfo.forEach(function(headList, rowIdx){
			var headers = [];
			headList.forEach(function (headTxt, colIdx){
				var isCspan = equalsThenExcute(headTxt, cspan, function(){
					var beforeCell = headers[headers.length - 1];
					beforeCell.colSpan = beforeCell.colSpan + 1;
				});
				
				var isRspan = equalsThenExcute(headTxt, rspan, function(){
					var beforeRowCell = ths[rowIdx-1][colIdx];
					beforeRowCell.rowSpan = beforeRowCell.rowSpan + 1;
				});
				
				var allCheck = function(){
					var rows = self.getRows();
					rows.forEach(function(row, rowIdx){
						var checkbox = self.getCellChild(rowIdx, colIdx);
						var value = headers[colIdx].children[0].checked;
						checkbox.checked = value;
					});
				};
				
				if(!isCspan && !isRspan){
					var th = mkElmt('TH');
					th.style.width = colInfo[colIdx].width;
					th.style.height = '90%';
					th.style.verticalAlign = 'middle';
					th.classList.add('th');
					if(headTxt == 'chkbox'){
						var checkbox = mkElmt('INPUT');
						checkbox.type = 'CHECKBOX';
						checkbox.onclick = allCheck;
					}else{
						var input = mkElmt('INPUT');
						var dataType = self.getCellTypeByIndex(colIdx);
						if(dataType == DataType.HIDDEN){
							input.type = 'TEXT';
							input.value = headTxt;
							input.disabled = 'disabled';
							th.hidden = true;
						}else if(dataType == DataType.CHECK){
							input.type = 'CHECKBOX';
							input.onclick = allCheck;
						}else{
							input.type = 'TEXT';
							input.value = headTxt;
							input.disabled = 'disabled';
							th.appendChild(input);
							th.hidden = false;
						}
						
						input.style.width = '100%';
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
	for(headers in ths){
		var tr = mkElmt('TR');
		for(td in ths[headers]){
			tr.appendChild(ths[headers][td]);
		}
		tHead.appendChild(tr);
	}
}

TableBuilder.prototype.clear = function(){
	var tbody = this.getTbody();
	tbody.innerHTML = '';
}

TableBuilder.prototype.getTHead = function(){
	return getTags('THEAD',this.getTable())[0];
}

TableBuilder.prototype.getTbody = function(){
	return getTags('TBODY',this.getTable())[0];
}

TableBuilder.prototype.getRows = function(){
	var _rows = [];
	for(var i = 0; i < this.getTbody().rows.length; i++){
		_rows.push(this.getTbody().rows[i]);
	}
	return _rows;
}

TableBuilder.prototype.getRow = function(idx){
	return this.getRows()[idx];
}

TableBuilder.prototype.getCells = function(rowIdx){
	return this.getRow(rowIdx).children;
}

TableBuilder.prototype.getCell = function(rowIdx,cellIdx){
	return this.getCells(rowIdx)[cellIdx];
}

TableBuilder.prototype.getCellById = function(rowIdx,cellId){
	return this.getCell(rowIdx, this.getColIndex(cellId));
}

TableBuilder.prototype.getCellValueById = function(rowIdx, cellId){
	return this.getCellValue(rowIdx, this.getColIndex(cellId));
}

TableBuilder.prototype.getCellChild = function(rowIdx,cellIndex){
	return this.getCell(rowIdx,cellIndex).children[0];
}

TableBuilder.prototype.getCellChildById = function(rowIdx,cellId){
	return this.getCellChild(rowIdx, this.getIdToIndex()[cellId]);
}

TableBuilder.prototype.setCellChildById = function(rowIdx,cellId, element){
	return this.setCellChild(rowIdx,this.getIdToIndex()[cellId], element);
}

TableBuilder.prototype.setCellChild = function(rowIdx,cellIndex, element){
	this.getCell(rowIdx,cellIndex).innerHTML = '';
	this.getCell(rowIdx,cellIndex).append(element);
	return this.getCell(rowIdx,cellIndex).lastChild;
}

TableBuilder.prototype.getCellValue = function(rowIdx,cellIndex){
	return this.getCell(rowIdx,cellIndex).children[0].value;
}

TableBuilder.prototype.setCellValueById = function(rowIdx, cellId, _value){
	this.getCell(rowIdx,this.getColIndex(cellId)).children[0].value = _value;
}

TableBuilder.prototype.setCellValue = function(rowIdx,cellIndex, _value){
	this.getCell(rowIdx,cellIndex).children[0].value = _value;
}

TableBuilder.prototype.getColId = function(cellIndex){
	return this.headers[cellIndex].colId;
}

TableBuilder.prototype.getColIndex = function(cellId){
	return this.getIdToIndex()[cellId];
}

TableBuilder.prototype.getRowData = function(rowIdx){
	var data = {};
	var cells = this.getCells(rowIdx);
	for(var cell of cells){
		data[this.getColId(cell.cellIndex)] = this.getCellValue(rowIdx, cell.cellIndex);
	};
	return data;
}

TableBuilder.prototype.getCellTypeByIndex = function(cellIndex){
	return this.headers[cellIndex].dtType;
}

TableBuilder.prototype.getCellTypeById = function(cellId){
	return this.getCellTypeByIndex(this.getIdToIndex()[cellId]);
}

TableBuilder.prototype.addRowData = function(item){
	var tbody = this.getTbody();
	var tr = tbody.insertRow(-1);
	var builder = this;
	this.headers.forEach(function(col){
		builder.setCell(col, col.colIdx, tr, item);
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
TableBuilder.prototype.disabledCellById = function(rowIdx, cellId){
	this.disabledCell(rowIdx, this.getColIndex(cellId));
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
TableBuilder.prototype.disabledCell = function(rowIdx, cellIdx){
	this.getCell(rowIdx, cellIdx).lastChild.disabled = true;
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
TableBuilder.prototype.notDisabledCellById = function(rowIdx, cellId){
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
TableBuilder.prototype.notDisabledCell = function(rowIdx, cellIdx){
	this.getCell(rowIdx, cellIdx).lastChild.disabled = false;
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
TableBuilder.prototype.addEventCell = function(rowIdx, cellIdx, type, fn){
	this.getCell(rowIdx, cellIdx).addEventListener(type, fn());
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
TableBuilder.prototype.addEventCellById = function(rowIdx, cellId, type, fn){
	this.addEventCell(rowIdx, this.getIdToIndex()[cellId], type, fn);
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
TableBuilder.prototype.addEventRow = function(rowIdx, type, fn){
	var cells = this.getCells(rowIdx);
	
	for(var i = 0; i<cells.length; i++ ){
		cells[i].lastChild.addEventListener(type, fn);
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
TableBuilder.prototype.getBtnById = function(rowIdx, cellId, btnName, fn){
	var cell = this.getBtn(rowIdx, this.getIdToIndex()[cellId], btnName, fn);
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
TableBuilder.prototype.getBtn = function(rowIdx, cellIdx, btnName, fn){
	var btn = this.getCellChild(rowIdx,cellIdx);
	if(isEmpty(btn)){
		btn = mkElmt('INPUT');
	}
	btn.type = 'BUTTON';
	btn.value=btnName;
	btn.onclick=fn;
	this.setCellChild(rowIdx, cellIdx, btn);
}

TableBuilder.prototype.getBtnPopById = function(rowIdx, cellId, btnName, fn){
	var cell = this.getBtnPop(rowIdx, this.getIdToIndex()[cellId], btnName, fn);
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
TableBuilder.prototype.getBtnPop = function(rowIdx, cellIdx, btnName, fn){
	var btn = this.getCellChild(rowIdx,cellIdx);
	if(isEmpty(btn)){
		btn = mkElmt('INPUT');
	}
	btn.type = 'BUTTON';
	btn.value=btnName;
	btn.target='_blank';
	btn.onclick=fn;
	this.setCellChild(rowIdx, cellIdx, btn);
}