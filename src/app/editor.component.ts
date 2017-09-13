import { Component, ViewChild, ElementRef } from '@angular/core';

import {TabComponent } from './tab.component';
import { ProfileService }  from './profile.service';

@Component({
    selector: 'editor-root',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css'],
})

export class EditorComponent {
    @ViewChild('preview') resultContainer: ElementRef;
    title = 'Tabby';
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
}
