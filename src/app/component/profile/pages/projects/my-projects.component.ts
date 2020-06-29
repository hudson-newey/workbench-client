import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProjectsService } from "@baw-api/project/projects.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myProjectsMenuItem,
} from "@component/profile/profile.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([myAccountMenuItem, ...myAccountActions]),
    links: List(),
  },
  resolvers: {
    [userKey]: userResolvers.show,
  },
  self: myProjectsMenuItem,
})
@Component({
  selector: "app-my-projects",
  templateUrl: "./projects.component.html",
})
export class MyProjectsComponent extends PagedTableTemplate<TableRow, Project> {
  public columns = [
    { name: "Project" },
    { name: "Sites" },
    { name: "Permission" },
  ];

  constructor(api: ProjectsService, route: ActivatedRoute) {
    super(
      api,
      (projects) =>
        projects.map((project) => ({
          project,
          sites: project.siteIds.size,
          permission: "UNKNOWN", // TODO After https://github.com/QutEcoacoustics/baw-server/issues/425
        })),
      route
    );
  }

  public get account(): User {
    return this.models[userKey] as User;
  }
}

interface TableRow {
  project: Project;
  sites: number;
  permission: string;
}