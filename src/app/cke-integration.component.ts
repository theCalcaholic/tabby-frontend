import { OnInit, Component, Input } from '@angular/core';
import { Tab } from '../../../tabby-common/models/tab';
import { ProfileService } from './profile.service';

@Component({
    selector: 'editor',
    template: `
      <div class="editorcontainer">
				<ckeditor
          [(ngModel)]="tab.content"
          debounce="500"
          [config]="{contentsCss: styleUrl}"
        >
        </ckeditor>
      </div>
    `,
    styles: [``],
})

export class CKEIntegrationComponent implements OnInit {
  @Input() tab: Tab;
  @Input() tabStyles : string;
  styleUrl= "";

  constructor(
    private profileService: ProfileService,
  ) {

  }
  changeStyleUrl() {

  }

  updateStyleUrl(url:string) {
    if(!url) {
      this.styleUrl = "";
      return;
    }
    this.styleUrl = url;
  }

  ngOnInit() {
    this.styleUrl = this.profileService.getStyleUrl();
  }

}
