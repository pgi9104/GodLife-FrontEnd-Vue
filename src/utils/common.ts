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

export enum HTTP_METHODS{
	GET = 'get',
	POST = 'post',
	PATCH = 'patch',
	DELETE= 'delete',
	PUT = 'put',
}

export enum HTTP_CONTENT_TYPE {
	JSON = "application/json;charset=UTF-8",
}

export class Http{
	_param: any|null;
	_url: string = '';
	_httpMethods: HTTP_METHODS = HTTP_METHODS.GET;
	_successFuntion: Function = function(){};
	_failFunction: Function = function(){};
	_headers: Map<string, string> = new Map<string, string>();
	_async: boolean = false;
	_contentType: HTTP_CONTENT_TYPE = HTTP_CONTENT_TYPE.JSON;

	constructor(){
		this.addHeader('content-type', HTTP_CONTENT_TYPE.JSON);
	}

	public getParam(){
		let p = this._param;
		if(this._contentType === HTTP_CONTENT_TYPE.JSON){
			return JSON.stringify(p);
		}

		return this._param;
	}

	public setParam(param: any|null){
		this._param = param;
	}

	public getUrl(){
		return this._url;
	}

	public setUrl(url: string){
		this._url = url;
	}

	public getHttpMethods(){
		return this._httpMethods;
	}

	public get(){
		this._httpMethods = HTTP_METHODS.GET;
		return this;
	}

	public post(){
		this._httpMethods = HTTP_METHODS.POST;
	}

	public patch(){
		this._httpMethods = HTTP_METHODS.PATCH;
	}

	public delete(){
		this._httpMethods = HTTP_METHODS.DELETE;
	}

	public put(){
		this._httpMethods = HTTP_METHODS.PUT;
	}

	public getSeccess(){
		return this._successFuntion;
	}

	public setSuccess(fn: Function){
		this._successFuntion = fn;
	}

	public getFail(){
		return this._failFunction;
	}

	public setFail(fn: Function){
		this._failFunction = fn;
	}

	public getHeaders(){
		return this._headers;
	}

	public addHeader(key: string, value: string){
		this._headers.set(key, value);
	}

	public removeHeader(key: string, value: string){
		this._headers.delete(key);
	}

	public getAsync(){
		return this._async;
	}
	public async(){
		this._async = true;
	}

	public notAsync(){
		this._async = false;
	}

	public getContentType(){
		return this._contentType;
	}

	public contentTypeJson(){
		this.addHeader('content-type', HTTP_CONTENT_TYPE.JSON);
	}
}

export function callAPI(http: Http){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState === XMLHttpRequest.DONE){
			if(xhr.status === 200){
				var data = null;
				if(isNotEmpty(xhr.responseText)){
					data = JSON.parse(xhr.responseText);
				}
				let success = http.getSeccess();
				success(data);
			}else{
				let fail = http.getFail();
				fail(data);				
			}
		}
	}
	xhr.open(http.getHttpMethods(), http.getUrl(), http.getAsync());

	let hdsKeys = Array.from(http.getHeaders().keys());
	hdsKeys.forEach(key => {
		xhr.setRequestHeader(key, http.getHeaders().get(key) as string);
	});

	xhr.send(http.getParam());
}