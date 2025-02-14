import { Injectable } from '@angular/core';
import { LEADERS } from './../shared/leaders';
import { Leader } from './../shared/leader';
import { of, Observable } from 'rxjs';
import { delay, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  // getLeaders(): Leader[] {
  //   return LEADERS;
  // }

  // getLeader(id: string): Leader {
  //   return LEADERS.filter((leader) => (leader.id === id))[0];
  // }

  // getFeaturedLeader(): Leader {
  //   return LEADERS.filter((leader) => leader.featured)[0];
  // }

  // added promises and simulated delays
  // getLeaders(): Promise<Leader[]> {
  //   // return Promise.resolve(LEADERS);
  //   return new Promise(resolve => {
  //     // Simulate server latency with 2 second delay
  //       setTimeout(() => resolve(LEADERS), 2000);
  //   });
  // }

  // getLeader(id: string): Promise<Leader> {
  //   // return Promise.resolve(LEADERS.filter((leader) => (leader.id === id))[0]);
  //   return new Promise(resolve => {
  //     // Simulate server latency with 2 second delay
  //       setTimeout(() => resolve(LEADERS.filter((leader) => (leader.id === id))[0]), 2000);
  //   });
  // }

  // getFeaturedLeader(): Promise<Leader> {
  //   // return Promise.resolve(LEADERS.filter((leader) => leader.featured)[0]);
  //   return  new Promise(resolve => {
  //     // Simulate server latency with 2 second delay
  //       setTimeout(() => resolve(LEADERS.filter((leader) => leader.featured)[0]), 2000);
  //   });
  // }

  // use observables and convert them to promises
  // getLeaders(): Promise<Leader[]> {
  //   return of(LEADERS).pipe(delay(2000)).toPromise();
  // }

  // getLeader(id: string): Promise<Leader> {
  //   return of(LEADERS.filter((leader) => (leader.id === id))[0]).pipe(delay(2000)).toPromise();
  // }

  // getFeaturedLeader(): Promise<Leader> {
  //   return of(LEADERS.filter((leader) => leader.featured)[0]).pipe(delay(2000)).toPromise();
  // }

  // use observables directly
  // getLeaders(): Observable<Leader[]> {
  //   return of(LEADERS).pipe(delay(2000));
  // }

  // getLeader(id: string): Observable<Leader> {
  //   return of(LEADERS.filter((leader) => (leader.id === id))[0]).pipe(delay(2000));
  // }

  // getFeaturedLeader(): Observable<Leader> {
  //   return of(LEADERS.filter((leader) => leader.featured)[0]).pipe(delay(2000));
  // }

  // get PROMOTIONS data from server, return errors
  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leadership')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeader(id: string): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>(baseURL + 'leadership?featured=true').pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

}
