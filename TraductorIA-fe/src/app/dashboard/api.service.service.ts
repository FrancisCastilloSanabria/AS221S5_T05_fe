import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private apiUrl = 'http://localhost:8085/oraclecloud/traducciones';
  private translationApiUrl = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=es';
  private translationApiKey = 'b328c314264746f885a937ada7680e72';
  private translationLocation = 'eastus';

  constructor(private http: HttpClient) { }

  getTraduccionesGuardadas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  traducirPalabra(palabra: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Ocp-Apim-Subscription-Key', this.translationApiKey)
      .set('Ocp-Apim-Subscription-Region', this.translationLocation)
      .set('Content-Type', 'application/json');

    const body = [{ 'Text': palabra }];

    return this.http.post<any>(this.translationApiUrl, body, { headers });
  }

  guardarTraduccion(palabraOriginal: string, palabra_traducida: string): Observable<any> {
    const body = { palabra_ingresada: palabraOriginal, palabra_traducida };
    console.log('Solicitud a enviar:', body);
    return this.http.post<any>(this.apiUrl, body);
  }

  eliminarTraduccion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }  
}