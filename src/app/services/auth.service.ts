import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import * as actions from '../auth/auth.action'
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) { }

  initAuthUser() {
    this.auth.authState.subscribe(fuser => {
      if(fuser) {
       this.userSubscription =  this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe( (firestoreUser:any) => {
          const user = Usuario.fromFirebase(firestoreUser)
           this.store.dispatch(actions.setUser({user}))
        })
      } else {
        this.userSubscription.unsubscribe()
        this.store.dispatch(actions.unSetUser())
      }
    })
  }

  crearUsuario(nombre: string, email:string, password:string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
          .then(fbUser => {       
            const newUser = new Usuario(fbUser.user.uid, nombre, email)
            return this.firestore.doc(`${fbUser.user.uid}/usuario`)
            .set({...newUser})
            
          })
  }

  login( email:string, password:string) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    )
  }
}
