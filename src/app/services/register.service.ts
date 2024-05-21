import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:3000/register';

  constructor(private http: HttpClient) { }

  getRegister(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getRegisters(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addRegister(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  updateRegister(item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${item.id}`, item);
  }

  deleteRegister(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
