/**
 * IMenu
 */
export interface IMenu{
  getMenuCd(): string;
  getUrl(): string|null,
  getName(): string,
  getChildren():IMenu[]
  addChild(menu: IMenu): void
}

export abstract class AbstractMenu{
  protected readonly menuCd: string;
  protected readonly url: string|null;
  protected readonly name: string;
  private _parant: string = '';
  children: IMenu[] = [];

  constructor(protected readonly _menuCd: string, protected readonly _url: string|null, protected readonly  _name: string){
    this.menuCd = _menuCd;
    this.url = _url;
    this.name = _name;
  }

  public getMenuCd():string{
    return this._menuCd;
  }

  public getName(): string {
    return this.name;
  }

  public getUrl(): string|null {
    return this.url;
  }

  public getChildren(): IMenu[] {
    return this.children;
  }

  public addChild(menu: IMenu): void {
      this.getChildren().push(menu);
  }

  public getParent(): string {
    return this._parant;
  }

  public toString(): string{
    return `Menu[name: this.getName()][url: this.getUrl()]`;
  }

  public equals(menu: IMenu): boolean {
    return this.url === menu.getUrl();
  }
}

export class Menu extends AbstractMenu {

}

export class MenuBuilder{
  private _menuCd: string;
  private _url: string|null;
  private _name: string;
  _children: Menu[] = [];

  constructor(){
    this._menuCd = '';
    this._name = '';
    this._url = '';
  }

  public menuCd(menuCd: string): MenuBuilder{
    this._menuCd = menuCd;
    return this;
  }

  public name(name: string): MenuBuilder {
    this._name = name;
    return this;
  }

  public url(url: string|null): MenuBuilder {
    this._url = url;
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
    let menu: Menu = new Menu(this._menuCd, this._url, this._name); 
    this._children.forEach(child => menu.addChild(child));
    return menu;
  }
}