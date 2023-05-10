export class ApiResult {
    status: ApiResultType | undefined;
    message?: string;
    data?: any;
  }
  
  export enum ApiResultType {
    Info = 203,
    Success = 200,
    Error = 500,
    UnAuth = 401,
    Forbidden = 403,
    NoFound = 404,
    Locked = 423,
  }
export interface Option{
    name: string,
    value: number
}

export interface MemberRole{
   value: number,
   displayName : string,
}
export interface Member{
    checked:boolean,
    disabled:boolean,
    title:string,
    description:string,
    key:string,
    tag:string,
}
