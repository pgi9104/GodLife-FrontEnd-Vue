import { defineStore } from 'pinia'

export enum LangCd {
  korean = 'ko',
  english = 'en',
}

class Msg {
  _langCd: LangCd = LangCd.korean;
  korean: Map<string, string> = new Map<string, string>();
  english: Map<string, string> = new Map<string, string>();

  public langCd(langCd: LangCd){
    this._langCd = langCd;
    return this;
  }

  public addEn(code:string, en: string){
    this.english.set(code, en);
    return this;
  }

  public addKo(code:string, ko: string){
    this.korean.set(code, ko);
    return this;
  }

  public getCodeValue(code: string){
    const lang = this._langCd;
    let value = 'empty';

    if(lang == LangCd.english){
      value = this.english.get(code) as string;
    } else if(lang == LangCd.korean){
      value = this.korean.get(code) as string;
    } else {
      value = this.korean.get(code) as string;
    }

    return value;
  }
}

export const msgStore = defineStore('msgStore', () => {
  const globalMsg = new Msg();

  globalMsg
    .langCd(LangCd.korean)
      .addKo('COMM.BTN.ADD','추가').addEn('COMM.BTN.ADD','add')
      .addKo('COMM.BTN.DEL','삭제').addEn('COMM.BTN.DEL','delete')
      .addKo('COMM.BTN.SAVE','저장').addEn('COMM.BTN.SAVE','save')
      .addKo('COMM.BTN.GET','조회').addEn('COMM.BTN.GET','get')
  ;

  return { globalMsg , LangCd};
})
