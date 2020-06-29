import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tagResolvers, TagsService } from "@baw-api/tag/tags.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Page } from "@helpers/page/pageDecorator";
import { Tag, TagType } from "@models/Tag";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagsMenuItemActions } from "../list/list.component";
import { fields } from "../tag.schema.json";
import {
  adminDeleteTagMenuItem,
  adminEditTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem,
} from "../tags.menus";

const tagKey = "tag";
const tagTypesKey = "tagTypes";

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
    [tagTypesKey]: tagResolvers.tagTypes,
  },
  self: adminEditTagMenuItem,
})
@Component({
  selector: "app-admin-tags-edit",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
export class AdminTagsEditComponent extends FormTemplate<Tag>
  implements OnInit {
  public fields = fields;
  public title: string;

  constructor(
    private api: TagsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, tagKey, (model) =>
      defaultSuccessMsg("updated", model.text)
    );
  }

  ngOnInit() {
    super.ngOnInit();
    const typeOfTagIndex = 1;

    if (!this.failure) {
      this.title = `Edit ${this.model.text}`;
      this.fields[typeOfTagIndex].templateOptions.options = this.typeOfTags.map(
        (tagType) => ({
          label: tagType.name,
          value: tagType.name,
        })
      );
    }
  }

  public get typeOfTags(): TagType[] {
    return this.models[tagTypesKey] as TagType[];
  }

  // TODO https://github.com/QutEcoacoustics/baw-server/issues/449
  protected apiAction(model: Partial<Tag>) {
    return this.api.update(new Tag(model));
  }
}