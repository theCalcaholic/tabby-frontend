import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { ProfileService } from './profile.service';
import { Profile } from 'tabby-common/profile';

@Component({
  selector: 'landing',
  template: `
    <h1>Tabby</h1>
    <a routerLink="edit/9as9u2ob3bonal">TestProfile</a>
    <button (click)="createNewProfile()">New Profile</button>
    <hr>
    `
})
export class LandingComponent {
  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  createNewProfile() {
    this.profileService.newProfile().then((profile: Profile) => {
      this.router.navigateByUrl(`/edit/${profile.id}`);
    });
  }
}
