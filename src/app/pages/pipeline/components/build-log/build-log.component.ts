import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BackendService } from 'src/app/pages/services/backend.service';
import { ApiResultType } from 'src/app/shared/common.type';
const { parse } = require('ansicolor');
@Component({
  selector: 'app-build-log',
  templateUrl: './build-log.component.html',
  styleUrls: ['./build-log.component.less'],
})
export class BuildLogComponent implements OnInit {
  @ViewChild('codeContent', { static: true }) codeContent!: ElementRef;

//   @ViewChild('codeContent', { static: false }) codeContent?: TemplateRef<{
//     $implicit: { value: string };
//     drawerRef: NzDrawerRef<string>;
//   }>;
  @Input()
    get id():string {
    return this._id;
  } 
   set id(id:string) {
    if (id) {
      this._id = id;
    //   this.backendService.releasePackReleasepacksAll(id).subscribe(res => {
    //     if (res.code === ApiResultType.Success) {
    //       this.dataDetail = res.data.releasePackViewModel;
    //       this.status = this.dataDetail.status;
    //       if (this.dataDetail.buildPipeline) {
    //         const duration = this.dataDetail.buildPipeline.duration;
    //         if (duration === 0) {
    //           this.dataDetail.buildPipeline.duration = '---';
    //         } else {
    //           this.dataDetail.buildPipeline.duration = `${Math.floor(duration / 60)}分：${duration % 60}秒`;
    //         }
    //       }
    //       this.allLog = res.data.releasePackViewModel.buildLog;
    //       this.initLogData(this.allLog);
    //     }
    //   });
    }
  }
  @Input() get data() {
    return this._data;
  } set data(data: any) {
    if (data) {
      // 检测其他端更新数据 清空之前 log
    //   if (this.status !== 1 && data.packBuildStatus === 1) {
    //     this.list = [];
    //   }
    //   if (this.dataDetail && this.dataDetail.buildPipeline) {
    //     this.dataDetail.buildPipeline.duration = `${Math.floor(data.duration / 60)}分：${data.duration % 60}秒`;
    //   }
    //   this.status = data.packBuildStatus;
    //   this._data = data;

    //   this.addLogData(data);
    }
  }

  public list:any[] =[];
  public _data: object={};
  public _id: string ='';
  public dataDetail: any;
  public buttionLoading = false;
  public allLog = '';
  public status = 0;
  constructor(private backendService: BackendService, private eventBus: NgEventBus, public msgSrv: NzMessageService) {}

  ngOnInit() :void{
     this.allLog="dasdwrqwrqwrqwrqwrdadafgdasda";
     this.addLogData(this.allLog);
  }
  getcss(css:string) {
    return `${css}`;
  }

  initLogData(data:any) {
    if (data) {
      this.list = this.filterData(data);
      this.bottom();
    }
  }

  filterData(data:any) {
    const parsed = parse(data);
    console.log(parse);
    return parsed.spans
      .filter((res: { text: string; }) => res.text !== '\n')
      .map((res: { text: string; }) => {
        res.text = res.text.replace(/\u001b\[0K/g, '');
        res.text = res.text.replace(/\n/g, '<br/>');
        res.text = res.text.replace(/<br\/>/, '');
        return res;
      });
  }

  goToJenkins(item:any) {
    if (item.isHasPermission) {
      window.open(item.buildPipeline.pipelineUrl);
    } else {
    //   this.msgSrv.error('没有权限！');
    }
  }

  /**
   * 格式化 css
   * @param css
   */
  formatCss(css:any) {
    if (css) {
      const cssObj:any = {};
      css.split(';').forEach((element: string) => {
        if (element) {
          const cssArray = element.split(':') as Array<any>;
          cssObj[cssArray[0]] = cssArray[1];
        }
      });
      return cssObj;
    }
    return '';
  }

  /**
   * 添加log
   * @param data
   */
  addLogData(data:any) {
    if (data.log) {
      this.list = [...this.list, ...this.filterData(data.log)];
      this.bottom();
    }
  }



  /**
   * 置顶
   */
  topping() {
    this.codeContent.nativeElement.scrollTo(0, 0);

  }

  /**
   * 置底
   */
  bottom(handel = '') {
    if (handel) {
      this.codeContent.nativeElement.scrollTo(0, this.codeContent.nativeElement.scrollHeight);
    
    } else {
      setTimeout(res => {
        this.codeContent.nativeElement.scrollTo(0, this.codeContent.nativeElement.scrollHeight);
      }, 300);
    }
  }
}
