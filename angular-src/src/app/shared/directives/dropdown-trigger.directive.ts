import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2
} from '@angular/core';

import { HandlePropChanges } from './../handle-prop-changes';
import { AppRenderer } from './../../services/app-renderer.service';

@Directive({
  selector: '[dropdownTriggerFor]',
  exportAs: 'dropdownTrigger'
})
export class DropdownTrigger extends HandlePropChanges implements AfterViewInit {
  @Input() align: string;
  @Input() belowOrigin: boolean;
  @Input() constrainWidth: boolean;
  @Input() dropdownButtonId: string;
  @Input() gutter: number;
  @Input() hover: boolean;
  @Input() id: string;
  @Input() inDuration: number;
  @Input() outDuration: number;
  @Input() stopPropagation: boolean;
  @Input() dropdownTriggerFor: string;

  private dropdownOpen = false
  private dropdownButtonElement: JQuery;
  private dropdownElement: JQuery;

  constructor(private elementRef: ElementRef, private renderer: Renderer2, private appRenderer: AppRenderer) {
    super();
  }

  ngAfterViewInit() {
    this.initDropdownButtonElement();
    this.initDropdownElement();
    this.validateProperties();
    this.initHandlers();
    this.handleProperties();
  }

  initDropdownButtonElement() {
    this.dropdownButtonElement = $(`#${this.id}`);
  }

  initDropdownElement() {
    this.dropdownElement = $(`#${this.dropdownTriggerFor}`);
  }

  initHandlers() {
    this.handlers = {
      align: () => this.handleDropdown(),
      belowOrigin: () => this.handleDropdown(),
      constrainWidth: () => this.handleDropdown(),
      dropdownButtonId: () => this.handleDataActivates(),
      gutter: () => this.handleDropdown(),
      hover: () => this.handleDropdown(),
      id: () => this.handleDropdown(),
      inDuration: () => this.handleDropdown(),
      outDuration: () => this.handleDropdown(),
      stopPropagation: () => this.handleDropdown(),
    };
  }

  handleProperties() {
    this.handleDataActivates();
    this.handleDropdown();
  }

  handleDataActivates() {
    this.renderer.setAttribute(this.dropdownButtonElement[0], 'data-activates', this.dropdownTriggerFor);
  }

  handleDropdown() {
    this.validateProperties();

    const options: Materialize.DropDownOptions = {
      alignment: this.align,
      belowOrigin: this.belowOrigin,
      constrainWidth: this.constrainWidth,
      gutter: this.gutter,
      hover: this.hover,
      inDuration: this.inDuration,
      outDuration: this.outDuration,
      stopPropagation: this.stopPropagation,
    };

    // Initialize dropdown button for dropdown
    setTimeout(() => this.appRenderer.invokeMethod(this.dropdownButtonElement, 'dropdown', [options]));
  }

  validateProperties() {
    if (!this.dropdownTriggerFor) {
      throw new Error('Attribute [dropdownTriggerFor] from dropdown-trigger is required. ' + this.dropdownElement);
    }
    if (!this.id) {
      throw new Error('Attribute [id] from dropdown-trigger is required. ' + this.dropdownButtonElement);
    }
  }
}