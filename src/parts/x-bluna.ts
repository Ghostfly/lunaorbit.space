import {
  html,
  customElement,
  TemplateResult,
  property,
  LitElement,
} from 'lit-element';

import '../components/cta-hero';

/*

import { Chart } from '@antv/g2';

fetch('https://fcd.terra.dev/v1/market/price?denom=uusd&interval=1d')
  .then(res => res.json())
  .then(data => {
    const kagiData = getKagiData(data.prices, 'datetime', 'price');
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500
    });
    chart.data(kagiData);
    chart.scale({
      date_time: {
        nice: true
      },
      price: {
        nice: true
      }
    });
    chart.tooltip({
      showCrosshairs: true,
      crosshairs: 'x'
    });
    chart.path({
      generatePoints: true
    })
      .position('datetime*price')
      .color('type', val => {
        if (val === 'pos') {
          return '#2fc25b';
        }
        return '#f04864';
      })
      .size('type', val => {
        if (val === 'pos') {
          return 2;
        }

        return 1;
      });
    chart.render();
  });

function getKagiData(points, x, y) {
  let min = points[0][y];
  let max = points[0][y];
  let start = points[0];
  let isPos = points[1][y] >= points[0][y];
  let direction = isPos ? 1 : -1;
  const maxValue = getMax(points, y);
  const threshold = maxValue * 0.04;
  const negPath = [];
  const posPath = [];
  const tmp1 = {};
  tmp1[x] = start[x];
  tmp1[y] = start[y];
  pushPoint(tmp1, isPos, posPath, negPath, x, y);
  if (points.length > 1) {
    for (let i = 0; i <= points.length - 1; i++) {
      if (Math.abs(start[y] - points[i][y]) > threshold) {
        if (direction > 0) {
          if (points[i][y] >= start[y]) {
            isPos = getVerticalPoints(start, points[i], max, direction, negPath, posPath, isPos, x, y);
            start[y] = points[i][y];
          } else {
            const tmp2 = {};
            tmp2[x] = points[i][x];
            tmp2[y] = start[y];
            pushPoint(tmp2, isPos, posPath, negPath, x, y);
            start[x] = points[i][x];
            direction = -1;
            isPos = getVerticalPoints(start, points[i], min, direction, negPath, posPath, isPos, x, y);
            max = start[y];
            start = points[i];
          }
        } else {
          if (points[i][y] < start[y]) {
            isPos = getVerticalPoints(start, points[i], min, direction, negPath, posPath, isPos, x, y);
            start[y] = points[i][y];
          } else {
            const tmp3 = {};
            tmp3[x] = points[i][x];
            tmp3[y] = start[y];
            pushPoint(tmp3, isPos, posPath, negPath, x, y);
            start[x] = points[i][x];
            direction = 1;
            isPos = getVerticalPoints(start, points[i], max, direction, negPath, posPath, isPos, x, y);
            min = start[y];
            start = points[i];
          }
        }
      }
    }
  }
  return posPath.concat(negPath);
}

function getVerticalPoints(start, end, changePoint, direction, negPath, posPath, isPos, x, y) {
  const condition = direction > 0 ? (end[y] > changePoint) && (start[y] < changePoint) && !isPos : (end[y] < changePoint) && (start[y] > changePoint) && isPos;
  const tmp1 = {};
  tmp1[x] = start[x];
  tmp1[y] = changePoint;
  const tmp2 = {};
  tmp2[x] = start[x];
  tmp2[y] = end[y];
  if (condition) {
    pushPoint(tmp1, isPos, posPath, negPath, x, y, true);
    isPos = !isPos;
    pushPoint(tmp2, isPos, posPath, negPath, x, y);
  } else {
    pushPoint(tmp2, isPos, posPath, negPath, x, y);
  }
  return isPos;
}

function pushPoint(point, isPos, posPath, negPath, x, y, isChangePoint = false) {
  const tmpPoint = {};
  tmpPoint[x] = point[x];
  tmpPoint[y] = isChangePoint ? point[y] : null;
  if (isPos) {
    point.type = 'pos';
    posPath.push(point);
    tmpPoint.type = 'neg';
    negPath.push(tmpPoint);
  } else {
    point.type = 'neg';
    negPath.push(point);
    tmpPoint.type = 'pos';
    posPath.push(tmpPoint);
  }
}

function getMax(points, y) {
  let max = points[points.length - 1][y];
  if (points.length > 0) {
    for (let i = points.length - 1; i >= 0; i--) {
      max = points[i][y] > max ? points[i][y] : max;
    }
  }
  return max;
}



*/

/**
 * X-bLuna-Luna Helper
 */
@customElement('x-bluna')
export class XBluna extends LitElement {
  @property({type: Boolean})
  public loading = false;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    this.loading = true;

    const orbit = document.querySelector('luna-orbit');
    await orbit?.updateComplete;

    setTimeout(() => {
      orbit?.stopPriceRefesh();
    }, 0);

    this.loading = false;
  }

  render(): TemplateResult {
    return html`
    
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-bluna': XBluna;
  }
}
