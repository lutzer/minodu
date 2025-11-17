import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  constructor(private datePipe: DatePipe) {}

  // Format date to 'dd MMMM yyyy'
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'dd MMMM yyyy', 'fr-FR');
    return formattedDate || '';
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'dd MMMM yyyy à H:mm', 'fr-FR');
    return formattedDate+' min' || '';
  }
}
