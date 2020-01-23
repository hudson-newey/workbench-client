import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ID } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  deleteProjectMenuItem,
  projectCategory,
  projectMenuItem,
  projectsMenuItem
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    links: List()
  },
  self: deleteProjectMenuItem
})
@Component({
  selector: "app-projects-delete",
  template: `
    <app-form
      *ngIf="ready"
      [schema]="{ model: {}, fields: [] }"
      [title]="'Are you certain you wish to delete ' + projectName + '?'"
      [btnColor]="'btn-danger'"
      [error]="error"
      [submitLabel]="'Delete'"
      [submitLoading]="formLoading"
      (onSubmit)="submit($event)"
    ></app-form>
    <app-loading [isLoading]="loading"></app-loading>
    <app-error-handler [error]="errorDetails"></app-error-handler>
  `
})
export class DeleteComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject<any>();
  error: string;
  errorDetails: APIErrorDetails;
  formLoading: boolean;
  loading: boolean;
  projectName: string;
  ready: boolean;
  projectId: ID;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ProjectsService
  ) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.ready = false;

    this.route.params
      .pipe(
        flatMap(params => {
          this.projectId = params.projectId;
          return this.api.getProject(this.projectId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (project: Project) => {
          this.projectName = project.name;
          this.ready = true;
          this.loading = false;
        },
        (err: APIErrorDetails) => {
          this.errorDetails = err;
          this.loading = false;
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  submit() {
    // This subscription must complete so takeuntil is ignored
    // so that it will run in the background in case the user
    // manages to navigate too fast. Subscription will call
    // onComplete so it should not sit hanging in the event
    // of component onDestroy.
    this.formLoading = true;
    this.api
      .deleteProject(this.projectId)
      // tslint:disable-next-line: rxjs-prefer-angular-takeuntil
      .subscribe(
        () => {
          this.formLoading = false;
          this.router.navigate(projectsMenuItem.route.toRoute());
        },
        (err: APIErrorDetails) => {
          this.formLoading = false;
          this.error = err.message;
        }
      );
  }
}