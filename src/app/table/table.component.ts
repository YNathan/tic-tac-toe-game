import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  GameSteps = [];
  cells = [];
  poisitioningTxt: String;
  _dimension: number;
  boxSizeStyle = "";
  boardWidth: number = 0;
  gridStyle: any;

  @Input() steps: any;
  @Input() set dimension(value: number) {
    // updating the url
    this.router.navigateByUrl(this.router.url.replace(this.router.url.split('dimension=')[1].split('&')[0], value.toString()));
    // initilizing the game step array will contain wich cell the first play and what the second play
    this.GameSteps = [];
    // the dimension
    this._dimension = value;
    // the style of the bord to be changed when the size incress or decress
    this.boxSizeStyle = "";
    this.boardWidth = 0;
    // the cells 
    this.cells = [];
    // initilizing the cells
    for (let i = 1; i <= this._dimension; i++) {
      this.cells.push({ cell_num: i, player: "" });
    }
    // initilizing thg game step *The max game steps is a half of the cells amount
    for (let i = 1; i <= this._dimension / 2; i++) {
      this.GameSteps.push({ first: 0, second: 0 })
    }
    this.generateBoxSizeCss();
  }


  ngOnInit() {
    this.fromUrlStep();
  }

  fromUrlStep() {
    let stepsArray = this.steps.split(':');
    for (let stp of stepsArray) {
      this.poisitioningTxt = stp.substring(1, stp.length)
      let stepNumber = parseInt(stp[0]) - 1;
      let first = parseInt(this.poisitioningTxt.split('s')[0].split('f')[1]);
      let second = parseInt(this.poisitioningTxt.split('s')[1]);
      this.cells[first - 1].player = 'first';
      this.cells[second - 1].player = 'second';
      this.GameSteps[stepNumber] = { 'first': first, 'second': second };
    }
  }

  cellClicked(cell_num: number,cell_player){
    if(cell_player.length === 0){
      console.log(cell_num);
      for(let i = 0; i < this.GameSteps.length; i++){
        if(this.GameSteps[i].first === 0){
          this.GameSteps[i].first = cell_num;
          this.cells[cell_num].player = "first";
          break;
        }else if(this.GameSteps[i].second === 0){
          this.cells[cell_num].player = "second";
          this.GameSteps[i].second = cell_num;
          let param = ':'+(i+1) +'f'+this.GameSteps[i].first+'s'+this.GameSteps[i].second; 
          let oldUrlPlusNewStepParam = this.router.url + param;
          this.router.navigateByUrl(oldUrlPlusNewStepParam);
          break;
        }
      }
    }

  }

  generateBoxSizeCss() {
    for (let i = 0; i < Math.sqrt(this._dimension); i++) {
      this.boxSizeStyle += "100px "
      this.boardWidth += 101;
    }

    this.gridStyle = {
      'width': this.boardWidth + 'px',
      'grid-template-rows': this.boxSizeStyle,
      'grid-template-columns': this.boxSizeStyle,
    }
  }
}
