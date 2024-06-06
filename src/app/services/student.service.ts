import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, IStudent } from '../models/Student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  apiUrl = 'http://localhost:8000/api/users';
  constructor(private http: HttpClient) {}

  getAllStudent(): Observable<ApiResponse<IStudent[]>> {
    return this.http.get<ApiResponse<IStudent[]>>(`${this.apiUrl}`);
  }
  getStudent(id: string): Observable<ApiResponse<IStudent>> {
    return this.http.get<ApiResponse<IStudent>>(`${this.apiUrl}/${id}`);
  }
  createStudent(student: IStudent): Observable<ApiResponse<IStudent>> {
    return this.http.post<ApiResponse<IStudent>>(`${this.apiUrl}`, student);
  }
  updateStudent(id: string, student: IStudent) {
    return this.http.put<ApiResponse<IStudent>>(
      `${this.apiUrl}/${id}`,
      student
    );
  }

  deleteStudent(id: string): Observable<ApiResponse<IStudent>> {
    return this.http.delete<ApiResponse<IStudent>>(`${this.apiUrl}/${id}`);
  }
}
