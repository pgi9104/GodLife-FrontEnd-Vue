function toString(str){
	var result = "";
	if(!typeCheck(str, 'undefined') && !isNull(str)){
		result = str;
	}
	return result;
}

function isEmpty(str){
	var result = false;
	if(typeCheck(str, 'undefined') || isNull(str)){
		if('' == toString(str)){
			result = true;
		}
	}
	return result;
}

function isNotEmpty(str){
	return !isEmpty(str);
}

function caseEmptyThenExcute(obj, fn){
	if(isEmpty(obj) && isNotEmpty(fn)){
		fn(obj);
	}
}

function caseNotEmptyThenExcute(obj, fn){
	if(isNotEmpty(obj) && isNotEmpty(fn)){
		fn(obj);
	}
}

function equalsThenExcute(org, compare, fn){
	var isEquals = false;
	if(org == compare && isNotEmpty(fn)){
		caseNotEmptyThenExcute(org, fn);
		isEquals = true;
	}
	
	return isEquals;
}

function notEqualsThenExcute(org, compare, fn){
	var isNotEquals = false;
	if(org != compare && isNotEmpty(fn)){
		caseNotEmptyThenExcute(org, fn);
		isNotEquals = true;
	}
	
	return isNotEquals;
}

function emptyAlert(str){
	var result = isEmpty(str);
	if(result){
		alert(str + '빈 값입니다.')
	}
	return result;
}

function getId(id, elmt){
	if(isNotEmpty(document.getElementById(id))){
		if(isEmpty(elmt)){
			return document.getElementById(id);
		}else{
			return elmt.getElementById(id);
		}
	}else{
		return null;
	}
}

function getValue(id, elmt){
	return getId(id,elmt).value;
}

function getTags(tag, element){
	if(isEmpty(element)){
		return document.getElementsByTagName(tag);
	}else{
		return element.getElementsByTagName(tag);
	}
}

function typeCheck(obj, type){
	return typeof obj === type;
}

function isNull(obj){
	return obj == null;
}

function mkElmt(element){
	return document.createElement(element);
}

function selectCodeList(codeId){
	var param = {};
	param.code = codeId;
	var codeData = function(data){
		return data;
	}
	getCallReqBodyAjax(param, '/manager/code/selectCodeList.ajax', codeData);
	
	return codeData;
}