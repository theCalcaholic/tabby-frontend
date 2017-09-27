import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { ProfileService } from './profile.service';
import { Profile } from 'tabby-common/models/profile';

@Component({
  selector: 'edit-view',
  template: `
    <div id='editorcontainer'>
      <h1>Tabby</h1>
      <tabeditor-root></tabeditor-root>
    </div>
    <div id='styleeditor-sidebar'>
      <style-editor></style-editor>
    </div>
    `,
    styleUrls: ['editview.component.css']
})

export class EditViewComponent {

}
