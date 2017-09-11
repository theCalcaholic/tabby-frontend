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
      <editor [tab]="activeTab">
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
