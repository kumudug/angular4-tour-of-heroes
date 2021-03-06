import { Component, OnInit } from '@angular/core';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ],
  providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  // tslint:disable-next-line:max-line-length
  private searchTerms = new Subject<string>(); // A Subject is a producer of an observable event stream; searchTerms produces an Observable of strings, the filter criteria for the name search. Each call to search() puts a new string into this subject's observable stream by calling next().

  constructor(
    private heroSearchService: HeroSearchService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),        // wait 300ms after each keystroke before considering the term
      distinctUntilChanged(),   // ignore if next search term is same as previous
      // tslint:disable-next-line:max-line-length
      /*.switchMap(term => term   // switch to new observable each time the term changes. Note that until the service supports that feature, canceling the HeroSearchService Observable doesn't actually abort a pending HTTP request. For now, unwanted results are discarded.
        // return the http search observable
        ? this.heroSearchService.search(term)
        // or the observable of empty heroes if there was no search term
        : Observable.of<Hero[]>([]))*/
      switchMap((term: string) => this.heroSearchService.search(term))
    );
      // .catch(error => {
      //   // TODO: add real error handling
      //   console.log(error);
      //   return Observable.of<Hero[]>([]);
      // });
  }

  // gotoDetail(hero: Hero): void {
  //   let link = ['/detail', hero.id];
  //   this.router.navigate(link);
  // }
}
