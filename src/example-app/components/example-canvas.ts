import { CssRgba, MultiHorizontalGradientImage } from '../../color-picker';
import { BaseGradientImage } from '../../gradient-image/base-gradient-image';

export class ExampleCanvas extends HTMLElement {
  private gradientImage: BaseGradientImage;
  private rainbow = [
    [255, 0, 0, 255],
    [255, 127, 0, 255],
    [255, 255, 0, 255],
    [0, 255, 0, 255],
    [0, 255, 255, 255],
    [0, 0, 255, 255],
    [255, 0, 255, 255],
  ];

  static get observedAttributes() {
    return ['fade'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    const canvas = document.createElement('canvas');
    shadow.appendChild(canvas);
    let removePickListener = this.drawOnDocument(canvas);
    window.addEventListener('resize', (event: Event) => {
      removePickListener();
      removePickListener = this.drawOnDocument(canvas);
    });
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    switch (attr) {
      case 'fade': this.onChangeFade(newVal); return;
    }
  }

  private drawOnDocument(canvas: HTMLCanvasElement) {
    canvas.setAttribute('width', window.innerWidth.toString());
    canvas.setAttribute('height', window.innerHeight.toString());
    const ctx = canvas.getContext('2d');
    this.gradientImage = new MultiHorizontalGradientImage(ctx);
    this.gradientImage.draw(
      this.rainbow,
      [[255, 255, 255, 255]],
    );
    const onPick = (event: MouseEvent) => {
      const {clientX, clientY} = event;
      const colorData = this.gradientImage.getColorByCoords(clientX, clientY);
      const color = new CssRgba(colorData);
      this.dispatchEvent(new CustomEvent('pick', {
        detail: {colorData},
        bubbles: true,
      }));
    };
    canvas.addEventListener('click', onPick);
    return () => {canvas.removeEventListener('click', onPick)};
  }

  private onChangeFade(colorStr: string) {
    const colorData = colorStr.split(',').map(slot => parseInt(slot));
    this.gradientImage.draw(this.rainbow, [colorData]);
  }

}