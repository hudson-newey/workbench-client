import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/core";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-question-answer",
  template: `
    <div class="form-group row">
      <label
        *ngIf="field.templateOptions.label"
        class="col-sm-2 col-form-label"
        [for]="field.id"
      >
        {{ field.templateOptions.label }}
      </label>

      <div class="input-group col-sm-10">
        <input
          type="text"
          readonly
          class="form-control"
          [id]="field.id"
          [value]="model[key]"
        />
      </div>
    </div>
  `
})
// tslint:disable-next-line: component-class-suffix
export class FormlyQuestionAnswer extends FieldType {
  formControl: FormControl;
}
