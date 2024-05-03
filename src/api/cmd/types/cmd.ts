import type { kStringMaxLength } from "buffer";

export interface ICommand{
  getParant():   ICommand|null;
  getChildren(): ICommand[];
  getValues():   string[];
  isNeed():      boolean;
  getDesc():     string;
  getCommand():  string;
  toString():    string;
}

export abstract class AbstractCommand implements ICommand{
  protected parant: ICommand|null = null;
  protected children: ICommand[]  = [];
  protected values: string[]      = [];
  protected need: boolean         = true;
  protected desc: string          = '';
  protected readonly command:  string

  constructor(_command: string, _parant: ICommand|null, _children: ICommand[], _values: string[], _need: boolean){
    this.command  =_command;
    this.parant   = _parant;
    this.children = _children;
    this.values   = _values;
    this.need     = _need;
  }


  public getParant(): ICommand|null{
    return this.parant;
  }

  public getValues(): string[]{
    return this.values;
  }

  public getChildren(): ICommand[]{
    return this.children;
  }
  
  public getDesc(): string{
    return this.desc;
  }

  public setDesc(_desc: string): void{
    this.desc = _desc;
  }

  public isNeed(): boolean{
    return this.need;
  }

  public setNeed(_need: boolean): void{
    this.need = _need;
  }

  public getCommand(): string {
    return this.command;
  }

  public abstract toString(): string
}

enum ElementType{
  SELECT   = 'select',
  RADIO    = 'radio',
  CHECK    = 'checkbox',
  TEXT     = 'text',
  TEXTAREA = 'textarea',
}

enum ValueCount{
  ZERO    = 0,
  ONE     = 1,
  LIST    = 2,
}

export interface CommandElement{
  elementType: ElementType,
  valueCount: ValueCount,
}