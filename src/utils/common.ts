export function toString(str: any): string{
	var result = "";
	if(!typeCheck(str, 'undefined') && !isNull(str)){
		result = str;
	}
	return result;
}

export function isEmpty(str: any): boolean{
	var result = false;
	if(typeCheck(str, 'undefined') || isNull(str)){
		if('' == toString(str)){
			result = true;
		}
	}
	return result;
}

export function isNotEmpty(str: any): boolean{
	return !isEmpty(str);
}

export function caseEmptyThenExcute(obj: any, fn: Function){
	if(isEmpty(obj) && isNotEmpty(fn)){
		fn(obj);
	}
}

export function caseNotEmptyThenExcute(obj: any, fn: Function){
	if(isNotEmpty(obj) && isNotEmpty(fn)){
		fn(obj);
	}
}

export function equalsThenExcute(org: any, compare: any, fn: Function): boolean{
	var isEquals = false;
	if(org == compare && isNotEmpty(fn)){
		caseNotEmptyThenExcute(org, fn);
		isEquals = true;
	}
	
	return isEquals;
}

export function notEqualsThenExcute(org: any, compare: any, fn: Function): boolean{
	var isNotEquals = false;
	if(org != compare && isNotEmpty(fn)){
		caseNotEmptyThenExcute(org, fn);
		isNotEquals = true;
	}
	
	return isNotEquals;
}

export function emptyAlert(str: string): boolean{
	var result = isEmpty(str);
	if(result){
		alert(str + '빈 값입니다.')
	}
	return result;
}

export function getId(id: string): HTMLElement|null{
	return document.getElementById(id);
}

export function getValue(id: string): string|null{
	let el = getId(id) as HTMLInputElement
	return el.value;
}

export function getTags(tag: string, el: HTMLElement): HTMLCollectionOf<Element>|null{
	return el.getElementsByTagName(tag);
}

export function typeCheck(obj: any, type: string): boolean{
	return typeof obj === type;
}

export function isNull(obj: any): boolean{
	return obj == null;
}

export function mkElmt(element: string): HTMLElement{
	return document.createElement(element);
}