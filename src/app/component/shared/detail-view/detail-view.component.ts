import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { AbstractModel } from "src/app/models/AbstractModel";

@Component({
  selector: "baw-detail-view",
  template: `
    <div *ngFor="let field of sanitizedFields" class="row">
      <dt class="col-sm-3 text-left text-sm-right font-weight-bold">
        {{ field.templateOptions.label }}
      </dt>
      <baw-render-field
        class="col-sm-9"
        [value]="model[field.key]"
      ></baw-render-field>
    </div>
  `,
  styles: [
    `
      dt {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class DetailViewComponent implements OnInit, OnChanges {
  @Input() public fields: FormlyFieldConfig[];
  @Input() public model: AbstractModel;
  public sanitizedFields: FormlyFieldConfig[];

  constructor() {}

  public ngOnInit(): void {
    this.ngOnChanges();
  }

  public ngOnChanges(): void {
    this.sanitizedFields = [];
    this.recursiveSanitization(this.fields);
  }

  private recursiveSanitization(fields: FormlyFieldConfig[]) {
    fields?.forEach((field) => {
      if (field.fieldGroup) {
        this.recursiveSanitization(field.fieldGroup);
      } else {
        this.sanitizedFields.push(field);
      }
    });
  }
}
