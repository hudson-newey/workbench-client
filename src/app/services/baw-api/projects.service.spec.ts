import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Project } from "src/app/models/Project";
import { environment } from "src/environments/environment";
import { BawApiInterceptor } from "./api.interceptor";
import { mockSessionStorage } from "./mock/sessionStorageMock";
import { ProjectsService } from "./projects.service";
import { SecurityService } from "./security.service";

describe("ProjectsService", () => {
  let service: ProjectsService;
  let securityService: SecurityService;
  let httpMock: HttpTestingController;
  const url = environment.bawApiUrl;

  const pageNotFoundResponse = {
    meta: {
      status: 404,
      message: "Not Found",
      error: {
        details: "Could not find the requested page.",
        info: {
          original_route: "dsfaggsdfg",
          original_http_method: "GET"
        }
      }
    },
    data: null
  };

  const itemNotFoundResponse = {
    meta: {
      status: 404,
      message: "Not Found",
      error: {
        details: "Could not find the requested item.",
        info: null
      }
    },
    data: null
  };

  const projectValidResponse = {
    meta: {
      status: 200,
      message: "OK",
      sorting: {
        order_by: "creator_id",
        direction: "asc"
      },
      paging: {
        page: 1,
        items: 25,
        total: 1,
        max_page: 1,
        current:
          "<BROKEN LINK>/projects?direction=asc&items=3&order_by=name&page=1",
        previous: null,
        next: null
      }
    },
    data: {
      id: 512,
      name: "512 Name",
      description: "512 Description.",
      creator_id: 138,
      site_ids: new Set([513, 514, 519]),
      description_html: "<p>512 Description.</p>\n"
    }
  };

  const projectValidConvertedResponse = new Project({
    id: 512,
    name: "512 Name",
    description: "512 Description.",
    creatorId: 138,
    siteIds: new Set([513, 514, 519])
  });

  const projectUnauthorizedResponse = {
    meta: {
      status: 401,
      message: "Unauthorized",
      error: {
        details: "You need to log in or register before continuing.",
        links: {
          "Log in": "/my_account/sign_in",
          Register: "/my_account/sign_up",
          "Confirm account": "/my_account/confirmation/new"
        },
        info: null
      }
    },
    data: null
  };

  const projectsValidResponse = {
    meta: {
      status: 200,
      message: "OK",
      sorting: {
        order_by: "creator_id",
        direction: "asc"
      },
      paging: {
        page: 1,
        items: 25,
        total: 1,
        max_page: 1,
        current:
          "<BROKEN LINK>/projects?direction=asc&items=3&order_by=name&page=1",
        previous: null,
        next: null
      }
    },
    data: [
      {
        id: 512,
        name: "512 Name",
        description: "512 Description.",
        creator_id: 138,
        site_ids: new Set([513, 514, 519]),
        description_html: "<p>512 Description.</p>\n"
      },
      {
        id: 513,
        name: "513 Name",
        description: "513 Description.",
        creator_id: 138,
        site_ids: new Set([513, 514, 519]),
        description_html: "<p>513 Description.</p>\n"
      }
    ]
  };

  const projectsValidConvertedResponse = [
    new Project({
      id: 512,
      name: "512 Name",
      description: "512 Description.",
      creatorId: 138,
      siteIds: new Set([513, 514, 519])
    }),
    new Project({
      id: 513,
      name: "513 Name",
      description: "513 Description.",
      creatorId: 138,
      siteIds: new Set([513, 514, 519])
    })
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProjectsService,
        SecurityService,
        { provide: HTTP_INTERCEPTORS, useClass: BawApiInterceptor, multi: true }
      ]
    });

    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage
    });

    service = TestBed.get(ProjectsService);
    securityService = TestBed.get(SecurityService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    sessionStorage.clear();
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getProjects should return data", () => {
    service.getProjects().subscribe(res => {
      expect(res).toEqual(projectsValidConvertedResponse);
    });

    const req = httpMock.expectOne(url + "/projects");
    req.flush(projectsValidResponse);
  });

  it("getProject should return data", () => {
    service.getProject(512).subscribe(res => {
      expect(res).toEqual(projectValidConvertedResponse);
    });

    const req = httpMock.expectOne(url + "/projects/512");
    req.flush(projectValidResponse);
  });

  it("getProject invalid project should return error", done => {
    service.getProject(-1).subscribe(
      () => {
        expect(false).toBeTruthy(
          "getProject should not return result on error"
        );
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(url + "/projects/-1");
    req.flush(itemNotFoundResponse);
  });

  it("getProject invalid page should return error", done => {
    service.getProject(-1).subscribe(
      () => {
        expect(false).toBeTruthy(
          "getProject should not return result on error"
        );
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(url + "/projects/-1");
    req.flush(pageNotFoundResponse);
  });

  it("getProject unauthorized should return error", done => {
    service.getProject(-1).subscribe(
      () => {
        expect(false).toBeTruthy(
          "getProject should not return result on error"
        );
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(url + "/projects/-1");
    req.flush(projectUnauthorizedResponse);
  });

  it("getFilteredProjects should get filtered number of items", done => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "name",
          direction: "asc"
        },
        paging: {
          page: 1,
          items: 3,
          total: 1,
          max_page: 1,
          current:
            "<BROKEN LINK>/projects?direction=asc&items=3&order_by=name&page=1",
          previous: null,
          next: null
        }
      },
      data: [
        {
          id: 512,
          name: "512 Name",
          description: "512 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>512 Description.</p>\n"
        },
        {
          id: 513,
          name: "513 Name",
          description: "513 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>513 Description.</p>\n"
        },
        {
          id: 514,
          name: "514 Name",
          description: "514 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>514 Description.</p>\n"
        }
      ]
    };

    const dummyApiConvertedResponse = [
      new Project({
        id: 512,
        name: "512 Name",
        description: "512 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 513,
        name: "513 Name",
        description: "513 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 514,
        name: "514 Name",
        description: "514 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      })
    ];

    service
      .getFilteredProjects({
        items: 3
      })
      .subscribe(
        res => {
          expect(res).toEqual(dummyApiConvertedResponse);
          done();
        },
        () => {
          expect(false).toBeTruthy("No error should be reported");
          done();
        },
        () => {
          done();
        }
      );

    const req = httpMock.expectOne(url + "/projects/filter?items=3");
    req.flush(dummyApiResponse);
  });

  it("getFilteredProjects should get ordered by creator id", done => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "creator_id",
          direction: "asc"
        },
        paging: {
          page: 1,
          items: 25,
          total: 1,
          max_page: 1,
          current:
            "<BROKEN LINK>/projects?direction=asc&items=3&order_by=name&page=1",
          previous: null,
          next: null
        }
      },
      data: [
        {
          id: 512,
          name: "512 Name",
          description: "512 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>512 Description.</p>\n"
        },
        {
          id: 513,
          name: "513 Name",
          description: "513 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>513 Description.</p>\n"
        },
        {
          id: 514,
          name: "514 Name",
          description: "514 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>514 Description.</p>\n"
        }
      ]
    };

    const dummyApiConvertedResponse = [
      new Project({
        id: 512,
        name: "512 Name",
        description: "512 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 513,
        name: "513 Name",
        description: "513 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 514,
        name: "514 Name",
        description: "514 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      })
    ];

    service
      .getFilteredProjects({
        orderBy: "creatorId"
      })
      .subscribe(
        res => {
          expect(res).toEqual(dummyApiConvertedResponse);
          done();
        },
        () => {
          expect(false).toBeTruthy("No error should be reported");
          done();
        },
        () => {
          done();
        }
      );

    const req = httpMock.expectOne(
      url + "/projects/filter?order_by=creator_id"
    );
    req.flush(dummyApiResponse);
  });

  it("getFilteredProjects should get multi filter", done => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "creator_id",
          direction: "desc"
        },
        paging: {
          page: 2,
          items: 5,
          total: 1,
          max_page: 2,
          current:
            "<BROKEN LINK>/projects?direction=asc&items=3&order_by=name&page=1",
          previous: null,
          next: null
        }
      },
      data: [
        {
          id: 512,
          name: "512 Name",
          description: "512 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>512 Description.</p>\n"
        },
        {
          id: 513,
          name: "513 Name",
          description: "513 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>513 Description.</p>\n"
        },
        {
          id: 514,
          name: "514 Name",
          description: "514 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>514 Description.</p>\n"
        }
      ]
    };

    const dummyApiConvertedResponse = [
      new Project({
        id: 512,
        name: "512 Name",
        description: "512 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 513,
        name: "513 Name",
        description: "513 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 514,
        name: "514 Name",
        description: "514 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      })
    ];

    service
      .getFilteredProjects({
        direction: "desc",
        items: 3,
        orderBy: "creatorId",
        page: 2
      })
      .subscribe(
        res => {
          expect(res).toEqual(dummyApiConvertedResponse);
          done();
        },
        () => {
          expect(false).toBeTruthy("No error should be reported");
          done();
        },
        () => {
          done();
        }
      );

    const req = httpMock.expectOne(
      url + "/projects/filter?direction=desc&items=3&order_by=creator_id&page=2"
    );
    req.flush(dummyApiResponse);
  });

  it("getProject empty response should return error msg", done => {
    service.getProject(512).subscribe(
      () => {
        expect(false).toBeTruthy("Error response should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(url + "/projects/512");
    req.flush({ meta: { status: 404 } });
  });

  it("getProjects empty response should return error msg", done => {
    service.getProjects().subscribe(
      () => {
        expect(false).toBeTruthy("Error response should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(url + "/projects");
    req.flush({ meta: { status: 404 } });
  });

  it("getFilteredProjects empty response should return error msg", done => {
    service
      .getFilteredProjects({
        items: 3
      })
      .subscribe(
        () => {
          expect(false).toBeTruthy("Error response should not return result");
          done();
        },
        err => {
          expect(err).toBeTruthy();
          expect(typeof err).toBe("string");
          done();
        },
        () => {
          done();
        }
      );

    const req = httpMock.expectOne(url + "/projects/filter?items=3");
    req.flush({ meta: { status: 404 } });
  });

  it("authenticated getProjects should return data", () => {
    service.getProjects().subscribe(res => {
      expect(res).toEqual(projectsValidConvertedResponse);
    });

    // Login
    securityService
      .signIn({ email: "email", password: "password" })
      .subscribe(() => {});

    // Catch security check and return login details
    const login = httpMock.expectOne(url + "/security");
    login.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "aaaaaaaaaaaaaaaaaaaaaa",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    const projects = httpMock.expectOne({
      url: url + "/projects",
      method: "GET"
    });
    projects.flush(projectsValidResponse);
  });

  it("authenticated getProject should return data", done => {
    service.getProject(512).subscribe(
      res => {
        expect(res).toEqual(projectValidConvertedResponse);
        done();
      },
      () => {
        expect(false).toBeTruthy("Should be no error response");
        done();
      },
      () => {
        done();
      }
    );

    // Login
    securityService
      .signIn({ email: "email", password: "password" })
      .subscribe(() => {});

    // Catch security check and return login details
    const login = httpMock.expectOne(url + "/security");
    login.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "aaaaaaaaaaaaaaaaaaaaaa",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    const project = httpMock.expectOne({
      url: url + "/projects/512",
      method: "GET"
    });
    project.flush(projectValidResponse);
  });
});
