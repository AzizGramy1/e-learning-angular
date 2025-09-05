import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(courses: any[], category: string): any[] {
    if (category === 'Tous') {
      return courses;
    }
    return courses.filter(course => course.category === category);
  }
}