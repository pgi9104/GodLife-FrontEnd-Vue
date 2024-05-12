/**
 * ITreeAble
 */
export interface ITreeAble {
  getTreeCd(): string;
  setTreeCd(treeCd: string): void;
  getParent(): string;
  setParent(parent: string): void;
  getChildren(): ITreeAble[];
  setChildren(children: ITreeAble[]): void;
  getLevel(): number;
  setLevel(level: number): void;
}

/**
 * Tree를 만들기 위한 Abstract 클래스
 */
export abstract class AbstractTree implements ITreeAble{
  private _treeCd: string;
  private _parent: string = '';
  private _children: ITreeAble[] = [];
  private _level: number = 0;

  constructor(treeCd: string){
    this._treeCd = treeCd;
  }

  public getTreeCd(){
    return this._treeCd;
  }

  public setTreeCd(treeCd: string): void {
      this._treeCd = treeCd;
  }

  public getChildren(): ITreeAble[] {
      return this._children;
  }

  public setChildren(children: ITreeAble[]): void {
      this._children = this._children;
  }

  public getLevel(): number {
      return this._level;
  }

  public setLevel(level: number): void {
      this._level = level;
  }

  public getParent(): string {
      return this._parent;
  }

  public setParent(parent: string): void {
      this._parent = parent
  }
}

/**
 * Tree 클래스
 * 해당 클래스를 상속 받은 항목은 트리항목을 만들어준다
 */
export class Tree extends AbstractTree{

}

export class TreeConverter<T extends Tree>{
  private treeMap: Map<string, T> = new Map<string,T>();
  private treeList:T[] = [];
  
  constructor(){}

  init(){
    
  }
}