import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem
} from "../../projects.menus";
import data from "./request.json";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      projectsMenuItem,
      newProjectMenuItem,
      requestProjectMenuItem
    ]),
    links: List()
  },
  self: requestProjectMenuItem
})
@Component({
  selector: "app-projects-request",
  template: `
    <app-wip>
      <app-form
        [schema]="schema"
        [title]="'Request project access'"
        [error]="error"
        [submitLabel]="'Submit request'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class RequestComponent extends PageComponent implements OnInit {
  schema: any;
  error: string;
  loading: boolean;

  constructor(private api: ProjectsService) {
    super();
  }

  ngOnInit() {
    this.loading = false;

    // TODO Change this to the list of projects a user does not have access to
    this.schema = data;
    this.api.getProjects().subscribe(projects => {
      this.schema.fields[0].templateOptions.options = projects.map(project => {
        return {
          value: project.id,
          label: project.name
        };
      });
    });
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}