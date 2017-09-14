import { Component } from '@angular/core';

@Component({
  selector: 'landing',
  template: `
    <h1>Tabby</h1>
    <a routerLink="edit/9as9u2ob3bonal">TestProfile</a>
    <hr>
    <router-outlet></router-outlet>
    `
})
export class LandingComponent { }
