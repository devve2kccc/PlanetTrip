import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Travel, Location, TravelComment } from '../models/travel.model';

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private apiUrl = 'https://mobile-api-one.vercel.app/api/travels';
  private auth = btoa('zeinm@ipvc.pt:P4@yL9Tz');

  private headers = new HttpHeaders({
    'Authorization': `Basic ${this.auth}`,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.error || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  getTravels(): Observable<Travel[]> {
    return this.http.get<Travel[]>(this.apiUrl, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getTravel(id: string): Observable<Travel> {
    return this.getTravels().pipe(
      map((travels: Travel[]) => travels.find(travel => travel.id === id) as Travel),
      catchError(this.handleError)
    );
  }

  addTravel(trip: Travel): Observable<Travel> {
    return this.http.post<Travel>(this.apiUrl, trip, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTravel(id: string, trip: Travel): Observable<Travel> {
    return this.http.put<Travel>(`${this.apiUrl}/${id}`, trip, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTravel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLocations(travelId: string): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/${travelId}/locations`, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getLocation(travelId: string, locationId: string): Observable<Location> {
    return this.http.get<Location>(`${this.apiUrl}/${travelId}/locations/${locationId}`, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addLocation(location: Location): Observable<Location> {
    return this.http.post<Location>(`${this.apiUrl}/locations`, location, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateLocation(locationId: string, location: Location): Observable<Location> {
    return this.http.put<Location>(`${this.apiUrl}/locations/${locationId}`, location, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteLocation(locationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/locations/${locationId}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add methods for travel comments
  getTravelComments(travelId: string): Observable<TravelComment[]> {
    return this.http.get<TravelComment[]>(`${this.apiUrl}/${travelId}/comments`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  addTravelComment(comment: TravelComment): Observable<TravelComment> {
    return this.http.post<TravelComment>(`${this.apiUrl}/comments`, comment, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTravelComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add methods for location comments
  getLocationComments(locationId: string): Observable<TravelComment[]> {
    return this.http.get<TravelComment[]>(`${this.apiUrl}/locations/${locationId}/comments`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  addLocationComment(comment: TravelComment): Observable<TravelComment> {
    return this.http.post<TravelComment>(`${this.apiUrl}/locations/comments`, comment, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteLocationComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/locations/comments/${commentId}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
}