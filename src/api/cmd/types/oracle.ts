import { AbstractCommand, type ICommand} from '@/api/cmd/types/cmd'

export class OracleCommand extends AbstractCommand{
  constructor(_command: string, _parant: ICommand|null, _children: ICommand[], _values: string[], _need: boolean){
    super(_command, _parant, _children, _values, _need)
  }
  
  toString(): string{
    let values = '';
    let options = '';
    
    let valueList = super.getValues() as string[]
    valueList.forEach(value => values = values+" "+value);

    let children = super.getChildren() as ICommand[]
    children.forEach(option => options = options+" "+option.toString());

    let result= super.getCommand()+values+options;
    
    return result;
  }
}

export class OracleCommandBuilder{
  _parant: ICommand|null = null;
  _children: ICommand[]  = [];
  _values: string[]      = [];
  _need: boolean         = true;
  _desc: string          = '';
  _command:  string      = '';

  parant(parent: ICommand|null): OracleCommandBuilder{
    this._parant = parent;
    return this;
  }

  children(children: ICommand[]): OracleCommandBuilder{
    children.forEach(child => this._children.push(child));
    return this;
  }

  values(values: string[]): OracleCommandBuilder{
    values.forEach(value => this._values.push(value));
    return this;
  }

  need(need: boolean): OracleCommandBuilder{
    this._need = need;
    return this;
  }

  desc(desc: string): OracleCommandBuilder{
    this._desc = desc;
    return this;
  }

  command(command: string): OracleCommandBuilder{
    this._command = command;
    return this;
  }

  build(): OracleCommand{
    let oracleCommand = new OracleCommand(this._command, this._parant, this._children, this._values, this._need);
    oracleCommand.setDesc(this._desc);

    return oracleCommand;
  }
}