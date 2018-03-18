import { Component, Input } from '@angular/core';
import { Parameter } from '../../../../tabby-common/models/style';

@Component({
  selector: 'dropdown-parameter',
  templateUrl: "dropdown.component.html",
  styleUrls: ['dropdown.component.css']
})

export class DropdownParameterComponent {
  @Input('parameter')
  parameter: Parameter;

  @Input('updateFun')
  updateFun: Function;
}
