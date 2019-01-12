import { Injectable } from '@angular/core';
import { OrgTreeNodeDto, OrgDto, OrgServiceProxy } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class OrgServiceService {

  public orgInfos: OrgDto[];
  public orgTreeNodes: OrgTreeNodeDto[];

  constructor(private _baseServicy: OrgServiceProxy) {
  }

  public getOrgInfos(): OrgDto[] {
    if (!this.orgInfos) {
      this.requestOrgInfos();
    }
    return this.orgInfos;
  }

  public getOrgTree(): OrgTreeNodeDto[] {
    return this.orgTreeNodes;
  }

  private requestOrgInfos() {
    this._baseServicy.getOrgInfos()
      .subscribe((res: OrgDto[]) => {
        this.orgInfos = res;
      });
  }
}
