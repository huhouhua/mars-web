// Imports
import {
    Component,
    Input,
    Output,
    ElementRef,
    ViewChild,
    EventEmitter,
    forwardRef,
    AfterViewInit,
    OnDestroy,
    OnInit,
  } from '@angular/core';
  import { NG_VALUE_ACCESSOR } from '@angular/forms';
  import * as CodeMirror from 'codemirror';
  
  /**
   * CodeMirror component
   * Usage :
   * <codemirror [(ngModel)]="data" [config]="{...}"></codemirror>
   */
  @Component({
    selector: 'codemirror',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CodemirrorComponent),
        multi: true
      }
    ],
    template: `<textarea #host></textarea>`,
  })
  export class CodemirrorComponent implements AfterViewInit, OnDestroy {
  
    @Input()
      config:any
    @Output() change = new EventEmitter();
    @Output() focus = new EventEmitter();
    @Output() blur = new EventEmitter();
    @Output() cursorActivity = new EventEmitter();
   
    @ViewChild('host',{read:null}) host:any;
  
    @Output()
    instance!: CodeMirror.EditorFromTextArea;
    _value:string = '';
  
    /**
     * Constructor
     */
    constructor() {}
      // ngOnInit(): void {
      //   this.config = this.config || {};
      //   this.codemirrorInit(this.config);
      // }
      ngAfterViewInit(): void {
     
        this.config = this.config || {};
        this.codemirrorInit(this.config);
      }
  
    get value() { return this._value; }
  
    @Input() set value(v) {
      if (v !== this._value) {
        this._value = v;
        this.onChange(v);
      }
    }
  
    /**
     * On component destroy
     */
    ngOnDestroy() {
  
    }
  
    /**
     * On component view init
     */

  
    /**
     * Initialize codemirror
     */
    codemirrorInit(config:any) {
      this.instance = CodeMirror.fromTextArea(this.host.nativeElement, config);
      this.instance?.setValue(this._value);
  
      this.instance?.on('change', () => {
        this.updateValue(this.instance.getValue());
      });
  
      this.instance?.on('focus', (instance: any , event: any) => {
        this.focus.emit({instance, event});
      });
  
      this.instance?.on('cursorActivity', (instance: any) => {
        this.cursorActivity.emit({instance});
      });
  
      this.instance?.on('blur', (instance: any, event: any) => {
        this.blur.emit({instance, event});
      });
    }
  
    /**
     * Value update process
     */
    updateValue(value:string) {
      this.value = value;
      this.onTouched();
      this.change.emit(value);
    }
  
    /**
     * Implements ControlValueAccessor
     */
    writeValue(value:any) {
      this._value = value || '';
      if (this.instance) {
    
        if(typeof(this._value) =='object'){
          this.instance.setValue(JSON.stringify(this._value));
        }else{
          this.instance.setValue(this._value);
        }
        
      }
    }
    onChange(v:string): void {}
    onTouched() {}
    registerOnChange(fn: () => void) { this.onChange = fn; }
    registerOnTouched(fn: () => void) { this.onTouched = fn; }
  }
  
   class  nativeElementCus{
    nativeElement?: HTMLTextAreaElement;
  }  