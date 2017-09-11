import { Component, ViewChild, ElementRef } from '@angular/core';
import {TabComponent } from './tab.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    template: `
        <h1>{{title}}</h1>
        <div class='tabscontainer'>
            <tabs [renderPreview]="renderPreview.bind(this)"></tabs>
        </div>
        <h1 [class.hidden]="!showExport" id='previewHead'>Preview</h1>
        <div [class.hidden]="!showExport" id='previewContainer'>
        <iframe
          id='preview'
          style='width:600px;'
          #preview>
        </iframe>
        </div>
        `,
})

export class AppComponent {
    @ViewChild('preview') resultContainer: ElementRef;
    title = 'Tabby';
    editmode = 'source';
    showExport = false;

    profileSrc: string;

    renderPreview(src: string): void {
      this.showExport = true;
      this.profileSrc = src;
      let iframe: HTMLIFrameElement
      = <HTMLIFrameElement> this.resultContainer.nativeElement;
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write("<body>" + src + "</body>");
      iframe.contentWindow.document.close();
    }

    ngOnInit(): void {
    }
}
