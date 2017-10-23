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
    mutePreviewValue = true;
    get mutePreview(): boolean {
      return this.mutePreviewValue;
    }
    set mutePreview(b:boolean) {
      this.mutePreviewValue = b;
      this.renderPreview(this.profileSrc);
    }

    renderPreview(src: string): void {
      console.log("renderPreview(string)");
      this.showExport = true;
      this.profileSrc = src;
      let finalSrc = src;
      if(this.mutePreview) {
        finalSrc = finalSrc
          .replace("autoplay=1", '')
          .replace("autoplay", "");
      }
      let iframe: HTMLIFrameElement
        = <HTMLIFrameElement> this.resultContainer.nativeElement;
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write("<body style='margin:0;'>" + finalSrc + "</body>");
      iframe.contentWindow.document.close();
      iframe.style.height = iframe.contentWindow.document.body.offsetHeight + 'px';
      //iframe.clientHeight
    }

    onClipboardSuccess(): void {
      console.log("Successfully copied source to clipboard.");
      alert("Successfully copied source to clipboard.");
    }

    onClipboardError(): void {
      console.log("An error occured while copying to clipboard.");
      alert("An error occured while copying to clipboard.");
    }
}
