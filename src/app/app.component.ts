import { OnInit, Component } from '@angular/core';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    `,
})
export class AppComponent implements OnInit {

  ngOnInit(): void {}
 }
