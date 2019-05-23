import { Component, OnInit } from '@angular/core';
import { Assay_FormulaServiceProxy, CreateConstDto, HtmlDataOperRetDto } from '@shared/service-proxies/service-proxies';
import { ModalHelper } from '@delon/theme';
import { ConsteditComponent } from './edit/constedit/constedit.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-const',
  templateUrl: './const.component.html',
  styles: []
})
export class ConstComponent implements OnInit {
  searchTxt;
  dataList: Array<CreateConstDto>;

  constructor(private _service: Assay_FormulaServiceProxy,
    private _msg: NzMessageService,
    private modalHelper: ModalHelper) {
  }

  ngOnInit() {
    this.searchTxt = "";
    this.loadData();
  }

  loadData() {
    this._service.getAllConst().subscribe(res => {
      if (res.length > 0) {
        this.dataList = res;
      } else {
        this._msg.warning("当前没有数据！");
      }
    })
  }

  // 编辑元素
  edit(item: CreateConstDto): void {
    this.modalHelper
      .open(ConsteditComponent, { editItem: item }, 'md', {
        nzMask: true,
      })
      .subscribe(isSave => {
        this.loadData();
      });
  }

  refresh() {
    this.loadData();
  }

  delete(item: CreateConstDto): void {
    this._service.deleteConstById(item.id).subscribe((res: HtmlDataOperRetDto) => {
      this._msg.info(res.message);
      if (res.code > 0) {
        this.loadData();
      }
    });
  }

  create() {
    let item = new CreateConstDto();
    this.modalHelper
      .open(ConsteditComponent, { editItem: item }, 'md', {
        nzMask: true,
      })
      .subscribe(isSave => {
        this.refresh();
      });
  }

}
