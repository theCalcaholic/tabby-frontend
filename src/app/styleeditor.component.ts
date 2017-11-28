import { OnChanges, OnInit, SimpleChanges, Component } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { ProfileService } from './profile.service';

import { Style, Parameter } from '../../../tabby-common/models/style';
import { styles } from '../../../tabby-common/styles/styles'

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
export class StyleEditorComponent implements OnInit {
  styles: Style[];
  _selectedStyle:Style;
  bgMusicUrl:string;
  isCollapsed = false;
  toggleButtonText = ">>"

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed
    if(this.isCollapsed) {
      this.toggleButtonText = "<<";
    } else {
      this.toggleButtonText = ">>";
    }
  }

  get selectedStyle():Style {
    return this._selectedStyle;
  }
  set selectedStyle(style:Style) {
    this._selectedStyle = style;
    this.profileService.updateStyle(style);
  }

  resetParam(paramId: string): void {
    let style;
    styles.some((template, i) => {
      style = new template();
      return style.id == this._selectedStyle.id;
    })
    console.log("found style: " + style.id);
    let param = style.parameters.filter(p => p.id == paramId)[0];
    console.log("default param value is: " + param.value);
    this._selectedStyle.parameters.forEach((param_old, i) => {
      if( param_old.id == paramId )
        this._selectedStyle.parameters[i] = param;
    });
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

  loadMusic(musicUrl:string) {
    this.bgMusicUrl = musicUrl;
  }

  styleUpdate() {
    this.profileService.updateStyle(this._selectedStyle);
  }

  updateParameter(id: string, value: string) {
    this._selectedStyle.parameters.forEach((param) => {
      if(param.id == id) {
        param.value = value;
      }
    });
    this.styleUpdate();
  }


  musicUpdate() {
    this.profileService.updateBgMusic(this.bgMusicUrl);
  }

  ngOnInit(): void {
    this.profileService.OnStyleUpdate(this.loadStyle.bind(this));
    this.profileService.OnMusicUpdate(this.loadMusic.bind(this));
    /*(
      function(url) {
        console.log("update music url in style comp: " + url);
        this.bgMusicUrl = url;
      }
    ).bind(this));*/
  }
}
