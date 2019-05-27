import { Component, OnInit, Injector, ViewChild, TemplateRef } from '@angular/core';
import { AppComponentBase } from '@shared/component-base';
import { OrgServiceProxy, OrgTreeNodeDto, HtmlSelectDto, DetectServiceProxy, Assay_DataSearchServiceProxy, ImportRetInfoDto } from '@shared/service-proxies/service-proxies';
import { NzMessageService, NzModalService, UploadXHRArgs, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse, HttpHeaderResponse } from '@angular/common/http';
import { AppConsts } from '@shared/AppConsts';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-exceloper',
  templateUrl: './exceloper.component.html',
  styles: []
})
export class ExceloperComponent extends AppComponentBase implements OnInit {
  fileType: string;
  orgTree: OrgTreeNodeDto[];
  orgCode: string;
  templateId: string;
  specId: number;
  timeArray: Date[];
  listOfTemplate: HtmlSelectDto[];
  listOfSpec: HtmlSelectDto[];
  tbBody: Array<Array<string>>;
  uploadUrl: string;
  fileList: UploadFile[] = [];
  msgId: string; // 存储当前消息框的句柄

  constructor(private _searchService: Assay_DataSearchServiceProxy,
    private _orgService: OrgServiceProxy,
    private _detectService: DetectServiceProxy,
    private injector: Injector,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private http: HttpClient) {
    super(injector);
  }

  ngOnInit() {
    this._orgService.getOrgTreeByTplQx()
      .subscribe((res: OrgTreeNodeDto[]) => {
        this.orgTree = res;
      });
    this.timeArray = new Array<Date>();
    this.timeArray.push(new Date());
    this.timeArray.push(new Date());
    this.fileType = "xls/xlsx";
    this.uploadUrl = AppConsts.excelBaseUrl + "File/PostFile";
    console.log(this.uploadUrl);
  }

  orgChange(item) {
    if (item) {
      this._searchService.getTemplateHtmlSelectDtosByOrgCode(item)
        .subscribe((res: HtmlSelectDto[]) => {
          if (res.length > 0) {
            this.listOfTemplate = res;
            this.templateId = this.listOfTemplate[0].key;
            this.tplChange(this.templateId);
          } else {
            this.msg.info("该机构下没有化验模板！");
          }
        });
    }
  }

  tplChange(item) {
    if (item) {
      this._searchService.getSpecimenHtmlSelectByTemplateId(item, false)
        .subscribe((res: HtmlSelectDto[]) => {
          if (res.length > 0) {
            // let ff: HtmlSelectDto = new HtmlSelectDto();
            // ff.key = "-1";
            // ff.value = "全部";
            // res.unshift(ff);
            this.listOfSpec = res;
            this.specId = Number.parseInt(res.keys[0]);
          } else {
            this.msg.warning("该化验模板下没有样品信息！");
          }
        });
    }
  }

  btnDownload() {
    if (this.specId > 0) {
      this._detectService.downLoadExcelBySpecId(this.specId).subscribe(res => {
        this.openExcel(res);
      });
    } else {
      this.msg.warning("请选择样品");
    }
  }

  openExcel(fileName: string) {
    let url = AppConsts.uploadApiUrl + "api/excel?fileName=" + fileName;
    this.http.get(url, {
      responseType: "blob",
      headers: { 'Accept': 'application/vnd.ms-excel' }
    }).subscribe(blob => {
      saveAs(blob, fileName);
    });
  }

  afterUpload(fileName: string) {
    this._detectService.uploadFile(fileName).subscribe((res: ImportRetInfoDto) => {

    });
  }

  customReq = (item: UploadXHRArgs) => {
    // 构建一个 FormData 对象，用于存储文件或其他参数
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append('file', item.file as any);
    const req = new HttpRequest('POST', this.uploadUrl, formData, {
      reportProgress: true,
      withCredentials: false
    });
    // 始终返回一个 `Subscription` 对象，nz-upload 会在适当时机自动取消订阅
    return this.http.request(req).subscribe(
      (event: HttpEvent<{}>) => {
        if (event instanceof HttpResponse) {
          const res = (<HttpResponse<string>>event).body;
          const resObj = res.indexOf("fail") > 0;
          console.log(resObj);
          if (!resObj) {
            this.msgId = this.msg.loading('正在解析数据', { nzDuration: 0 }).messageId;
          } else {
            this.msg.warning("上传失败");
          }
        }
      },
      err => {
        // 处理失败
        item.onError!(err, item.file!);
      }
    );
  };
}
