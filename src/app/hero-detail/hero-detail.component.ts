import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService }  from '../hero.service';

import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

	@Input() hero: Hero;

  constructor(
		private route: ActivatedRoute,
		private location: Location,
		private heroService: HeroService
	) { }

  ngOnInit() {
		this.getHero();
  }

	getHero() {
		let id: Number = this.route.snapshot.params.id;
		return this.heroService.getHero(id).subscribe(
			res => {this.hero = res},
			err => {console.log('getHero()', err)}
		);
	}

	save() {
		this.heroService.updateHero(this.hero).subscribe(
			res => {this.hero = res},
			err => {console.log('updateHero()', err)}
		);
		this.location.back();
	}
}
