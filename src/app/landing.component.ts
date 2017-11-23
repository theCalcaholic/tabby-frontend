import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { ProfileService } from './profile.service';
import { Profile } from '../../../tabby-common/models/profile';

@Component({
  selector: 'landing',
  template: `
    <h1>Tabby</h1>
    <button (click)="createNewProfile()">New Profile</button>
    <hr>
    `,
  styleUrls: ['landing.component.css']
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
