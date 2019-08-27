import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LOGIN } from '../constants/formValidationMessage';
import { HelperService } from '../providers/helper.service';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../providers/firebase-auth.service';
import { WidgetUtilService } from '../providers/widget-util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  formError: any = {
    email: '',
    password: ''
  };
  validationMessage: any = LOGIN;
  showLoginSpinner: boolean = false;

  constructor(private helperService: HelperService, private router: Router, private firebaseAuthService: FirebaseAuthService,
    private widgetUtilService: WidgetUtilService) { }

  ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  resetForm(){
    this.loginForm.reset();
    this.formError = {
    email: '',
    password: ''
    };
  }

  async loginWithEmailPassword(){
    try{
      this.showLoginSpinner = true;
      await this.firebaseAuthService.loginWithEmailPassword(this.email.value, this.password.value);
      this.showLoginSpinner = false;
      this.widgetUtilService.presentToast('Login Success!');
      this.resetForm();
      this.router.navigate(['/home']);
    }catch(error){
      this.showLoginSpinner = false;
      this.widgetUtilService.presentErrorToast(error.message);
    }
  }

  goToSignup(){
    this.router.navigate(['/signup']);
  }

  createFormControl(){
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ])
  }

  async googleLoginWeb(){
    try{
      await this.firebaseAuthService.googleLoginWeb();
    }catch(error){
      this.widgetUtilService.presentErrorToast(error.message);
    }
  }


  createForm(){
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
    this.loginForm.valueChanges.subscribe(data => this.onFormValuechange(data));
  }

  onFormValuechange(data){
    this.helperService.prepareValidationMessage(this.loginForm, this.validationMessage,this.formError);
  }

}
