import { Component, OnInit, Input, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Imessage } from 'src/app/services/notification.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  // @ViewChild('notificationbanner') notification: TemplateRef<HTMLElement> | undefined;
  allnotification: Imessage[] = [];
  arrSubscriptions: Subscription[] = [];
  timeOut: any;
  constructor( private notify: NotificationService) { }

  ngOnInit(): void {
    this.subscribetoNotification();
  }


  subscribetoNotification(): void {
    this.arrSubscriptions.push (this.notify.notifications$.subscribe((notificationRes: Imessage | null) => {
        console.log('Notification', notificationRes);
        this.allnotification.push(notificationRes as Imessage);
        var ref =  this;
        this.timeOut  =  window.setTimeout( function(){
          ref.allnotification = [];
        }.bind(this), 5000);
    }));
  }


  ngOnDestroy(): void {
    this.arrSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
