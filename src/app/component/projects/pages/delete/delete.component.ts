import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  deleteProjectMenuItem,
  projectCategory,
  projectMenuItem,
  projectsMenuItem
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import { ToastrService } from "ngx-toastr";

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: deleteProjectMenuItem
})
@Component({
  selector: "app-projects-delete",
  template: `
    <app-form
      *ngIf="success"
      [schema]="{ model: {}, fields: [] }"
      [title]="'Are you certain you wish to delete ' + project.name + '?'"
      [btnColor]="'btn-danger'"
      [submitLabel]="'Delete'"
      [submitLoading]="loading"
      (onSubmit)="submit()"
    ></app-form>
  `
})
export class DeleteComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public project: Project;
  public success: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ProjectsService,
    private notification: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    const projectModel: ResolvedModel<Project> = this.route.snapshot.data
      .project;

    if (projectModel.error) {
      return;
    }

    this.project = projectModel.model;
    this.success = true;
  }

  submit() {
    // This subscription must complete so takeuntil is ignored
    // so that it will run in the background in case the user
    // manages to navigate too fast. Subscription will call
    // onComplete so it should not sit hanging in the event
    // of component onDestroy.
    this.loading = true;
    this.api
      .destroy(this.project.id)
      // tslint:disable-next-line: rxjs-prefer-angular-takeuntil
      .subscribe(
        () => {
          this.loading = false;
          this.router.navigate(projectsMenuItem.route.toRoute());
          this.notification.success("Successfully deleted project.");
        },
        (err: ApiErrorDetails) => {
          this.loading = false;
          this.notification.error(err.message);
        }
      );
  }
}
