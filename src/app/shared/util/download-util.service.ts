import { Injectable } from '@angular/core';

@Injectable({
  providedIn: `root`,
})
export class DownloadUtilityService {
  /**
   *base64转Uint8Array
   */
  public base64toUint8Array(base64Data: string): Uint8Array {
    const padding = '='.repeat((4 - (base64Data.length % 4)) % 4);
    const base64 = (base64Data + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * 下载
   */
  public browserDownload(blob: Blob, fileName: string): void {
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(objectUrl);
  }

}
