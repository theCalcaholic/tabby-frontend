import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as Clipboard from 'clipboard';

@Directive({
  selector: '[clipboard]'
})

export class ClipboardDirective {
  clipboard: Clipboard;

  @Input('clipboard')
  elt:ElementRef;

  @Output()
  clipboardSuccess:EventEmitter<any> = new EventEmitter();

  @Output()
  clipboardError:EventEmitter<any> = new EventEmitter();

  constructor(private eltRef:ElementRef) {
    console.log("Creating clipboard...");
  }


  ngOnInit() {
    console.log("ngOnInit...");
    console.log(this.eltRef.nativeElement);
    this.clipboard = new Clipboard(this.eltRef.nativeElement);

    this.clipboard.on('success', (e) => {
      this.clipboardSuccess.emit(e);
    });

    this.clipboard.on('error', (e) => {
      this.clipboardError.emit(e);
    })
  }

  ngOnDestroy() {
    if( this.clipboard ) {
      this.clipboard.destroy();
    }
  }
}
