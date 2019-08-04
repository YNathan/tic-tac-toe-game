import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  dimensionOps = [9, 16, 25, 36, 49, 64, 81, 100];
  dimensionSelected = this.dimensionOps[0];
  dimension = 0;
  steps: any;

  ngOnInit(): void {
    this.route.queryParams.pipe(first()).subscribe(x => {
      if (x.hasOwnProperty('dimension')) {
        let dim = x['dimension'];
        this.dimensionSelected = parseInt(dim);

      }
      if (x.hasOwnProperty('steps')) {

        this.steps = x['steps'];
      }
      if (this.dimensionSelected == 0) {
        this.dimensionSelected = this.dimensionOps[0];
      }

    });
  }


}
