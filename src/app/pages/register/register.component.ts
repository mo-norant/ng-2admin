import { Component , ViewChild, Input, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';
import 'style-loader!./register.scss';
import { NgUploaderOptions } from 'ngx-uploader';
import {Observable} from 'rxjs/Rx';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';



@Component({
  selector: 'register',
  templateUrl: './register.html',
})
export class Register {

 

  public form: FormGroup;
  public name: AbstractControl;
  public email: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public passwords: FormGroup;
  error;
  public uploadInProgress:boolean;

  public submitted: boolean = false;
  edited = false;

  constructor(fb: FormBuilder, public af: AngularFire, private router: Router) {

    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
    });

    this.name = this.form.controls['name'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  public defaultPicture = 'assets/img/theme/no-photo.png';
  public profile:any = {
    picture: 'assets/img/app/profile/user.jpg'
  };

  loginGoogle() {
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    }).then(
        (success) => {
        this.router.navigate(['/dashboard']);
      }).catch(
        (err) => {
          this.edited = true;
          this.error = err.message;
      })
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {

      this.af.auth.createUser({
        email: this.form.value.email,
        password: this.form.value.passwords.password
      }).then(
        (success) => {
          const itemObservable = this.af.database.object('/users/' + success.uid);

          itemObservable.set({ firstname: this.form.value.name });
          this.router.navigate(['/dashboard']);
        }).catch(
        (err) => {
          this.edited = true;
          this.error = err.message;
          Observable.interval(4000)
          .take(10).map((x) => x+1)
          .subscribe((x) => {
            this.edited= false
          })
        })

    }
  }

 src: string = "";
 
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 128,
        resizeMaxWidth: 128
    };
 
    selected(imageResult: ImageResult) {
        this.src = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
    }

  
}
