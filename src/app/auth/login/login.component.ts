import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { switchAll } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  login() {
  
    if(this.loginForm.invalid) {return};

    const {email, password} = this.loginForm.value
    this.authService.login(email, password)
    .then(resp => {      
      this.router.navigate(['/']);

    }).catch(err => Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message,
    }))
   
    
  }

}
