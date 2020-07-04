import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { catchError, retry, tap } from 'rxjs/operators';
// import { MatSnackBar } from '@angular/material/snack-bar';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,

  ) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }


  public employees(): Observable<any> {
    return this.http.get<any>('http://dummy.restapiexample.com/api/v1/employees')
      .pipe(
        catchError(this.handleError)
      );
  }

  // public getHero(id: number): Observable<Hero> {
  //   const url = `${this.heroesUrl}/${id}`;
  //   return this.http.get<Hero>(url).pipe(
  //     tap(_ => this.log(`fetched hero id=${id}`)),
  //     catchError(this.handleError)
  //   );
  // }

  public add(data): Observable<any> {
    return this.http.post<any>("http://dummy.restapiexample.com/api/v1/create", data).pipe(
      catchError(this.handleError)
    );
  }

  public update(data): Observable<any> {
    const url = `http://dummy.restapiexample.com/api/v1/update/${data.id}`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError)
    );
  }

  public delete(data): Observable<any> {
    const url = `http://dummy.restapiexample.com/api/v1/delete/${data.id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }
}
