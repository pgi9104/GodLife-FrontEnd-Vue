/**
 * IMenu
 */
export interface IMenu {
  getPath(): string,
  getName(): string,
  getChildren():IMenu[]
  addChild(menu: IMenu): void
}

export abstract class AbstractMenu implements IMenu{
  protected readonly path: string;
  protected readonly name: string;
  children: IMenu[] = [];

  constructor(protected readonly _path: string, protected readonly  _name: string){
    this.path = _path;
    this.name = _name;
  }

  public abstract getName(): string;

  public abstract getPath(): string;

  public abstract getChildren(): IMenu[];

  public abstract addChild(menu: IMenu): void;

  public toString(): string{
    return `Menu[name: this.getName()][path: this.getPath()]`;
  }

  public equals(menu: IMenu): boolean {
    return this.path === menu.getPath();
  }
}

export class Menu extends AbstractMenu {
  constructor(path: string, name: string){
    super(path, name);
  }

  public getName(): string {
    return this.name;
  }

  public getPath(): string {
    return this.path;
  }

  public getChildren(): IMenu[] {
    return this.children;
  }

  public addChild(menu: IMenu): void {
      this.getChildren().push(menu);
  }
}

export class MenuBuilder{
  private _path: string;
  private _name: string;
  _children: Menu[] = [];

  constructor(){
    this._name = '';
    this._path = '';
  }
  
  public name(name: string): MenuBuilder {
    this._name = name;
    return this;
  }

  public path(path: string): MenuBuilder {
    this._path = path;
    return this;
  }

  public addChild(child: Menu): MenuBuilder {
    this._children.push(child);
    return this;
  }

  public addChildren(children: Menu[]): MenuBuilder {
    children.forEach(child => this._children.push(child));
    return this;
  }

  public build(): Menu {
    let menu: Menu = new Menu(this._path, this._name); 
    this._children.forEach(child => menu.addChild(child));
    return menu;
  }
}