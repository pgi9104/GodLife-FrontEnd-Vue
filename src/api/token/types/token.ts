/**
 * Token
 */
export interface Token {
  getToken(): string;
}

/**
 * AbstractToken
 */
export abstract class AbstractToken implements Token{
  private _token: string;

  constructor(token: string){
      this._token = token;
  }

  public getToken(): string {
      return "Bearer "+this._token;
  }
}

/**
 * AccessToken
 */
export class AccessToken extends AbstractToken {

}