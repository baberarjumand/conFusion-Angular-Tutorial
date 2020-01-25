import { Comment } from './../shared/comment';
import { DishService } from './../services/dish.service';
import { Dish } from './../shared/dish';
import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// const DISH = {
//   id: '0',
//   name: 'Uthappizza',
//   image: '/assets/images/uthappizza.png',
//   category: 'mains',
//   featured: true,
//   label: 'Hot',
//   price: '4.99',
//   // tslint:disable-next-line:max-line-length
//   description: 'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
//   comments: [
//        {
//            rating: 5,
//            comment: 'Imagine all the eatables, living in conFusion!',
//            author: 'John Lemon',
//            date: '2012-10-16T17:57:28.556094Z'
//        },
//        {
//            rating: 4,
//            comment: 'Sends anyone to heaven, I wish I could get my mother-in-law to eat it!',
//            author: 'Paul McVites',
//            date: '2014-09-05T17:57:28.556094Z'
//        },
//        {
//            rating: 3,
//            comment: 'Eat it, just eat it!',
//            author: 'Michael Jaikishan',
//            date: '2015-02-13T17:57:28.556094Z'
//        },
//        {
//            rating: 4,
//            comment: 'Ultimate, Reaching for the stars!',
//            author: 'Ringo Starry',
//            date: '2013-12-02T17:57:28.556094Z'
//        },
//        {
//            rating: 2,
//            comment: 'It\'s your birthday, we\'re gonna party!',
//            author: '25 Cent',
//            date: '2011-12-02T17:57:28.556094Z'
//        }
//    ]
// };

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

    // @Input() // this is not needed anymore when using route parameters
    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    errMess: string;
    dishcopy: Dish;

    commentForm: FormGroup;
    comment: Comment;
    @ViewChild('cform') commentFormDirective;

    formErrors = {
      'author': '',
      'comment': ''
    };

    validationMessages = {
      'author': {
        'required': 'Author Name is required.',
        'minlength': 'Author Name must be at least 2 characters long.',
        'maxlength': 'Author Name cannot be more than 100 characters long.'
      },
      'comment': {
        'required': 'Author Name is required.',
        'maxlength': 'Author Name cannot be more than 500 characters long.'
      }
    };

    constructor(private dishService: DishService,
                private location: Location,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                @Inject('BaseURL') private BaseURL) { }

    ngOnInit() {
      // const id = this.route.snapshot.params['id'];

      // this.dish = this.dishService.getDish(id);

      // use promise
      // this.dishService.getDish(id).then(dish => this.dish = dish);

      // use observable
      // this.dishService.getDish(id).subscribe(dish => this.dish = dish);

      // use route params to enable prev/next dish
      this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params
        .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
        .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
          errmess => this.errMess = <any>errmess );
      this.createCommentForm();
    }

    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

    goBack(): void {
      this.location.back();
    }

    createCommentForm() {
      this.commentForm = this.fb.group({
        author: [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
        rating: [ 5, Validators.required ],
        comment: [ '', [Validators.required, Validators.maxLength(500)] ]
      });

      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

      this.onValueChanged(); // (re)set validation messages now
    }

    onSubmit() {
      const tempDate = new Date();
      this.comment = this.commentForm.value;
      this.comment.date = tempDate.toISOString();
      console.log(this.comment);
      this.dishcopy.comments.push(this.comment);
      this.dishService.putDish(this.dishcopy)
        .subscribe(dish => {
          this.dish = dish; this.dishcopy = dish;
        },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
      this.commentFormDirective.resetForm();
      this.commentForm.reset({
        author: '',
        rating: 5,
        comment: ''
      });
    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }

}
