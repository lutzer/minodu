import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private activeMenuSubject = new BehaviorSubject<string>('');
  activeMenu$ = this.activeMenuSubject.asObservable();

  setActiveMenu(menu: string) {
    this.activeMenuSubject.next(menu);
  }
}