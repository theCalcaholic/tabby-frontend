import { Component } from '@angular/core';



export class Tab {
    id: number;
    title: string;
    active: boolean;
    content: string;
}


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
            <div *ngIf="activeTab" class='editorcontainer'>
                <textarea [(ngModel)]="activeTab.content" class='editor' width='300' height='20'>
                </textarea>
            </div>
        </div>
        `,
    styles: [`
        .active {
            color: red;
        }
        `]
})

export class AppComponent {
    title = 'Tabby';
    tabs = [];
    activeTab: Tab;

    add(tab: Tab): void {
        this.tabs.push(tab);
        if(this.tabs.length == 1) {
            this.activate(this.tabs[0]);
        }
    }

    activate(tab: Tab): void {
        this.activeTab = tab;
    }

    ngOnInit(): void {
        this.add({ id: 0, title: 'Tab1', active: true, content: '' });
        this.add({ id: 1, title: 'Tab2', active: false, content: '' });
        this.add({ id: 2, title: 'Tab3', active: false, content: '' });
        this.add({ id: 3, title: 'Tab4', active: false, content: '' });

    }
}
