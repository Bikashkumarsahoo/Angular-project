import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  
  dish!: Dish;
  dishIds!:string [];
  prev!: string;
  next!: string;
  commentForm!: FormGroup;
  comment!:Comment;
  @ViewChild('cform') commentFormDirective: any;

  commentFormErrors:any={
    'author': '',
    'comment': '',
    'rating':''
  };

  validationMessages:any = {
    'comment': {
      'required':      'Comment is required.',
    },
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
      'maxlength':     'Author Name cannot be more than 35 characters long.'
    },
  };

  constructor(private dishService:DishService,private route:ActivatedRoute, private location:Location, private formBuilder:FormBuilder, @Inject('BaseURL') public BaseURL:any ) { 
    this.createForm();
  }

  ngOnInit(): void {
    this.dishService.getDishIds()
      .subscribe((dishIds) => { this.dishIds=dishIds});
    this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe( (dish) => {this.dish= dish; this.setPrevNext(dish.id); });
  }

  createForm(){
    this.commentForm=this.formBuilder.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35)]],
      comment: ['', Validators.required],
      rating:[5, Validators.required]
    });
    this.commentForm.valueChanges.subscribe(data => this.onValueChange(data));
    this.onValueChange();
  }
  onValueChange(data?: any){
    if(!this.commentForm) { return; }
    const form=this.commentForm;
    for(const field in this.commentFormErrors) {
      if(this.commentFormErrors.hasOwnProperty(field)) {
        this.commentFormErrors[field]='';
        const control=form.get(field);
        if(control && control.dirty && !control.valid) {
          const messages=this.validationMessages[field];
          for( const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.commentFormErrors[field]+=messages[key];
            }
          }
        }
      }
    }
  }

  onSubmit(){
    let date = new Date().toISOString();
    this.comment = this.commentForm.value;
    this.comment.date = date;
    this.dish.comments.push(this.comment);
    console.log(this.comment);
    this.commentForm.reset({
      author: '',
      comment: '',
      rating:5
    });
    this.commentFormDirective.resetForm();
  }

  setPrevNext(dishId: string){
    const index=this.dishIds.indexOf(dishId);
    this.prev=this.dishIds[(this.dishIds.length + index -1)% this.dishIds.length];
    this.next=this.dishIds[(this.dishIds.length + index +1)% this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

}
