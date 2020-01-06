import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { EthicsComponent } from "./ethics.component";

describe("AboutEthicsComponent", () => {
  let httpMock: HttpTestingController;
  let config: AppConfigService;
  let component: EthicsComponent;
  let fixture: ComponentFixture<EthicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
      declarations: [EthicsComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthicsComponent);
    httpMock = TestBed.get(HttpTestingController);
    config = TestBed.get(AppConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create", () => {
    httpMock.expectOne(config.getConfig().environment.cmsRoot + "/ethics.html");
    expect(component).toBeTruthy();
  });
});