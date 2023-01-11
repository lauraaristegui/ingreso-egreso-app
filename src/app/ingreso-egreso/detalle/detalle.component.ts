import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingresos-egresos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy{

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
  this.ingresosSubscription =  this.store.select('ingresosEgresos').subscribe(({items}) => this.ingresosEgresos = items)
  }

  ngOnDestroy(): void {
    this.ingresosSubscription.unsubscribe()
    }
  borrar(uid: string) {

    this.ingresoEgresoService.borrarIngresoEgreso(uid)
    .then(() => {
      Swal.fire('Borrado', 'item borrado', 'success')
    })
    .catch(err => Swal.fire('Error', 'err.message', 'error'))
  
  }

}
