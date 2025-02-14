import { LeaderService } from './../services/leader.service';
import { Leader } from './../shared/leader';
import { Component, OnInit, Inject } from '@angular/core';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[];
  errMess: string;

  constructor(private leaderService: LeaderService, @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    // this.leaders = this.leaderService.getLeaders();

    // use promise
    // this.leaderService.getLeaders().then(leaders => this.leaders = leaders);

    // use observable
    this.leaderService.getLeaders().subscribe(leaders => this.leaders = leaders, errmess => this.errMess = <any>errmess);
  }

}
