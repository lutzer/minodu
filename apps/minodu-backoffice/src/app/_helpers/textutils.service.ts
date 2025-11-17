import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextutilsService {

  constructor() { }

  truncateTexte(input: string): string {
    const maxLength = 76;
    if (input.length <= maxLength)
      return input;
    
    const truncatedString = input.slice(0, maxLength - 2);
    return truncatedString + '..';
  }
}
