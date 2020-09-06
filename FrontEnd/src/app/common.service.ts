import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
@Injectable()
export class CommonService {

  constructor(private http: Http) { }

  saveUser(user) {
    return this.http.post('http://localhost:8080/api/SaveUser/', user)
    .pipe(map((response: any) => response.json()));
  }

  uploadImage(id : string, file: File){
    const formData: FormData = new FormData();
    formData.append('avatar', file, file.name);
    formData.append('id', id);
    return this.http.post('http://localhost:8080/api/upload/', formData)
    .pipe(map((response: any) => response.json()));
  }

  GetUser() {
    return this.http.get('http://localhost:8080/api/getUser/')
    .pipe(map((response: any) => response.json()));
  }

  GetUserById(id) {
    return this.http.post('http://localhost:8080/api/getUserById/',{ 'id': id })
    .pipe(map((response: any) => response.json()));
  }


  deleteUser(id) {
    return this.http.post('http://localhost:8080/api/deleteUser/', { 'id': id })
    .pipe(map((response: any) => response.json()));
  }

} 