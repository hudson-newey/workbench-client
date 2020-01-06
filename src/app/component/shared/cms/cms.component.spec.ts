import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { testBawServices } from "src/app/app.helper";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { BawApiService } from "src/app/services/baw-api/base-api.service";
import { SharedModule } from "../shared.module";
import { CmsComponent } from "./cms.component";

describe("CmsComponent", () => {
  let api: BawApiService;
  let httpMock: HttpTestingController;
  let config: AppConfigService;
  let component: CmsComponent;
  let fixture: ComponentFixture<CmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
      declarations: [CmsComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsComponent);
    httpMock = TestBed.get(HttpTestingController);
    config = TestBed.get(AppConfigService);
    api = TestBed.get(BawApiService);
    component = fixture.componentInstance;
  });

  afterEach(() => httpMock.verify());

  it("should request page from api", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );

    expect(req).toBeTruthy();
    expect(req.request.method).toBe("GET");
  });

  it("should change request based on page", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "new.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/new.html"
    );

    expect(req).toBeTruthy();
    expect(req.request.method).toBe("GET");
  });

  it("should initially display loading animation", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );

    const spinner = fixture.debugElement.nativeElement.querySelector(
      "mat-spinner"
    );
    expect(spinner).toBeTruthy();
  });

  it("should hide loading animation after success response", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );
    req.flush("<h1>Response</h1><p>Example HTML response from API</p>");

    fixture.detectChanges();

    const spinner = fixture.debugElement.nativeElement.querySelector(
      "mat-spinner"
    );
    expect(spinner).toBeFalsy();
  });

  it("should hide loading animation after error response", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );
    req.flush("", { status: 404, statusText: "Not Found" });

    fixture.detectChanges();

    const spinner = fixture.debugElement.nativeElement.querySelector(
      "mat-spinner"
    );
    expect(spinner).toBeFalsy();
  });

  it("should request page from api with 'responseType' of type text", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );

    expect(req.request.responseType).toBeTruthy();
    expect(req.request.responseType).toBe("text");
  });

  it("should request page from api without 'accept' header", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );
    expect(req.request.headers.has("Accept")).toBeFalsy();
  });

  it("should request page from api without 'content-type' header", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );
    expect(req.request.headers.has("Content-Type")).toBeFalsy();
  });

  it("should request page from api without 'Authorization' header when not logged in", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );
    expect(req.request.headers.has("Authorization")).toBeFalsy();
  });

  it("should request page from api with 'Authorization' header when logged in", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => true);
    spyOn(api, "getSessionUser").and.callFake(
      () =>
        new SessionUser({ authToken: "xxxxxxxxxxxxxxx", userName: "username" })
    );

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );
    expect(req.request.headers.has("Authorization")).toBeTruthy();
    expect(req.request.headers.get("Authorization")).toBe(
      'Token token="xxxxxxxxxxxxxxx"'
    );
  });

  it("should display html on success", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );
    req.flush("<h1>Response</h1><p>Example HTML response from API</p>");

    fixture.detectChanges();

    const header = fixture.debugElement.nativeElement.querySelector("h1");
    expect(header).toBeTruthy();
    expect(header.innerText).toBe("Response");

    const body = fixture.debugElement.nativeElement.querySelector("p");
    expect(body).toBeTruthy();
    expect(body.innerText).toBe("Example HTML response from API");
  });

  it("should display 'not found' on page not found", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );
    req.flush("", { status: 404, statusText: "Not Found" });

    const header = fixture.debugElement.nativeElement.querySelector("h1");
    expect(header).toBeTruthy();
    expect(header.innerText).toBe("Not found");
  });

  it("should display 'unauthorized' on unauthorized", () => {
    spyOn(api, "isLoggedIn").and.callFake(() => false);

    component.page = "testing.html";
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/testing.html"
    );
    req.flush("", { status: 401, statusText: "Unauthorized" });

    const header = fixture.debugElement.nativeElement.querySelector("h1");
    expect(header).toBeTruthy();
    expect(header.innerText).toBe("Unauthorized access");
  });
});