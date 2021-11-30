import { Injectable } from '@angular/core';
import { Observable ,of } from 'rxjs';
import { Promotion } from '../shared/promotion';
//import { PROMOTION } from '../shared/promotions';
import { delay, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor( private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }

  getPromotiones(): Observable<Promotion[]> {
    // return Promise.resolve(PROMOTION);
    // return new Promise((resolve) => {
    //   setTimeout(()=>resolve(PROMOTION),2000);
    // })

    // return of(PROMOTION).pipe(delay(2000));

    return this.http.get<Promotion[]>(baseURL + 'promotions')
      .pipe(catchError(this.processHTTPMsgService.handleError)); 


  }

  getPromotion(id:string): Observable<Promotion> {
    // return Promise.resolve(PROMOTION.filter((promotion) => ( promotion.id===id) )[0]);
    // return new Promise((resolve) => {
    //   setTimeout(()=>resolve(PROMOTION.filter((promotion) => ( promotion.id===id) )[0]),2000);
    // })

    // return of(PROMOTION.filter((promotion) => ( promotion.id===id) )[0]).pipe(delay(2000));

    return this.http.get<Promotion> (baseURL+ 'promotions/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));

  }

  getFeaturedPromotion(): Observable<Promotion> {
    // return Promise.resolve(PROMOTION.filter( (promotion) => promotion.featured)[0]);
    // return new Promise((resolve) => {
    //   setTimeout(()=>resolve(PROMOTION.filter( (promotion) => promotion.featured)[0]),2000);
    // })

    // return of(PROMOTION.filter( (promotion) => promotion.featured)[0]).pipe(delay(2000));

    return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true')
    .pipe(map(promotions => promotions[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError)); 
  }
}
