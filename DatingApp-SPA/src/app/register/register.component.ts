import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsDaterangepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDaterangepickerConfig>;

  constructor(private authSevice: AuthService, private alertify: AlertifyService,
    private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { 'mismatch': true };
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authSevice.register(this.user).subscribe(() => {
        this.alertify.success('Registration succesfully');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authSevice.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });


    }
    /* this.authSevice.register(this.model).subscribe(() => {
      this.alertify.success('registration successfully');
    }, error => {
     this.alertify.error(error);
    }); */
    // tslint:disable-next-line: comment-format
    //console.log(this.registerForm.value);

  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
