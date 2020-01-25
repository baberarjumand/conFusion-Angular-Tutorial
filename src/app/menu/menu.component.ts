import { DishdetailComponent } from './../dishdetail/dishdetail.component';
import { Dish } from '../shared/dish';
// import { DISHES } from '../shared/dishes';
import { DishService } from './../services/dish.service';
import { Component, OnInit, Inject } from '@angular/core';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
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
export class MenuComponent implements OnInit {

  // dishes: Dish[] = DISHES;
  dishes: Dish[];
  // selectedDish: Dish;
  errMess: string;

  constructor(private dishService: DishService,
              @Inject('BaseURL') private BaseURL) { }

  // life cycle method
  ngOnInit() {
    // this.dishes = this.dishService.getDishes();

    // use promise
    // this.dishService.getDishes().then((dishes) => this.dishes = dishes);

    // use observable
    this.dishService.getDishes().subscribe(dishes => this.dishes = dishes, errmess => this.errMess = <any>errmess);
  }

  // onSelect(dish: Dish) {
  //   this.selectedDish = dish;
  // }

}
