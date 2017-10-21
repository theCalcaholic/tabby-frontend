import { OnChanges, OnInit, SimpleChanges, Component } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { ProfileService } from './profile.service';

import { Style, Parameter } from 'tabby-common/models/style';
import { styles } from 'tabby-common/styles/styles'

function cloneTo(from:Array<any>, to:Array<any>) {
  while( to.length > 0 ) {
    to.pop
  }
  let fromCopy = JSON.parse(JSON.stringify(from));
  fromCopy.forEach(fElement => {
      to.push(fElement);
  });
}

@Component({
  selector: 'style-editor',
  templateUrl: 'styleeditor.component.html',
  styleUrls: ['styleeditor.component.css']
})
export class StyleEditorComponent implements OnInit, OnChanges {
  styles: Style[];
  _selectedStyle:Style;
  get selectedStyle():Style {
    return this._selectedStyle;
  }
  set selectedStyle(style:Style) {
    this._selectedStyle = style;
    this.profileService.updateStyle(style);
  }

  constructor(private profileService:ProfileService) {
    this.styles = new Array<Style>();
    styles.forEach((template) => {
      this.styles.push(new template());
    })
    this.selectedStyle = this.styles[0];
  }

  loadStyle(style:Style) {
    this.styles.forEach(s => {
      if(s.id == style.id) {
        s.loadParameters(style.parameters);
        this._selectedStyle = s;
      }
    });
  }

  styleUpdate() {
    this.profileService.updateStyle(this._selectedStyle);
  }

  ngOnInit(): void {
    this.profileService.OnStyleUpdate(this.loadStyle.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("gOnChanges()");
    console.log(changes);
  }
}