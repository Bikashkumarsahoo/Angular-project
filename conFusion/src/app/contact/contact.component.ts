import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display:block;',
  },
  animations: [flyInOut(), expand()],
})
export class ContactComponent implements OnInit {
  @ViewChild('fform') feedbackFormDirective!: { resetForm: () => void };
  feedbackForm!: FormGroup;
  feedback!: Feedback;
  contactType = ContactType;
  feedbackCopy!: Feedback;
  errMess!: string;
  showFeedbackForm=true;
  formErrors: any = {
    firstname: ' ',
    lastname: ' ',
    telnum: ' ',
    email: ' ',
  };

  validationMessages: { [key: string]: any } = {
    firstname: {
      required: 'First name is required.',
      minlength: 'First name must be at least 2 characters long.',
      maxlength: 'First name cannot be more than 25 characters.',
    },
    lastname: {
      required: 'Last name is required.',
      minlength: 'Last name must be at least 2 characters long.',
      maxlength: 'Last name cannot be more than 25 characters.',
    },
    telnum: {
      required: 'Tel. num is required.',
      pattern: 'Tel. num must contain only numbers.',
    },
    email: {
      required: 'Email is required.',
      email: 'Email not in valid format.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', Validators.required, Validators.email],
      agree: false,
      contacttype: 'None',
      message: '',
    });

    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
    this.onValueChanged(); // reset form validation message
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
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

  onSubmit() {this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.showFeedbackForm=false;
    this.feedbackService.submitFeedback(this.feedback).subscribe(
      (fdback) => {
        this.feedbackCopy = fdback;
        this.feedback=null as any;
        setTimeout(()=> {
          this.feedbackCopy=null as any;
          this.showFeedbackForm=true
        },5000);
        console.log(this.feedbackCopy);
      },
      (errmess) => {
        this.feedback = null as any;
        this.feedbackCopy = null as any;
        this.errMess = <any>errmess;
      }
    );
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: '',
    });

    this.feedbackFormDirective.resetForm();
  }
}
