export function hadnlerUpdateTime(object: any): string {
    if (object.updateUserId == 0) {
      return '-';
    }
    return object.updateTime;
  }
  
  export function hadnlerCreateTime(object: any): string {
    if (object.creatorUserId == 0) {
      return '-';
    }
    return object.creationTime;
  }
  
export function removeBodyStyle():void{
  const body = document.getElementsByTagName('body')[0];
  body.classList.remove('login-body');
}
export function addBodyStyle():void{
const body = document.getElementsByTagName('body')[0];
body.classList.add('login-body');
}