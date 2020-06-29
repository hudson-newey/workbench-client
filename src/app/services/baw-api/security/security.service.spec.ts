import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { fakeAsync, TestBed } from "@angular/core/testing";
import {
  ApiErrorDetails,
  BawApiInterceptor,
} from "@baw-api/api.interceptor.service";
import { MockShowApiService } from "@baw-api/mock/apiMocks.service";
import { ISessionUser, IUser, SessionUser, User } from "@models/User";
import { BehaviorSubject, Subject } from "rxjs";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import {
  apiErrorDetails,
  shouldNotComplete,
  shouldNotFail,
  shouldNotSucceed,
} from "../baw-api.service.spec";
import { UserService } from "../user/user.service";
import { LoginDetails, SecurityService } from "./security.service";

describe("SecurityService", () => {
  let service: SecurityService;
  let userApi: UserService;
  let httpMock: HttpTestingController;
  let defaultLoginDetails: LoginDetails;
  let defaultUser: User;
  let defaultSessionUser: SessionUser;

  function createError(
    func:
      | "apiList"
      | "apiFilter"
      | "apiShow"
      | "apiCreate"
      | "apiUpdate"
      | "apiDestroy",
    url: string,
    error: ApiErrorDetails
  ) {
    service[func] = jasmine.createSpy().and.callFake((path: string) => {
      expect(path).toBe(url);
      const subject = new Subject();
      subject.error(error);
      return subject;
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ...testAppInitializer,
        { provide: UserService, useClass: MockShowApiService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BawApiInterceptor,
          multi: true,
        },
        SecurityService,
      ],
    });

    service = TestBed.inject(SecurityService);
    userApi = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

    defaultUser = new User({
      id: 1,
      userName: "username",
    });
    defaultSessionUser = new SessionUser({
      authToken: "xxxxxxxxxxxxxxx",
      userName: "username",
    });
    defaultLoginDetails = new LoginDetails({
      login: "username",
      password: "password",
    });
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  describe("Authentication Tracking", () => {
    it("isLoggedIn should return false initially", () => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    it("getSessionUser should return null initially", () => {
      expect(service.getLocalUser()).toBeFalsy();
    });

    it("authTrigger should contain default value", () => {
      const spy = jasmine.createSpy();

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("signIn", () => {
    function createResponse(
      path: string,
      details: LoginDetails,
      model: SessionUser,
      user?: User
    ) {
      spyOn(service as any, "apiCreate").and.callFake(
        (_path: string, _details: object) => {
          expect(_path).toBe(path);
          expect(_details).toEqual(details);

          return new BehaviorSubject<SessionUser>(model);
        }
      );
      spyOn(userApi, "show").and.callFake(() => {
        if (user) {
          return new BehaviorSubject<User>(user);
        } else {
          const subject = new Subject<User>();
          subject.error({
            status: 401,
            message: "Unauthorized",
          } as ApiErrorDetails);
          return subject;
        }
      });
    }

    it("should call apiCreate", fakeAsync(() => {
      createResponse(
        "/security/",
        defaultLoginDetails,
        defaultSessionUser,
        defaultUser
      );
      service.signIn(defaultLoginDetails).subscribe();
      expect(service["apiCreate"]).toHaveBeenCalledWith(
        "/security/",
        defaultLoginDetails
      );
    }));

    it("should handle response", fakeAsync(() => {
      createResponse(
        "/security/",
        defaultLoginDetails,
        defaultSessionUser,
        defaultUser
      );
      service.signIn(defaultLoginDetails).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);
    }));

    it("should store user", fakeAsync(() => {
      const userDetails = {
        id: 1,
        userName: "username",
        preferences: {},
        rolesMask: 1,
        imageUrls: [
          { size: "extralarge", url: "path.png", width: 300, height: 300 },
        ],
      } as IUser;
      const authDetails = {
        authToken: "xxxxxxxxxxxxxxxx",
        userName: "username",
      } as ISessionUser;

      const user = new User(userDetails);
      const session = new SessionUser(authDetails);
      createResponse("/security/", defaultLoginDetails, session, user);
      service.signIn(defaultLoginDetails).subscribe(() => {}, shouldNotFail);

      expect(service.getLocalUser()).toEqual(
        new SessionUser({
          id: 1,
          authToken: "xxxxxxxxxxxxxxxx",
          userName: "username",
          preferences: {},
          rolesMask: 1,
          imageUrls: [
            { size: "extralarge", url: "path.png", width: 300, height: 300 },
          ],
        })
      );
    }));

    it("should ignore excess user data", () => {
      const userDetails = {
        id: 1,
        email: "test@example.com",
        userName: "username",
        signInCount: 1,
        failedAttempts: 2,
        preferences: {},
        isConfirmed: true,
        imageUrls: [
          { size: "extralarge", url: "path.png", width: 300, height: 300 },
        ],
        rolesMask: 1,
        rolesMaskNames: ["user"],
        resetPasswordSentAt: "1970-01-01T00:00:00.000+10:00",
        rememberCreatedAt: "1970-01-01T00:00:00.000+10:00",
        currentSignInAt: "1970-01-01T00:00:00.000+10:00",
        lastSignInAt: "1970-01-01T00:00:00.000+10:00",
        confirmedAt: "1970-01-01T00:00:00.000+10:00",
        confirmationSentAt: "1970-01-01T00:00:00.000+10:00",
        lockedAt: "1970-01-01T00:00:00.000+10:00",
        createdAt: "1970-01-01T00:00:00.000+10:00",
        updatedAt: "1970-01-01T00:00:00.000+10:00",
        lastSeenAt: "1970-01-01T00:00:00.000+10:00",
      } as IUser;
      const authDetails = {
        authToken: "xxxxxxxxxxxxxxxx",
        userName: "username",
      } as ISessionUser;

      const user = new User(userDetails);
      const session = new SessionUser(authDetails);
      createResponse("/security/", defaultLoginDetails, session, user);
      service.signIn(defaultLoginDetails).subscribe(() => {}, shouldNotFail);

      expect(service.getLocalUser()).toEqual(
        new SessionUser({
          id: 1,
          userName: "username",
          rolesMask: 1,
          preferences: {},
          authToken: "xxxxxxxxxxxxxxxx",
          imageUrls: [
            { size: "extralarge", url: "path.png", width: 300, height: 300 },
          ],
        })
      );
    });

    it("should trigger authTrigger", fakeAsync(() => {
      const spy = jasmine.createSpy();
      createResponse(
        "/security/",
        defaultLoginDetails,
        defaultSessionUser,
        defaultUser
      );

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);
      service.signIn(defaultLoginDetails).subscribe();

      // Should call auth trigger twice, first time is when the subscription is created
      expect(spy).toHaveBeenCalledTimes(2);
    }));

    it("should handle signIn error", fakeAsync(() => {
      createError("apiCreate", "/security/", apiErrorDetails);
      service
        .signIn(defaultLoginDetails)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorDetails);
        });
    }));

    it("should handle get user error", fakeAsync(() => {
      createResponse(
        "/security/",
        defaultLoginDetails,
        defaultSessionUser,
        undefined
      );

      service
        .signIn(defaultLoginDetails)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorDetails);
        });
    }));

    it("should trigger authTrigger on error", fakeAsync(() => {
      const noop = () => {};
      const spy = jasmine.createSpy();
      createError("apiCreate", "/security/", apiErrorDetails);

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);
      service.signIn(defaultLoginDetails).subscribe(noop, noop);

      // Should call auth trigger twice, first time is when the subscription is created
      expect(spy).toHaveBeenCalledTimes(2);
    }));
  });

  describe("signOut", () => {
    function createSuccess(path: string) {
      spyOn(service as any, "apiDestroy").and.callFake((_path: string) => {
        expect(_path).toBe(path);

        return new BehaviorSubject<void>(null);
      });
    }

    it("should call apiDestroy", fakeAsync(() => {
      createSuccess("/security/");
      service.signOut().subscribe();
      expect(service["apiDestroy"]).toHaveBeenCalledWith("/security/");
    }));

    it("should handle response", fakeAsync(() => {
      createSuccess("/security/");
      service
        .signOut()
        .subscribe(() => expect(true).toBeTruthy(), shouldNotFail);
    }));

    it("should clear session user", fakeAsync(() => {
      createSuccess("/security/");
      service.signOut().subscribe(() => {}, shouldNotFail);

      expect(service.getLocalUser()).toBeFalsy();
    }));

    it("should trigger authTrigger", fakeAsync(() => {
      const spy = jasmine.createSpy();
      createSuccess("/security/");

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);
      service.signOut().subscribe();

      // Should call auth trigger twice, first time is when the subscription is created
      expect(spy).toHaveBeenCalledTimes(2);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiDestroy", "/security/", apiErrorDetails);
      service.signOut().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorDetails);
      });
    }));

    it("should trigger authTrigger on error", fakeAsync(() => {
      const noop = () => {};
      const spy = jasmine.createSpy();
      createError("apiDestroy", "/security/", apiErrorDetails);

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);
      service.signOut().subscribe(noop, noop);

      // Should call auth trigger twice, first time is when the subscription is created
      expect(spy).toHaveBeenCalledTimes(2);
    }));
  });
});