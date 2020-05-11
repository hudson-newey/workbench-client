import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { shallowSiteResolvers } from "@baw-api/site/sites.service";
import { fields } from "@component/sites/site.json";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Site } from "@models/Site";
import { List } from "immutable";
import {
  adminOrphanMenuItem,
  adminOrphansCategory,
  adminOrphansMenuItem,
} from "../orphans.menus";

const siteKey = "site";

@Page({
  category: adminOrphansCategory,
  menus: {
    links: List(),
    actions: List([adminOrphansMenuItem, adminOrphanMenuItem]),
  },
  resolvers: {
    [siteKey]: shallowSiteResolvers.show,
  },
  self: adminOrphanMenuItem,
})
@Component({
  selector: "app-admin-orphan",
  template: `
    <div *ngIf="!failure">
      <h1>Orphan Site Details</h1>
      <baw-detail-view [fields]="fields" [model]="site"></baw-detail-view>
    </div>
  `,
})
export class AdminOrphanComponent extends WithUnsubscribe(PageComponent)
  implements OnInit {
  public site: Site;
  public failure: boolean;
  public fields = fields;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    const models = retrieveResolvers(data);

    if (!models) {
      this.failure = true;
      return;
    }

    this.site = models[siteKey] as Site;
  }
}
