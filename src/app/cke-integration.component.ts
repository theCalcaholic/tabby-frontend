import {Component, Input} from '@angular/core';
import { Tab } from 'tabby-common/tab';

@Component({
    selector: 'editor',
    template: `
      <div class="editorcontainer">
        <textarea
          *ngIf="editmode=='source'"
          [(ngModel)]="tab.content"
          class='editor'
          width='300'
          height='20'>
        </textarea>
				<ckeditor
          *ngIf="editmode=='cke'"
          [(ngModel)]="tab.content"
          debounce="500"
          [config]="{contentsCss: '../assets/tabstyle.css'}"
        >
        </ckeditor>
      </div>
    `,
    styles: [``]
})

export class CKEIntegrationComponent {
  @Input() tab: Tab;
  @Input() tabStyles : string;
  editmode = 'cke';


}
