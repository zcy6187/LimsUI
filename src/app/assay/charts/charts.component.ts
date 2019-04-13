import { Component, OnInit } from '@angular/core';
import g2 from '@antv/g2/build/g2';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styles: []
})
export class ChartsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    if (typeof G2 !== 'undefined') {
      G2.track(false);
    }
    this.drawBarChart();
  }

  drawBarChart() {
    const data = [
      { weekday: 'Mon', bugnum: 100 },
      { weekday: 'Tue', bugnum: 120 },
      { weekday: 'Wed', bugnum: 130 },
      { weekday: 'Thu', bugnum: 160 },
      { weekday: 'Fri', bugnum: 150 },
      { weekday: 'Sat', bugnum: 190 },
      { weekday: 'Sun', bugnum: 210 }
    ];
    const chart = new G2.Chart({
      container: 'g2_c1',
      width: 900,
      height: 500
    });

    chart.source(data);
    chart.interval().position('weekday*bugnum').color('weekday');
    chart.render();
  }

}
