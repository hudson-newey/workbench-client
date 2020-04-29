import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DatasetItem } from "@models/DatasetItem";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import { BawApiService } from "../baw-api.service";
import { DatasetItemsService } from "../dataset-items.service";
import { MockBawApiService } from "../mock/baseApiMock.service";

describe("DatasetItemsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        DatasetItemsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(DatasetItemsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<DatasetItem, DatasetItemsService>(
    "/datasets/5/items/",
    undefined,
    5
  );
  validateApiFilter<DatasetItem, DatasetItemsService>(
    "/datasets/5/items/filter",
    undefined,
    undefined,
    5
  );
  validateApiShow<DatasetItem, DatasetItemsService>(
    "/datasets/5/items/10",
    10,
    new DatasetItem({ id: 10 }),
    5
  );
  validateApiCreate<DatasetItem, DatasetItemsService>(
    "/datasets/5/items/",
    new DatasetItem({ id: 10 }),
    5
  );
  validateApiDestroy<DatasetItem, DatasetItemsService>(
    "/datasets/5/items/10",
    10,
    new DatasetItem({ id: 10 }),
    5
  );
});
