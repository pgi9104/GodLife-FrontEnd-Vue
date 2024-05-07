import { InlineScriptBuilder, InlineScript, ElType, ValidValueCount} from '@/api/cmd/types/cmd'

export class DatabaseInlineScript extends InlineScript{
  _type: string = ElType.TEXT;
  _label: string = '';
  _name: string = '';

  constructor(_id: string){
    super(_id);
  }

  public getLabel(): string {
    return this._label;
  }

  public setLabel(label: string): void {
    this._label = label;
  }

  public getName(): string {
    return this._name;
  }

  public setName(name: string) {
    this._name = name;
  }

  public getElType(): string {
    return this._type;
  }

  public setElType(type: string){
    this._type = type;
  }
  
  public toString(): string{
    let values = '';

    let check = document.getElementById(this.getQuestionId()) as HTMLInputElement;
    const children = this.getChildren() as DatabaseInlineScript[];
    const valid = this.getValidValueCount();
    const input = document.getElementById(this.getId()) as HTMLInputElement;
    let val = input.value;
    
    let cnt = val.trim() == ''? 0 : val.split(',').length;

    if(this.getElType() == ElType.QUESTION){
      val = '';
      cnt = 0;
    }
    
    if(check.checked){
      
      if(valid == ValidValueCount.ZERO){
        if(!(cnt == 0)){
          input.focus();
          alert('변수의 개수는 0개여야만 한다.');
          return values;
        }
      }else if(valid == ValidValueCount.ONE){
        if(!(cnt == 1)){
          input.focus();
          alert('변수의 개수는 1개여야만 한다.');
          return values;
        }
      }else if(valid == ValidValueCount.ZERO_TO_ONE){
        if(!(cnt == 1 || cnt == 0)){
          input.focus();
          alert('변수의 개수는 0에서 1개여야만 한다.');
          return values;
        }
      }else if(valid == ValidValueCount.ONE_TO_MANY){
        if(!(cnt >= 1)){
          input.focus();
          alert('변수의 개수는 1개여야만 한다.');
          return values;
        }
      }
      
      values = this.getPrefix()+val+this.getSuffix()+values;

      children.forEach(value => values = values+" "+value.toString());
    }

    return values;
  }
}

export class DatabaseInlineScriptBuilder extends InlineScriptBuilder{
  _type: string = ElType.TEXT;
  _name: string = '';
  _label: string = '';

  public elType(type: string){
    this._type = type;
    return this;
  }

  public name(name: string){
    this._name = name;
    return this;
  }

  public label(label: string){
    this._label = label;
    return this;
  }

  public override build(): DatabaseInlineScript{
    let inlineScript = new DatabaseInlineScript(this._id);
    inlineScript.setChildren(this._children);
    inlineScript.setValidValueCount(this._validValueCount);
    inlineScript.setQuestionId(this._questionId);
    inlineScript.setDesc(this._desc);
    inlineScript.setPrefix(this._prefix);
    inlineScript.setSuffix(this._suffix);
    inlineScript.setElType(this._type);
    inlineScript.setName(this._name);
    inlineScript.setLabel(this._label);

    return inlineScript;
  }
}