import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import {
  hasResolvedSuccessfully,
  ResolvedModelList,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  audioRecordingMenuItems,
  audioRecordingsCategory,
  downloadAudioRecordingMenuItem,
} from "@components/audio-recordings/audio-recording.menus";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo, PageInfo } from "@helpers/page/pageInfo";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import schema from "./audio-recording.schema.json";

const audioRecordingKey = "audioRecording";
const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

/**
 * Details of a special audio recording. This component can be accessed from:
 * /audio_recordings/:audioRecordingId
 */
@Component({
  selector: "baw-audio-recording",
  templateUrl: "./details.component.html",
})
class AudioRecordingsDetailsComponent extends PageComponent implements OnInit {
  public failure: boolean;
  private models: ResolvedModelList;
  public fields = schema.fields;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);
    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }
    this.models = models;
  }

  public get recording(): AudioRecording | undefined {
    return this.models[audioRecordingKey] as AudioRecording;
  }

  public get project(): Project | undefined {
    return this.models[projectKey] as Project;
  }

  public get region(): Region | undefined {
    return this.models[regionKey] as Region;
  }

  public get site(): Site | undefined {
    return this.models[siteKey] as Site;
  }
}

const menuItems = audioRecordingMenuItems.details;
const pageInfo: IPageInfo = {
  category: audioRecordingsCategory,
  menus: {
    actions: List([listenRecordingMenuItem, downloadAudioRecordingMenuItem]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: {
    [audioRecordingKey]: audioRecordingResolvers.show,
    [projectKey]: projectResolvers.showOptional,
    [regionKey]: regionResolvers.showOptional,
    [siteKey]: siteResolvers.showOptional,
  },
};

AudioRecordingsDetailsComponent.linkToRoute({
  ...pageInfo,
  pageRoute: menuItems.base,
})
  .linkToRoute({ ...pageInfo, pageRoute: menuItems.site })
  .linkToRoute({ ...pageInfo, pageRoute: menuItems.siteAndRegion })
  .linkToRoute({ ...pageInfo, pageRoute: menuItems.region })
  .linkToRoute({ ...pageInfo, pageRoute: menuItems.project });

export { AudioRecordingsDetailsComponent };