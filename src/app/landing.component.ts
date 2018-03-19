import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { ProfileService } from './profile.service';
import {Profile, ProfileData} from '../../../tabby-common/models/profile';

@Component({
  selector: 'landing',
  template: `
    <div class='page-container'>
      <register-form></register-form>
      <h1>Tabby</h1>
      <div class='create-profile-button button' (click)="createNewProfile()">Jump in!</div>
      <hr>
    </div>
    `,
  styleUrls: ['landing.component.css']
})
export class LandingComponent {
  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  createNewProfile() {
    this.profileService.profileSubject
        .subscribe({
          next: (profile: ProfileData) => {
            console.log('profile was created:');
            console.log(profile);
            this.router.navigateByUrl(`/edit/${profile.id}`);
          }
        });
    this.profileService.newProfile();
  }
}
