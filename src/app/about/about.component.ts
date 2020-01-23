import { LeaderService } from './../services/leader.service';
import { Leader } from './../shared/leader';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  leaders: Leader[];

  constructor(private leaderService: LeaderService) { }

  ngOnInit() {
    // this.leaders = this.leaderService.getLeaders();

    // use promise
    // this.leaderService.getLeaders().then(leaders => this.leaders = leaders);

    // use observable
    this.leaderService.getLeaders().subscribe(leaders => this.leaders = leaders);
  }

}
