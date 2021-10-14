import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-dardos',
  templateUrl: './dardos.component.html',
  styleUrls: ['./dardos.component.css']
})
export class DardosComponent implements AfterViewInit {

  @ViewChild('canvas') canvas! : ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D | null;
  form: FormGroup;

  diameter: number = 500;

  totalDartsToGenerate: number = 0;
  totalDarts: number = 0;
  totalDartsInside: number = 0;

  timeElapsed: number = 0;
  isProcessing = false;

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      totalDartsToGenerate: [1000000, [Validators.required, Validators.min(1)]],
      time: [10, [Validators.required, Validators.min(1)]],
    });
    this.context = null;
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d')!;
    this.resetBoard();
  }

  resetBoard(): void {
    this.totalDartsInside = 0;
    this.totalDarts = 0;
    this.totalDartsToGenerate = 0;
    this.timeElapsed = 0;

    this.context!.fillStyle = '#fff';
    this.context?.fillRect(0, 0, this.diameter, this.diameter);
    this.drawBoard();

    this.form.enable();
  }

  drawBoard(): void {
      this.context!.strokeStyle = '#00f';
      this.context!.beginPath();
      this.context!.arc(this.diameter / 2, this.diameter / 2, this.diameter / 2, 0, 2 * Math.PI);
      this.context!.stroke();
  }

  addRandomDart(): void {
    const x = Math.random() * this.diameter;
    const y = Math.random() * this.diameter;

    if (!this.isOutOfCircle(x, y)) {
      this.totalDartsInside++;
    }

    this.totalDarts++;
    this.drawCircle(x, y);
  }

  isOutOfCircle(x: number, y: number) {
    const centerX = this.diameter / 2;
    const centerY = this.diameter / 2;

    const value = Math.pow(x - centerX, 2) + Math.pow(y -  centerY, 2);
    return Math.sqrt(value) > (this.diameter / 2);
  }

  drawCircle(x: number, y: number): void {

    const context = this.context!;

    if (this.isOutOfCircle(x, y)) {
      context.fillStyle = '#f00';
    } else {
      context.fillStyle = '#0f0';
    }

    context.beginPath();
    context.arc(x, y, 2, 0, 2 * Math.PI);
    context.fill();
    context.moveTo(0, 0);
  }

  simulate(): void {

    if (this.form.invalid || this.form.disabled) {
      return;
    }

    this.isProcessing = true;

    const duration = this.form.get('time')?.value! * 1000;
    this.totalDartsToGenerate = this.form.get('totalDartsToGenerate')?.value;

    this.form.disable();

    const durationInterval = 20;

    let exactDarts = 0;

    const intervalId = setInterval(() => {

      this.timeElapsed += durationInterval;

      exactDarts = this.totalDartsToGenerate * this.percentage;
      exactDarts -= this.totalDarts;

      if (exactDarts >= 1) {
        const darts = Math.floor(exactDarts);

        for (let i = 0; i < darts; i++) {

          if (this.totalDarts >= this.totalDartsToGenerate) {
            clearInterval(intervalId);
            return;
          }

          this.addRandomDart();

          exactDarts -= darts;
        }
      }

      if (this.timeElapsed >= duration) {
        clearInterval(intervalId);
        this.isProcessing = false;
      }

    }, durationInterval);


  }

  get pi(): number {
    if (this.totalDartsInside == this.totalDarts) return 0;
    return 4 * (this.totalDartsInside/this.totalDarts);
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
