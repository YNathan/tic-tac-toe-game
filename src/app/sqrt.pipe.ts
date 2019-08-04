import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jacksSqrtPipe'
})
export class SqrtPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Math.sqrt(parseInt(value));
  }

}
