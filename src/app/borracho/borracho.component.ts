import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Position, Walk, WalkRow } from './walk'

@Component({
  selector: 'app-borracho',
  templateUrl: './borracho.component.html',
  styleUrls: ['./borracho.component.css']
})
export class BorrachoComponent implements AfterViewInit {

  @ViewChild('canvas') canvas! : ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D | null;
  form: FormGroup;

  diameter: number = 500;
  unit = 25;

  public walksShowed: WalkRow[] = [];
  walks: Walk[] = [];

  moreThanTwoBlocks = 0;
  totalWalks = 0;

  timeElapsed: number = 0;
  isProcessing = false;

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      totalWalks: [100, [Validators.required, Validators.min(1)]],
      totalDirections: [10, [Validators.required, Validators.min(1)]],
      time: [10, [Validators.required, Validators.min(1)]],
    });
    this.context = null;
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d')!;
    this.context.transform(1, 0, 0, -1, 0, this.diameter);
    this.context.translate(this.diameter / 2, this.diameter / 2);
    this.resetBoard();
  }

  resetBoard(): void {
    this.timeElapsed = 0;
    this.totalWalks = 0;
    this.walks = [];
    this.walksShowed = [];
    this.moreThanTwoBlocks = 0;

    this.clearBoard();

    this.form.enable();
  }

  clearBoard(): void {
    this.context!.fillStyle = '#fff';
    this.context?.fillRect(-this.diameter/2, -this.diameter/2, this.diameter, this.diameter);
    this.drawBoard();
  }

  drawBoard(): void {
    const context = this.context!;

    const coordInitial = - this.unit * 10;
    const coordFinal = this.unit * 10;

    for (let i = coordInitial; i <= coordFinal; i += this.unit) {
      context.beginPath();

      context.strokeStyle = 'rgba(0,0,0,0.4)'
      context.setLineDash([4, 3]);

      if (i == 0) {
        context.strokeStyle = '#000';
        context.setLineDash([]);
      }

      context.moveTo(i, coordInitial)
      context.lineTo(i, coordFinal);
      context.stroke();
    }

    for (let i = coordInitial; i <= coordFinal; i += this.unit) {
      context.beginPath();

      context.strokeStyle = 'rgba(0,0,0,0.4)'
      context.setLineDash([4, 3]);

      if (i == 0) {
        context.strokeStyle = '#000';
        context.setLineDash([]);
      }

      context.moveTo(coordInitial, i);
      context.lineTo(coordFinal, i);
      context.stroke();
    }

  }

  drawPath(path: Array<number[]>): void {
    const context = this.context!;

    context.lineWidth = 5;
    context.setLineDash([]);

    context.beginPath();

    context.moveTo(0, 0);

    path.forEach((segment, index) => {
      context.strokeStyle = '#00f';
      context.lineTo(segment[0] * this.unit, segment[1] * this.unit);
    });

    context.stroke();

    context.lineWidth = 1;


  }

  drawCircle(x: number, y: number, radius: number, color: string): void {

    const context = this.context!;

    context.fillStyle = color ?? '#000';

    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.moveTo(0, 0);
  }

  getDirection(number: number): number[] {
    if (0 <= number && number < 0.25) {
      return [0, 1]; // north
    }  else if (0.25 <= number && number < 0.5) {
      return [0, -1]; // south
    } else if (0.5 <= number && number < 0.75) {
      return [1, 0]; // east
    } else {
      return [-1, 0]; // west
    }
  }

  generateWalk(totalWalks: number, totalDirections: number) {

    for (let i = 0; i < totalWalks; i++) {
      let currentPosition = [0, 0];
      const positions: Position[] = [];

      for (let j = 0; j < totalDirections; j++) {
        const randomNumber = Math.random();
        const move = this.getDirection(randomNumber);

        positions.push({
          index: j + 1,
          coordinate: [
            currentPosition[0] +  move[0],
            currentPosition[1] +  move[1],
          ],
          randomNumber: randomNumber,
        });

        currentPosition[0] += move[0];
        currentPosition[1] += move[1];
      }

      const walk: Walk = {
        index: i + 1,
        positions: positions,
        point: currentPosition,
        isMoreThanTwoBlocks: Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]) >= 2,
      }

      this.walks.push(walk);
    }
  }

  simulate(): void {

    if (this.form.invalid || this.form.disabled) {
      return;
    }

    this.resetBoard();

    const data = this.form.value;
    const totalWalks = data.totalWalks;
    const totalDirections = data.totalDirections;

    this.generateWalk(totalWalks, totalDirections);

    this.isProcessing = true;
    this.form.disable();

    const duration = data.time * 1000;
    const durationInterval = duration / (this.walks.length * totalDirections);

    let currentWalk = 0, currentPosition = 0;

    let currentPath : Array<number[]> = [];

    const intervalId = setInterval(() => {

      this.timeElapsed += durationInterval;

      const walk  = this.walks[currentWalk];
      const pos   = walk.positions[currentPosition]

      currentPosition++;

      if (currentPosition >= walk.positions.length) {
        this.walksShowed.push({walk, hiddenDetail: true});
        if (walk.isMoreThanTwoBlocks) {
          this.moreThanTwoBlocks++;
        }
        currentWalk++;
        this.totalWalks++;
        currentPosition = 0;
        currentPath = [];
      } else {
        currentPath.push([pos.coordinate[0], pos.coordinate[1]]);
      }

      this.clearBoard();

      this.drawPath(currentPath);

      this.walksShowed.forEach(_w => {
        const w = _w.walk;
        const color = w.isMoreThanTwoBlocks ? '#0f0' : '#f00';
        this.drawCircle(w.point[0] * this.unit, w.point[1] * this.unit, 5, color);
      });

      if (currentWalk >= this.walks.length) {
        clearInterval(intervalId);
        this.isProcessing = false;
      }


    }, durationInterval);


  }

  get moreThanTwoBlocksPorcentage(): number {
    if (this.totalWalks == 0) return 0;
    return (this.moreThanTwoBlocks/this.totalWalks)*100;
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
