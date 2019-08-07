import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { dirtyParentQueries } from '@angular/core/src/view/query';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private router: Router) { }
  // The array that will contain the steps of the game each step has two plays
  GameSteps = [];
  // The cells array that containe a list that will generated the params from the player behavior
  cells = [];
  // the dimansion of the play bord get his input from the input dimension
  _dimension: number;
  // will used to generate the size of the board style as binding params
  boxSizeStyle = "";
  boardWidth: number = 0;
  gridStyle: any;
  fillColorAt : number[] = [];
  winner: string = "";

  @Output() playerWin = new EventEmitter<String>();
  // the input params
  @Input() steps: any;
  @Input() set dimension(value: number) {
    // when a new dimension size change we need to take of the old steps, its a new game
    this.router.navigateByUrl(this.router.url.replace(this.router.url.split('dimension=')[1].split('&')[0], value.toString()));
    if (this.GameSteps.length) {
      // its mean that i change the size of the game dimension and not a copy past url because the game.length hase a size
      this.router.navigateByUrl(this.router.url.split('dimension=')[0] += 'dimension=' + value.toString() + '&steps=');
    }
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
      this.cells.push({ cell_num: i, player: "",cell_color: 'white' });
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

  // parsing the steps from the url to the component
  fromUrlStep(): void {
    // that we do have step and is not a new game
    if (this.steps.length) {
      // split the structure divide the steps by :
      let stepsArray = this.steps.split(':');
      // looping over steps
      for (let stp of stepsArray) {
        // i case that was'nt parsed correctly and one step is broken
        if (stp.length) {
          let stepNumber = parseInt(stp[0]) - 1;
          let first = parseInt(stp.substring(1, stp.length).split('s')[0].split('f')[1]);
          let second = parseInt(stp.substring(1, stp.length).split('s')[1]);
          this.cells[first - 1].player = 'first';
          this.cells[second - 1].player = 'second';
          this.GameSteps[stepNumber] = { 'first': first, 'second': second };
        }
      }
    }
  }

  cellClicked(cell_num: number, cell_player) {
    let player = "";
    if (cell_player.length === 0) {
      for (let i = 0; i < this.GameSteps.length; i++) {
        if (this.GameSteps[i].first === 0) {
          this.GameSteps[i].first = cell_num;
          player = "first";
          this.cells[cell_num - 1].player = "first";
          break;
        } else if (this.GameSteps[i].second === 0) {
          player = "second";
          this.cells[cell_num - 1].player = "second";
          this.GameSteps[i].second = cell_num;
          let param = ':' + (i + 1) + 'f' + this.GameSteps[i].first + 's' + this.GameSteps[i].second;
          let oldUrlPlusNewStepParam = this.router.url + param;
          this.router.navigateByUrl(oldUrlPlusNewStepParam);
          break;
        }
      }
      this.doesHeWin(cell_num, player);
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

  doesHeWin(cell: number, player: string) {
    let jumper = Math.sqrt(this._dimension);
    if (this.verticalMatch(cell, jumper, player) || this.horizontalMatch(cell, jumper, player) || this.slantLeftToRight(cell, jumper, player) || this.slantRightToLeft(cell, jumper, player)) {
      this.playerWin.emit(player);
    }
  }
  verticalMatch(cell: number, jumper: number, player: string): boolean {
    
    let playerWin = true;

    let startIdx = (cell - 1) % jumper;
   
    for (let i = startIdx; i < this.cells.length; i += jumper) {
          if (this.cells[i].player !== player) {
            playerWin = false;
            this.fillColorAt = [];
            break;
         }else{
            this.fillColorAt.push(i);
         }
    }
    if(playerWin){
      for(let i of this.fillColorAt){
        this.cells[i]['cell_color'] = 'salmon';
      }
    }
    return playerWin;
  }
  horizontalMatch(cell: number, jumper: number, player: string): boolean {
    let playerWin = true;
    let startIdx = Math.floor((cell - 1)/ jumper ) * jumper; 
    let endIndex = startIdx + jumper;

    for (let i = startIdx; i < endIndex; i++) {
      if (this.cells[i].player !== player) {
        playerWin = false;
        this.fillColorAt = [];
        break;
      }else{
        this.fillColorAt.push(i);
      }
    }
    if(playerWin){
      for(let i of this.fillColorAt){
        this.cells[i]['cell_color'] = 'salmon';
      }
    }
    return playerWin;
  }
  slantRightToLeft(cell: number, jumper: number, player: string): boolean {
    let playerWin = true;
    let startIdx = jumper - 1;
    let endIndex = (jumper * jumper) - jumper;
    for(let i = startIdx; i < this.cells.length -1; i += (jumper -1)){
      if (this.cells[i].player !== player) {
        playerWin = false;
        this.fillColorAt = [];
        break;
      }else{
        this.fillColorAt.push(i);
      }
    }
    if(playerWin){
      for(let i of this.fillColorAt){
        this.cells[i]['cell_color'] = 'salmon';
      }
    }
    return playerWin;
  }
  slantLeftToRight(cell: number, jumper: number, player: string): boolean {
    let playerWin = true;
    for(let i = 0; i < this.cells.length; i += (jumper +1)){
      if (this.cells[i].player !== player) {
        playerWin = false;
        this.fillColorAt = [];
        break;
      }else{
        this.fillColorAt.push(i);
      }
    }
    if(playerWin){
      for(let i of this.fillColorAt){
        this.cells[i]['cell_color'] = 'salmon';
      }
    }
    return playerWin;
  }
}
