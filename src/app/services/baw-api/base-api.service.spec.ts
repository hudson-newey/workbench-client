import { TestBed } from "@angular/core/testing";

import { BawApiService } from "./base-api.service";

describe("BawApiService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: BawApiService = TestBed.get(BawApiService);
    expect(service).toBeTruthy();
  });
});