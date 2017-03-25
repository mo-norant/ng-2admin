import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';


import 'style-loader!./login.scss';

@Component({
  selector: 'login',
  templateUrl: './login.html',
})
export class Login {

  public form:FormGroup;
  public email:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;
  error;
  edited = false;

  constructor(fb:FormBuilder , public af: AngularFire , private router: Router) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];

      this.af.auth.subscribe(auth => { 
        if(auth) {
          this.router.navigateByUrl('/dashboard');
        }
      });
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    if(this.form.valid) {
      console.log(this.form.value);
      this.af.auth.login({
        email: this.form.value.email,
        password: this.form.value.password
      },
      {
        provider: AuthProviders.Password,
        method: AuthMethods.Password,
      }).then(
        (success) => {
        console.log(success);
        this.router.navigate(['/dashboard']);
      }).catch(
        (err) => {
          this.edited = true;
        this.error = err.message;
     //time na 4 seconden terug div hiden

        Observable.interval(4000)
          .take(10).map((x) => x+1)
          .subscribe((x) => {
            this.edited= false
          });
      })
    }
  }
  
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

          //time na 4 seconden terug div hiden
          Observable.interval(4000)
          .take(10).map((x) => x+1)
          .subscribe((x) => {
            this.edited= false
            });
      })
  }
}
