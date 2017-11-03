import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap }   from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { HeroService } from './hero.service';
import { Hero } from './hero';

@Component({
  selector: 'hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]

})
export class HeroDetailComponent implements OnInit {
    hero: Hero;
    constructor(
      private heroService: HeroService,
      private route: ActivatedRoute,
      private location: Location
    ) {}

    /*The switchMap operator maps the id in the Observable route parameters to a new Observable, the result of the HeroService.getHero() method.

    If a user re-navigates to this component while a getHero request is still processing, switchMap cancels the old request and then calls HeroService.getHero() again.

    The hero id is a number. Route parameters are always strings. So the route parameter value is converted to a number with the JavaScript (+) operator.*/
    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.heroService.getHero(+params.get('id')))
        .subscribe(hero => this.hero = hero);
    }

    goBack(): void {
      this.location.back();
    }

    save(): void {
      this.heroService.update(this.hero)
        .then(() => this.goBack());
    }

}
