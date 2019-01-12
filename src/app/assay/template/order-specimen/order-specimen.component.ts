import { Component, OnInit, Input, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { Assay_TplServiceProxy, ReOrderDto } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-order-specimen',
  templateUrl: './order-specimen.component.html',
  styles: []
})
export class OrderSpecimenComponent extends ModalComponentBase {
  @Input()
  list: Array<any>;
  @Input()
  title;
  @Input()
  lx;

  constructor(private injector: Injector, private msg: NzMessageService, private _tplService: Assay_TplServiceProxy) {
    super(injector);
  }

  up(item: any) {
    const tempList = new Array<any>();
    let isFirst = false;
    isFirst = this.list.some((forItem, index, array) => {
      if (item.id === forItem.id) {
        if (index === 0) {
          return true;
        } else {
          const tempItem = tempList.pop();
          tempList.push(forItem);
          tempList.push(tempItem);
        }
      } else {
        tempList.push(forItem);
      }
    });

    if (isFirst) {
      const firstItem = this.list.shift();
      this.list.forEach((val) => {
        tempList.push(val);
      });
      tempList.push(firstItem);
    }

    this.list = tempList;
  }

  down(item: any) {
    const tempList = new Array<any>();
    let isLast = false;
    let shiftItem: any = null;
    isLast = this.list.some((forItem, index, array) => {
      if (item.id === forItem.id) {
        shiftItem = forItem;
        if (index === this.list.length - 1) {
          return true;
        }
      } else {
        tempList.push(forItem);
        if (shiftItem) {
          tempList.push(shiftItem);
          shiftItem = null;
        }
      }
    });

    if (isLast) {
      tempList.unshift(shiftItem);
    }

    this.list = tempList;
  }

  save(): void {
    if (!this.list && this.list.length === 0) {
      this.msg.warning("没有可排序的数据!");
      return;
    }
    const tempArray = new Array<ReOrderDto>();
    this.list.forEach((val, index) => {
      const temp = new ReOrderDto();
      temp.id = val.id;
      temp.orderNo = index + 1;
      tempArray.push(temp);
    });

    this._tplService.reOrderTplSpecimen(tempArray)
      .subscribe((res) => {
        this.msg.info(res);
      });
  }

}
