import { Component, ViewChild, ElementRef } from '@angular/core';

import {TabComponent } from './tab.component';
import { ProfileService }  from './profile.service';

@Component({
    selector: 'tabeditor-root',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css'],
})

export class EditorComponent {
    @ViewChild('preview') resultContainer: ElementRef;
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

    onClipboardSuccess(): void {
      console.log("Successfully copied source to clipboard.");
    }

    onClipboardError(): void {
      console.log("An error occured while copying to clipboard.");
    }
}
