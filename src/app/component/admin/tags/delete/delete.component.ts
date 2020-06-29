import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tagResolvers, TagsService } from "@baw-api/tag/tags.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Page } from "@helpers/page/pageDecorator";
import { Tag } from "@models/Tag";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagsMenuItemActions } from "../list/list.component";
import {
  adminDeleteTagMenuItem,
  adminEditTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem,
} from "../tags.menus";

const tagKey = "tag";

@Page({
  category: adminTagsCategory,
  menus: {
    actions: List([
      adminTagsMenuItem,
      ...adminTagsMenuItemActions,
      adminEditTagMenuItem,
      adminDeleteTagMenuItem,
    ]),
    links: List(),
  },
  resolvers: {
    [tagKey]: tagResolvers.show,
  },
  self: adminDeleteTagMenuItem,
})
@Component({
  selector: "app-delete",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      btnColor="btn-danger"
      submitLabel="Delete"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
export class AdminTagsDeleteComponent extends FormTemplate<Tag>
  implements OnInit {
  public title: string;

  constructor(
    private api: TagsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, tagKey, (model) =>
      defaultSuccessMsg("destroyed", model.text)
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.text}?`;
    }
  }

  protected redirectionPath() {
    return adminTagsMenuItem.route.toString();
  }

  protected apiAction(model: Partial<Tag>) {
    return this.api.destroy(new Tag(model));
  }
}