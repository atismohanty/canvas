import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications$: BehaviorSubject< Imessage | null> =  new BehaviorSubject<Imessage|null>(null);

  pushNotification(messgae: {type: string, message: string, read: boolean}): void {
    this.notifications$.next(messgae);
  }

  pullNotification(): BehaviorSubject<Imessage | null> {
    return this.notifications$;
  }
}

export interface Imessage {
  type: string;
  message: string;
  read: boolean
}