import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { FeedbackService } from './../services/feedback.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, visibility, expand } from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackCopy: Feedback;
  contactType = ContactType;
  errMess: string;
  @ViewChild('fform') feedbackFormDirective;
  formVisibility = 'shown';
  responseVisibility = 'hidden';
  submittingVisibility = 'hidden';
  // isSubmitting = false;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  constructor(private fb: FormBuilder,
              private feedbackService: FeedbackService,
              private route: ActivatedRoute) {  }

  ngOnInit() {
    // this.route.params.pipe(switchMap((params: Params) => {
    //   // on submit, response submitted to server
    //   this.formVisibility = 'hidden';
    //   this.responseVisibility = 'shown';
    //   return this.feedbackService.getFeedback(params[2]);
    // })).subscribe(feedback => {
    //   // this executes when response received from serve
    //   this.feedback = feedback;
    //   this.feedbackCopy = feedback;
    //   this.responseVisibility = 'hidden';
    //   this.formVisibility = 'shown';
    // }, errmess => this.errMess = <any>errmess);
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.feedbackCopy = this.feedback;
    console.log(this.feedback);
    this.formVisibility = 'hidden';
    this.submittingVisibility = 'shown';
    // this.isSubmitting = true;
    this.feedbackService.submitFeedback(this.feedbackCopy)
      .subscribe(feedback => {
        this.feedback = feedback;
        this.feedbackCopy = feedback;
        this.submittingVisibility = 'hidden';
        this.responseVisibility = 'shown';
        setTimeout(() => {
          this.feedback = null;
          this.responseVisibility = 'hidden';
          this.formVisibility = 'shown';
        }, 5000);
        // this.isSubmitting = false;
      },
      errMess => { this.feedback = null; this.feedbackCopy = null; this.errMess = <any>errMess; });
    this.feedbackFormDirective.resetForm();
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
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
