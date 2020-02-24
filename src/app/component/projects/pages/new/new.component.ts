import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem
} from "../../projects.menus";
import { projectsMenuItemActions } from "../list/list.component";
import { fields } from "./new.json";
import { ToastrService } from "ngx-toastr";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([projectsMenuItem, ...projectsMenuItemActions]),
    links: List()
  },
  self: newProjectMenuItem
})
@Component({
  selector: "app-projects-new",
  template: `
    <app-form
      [schema]="schema"
      [title]="'New Project'"
      [submitLabel]="'Submit'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class NewComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public schema = { model: {}, fields };

  constructor(
    private api: ProjectsService,
    private notification: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    this.loading = false;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;

    this.api
      .create(new Project($event))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.notification.success("Project was successfully created.");
          this.loading = false;
        },
        (err: ApiErrorDetails) => {
          if (err.info && err.info.name && err.info.name.length === 1) {
            this.notification.error(err.message + ": name " + err.info.name[0]);
          } else {
            this.notification.error(err.message);
          }

          this.loading = false;
        }
      );
  }
}
