import { Component, OnInit, ViewChild } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { FieldType } from "@ngx-formly/core";
import { getTimeZones, TimeZone } from "@vvo/tzdb";
import { merge, Observable, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from "rxjs/operators";

/**
 * Timezone Input
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-timezone-input",
  template: `
    <div class="form-group">
      <label *ngIf="to.label" [for]="field.id">
        {{ to.label + (to.required ? " *" : "") }}
      </label>

      <ng-template #resultTemplate let-r="result" let-t="term">
        <ngb-highlight
          [result]="r.currentTimeFormat"
          [term]="t"
        ></ngb-highlight>
      </ng-template>

      <div class="input-group">
        <input
          #instance="ngbTypeahead"
          type="text"
          class="form-control"
          placeholder="Type a city or country name."
          [class]="{ 'is-invalid': error }"
          [editable]="false"
          [ngbTypeahead]="search"
          [inputFormatter]="formatter"
          [resultTemplate]="resultTemplate"
          [formlyAttributes]="field"
          [(ngModel)]="timezone"
          (ngModelChange)="updateValue()"
          (focus)="focus$.next($any($event).target.value)"
          (click)="click$.next($any($event).target.value)"
        />

        <div class="input-group-append">
          <span class="input-group-text">
            {{ timezone ? timezone.countryName : "(no value)" }}
          </span>
        </div>
      </div>

      <div *ngIf="error" class="invalid-feedback" style="display: block;">
        {{ getError() }}
      </div>

      <input type="hidden" [id]="field.id" [formControl]="formControl" />
    </div>
  `,
})
// tslint:disable-next-line: component-class-suffix
export class FormlyTimezoneInput extends FieldType implements OnInit {
  @ViewChild("instance", { static: true }) public instance: NgbTypeahead;
  public click$ = new Subject<string>();
  public focus$ = new Subject<string>();
  public defaultTime = "(no match)";
  public error: boolean;
  public offset: string = this.defaultTime;
  public timezone: TimeZone;
  public timezones: TimeZone[] = [];

  public async ngOnInit() {
    this.timezones = getTimeZones();
    this.formControl.setValidators(() => {
      if (!isInstantiated(this.timezone)) {
        if (this.to.required && this.formControl.dirty) {
          return { [this.field.key.toString()]: "You must select a timezone" };
        } else {
          return null;
        }
      }

      this.error = !this.timezones.find(
        (timezone) => timezone === this.timezone
      );
      return this.error
        ? { [this.field.key.toString()]: "Invalid timezone selected" }
        : null;
    });
    this.formControl.updateValueAndValidity();
  }

  public getError(): string {
    return this.formControl.getError(this.field.key.toString());
  }

  /**
   * Update form controller with latest timezone value
   */
  public updateValue() {
    this.formControl.setValue(this.timezone?.name);
  }

  /**
   * Format typeahead output to show current time format of timezone
   * @param selected Selected timezone
   */
  public formatter = (selected: TimeZone): string => selected.currentTimeFormat;

  /**
   * Update typeahead dropdown list whenever event is detected
   * @param text$ Search event
   */
  public search = (text$: Observable<string>): Observable<TimeZone[]> => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) => this.searchTimezones(term))
    );
  };

  /**
   * Search timezones and select any which reference the input
   * @param term Term to search for
   */
  private searchTimezones(term: string): TimeZone[] {
    let zones = this.timezones;

    if (term?.length > 0) {
      zones = zones.filter((zone) =>
        zone.currentTimeFormat
          .toLocaleLowerCase()
          .includes(term.toLocaleLowerCase())
      );
    }

    return zones.slice(0, 10);
  }
}