import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { HttpClient } from 'selenium-webdriver/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  firstPlayerIconUrl = "1.svg";
  secondPlayerIconUrl = "2.svg";
  IconesUrlsList = ["1.svg", "2.svg", "3.svg", "4.svg", "5.svg", "6.svg", "7.svg"];

  dimensionOps = [9, 16, 25, 36, 49, 64, 81, 100];
  dimensionSelected = this.dimensionOps[0];
  dimension = 0;
  steps: any;
  playerWinner: string = '';
  constructor(private route: ActivatedRoute, private router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    for(var icon of this.IconesUrlsList){
      iconRegistry.addSvgIcon(icon, sanitizer.bypassSecurityTrustResourceUrl('/assets/'+icon));
    }
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(first()).subscribe(x => {
      if (x.hasOwnProperty('dimension')) {
        let dim = x['dimension'];
        this.dimensionSelected = parseInt(dim);

      } else {
        this.router.navigateByUrl('/home?dimension=9&steps=');
      }
      if (x.hasOwnProperty('steps')) {

        this.steps = x['steps'];
      } else {
        this.router.navigateByUrl('/home?dimension=9&steps=');
      }
      if (this.dimensionSelected == 0) {
        this.dimensionSelected = this.dimensionOps[0];
      }

    });
  }

  whenPlayerWin(evt) {
    this.playerWinner = evt;
    console.log(this.playerWinner)
  }

  playerWinClick() {
    this.playerWinner = '';
    console.log(this.router.url.split('home'));
    console.log(this.router.url.split('home')[0]);
    this.router.navigateByUrl('/home?dimension=9&steps=');
  }


}
