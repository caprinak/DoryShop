import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private baseUrl = 'http://localhost:8080/api/dory/images';

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imageUrl: string }>(this.baseUrl, formData)
      .pipe(
        map(response => ({
          imageUrl: `${this.baseUrl}/${response.imageUrl}`
        }))
      );
  }
}