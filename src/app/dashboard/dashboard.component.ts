import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingresos-egresos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  ingresosEgresosSubscription: Subscription;
  constructor(
    private store: Store<AppState>,
    private ingresosEgresosService: IngresoEgresoService
  ) { }

  ngOnInit(): void {

   this.userSubscription =  this.store.select('user')
    .pipe(
      filter(auth => auth.user != null)
    )
    .subscribe(({user}) => {
    this.ingresosEgresosSubscription = this.ingresosEgresosService.initIngresosEgresosListener(user.uid)
      .subscribe(ingresosEgresosFB => {
      this.store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresosFB }))
      })
    })
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
