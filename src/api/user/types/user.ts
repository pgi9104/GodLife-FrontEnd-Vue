/**
 * UserInfo
 */
export interface UserInfo {
  getUserId(): string
  getUsername(): string
  getEmail(): string
}

/**
 * AbstractUser
 */
export abstract class AbstractUser implements UserInfo{
  _userId: string
  _username: string
  _email: string

  constructor(public userId: string,public  username: string,public  email: string){
    this._userId = userId;
    this._username = username;
    this._email = email;
  }

  public getUserId(): string {
    return this._userId;  
  }

  public getUsername(): string {
    return this._userId;  
  }

  public getEmail(): string {
    return this._userId;  
  }
}

/**
 * User
 */
export class User extends AbstractUser{
  constructor(public userId: string,public  username: string,public  email: string){
    super(userId, username, email);
  }
}