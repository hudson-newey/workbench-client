import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Page } from "src/app/helpers/page/pageDecorator";
import { PagedTableTemplate } from "src/app/helpers/tableTemplate/pagedTableTemplate";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Script } from "src/app/models/Script";
import { ScriptsService } from "src/app/services/baw-api/scripts.service";
import {
  adminDashboardMenuItem,
  adminNewScriptsMenuItem,
  adminScriptsCategory,
  adminScriptsMenuItem
} from "../admin.menus";

export const adminScriptsMenuItemActions = [adminNewScriptsMenuItem];

@Page({
  category: adminScriptsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminScriptsMenuItemActions
    ]),
    links: List()
  },
  self: adminScriptsMenuItem
})
@Component({
  selector: "app-scripts",
  templateUrl: "./scripts.component.html",
  styleUrls: ["./scripts.component.scss"]
})
export class AdminScriptsComponent extends PagedTableTemplate<TableRow, Script>
  implements OnInit {
  constructor(api: ScriptsService) {
    super(api, scripts =>
      scripts.map(script => ({
        name: script.name,
        version: script.version,
        id: script.id,
        command: script.executableCommand
      }))
    );
  }

  ngOnInit(): void {
    this.columns = [
      { name: "Name" },
      { name: "Version" },
      { name: "Id" },
      { name: "Command" }
    ];
    this.sortKeys = {
      name: "name",
      version: "version",
      id: "id",
      command: "executableCommand"
    };
    this.filterKey = "name";
    this.getModels();
  }
}

interface TableRow {
  name: string;
  version: number;
  id: Id;
  command: string;
}