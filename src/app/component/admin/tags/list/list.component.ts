import { Component } from "@angular/core";
import { TagsService } from "@baw-api/tag/tags.service";
import { adminDashboardMenuItem } from "@component/admin/admin.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Tag } from "@models/Tag";
import { List } from "immutable";
import {
  adminDeleteTagMenuItem,
  adminEditTagMenuItem,
  adminNewTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem,
} from "../tags.menus";

export const adminTagsMenuItemActions = [adminNewTagMenuItem];

@Page({
  category: adminTagsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminTagsMenuItemActions,
    ]),
    links: List(),
  },
  self: adminTagsMenuItem,
})
@Component({
  selector: "app-admin-tags",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class AdminTagsComponent extends PagedTableTemplate<TableRow, Tag> {
  public columns = [
    { name: "Text" },
    { name: "Taxanomic" },
    { name: "Retired" },
    { name: "type" },
    { name: "Tag" },
  ];
  public sortKeys = {
    text: "text",
    taxanomic: "isTaxanomic",
    retired: "retired",
    type: "typeOfTag",
  };

  constructor(api: TagsService) {
    super(api, (tags) =>
      tags.map((tag) => ({
        text: tag.text,
        taxanomic: tag.isTaxanomic ? "Taxanomic" : "Folksonomic",
        retired: tag.retired,
        type: tag.typeOfTag,
        tag,
      }))
    );

    this.filterKey = "text";
  }

  editPath(tag: Tag): string {
    return adminEditTagMenuItem.route
      .toString()
      .replace(":tagId", tag.id.toString());
  }

  deletePath(tag: Tag): string {
    return adminDeleteTagMenuItem.route
      .toString()
      .replace(":tagId", tag.id.toString());
  }
}

interface TableRow {
  text: string;
  taxanomic: "Taxanomic" | "Folksonomic";
  retired: boolean;
  type: string;
  tag: Tag;
}