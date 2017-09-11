import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    template: `
        <h1>{{title}}</h1>
        <div class='tabscontainer'>
            <tabs></tabs>
        </div>
        <input type='submit' (click)="export()" value="Profil exportieren" />
        <div>
        <iframe
          [class.hidden]="!showExport"
          id='result'
          style='width:600px; float: right;'
          #result>
        </iframe>
        <pre *ngIf="showExport">{{profileSrc}}</pre>
        </div>
        `,
})

export class AppComponent {
    @ViewChild('result') resultContainer: ElementRef;
    title = 'Tabby';
    editmode = 'source';
    showExport = false;

    profileSrc: string;

    /*export(): void {
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
        profileSrc += "\n" + tab.content;
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

    }*/

    ngOnInit(): void {
    }
}
