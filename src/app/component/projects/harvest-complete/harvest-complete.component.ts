import { Component, Input, OnInit } from "@angular/core";
import { SitesService } from "@baw-api/site/sites.service";
import { PagedTableTemplate } from "src/app/helpers/tableTemplate/pagedTableTemplate";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";

@Component({
  selector: "app-project-harvest-complete",
  templateUrl: "./harvest-complete.component.html",
})
export class HarvestCompleteComponent extends PagedTableTemplate<TableRow, Site>
  implements OnInit {
  @Input() project: Project;
  public sites: Site[];
  public error: ApiErrorDetails;
  public columns = [{ name: "Id" }, { name: "Name" }, { name: "Actions" }];
  public sortKeys = { id: "id", name: "name" };

  constructor(api: SitesService) {
    super(
      api,
      (sites) =>
        sites.map((site) => ({
          id: site.id,
          name: site.name,
          actions: site,
        })),
      undefined,
      (component: HarvestCompleteComponent) => [component.project]
    );
  }

  public detailsPath(site: Site) {
    return site.getViewUrl(this.project);
  }

  public playPath(site: Site) {
    return "/broken_link";
  }

  public visualizePath(site: Site) {
    return "/broken_link";
  }
}

interface TableRow {
  id: number;
  name: string;
  actions: Site;
}