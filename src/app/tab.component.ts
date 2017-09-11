import { SimpleChanges, Input, Component } from '@angular/core';


export class Tab {
    private _title: string;
    private _content: string;
    get title(): string {
      return this._title;
    };
    set title(theTitle: string) {
      this._title = theTitle;
      this.OnChange();
    }
    get content(): string {
      return this._content;
    }
    set content(theContent: string) {
      this._content = theContent;
      this.OnChange();
    }
    active: false;

    constructor(title: string, onChange?: Function) {
      this._title = title;
      this._content = '';
      this.OnChange = onChange || (()=>{});
    }

    OnChange: Function;

}

@Component({
  selector: 'tabs',
  template: `<label *ngFor="let tab of tabs"
    [class.active]="tab === activeTab"
    class="tabtitle"
    id="tabtitle_{{tab.id}}"
    for="tab_{{tab.id}}"
    (click)="activate(tab)">
      {{tab.title}}
  </label>
  <label class='tabtitle' id='addtab-button' (click)="addNewTab()">
    +
  </label>
  <div *ngIf="activeTab" class='editorcontainer'>
      <!--<textarea *ngIf="editmode=='source'" [(ngModel)]="activeTab.content" class='editor' width='300' height='20'>
      </textarea>-->
      <editor [tab]="activeTab" [tabStyles]="style">
      </editor>
  </div>`,
  styles: [`
      .active {
          color: red;
      }
      `]

})


export class TabComponent {
    @Input() renderPreview: Function;
    tabs = [];
    activeTab: Tab;

    add(tab: Tab): void {
        this.tabs.push(tab);
        this.activate(this.tabs[this.tabs.length - 1]);
        this.export();
    }

    activate(tab: Tab): void {
      if(this.activeTab === tab)
      {
        let resp = prompt(
          "Gebe einen neuen Titel f&uuml;r den Tab ein:",
          tab.title);
        if( resp !== null )
        {
          tab.title = resp;
        }
      }
      else {
        this.activeTab = tab;
      }
    }

    addNewTab(): void {
      this.add(new Tab('Tab' + (this.tabs.length + 1), this.export.bind(this)));
    }

    export(): void {
      console.log(this.tabs);
      let profileSrc = "<div id='noeditmode'>"
                     + "\n<div class='contentcontainer'>";
      this.tabs.forEach((tab: Tab, i: number, allTabs: Tab[]) => {
        profileSrc += "\n<label class='tabtitle' for='tab" + i + "'>"
                    + tab.title + "</label>";
      });
      this.tabs.forEach((tab: Tab, i: number, allTabs: Tab[]) => {
        profileSrc += "\n<input type='radio' id='tab" + i + "' class='tab'"
                    + (tab == this.activeTab ? " checked='checked'" : "")
                    + " name='tabs'>";
        profileSrc += "\n<div class='tabcontent'>";
        profileSrc += "\n" + tab.content;
        profileSrc += "\n</div>";
      });
      profileSrc += "\n</div>\n</div>";
      profileSrc += "\n<style type='text/css'>"
                  + "\n" + profileCss
                  + "\n</style>";
      console.log(profileSrc);
      this.renderPreview(profileSrc);
    }

}

const profileCss = `\
body {
  background-image: url(https://www.bienenfisch-design.com/wp-content/uploads/wpsg_produktbilder/6410/tn/s-800-600-feine-pergament-textur-003.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
.tab {
  visibility: hidden;
  appearance: none;
  border-color: red;
  border-width: 1px;
  border-style: solid;
}
.tab + div {
  display: none;
}
.tab:checked + div {
  display: block;
}
.tabcontent p, .tabtitle, .tabcontent li {
  font-family: Calibri, Arial, sans-serif;
  color: #880F0F;
  font-size: medium;
}
.tabcontent a {
  color: #FF2222;
}
.tabcontent ul {
  list-style: none;
  padding-left: 0;
}
.tabcontent li {
  margin-bottom: 1em;
}
.tabcontent img {
  max-width: 300px;
  margin: 10px;
  border-style: solid;
  border-width: 2px;
  border-color: #440808;
}
.tabtitle {
  margin: 5px 10px;
  padding: 5px;
  font-size: 1.1em;
  line-height: 2em;
  background-color: #880F0F;
  color: white;/*#440808;*/
  cursor: pointer;
  /*font-weight: bold;*/
  border-radius: 5px;
}
.tabtitle:hover {
  background-color: #EEEEEE;
  color: #880F0F;
}
/*.profilepic {
  border-width: 2px;
  border-style: solid;
  margin: 20px 30px;
  width: 250px;
  height: 273px;
  border-radius: 15em;
  float: right;
}*/
.contentcontainer {
  padding: 10px;
  min-height: 80%;
}
#editmode .tab + div {
  display: block;
}`;
