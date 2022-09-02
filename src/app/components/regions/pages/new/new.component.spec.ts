import { fakeAsync, tick } from "@angular/core/testing";
import { Router, RouterOutlet } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import { RegionsService } from "@baw-api/region/regions.service";
import {
  regionsRoute,
  shallowRegionsRoute,
} from "@components/regions/regions.routes";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import {
  createRoutingFactory,
  createSpyObject,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { testFormlyFields } from "@test/helpers/formly";
import { assertErrorHandler } from "@test/helpers/html";
import {
  addStandardFormImportsToMockBuilder,
  testFormImports,
} from "@test/helpers/testbed";
import { MockBuilder, MockRender, ngMocks } from "ng-mocks";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, of, Subject } from "rxjs";
import { Location } from "@angular/common";
import schema from "../../region.base.json";
import { NewComponent } from "./new.component";

describe("RegionsNewComponent", () => {
  let spectator: SpectatorRouting<NewComponent>;
  const { fields } = schema;
  const createComponent = createRoutingFactory({
    component: NewComponent,
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
    stubsEnabled: true,
  });

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Site Name Input",
        field: fields[1],
        key: "name",
        type: "input",
        required: true,
        label: "Site Name",
        inputType: "text",
      },
      {
        testGroup: "Site Description Input",
        field: fields[2],
        key: "description",
        type: "textarea",
        label: "Description",
      },
    ]);
  });

  describe("component", () => {
    let api: SpyObject<RegionsService>;
    let defaultProject: Project;

    function setup(error?: BawApiError) {
      spectator = createComponent({
        detectChanges: false,
        params: { projectId: defaultProject?.id },
        data: {
          resolvers: { project: projectResolvers.show },
          project: { model: defaultProject, error },
        },
      });

      api = spectator.inject(RegionsService);
      spectator.detectChanges();
    }

    beforeEach(() => {
      defaultProject = new Project(generateProject());
    });

    it("should create", () => {
      setup();
      expect(spectator.component).toBeTruthy();
    });

    it("should handle project error", () => {
      setup(generateBawApiError());
      assertErrorHandler(spectator.fixture);
    });

    it("should call api", () => {
      setup();
      api.create.and.callFake(() => new Subject());
      spectator.component.submit({});
      expect(api.create).toHaveBeenCalledWith(
        jasmine.any(Object),
        defaultProject
      );
    });

    it("should redirect to region", () => {
      setup();
      const region = new Region(generateRegion());
      api.create.and.callFake(() => new BehaviorSubject<Region>(region));

      spectator.component.submit({});
      expect(spectator.router.navigateByUrl).toHaveBeenCalledWith(
        region.getViewUrl(defaultProject)
      );
    });
  });
});

describe("routing and resolvers", () => {
  const nestedRoutes = regionsRoute.compileRoutes(getRouteConfigForPage);
  const shallowRoutes = shallowRegionsRoute.compileRoutes(
    getRouteConfigForPage
  );

  let project: Project;
  let defaultProject: Project;

  beforeEach(() => {
    // create 2 stub projects so we can clearly assert different ones are loaded
    // on different routes
    project = new Project(generateProject());
    defaultProject = new Project(generateProject());

    // stub both api methods that the two resolvers use
    const api = createSpyObject(ProjectsService);
    api.show.and.callFake(() => of(project));
    api.filter.and.callFake(() => of([defaultProject]));

    // set up ngMocks according to https://ng-mocks.sudo.eu/guides/routing-resolver
    const builder = MockBuilder([
      NewComponent,
      RouterTestingModule.withRoutes([...nestedRoutes, ...shallowRoutes]),
    ])
      .keep(MockBawApiModule, { export: true })
      .provide({ provide: ProjectsService, useValue: api });

    // augment builder with out app level module imports
    return addStandardFormImportsToMockBuilder(builder);
  });

  function setup(path) {
    // boiler plate adapted from https://ng-mocks.sudo.eu/guides/route
    const fixture = MockRender(RouterOutlet);
    const router = fixture.point.injector.get(Router);
    const location = fixture.point.injector.get(Location);

    location.go(path);

    router.initialNavigation();
    tick();

    expect(location.path()).toBe(path);

    const component = ngMocks.find(fixture, NewComponent);
    fixture.detectChanges();

    return component;
  }

  it("should resolve with project id in the the route", fakeAsync(() => {
    const path = `/projects/${project.id}/regions/new`;
    const component = setup(path);

    expect(component.componentInstance.project).toBe(project);
  }));

  it("should resolve the default project for the shallow route", fakeAsync(() => {
    const path = "/regions/new";
    const component = setup(path);

    expect(component.componentInstance.project).toBe(defaultProject);
  }));
});
