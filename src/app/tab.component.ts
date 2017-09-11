import { Component } from '@angular/core';


export class Tab {
    title: string;
    active: boolean;
    content: string;

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
    tabs = [];
    activeTab: Tab;

    add(tab: Tab): void {
        this.tabs.push(tab);
        this.activate(this.tabs[this.tabs.length - 1]);
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
      this.add({
        title: 'Tab' + (this.tabs.length + 1),
        active: false, content: ''
      });
    }
}

const parofileCss = `\
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
