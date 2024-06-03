import { isNotEmpty } from "./common";

export enum HTTP_METHODS{
	GET = 'get',
	POST = 'post',
	PATCH = 'patch',
	DELETE= 'delete',
	PUT = 'put',
}

export enum HTTP_CONTENT_TYPE {
	JSON = "application/json;charset=UTF-8",
	APP_FORM_URLENCODED = "application/x-www-form-urlencoded",
	MULTIPART_FORM_DATA_VALUE = "multipart/form-data",
}

export class Http{
	_param: any|null;
	_url: string = '';
	_httpMethods: HTTP_METHODS = HTTP_METHODS.GET;
	_successFuntion: Function = function(){};
	_failFunction: Function = function(){};
	_headers: Map<string, string> = new Map<string, string>();
	_async: boolean = false;
	_contentType: HTTP_CONTENT_TYPE | string = HTTP_CONTENT_TYPE.JSON;

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

	public method(method: string){
		let type = method.toUpperCase().trim();
		
		if(type == "POST"){
			this._httpMethods = HTTP_METHODS.POST;
		}else if(type == "PATCH"){
			this._httpMethods = HTTP_METHODS.PATCH;
		}else if(type == "DELETE"){
			this._httpMethods = HTTP_METHODS.DELETE;
		}else if(type == "PUT"){
			this._httpMethods = HTTP_METHODS.PUT;
		}else {
			this._httpMethods = HTTP_METHODS.GET;
		}

		return this;
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

	public setContentType(contentType: string){
		this._contentType = contentType;
	}

	public contentTypeJson(){
		this._contentType = HTTP_CONTENT_TYPE.JSON;
		this.addHeader('content-type', HTTP_CONTENT_TYPE.JSON);
	}
	
	public contentTypeAppFormUrlEncoded(){
		this._contentType = HTTP_CONTENT_TYPE.APP_FORM_URLENCODED;
		this.addHeader('content-type', HTTP_CONTENT_TYPE.APP_FORM_URLENCODED);
	}

	public contentTypeFormData(){
		this._contentType = HTTP_CONTENT_TYPE.MULTIPART_FORM_DATA_VALUE;
		this.addHeader('content-type', HTTP_CONTENT_TYPE.MULTIPART_FORM_DATA_VALUE);
	}

	public setToken(_token: string){
		let token = isNotEmpty(_token)? _token.trim() : '';
		this.addHeader('Authorization', +"Bearer "+ token);
	}
}

export function callAPI(http: Http){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState === XMLHttpRequest.DONE){
			let data = null;

			if(xhr.status >= 200 && xhr.status < 300 && xhr.status != 204){
				if(isNotEmpty(xhr.responseText)){
					data = JSON.parse(xhr.responseText);
				}
				let success = http.getSeccess();
				success(data);
			}else{
				data = xhr.responseText;
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

export class LinkInfo {
    href: string = '';
    type: HTTP_METHODS = HTTP_METHODS.GET;
    media: string = '';
}