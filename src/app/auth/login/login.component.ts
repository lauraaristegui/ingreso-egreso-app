import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import * as ui  from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loading: boolean =  false;
  uiSubscription: Subscription

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

   this.uiSubscription =  this.store.select('ui')
                           .subscribe(ui => {
                            this.loading = ui.isLoading;                            
                           })
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe()
  }

  login() {
    if (this.loginForm.invalid) { return; }
    this.store.dispatch(ui.isLoading())
    const { email, password } = this.loginForm.value
    this.authService.login(email, password)
      .then(resp => {
        this.store.dispatch(ui.stopLoading())
        this.router.navigate(['/']);

      }).catch(err => {
        this.store.dispatch(ui.stopLoading())
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    })


  }

}
