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
  