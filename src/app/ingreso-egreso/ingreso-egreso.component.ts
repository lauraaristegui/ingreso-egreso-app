import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingresos-egresos.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import * as ui  from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy{

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  loading: boolean =  false;
  uisubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
    this.uisubscription = this.store.select('ui')
    .subscribe(ui => this.loading = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uisubscription.unsubscribe()
    }
 
  guardar() {
    if(this.ingresoForm.invalid) {return;}
      this.store.dispatch(ui.isLoading());

    const {descripcion, monto} = this.ingresoForm.value;
    const ingresoEgreso =  new IngresoEgreso(descripcion, monto, this.tipo);
  
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
    .then(() => {
      this.ingresoForm.reset();
      this.store.dispatch(ui.stopLoading());
      Swal.fire('Registro creado', descripcion, 'success')
    })
    .catch(err => {
      this.store.dispatch(ui.stopLoading());
      Swal.fire('Error', err.message, 'error')
    })
}


}