import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SavedSearch } from "@models/SavedSearch";
import { testAppInitializer } from "src/app/test.helper";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "./api-common.helper";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";
import { SavedSearchesService } from "./saved-searches.service";

describe("SavedSearchesService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        SavedSearchesService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(SavedSearchesService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<SavedSearch, SavedSearchesService>("/saved_searches/");
  validateApiFilter<SavedSearch, SavedSearchesService>(
    "/saved_searches/filter"
  );
  validateApiShow<SavedSearch, SavedSearchesService>(
    "/saved_searches/5",
    5,
    new SavedSearch({ id: 5 })
  );
  validateApiCreate<SavedSearch, SavedSearchesService>(
    "/saved_searches/",
    new SavedSearch({ id: 5 })
  );
  validateApiUpdate<SavedSearch, SavedSearchesService>(
    "/saved_searches/5",
    new SavedSearch({ id: 5 })
  );
  validateApiDestroy<SavedSearch, SavedSearchesService>(
    "/saved_searches/5",
    5,
    new SavedSearch({ id: 5 })
  );
});
