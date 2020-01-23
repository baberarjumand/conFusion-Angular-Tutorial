import { LeaderService } from './../services/leader.service';
import { Leader } from './../shared/leader';
import { PromotionService } from './../services/promotion.service';
import { Promotion } from './../shared/promotion';
import { DishService } from './../services/dish.service';
import { Dish } from './../shared/dish';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;

  constructor(private dishService: DishService,
              private promotionService: PromotionService,
              private leaderService: LeaderService) { }

  ngOnInit() {
    // this.dish = this.dishService.getFeaturedDish();
    // this.promotion = this.promotionService.getFeaturedPromotion();
    // this.leader = this.leaderService.getFeaturedLeader();

    // use promise
    // this.dishService.getFeaturedDish().then(dish => this.dish = dish);
    // this.promotionService.getFeaturedPromotion().then(promo => this.promotion = promo);
    // this.leaderService.getFeaturedLeader().then(leader => this.leader = leader;

    // use observable
    this.dishService.getFeaturedDish().subscribe(dish => this.dish = dish);
    this.promotionService.getFeaturedPromotion().subscribe(promo => this.promotion = promo);
    this.leaderService.getFeaturedLeader().subscribe(leader => this.leader = leader);
  }

}
