import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: []
})
export class ListComponent implements OnInit {

  list: Array<string>;

  constructor() {
    this.list = new Array<string>();
    for (let i = 0; i < 10; i++) {
      this.list.push('cotent    ' + i.toString());
    }
  }

  ngOnInit() {
  }

}
