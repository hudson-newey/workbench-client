import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { UserService } from "src/app/services/baw-api/user.service";
import {
  editProfileMenuItem,
  profileCategory,
  profileMenuItem
} from "../../profile.menus";
import data from "./edit.json";

@Page({
  category: profileCategory,
  menus: {
    actions: List<AnyMenuItem>([profileMenuItem, editProfileMenuItem]),
    links: List()
  },
  self: editProfileMenuItem
})
@Component({
  selector: "app-profile-edit",
  template: `
    <app-wip>
      <app-form
        *ngIf="ready"
        [schema]="schema"
        [title]="'Editing profile for ' + user.userName"
        [error]="error"
        [success]="success"
        [submitLabel]="'Update User'"
        [submitLoading]="loading"
        [btnColor]="'btn-warning'"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class EditComponent extends PageComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  error: string;
  errorDetails: APIErrorDetails;
  loading: boolean;
  ready: boolean;
  schema = data;
  success: string;

  user: User;

  constructor(private api: UserService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.ready = false;
    this.loading = false;

    this.route.params
      .pipe(
        flatMap(params => {
          return this.api.getUserAccount(params.userId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (user: User) => {
          this.user = user;
          this.ready = true;

          this.schema.model["name"] = this.user.userName;
        },
        (err: APIErrorDetails) => {
          this.errorDetails = err;
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    console.log($event);
  }
}
