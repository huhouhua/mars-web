
export function dateFormat(dataStr: any) {
    const date = new Date(dataStr);
    const y = date.getFullYear();
    let m: string | number = date.getMonth() + 1;
    m = m < 10 ? `0${String(m)}` : m;
    let d: string | number = date.getDate();
    d = d < 10 ? `0${String(d)}` : d;
    let h: string | number = date.getHours();
    h = h < 10 ? `0${String(h)}` : h;
    let minute: string | number = date.getMinutes();
    minute = minute < 10 ? `0${String(minute)}` : minute;
    let second: string | number = date.getSeconds();
    second = second < 10 ? `0${String(second)}` : second;
    return `${String(y)}-${String(m)}-${String(d)}   ${String(h)}:${String(minute)}:${String(second)}`;
}
//2016-01-12
export function dateFormatSimple(dataStr: any) {
    const date = new Date(dataStr);
    const y = date.getFullYear();
    let m: string | number = date.getMonth() + 1;
    m = m < 10 ? `0${String(m)}` : m;
    let d: string | number = date.getDate();
    d = d < 10 ? `0${String(d)}` : d;
    return `${String(y)}-${String(m)}-${String(d)}`;
}

// 20221013151302
export function dateFormatForName(dataStr: any) {
    const date = new Date(dataStr);
    const y = date.getFullYear();
    let m: string | number = date.getMonth() + 1;
    m = m < 10 ? `0${String(m)}` : m;
    let d: string | number = date.getDate();
    d = d < 10 ? `0${String(d)}` : d;
    let h: string | number = date.getHours();
    h = h < 10 ? `0${String(h)}` : h;
    let minute: string | number = date.getMinutes();
    minute = minute < 10 ? `0${String(minute)}` : minute;
    let second: string | number = date.getSeconds();
    second = second < 10 ? `0${String(second)}` : second;
    return `${String(y)}${String(m)}${String(d)}${String(h)}${String(minute)}${String(second)}`;
}
export function computeSize(size: number): string {
    const num = 1024.0;
    if (size < num) return size + ' B';
    if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + ' KB';
    if (size < Math.pow(num, 3)) return (size / Math.pow(num, 2)).toFixed(2) + ' MB';
    if (size < Math.pow(num, 4)) return (size / Math.pow(num, 3)).toFixed(2) + ' GB';
    return (size / Math.pow(num, 4)).toFixed(2) + ' TB';
}
export function computeSizeFromMB(size: number): string {
    const num = 1024.0;
    if (size < num) return size + ' MB';
    if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + ' GB';
    return (size / Math.pow(num, 3)).toFixed(2) + ' TB';
}
export function computeSizeFromKBs(size: number): string {
    const num = 1024.0;
    if (size < num) return size + ' KB/s';
    if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + ' MB/s';
    if (size < Math.pow(num, 3)) return (size / Math.pow(num, 2)).toFixed(2) + ' GB/s';
    return (size / Math.pow(num, 3)).toFixed(2) + ' TB/s';
}

let icons = new Map([
    ['.zip', 'p-file-zip'],
    ['.gz', 'p-file-zip'],
    ['.tar.bz2', 'p-file-zip'],
    ['.tar', 'p-file-zip'],
    ['.tar.gz', 'p-file-zip'],
    ['.tar.xz', 'p-file-zip'],
    ['.mp3', 'p-file-mp3'],
    ['.svg', 'p-file-svg'],
    ['.txt', 'p-file-txt'],
    ['.html', 'p-file-html'],
    ['.word', 'p-file-word'],
    ['.ppt', 'p-file-ppt'],
    ['.jpg', 'p-file-jpg'],
    ['.xlsx', 'p-file-excel'],
    ['.doc', 'p-file-word'],
    ['.pdf', 'p-file-pdf'],
]);

export function getIcon(extention: string): string {
    if (icons.get(extention) != undefined) {
        const icon = icons.get(extention);
        return String(icon);
    } else {
        return 'p-file-normal';
    }
}
export function isJson(str:string):boolean{
    try {
        if (typeof JSON.parse(str) === 'object') {
            return true;
        }
    } catch {
        return false;
    }
    return false
}