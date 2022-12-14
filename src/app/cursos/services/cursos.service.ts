import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cursos } from '../../models/cursos';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  cursosObservable:Observable<any>;
  cursosSubject:Subject<any>;
  api:string = environment.api;


  cursos: Cursos[] =[]/*[
    {id:'DW001', titulo: 'Angular', duracion: '4 Semanas' , profesor:"Juan Perez" },
    {id:'BK001', titulo: 'C#', duracion: '9 Semanas' , profesor:"Fernando Septimo" },
    {id:'DB001', titulo: 'SQL', duracion: '5 Semanas' , profesor:"Mario Sosa" }
  ]*/


  constructor(private http:HttpClient) {
    this.cursosObservable = new Observable<any>((suscriptor)=>{
      suscriptor.next(this.cursos);

      this.cursosSubject.subscribe((cursos)=>{
        suscriptor.next(this.cursos);
      });
    });

    this.cursosSubject = new Subject();

   }



   getCursosObservable(){
    return this.cursosObservable;
   }

   addCurso(curso:Cursos){
    this.cursos.push(curso);
    this.cursosSubject.next(this.cursos);
   }

   /*funcion anterior para borrar cursos
   deleteCurso(elemento:Cursos){
    this.cursos.forEach((curso, index) =>{
        if(curso.id === elemento.id){
          this.cursos.splice(index, 1);
        }
    });
    this.cursosSubject.next(this.cursos);
   }*/

   /***Nuevas funciones para integrar API */
   private getCursos():Observable<Cursos[]>{
    return this.http.get<Cursos[]>(`${this.api}/curso`);
   }
   cargarCursos(){
    this.getCursos().subscribe((cursos)=>{
      this.cursosSubject.next(cursos);
    });
   }

   private postCursos(data:Cursos){
    return this.http.post(`${this.api}/curso`, data);
   }
   crearCurso(data:Cursos){
    this.postCursos(data).subscribe(()=>{
      this.cargarCursos();
    });
   }

   private deteleCurso(id:string){
    return this.http.delete<Cursos>(`${this.api}/curso/${id}`);
   }
   borrarCurso(id:string){
    if(id){
      this.deteleCurso(id).subscribe(()=>{
        this.cargarCursos();
        alert("Se elimin?? el curso: #:" +id);
      });
    }else{
      console.log("No se encontro el id del curso");
    }
   }

   private putCursos(data:Cursos){
    return this.http.put<Cursos>(`${this.api}/curso/${data.id}`,data);
   }
   edutarCursos(data:Cursos){
    this.putCursos(data).subscribe(()=>{
      this.cargarCursos();
      alert("Se modific?? el curso: #" + data.id);
    });
   }


}
