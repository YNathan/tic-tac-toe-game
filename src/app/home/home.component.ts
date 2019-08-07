import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dimensionOps = [9, 16, 25, 36, 49, 64, 81, 100];
  dimensionSelected = this.dimensionOps[0];
  dimension = 0;
  steps: any;
  playerWinner: string = '';
  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(first()).subscribe(x => {
      if (x.hasOwnProperty('dimension')) {
        let dim = x['dimension'];
        this.dimensionSelected = parseInt(dim);

      }else{
        this.router.navigateByUrl(this.router.url.replace(this.router.url.split('home')[0], 'home?dimension=9'));
      }
      if (x.hasOwnProperty('steps')) {

        this.steps = x['steps'];
      }else{
        this.router.navigateByUrl(this.router.url.replace(this.router.url.split('home')[0], 'home?dimension=9&steps='));
      }
      if (this.dimensionSelected == 0) {
        this.dimensionSelected = this.dimensionOps[0];
      }

    });
  }

  whenPlayerWin(evt){
    this.playerWinner = evt;
    console.log(this.playerWinner)
  }


}
