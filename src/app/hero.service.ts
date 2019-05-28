import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

	private heroesUrl = 'api/heroes';  // URL to web api

  constructor(
		private http: HttpClient,
	  private messageService: MessageService
	) {}

	getHeroes(): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl)
			.pipe(
				tap(() => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
			);
	}

	getHero(id: Number): Observable<Hero> {
		return this.http.get<Hero>(`${this.heroesUrl}/${id}`)
			.pipe(
				tap(() => this.log('fetched hero id=' + Number(id))),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
			)
	}

	updateHero(hero: Hero): Observable<Hero> {
		return this.http.put<Hero>(this.heroesUrl, hero, httpOptions)
			.pipe(
				tap(() => this.log(`Updated Hero ${hero.name}`)),
        catchError(this.handleError<Hero>(`updateHero()`))
			)
	}

	addHero(heroName: string) {
		let hero = {name: heroName} as Hero;
		return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
			.pipe(
				tap((newHero) => this.log(`Added Hero ${newHero.name}`)),
        catchError(this.handleError<Hero>(`addHero()`))
			)
	}

	deleteHero(hero: Hero) {
		return this.http.delete<Hero>(`${this.heroesUrl}/${hero.id}`, httpOptions)
			.pipe(
				tap(_ => this.log(`deleted hero ${hero.name}`)),
        catchError(this.handleError<Hero>(`deleteHero()`))
			)
	}

	/* GET heroes whose name contains search term */
	searchHeroes(term: string): Observable<Hero[]> {
		if (!term.trim()) {
	    // if not search term, return empty hero array.
	    return of([]);
	  }

		return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
			.pipe(
				tap(_ => this.log(`Searched heroes matching "${term}""`)),
        catchError(this.handleError<Hero[]>(`searchHeroes()`, []))
			)
	}

	/**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

	/** Log a HeroService message with the MessageService */
	private log(message: string) {
	  this.messageService.add(`HeroService: ${message}`);
	}
}
