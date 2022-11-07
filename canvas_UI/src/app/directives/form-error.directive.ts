import { Directive, ElementRef, Input , OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appFormError]'
})
export class FormErrorDirective implements OnChanges{

  @Input('appFormError') formError : any;

  constructor(private elemRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    const formError =  changes.formError;
    if( formError && formError.currentValue !== formError.previousValue) {
      console.log('Form Value ', formError);
      if( formError.currentValue?.required) {
        this.elemRef.nativeElement.display = 'block';
        this.elemRef.nativeElement.innerText = 'Field is required.';
        return;
      }
      if( formError.currentValue?.minlength) {
        this.elemRef.nativeElement.display = 'block';
        this.elemRef.nativeElement.innerText = 'Field should have a min length of '  + formError.currentValue.minlength?.requiredLength;
        return;
      }
      if( formError.currentValue?.maxlength) {
        this.elemRef.nativeElement.display = 'block';
        this.elemRef.nativeElement.innerText = 'Field should have a min length of '  + formError.currentValue.maxlength?.requiredLength;
        return;
      }
      if( formError.currentValue?.userName || formError.currentValue?.emailAddress || formError.currentValue?.password || formError.currentValue?.mismatchPwd ) {
        this.elemRef.nativeElement.display = 'block';
        this.elemRef.nativeElement.innerText = formError.currentValue?.userName?.reason || formError.currentValue?.emailAddress?.reason 
        || formError.currentValue?.password?.reason || formError.currentValue?.mismatchPwd?.reason;
        return;
      }
      this.elemRef.nativeElement.display = 'none';
      this.elemRef.nativeElement.innerText = '';
    }
  }
}
