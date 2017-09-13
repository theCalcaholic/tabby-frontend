import { Component } from '@angular/core';

@Component({
  selector: 'landing',
  template: `
    <h1>Tabby</h1>
    <a href='new'>New Profile</a>
    <hr>
    <router-outlet></router-outlet>
    `
})
export class LandingComponent { }
