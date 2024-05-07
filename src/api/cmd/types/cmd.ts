export const enum ElType {
  TEXT = "TEXT",
  SELECT = "SELECT",
  TEXTAREA = "TEXTAREA",
  RADIO = "RADIO",
  CHECK = "CHECK",
  QUESTION = "QUESTION",
  NONE = "NONE",
}

export const enum ValidValueCount {
  ZERO = "ZERO",
  ONE = "ONE",
  ZERO_TO_ONE = "ZERO_TO_ONE",
  ONE_TO_MANY = "ONE_TO_MANY",
  MANY = "MANY",
}

export interface IScript{
  getId(): string;
  getQuestionId(): string;
  setQuestionId(questionId : string): void;
  getChildren(): IScript[];
  setChildren(children: IScript[]): void;
  getValidValueCount(): string;
  setValidValueCount(validValueCount: string):void;
  getDesc(): string;
  setDesc(desc: string): void;
  toString(): string;
}

export abstract class AbstractScript implements IScript{
  protected readonly _id: string;
  protected _questionId: string = '';
  protected _children: IScript[] = [];
  protected _validValueCount: string = ValidValueCount.ZERO;
  protected _desc: string = '';

  constructor(id: string){
    this._id = id;
  }

  public getId(): string{
    return this._id;
  }

  public getQuestionId(): string{
    return this._questionId;
  }

  public setQuestionId(questionId: string): void {
      this._questionId = questionId;
  }

  public getChildren(): IScript[]{
    return this._children;
  }
  
  public setChildren(children: IScript[]): void {
      this._children = children;
  }

  public getDesc(): string{
    return this._desc;
  }

  public setDesc(desc: string): void{
    this._desc = desc;
  }

  public getValidValueCount(): string{
    return this._validValueCount;
  }

  public setValidValueCount(validValueCount: string): void{
    this._validValueCount = validValueCount;
  }

  public abstract toString(): string
}

export class InlineScript extends AbstractScript{
  _prefix: string = '';
  _suffix: string = '';

  constructor(_id: string){
    super(_id)
  }
  
  public getPrefix(): string{
    return this._prefix+" ";
  }

  public setPrefix(prefix: string): void{
    this._prefix = prefix;
  }

  public getSuffix(): string{
    return " "+this._suffix;
  }

  public setSuffix(suffix: string){
    this._suffix = suffix;
  }

  toString(): string{
    let values = '';

    let children = this.getChildren() as InlineScript[]
    children.forEach(value => {
      values = values+" "+value.toString();
    });

    let result= this.getPrefix()+values+this.getSuffix();
    
    return result;
  }
}

export class InlineScriptBuilder{
  readonly _id: string = '';
  _questionId: string = '';
  _children: IScript[] = [];
  _validValueCount: string = ValidValueCount.ZERO;
  _desc: string = '';
  _prefix: string = '';
  _suffix: string = '';

  constructor(id:string){
    this._id = id;
  }

  public questionId(questionId: string){
    this._questionId = questionId;
    return this;
  }

  public children(children: IScript[]){
    children.forEach(child => this._children.push(child));
    return this;
  }

  public validValueCount(validValueCount: string){
    this._validValueCount = validValueCount;
    return this;
  }

  public desc(desc: string){
    this._desc = desc;
    return this;
  }

  public prefix(prefix: string){
    this._prefix = prefix;
    return this;
  }

  public suffix(suffix: string){
    this._suffix = suffix;
    return this;
  }

  public build(): InlineScript{
    let inlineScript = new InlineScript(this._id);
    inlineScript.setChildren(this._children);
    inlineScript.setValidValueCount(this._validValueCount);
    inlineScript.setQuestionId(this._questionId);
    inlineScript.setPrefix(this._prefix);
    inlineScript.setSuffix(this._suffix);
    inlineScript.setDesc(this._desc);

    return inlineScript;
  }
}