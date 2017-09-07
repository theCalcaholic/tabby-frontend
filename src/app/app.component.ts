import { Component, ViewChild, ElementRef } from '@angular/core';



export class Tab {
    title: string;
    active: boolean;
    content: string;

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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    template: `
        <h1>{{title}}</h1>
        <div class='tabscontainer'>
            <label *ngFor="let tab of tabs"
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
                <textarea *ngIf="editmode=='source'" [(ngModel)]="activeTab.content" class='editor' width='300' height='20'>
                </textarea>
            </div>
        </div>
        <input type='submit' (click)="export()" value="Profil exportieren" />
        <div>
        <iframe
          [class.hidden]="!showExport"
          id='result'
          style='width:600px;'
          #result>
        </iframe>
        <pre *ngIf="showExport" style='float: left;'>{{profileSrc}}</pre>
        </div>
        `,
    styles: [`
        .active {
            color: red;
        }
        .hidden {
          display: none;
        }
        `]
})

export class AppComponent {
    @ViewChild('result') resultContainer: ElementRef;
    title = 'Tabby';
    editmode = 'source';
    showExport = false;

    tabs = [];
    activeTab: Tab;
    profileSrc: string;

    add(tab: Tab): void {
        this.tabs.push(tab);
        if(!this.activeTab) {
            this.activate(this.tabs[this.tabs.length - 1]);
        }
    }

    activate(tab: Tab): void {
      if(this.activeTab === tab)
      {
        tab.title = prompt(
          "Gebe einen neuen Titel f&uuml;r den Tab ein:",
          tab.title);
      }
      else {
        this.activeTab = tab;
      }
    }

    export(): void {
      let profileSrc = "<div id='noeditmode'>"
                     + "\n<div class='contentcontainer'>";
      this.tabs.forEach((tab: Tab, i: number, allTabs: Tab[]) => {
        profileSrc += "\n<label class='tabtitle' for='tab" + i + "'>"
                    + tab.title + "</label>";
      });
      this.tabs.forEach((tab: Tab, i: number, allTabs: Tab[]) => {
        profileSrc += "\n<input type='radio' id='tab" + i + "' class='tab'"
                    + (i === 1 ? " checked='checked'" : "")
                    + " name='tabs' />";
        profileSrc += "\n<div class='tabcontent'>";
        profileSrc += "\n" + tab.content;/*.replace('<', '&lt;')
                      .replace('>', '&gt;');*/
        profileSrc += "\n</div>";
      });
      profileSrc += "\n</div>\n</div>";
      profileSrc += "\n<style type='text/css'>"
                  + "\n" + profileCss
                  + "\n</style>";
      this.profileSrc = profileSrc;
      this.showExport = true;
      let iframe: HTMLIFrameElement
        = <HTMLIFrameElement> this.resultContainer.nativeElement;
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write("<body>" + this.profileSrc + "</body>");
      iframe.contentWindow.document.close();

    }

    addNewTab(): void {
      this.add({
        title: 'Tab' + (this.tabs.length + 1),
        active: false, content: ''
      });
    }

    ngOnInit(): void {
    }
}
