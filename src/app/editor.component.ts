import {Component, Input} from '@angular/core';
import { Tab } from './tab.component';

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
				<div *ngIf="editmode=='cke'" id="editor">
				</div>
      </div>
    `,
    styles: [``]
})

export class EditorComponent {
  @Input() tab: Tab;
  editmode = 'source';
}
