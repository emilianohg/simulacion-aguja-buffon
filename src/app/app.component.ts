import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { literal } from '@angular/compiler/src/output/output_ast'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('canvas') canvas! : ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D | null;
  form: FormGroup;

  width: number = 700;
  height: number = 500;

  totalLinesToGenerate: number = 0;
  totalLines: number = 0;
  totalCrossedLines: number = 0;

  timeElapsed: number = 0;

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      totalLinesToGenerate: [1000000, [Validators.required, Validators.min(1)]],
      time: [10, [Validators.required, Validators.min(1)]],
      longitude: [100, [Validators.required, Validators.min(1)]]
    });
    this.context = null;
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d')!;
    this.resetBoard();
  }

  resetBoard(): void {
    this.totalCrossedLines = 0;
    this.totalLines = 0;
    this.totalLinesToGenerate = 0;
    this.timeElapsed = 0;

    this.context!.fillStyle = '#fff';
    this.context?.fillRect(0, 0, this.width, this.height);
    this.drawBoard();

    this.form.enable();
  }

  drawBoard(): void {

    for (let i = 100; i < this.width; i += 100) {
      this.context!.fillStyle = '#00f';
      this.context?.fillRect(i, 0, 1, this.height);
    }

  }

  addRandomLine(): void {
    const longitude = 100.1;

    const x1 = (Math.random() * (this.width - (2*longitude))) + longitude;
    //const y1 = (Math.random() * (this.height - (2*longitude))) + longitude;

    //const x1 = Math.random() * this.width ;
    const y1 = Math.random() * this.height;

    // number between [-100, 100]
    const adjacentSide = Math.cos(Math.random() * (2 * longitude) - longitude) * longitude;
    const angle = Math.acos(adjacentSide/longitude);

    const sign = Math.random() < 0.5 ? -1 : 1;

    const oppositeSide = sign * Math.sin(angle) * longitude;

    const x2 = x1 + adjacentSide;
    const y2 = y1 + oppositeSide;

    this.totalLines++;
    this.drawLine(x1, y1, x2, y2);
  }

  drawLine(x1: number, y1: number, x2: number, y2: number): void {


    // console.log(x1, y1, x2, y2);
    const context = this.context!;

    const s1 = Math.floor(x1 / 100);
    const s2 = Math.floor(x2 / 100);

    if (s1 === s2) {
      context.strokeStyle = '#0f0';
    } else {
      context.strokeStyle = '#f00';
      this.totalCrossedLines++;
    }

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.moveTo(0, 0);
    context.stroke();

  }

  simulate(): void {

    if (this.form.invalid || this.form.disabled) {
      return;
    }

    const duration = this.form.get('time')?.value! * 1000;
    this.totalLinesToGenerate = this.form.get('totalLinesToGenerate')?.value;

    this.form.disable();

    // console.log('Total agujas a generar', this.totalLinesToGenerate);

    const durationInterval = 20;

    let exactNeedles = 0;

    const intervalId = setInterval(() => {

      // console.log("Tiempo transcurrido: " + this.timeElapsed + ' de ' + duration);

      this.timeElapsed += durationInterval;

      exactNeedles = this.totalLinesToGenerate * this.percentage;
      exactNeedles -= this.totalLines;

      // console.log("Agujas agregadas exactas: ", exactNeedles);

      if (exactNeedles >= 1) {
        const needles = Math.floor(exactNeedles);
        // console.log("Agujas agregadas efectivas: ", needles);

        for (let i = 0; i < needles; i++) {

          if (this.totalLines >= this.totalLinesToGenerate) {
            clearInterval(intervalId);
            return;
          }

          this.addRandomLine();

          // console.log(this.totalLines, this.totalLinesToGenerate);

          exactNeedles -= needles;
        }
      }

      if (this.timeElapsed >= duration) {
        clearInterval(intervalId);
      }

    }, durationInterval);


  }

  get pi(): number {
    if (this.totalCrossedLines == 0) return 0;
    return 2 * (this.totalLines/this.totalCrossedLines);
  }

  get percentage(): number {
    const duration = this.form.get('time')?.value! * 1000;
    if(this.form.invalid || duration == 0) return 0;
    return this.timeElapsed / duration;
  }

  get printPercentage(): string {
    return (this.percentage * 100).toFixed(2);
  }

}
