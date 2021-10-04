import { Injectable } from '@angular/core';
import { Observable ,of } from 'rxjs';
import { Promotion } from '../shared/promotion';
import { PROMOTION } from '../shared/promotions';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotiones(): Observable<Promotion[]> {
    // return Promise.resolve(PROMOTION);
    // return new Promise((resolve) => {
    //   setTimeout(()=>resolve(PROMOTION),2000);
    // })

    return of(PROMOTION).pipe(delay(2000));
  }

  getPromotion(id:string): Observable<Promotion> {
    // return Promise.resolve(PROMOTION.filter((promotion) => ( promotion.id===id) )[0]);
    // return new Promise((resolve) => {
    //   setTimeout(()=>resolve(PROMOTION.filter((promotion) => ( promotion.id===id) )[0]),2000);
    // })

    return of(PROMOTION.filter((promotion) => ( promotion.id===id) )[0]).pipe(delay(2000));

  }

  getFeaturedPromotion(): Observable<Promotion> {
    // return Promise.resolve(PROMOTION.filter( (promotion) => promotion.featured)[0]);
    // return new Promise((resolve) => {
    //   setTimeout(()=>resolve(PROMOTION.filter( (promotion) => promotion.featured)[0]),2000);
    // })

    return of(PROMOTION.filter( (promotion) => promotion.featured)[0]).pipe(delay(2000));

  }
}
