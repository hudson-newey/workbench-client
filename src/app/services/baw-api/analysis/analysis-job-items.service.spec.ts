import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AnalysisJobItem } from "@models/AnalysisJobItem";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateAnalysisJobItem } from "@test/fakes/AnalysisJobItem";
import { validateReadonlyApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { AnalysisJobItemsService } from "./analysis-job-items.service";

describe("AnalysisJobItemsService", (): void => {
  const createModel = () =>
    new AnalysisJobItem(generateAnalysisJobItem({ id: 10 }));
  const baseUrl = "/analysis_jobs/5/audio_recordings/";
  let spec: SpectatorService<AnalysisJobItemsService>;
  const createService = createServiceFactory({
    service: AnalysisJobItemsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadonlyApi(
    () => spec,
    AnalysisJobItem,
    baseUrl,
    baseUrl + "filter",
    baseUrl + "10",
    createModel,
    10,
    5
  );
});
