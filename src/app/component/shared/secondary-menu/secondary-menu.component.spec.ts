import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { BehaviorSubject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { DefaultMenu } from "src/app/helpers/page/defaultMenus";
import { PageInfo, PageInfoInterface } from "src/app/helpers/page/pageInfo";
import {
  AnyMenuItem,
  MenuLink,
  MenuRoute,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { SharedModule } from "../shared.module";
import { SecondaryMenuComponent } from "./secondary-menu.component";

describe("SecondaryMenuComponent", () => {
  let component: SecondaryMenuComponent;
  let fixture: ComponentFixture<SecondaryMenuComponent>;
  const defaultLinks = DefaultMenu.contextLinks;

  it("should display menu title", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("h6");
    const icon = title.querySelector("fa-icon");
    expect(title).toBeTruthy();
    expect(icon).toBeFalsy();
    expect(title.innerText.trim()).toBe("MENU");
  });

  it("should handle default links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 2 - 2);
  });

  it("should create self link", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "ZZZCustom Label", // Force to be last link
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 2 - 2);

    const item = menuElements[defaultLinks.count() + 2 - 2 - 1].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    const icon = item.querySelector("fa-icon");
    const label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,question-circle"
    );
  });

  it("should handle single internal link", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              {
                kind: "MenuRoute",
                label: "ZZZCustom Label", // Force to be last link
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip",
                route: this.route
              } as MenuRoute
            ])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added link,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 3 - 2);

    const item = menuElements[defaultLinks.count() + 3 - 2 - 1].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    const icon = item.querySelector("fa-icon");
    const label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );
  });

  it("should handle multiple internal links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              {
                kind: "MenuRoute",
                label: "ZZZCustom Label 1", // Force to be last link
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip 1",
                route: this.route
              } as MenuRoute,
              {
                kind: "MenuRoute",
                label: "ZZZCustom Label 2", // Force to be last link
                icon: ["fas", "tags"],
                tooltip: () => "Custom Tooltip 2",
                route: this.route
              } as MenuRoute
            ])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added links,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 4 - 2);

    let item = menuElements[defaultLinks.count() + 4 - 2 - 2].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 1");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[defaultLinks.count() + 4 - 2 - 1].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 2");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tags"
    );
  });

  it("should handle single external link", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              {
                kind: "MenuLink",
                label: "ZZZCustom Label", // Force to be last link
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip",
                uri: "http://brokenlink/"
              } as MenuLink
            ])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added link,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 3 - 2);

    const item = menuElements[defaultLinks.count() + 3 - 2 - 1].querySelector(
      "app-menu-external-link a"
    );
    expect(item).toBeTruthy();

    const icon = item.querySelector("fa-icon");
    const label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );
  });

  it("should handle multiple external links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              {
                kind: "MenuLink",
                label: "ZZZCustom Label 1", // Force to be last link
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip 1",
                uri: "http://brokenlink/1"
              } as MenuLink,
              {
                kind: "MenuLink",
                label: "ZZZCustom Label 2", // Force to be last link
                icon: ["fas", "tags"],
                tooltip: () => "Custom Tooltip 2",
                uri: "http://brokenlink/2"
              } as MenuLink
            ])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added links,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 4 - 2);

    let item = menuElements[defaultLinks.count() + 4 - 2 - 2].querySelector(
      "app-menu-external-link a"
    );
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 1");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[defaultLinks.count() + 4 - 2 - 1].querySelector(
      "app-menu-external-link a"
    );
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 2");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tags"
    );
  });

  it("should handle mixed links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              {
                kind: "MenuRoute",
                label: "ZZZCustom Label 1", // Force to be last link
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip 1",
                route: this.route
              } as MenuRoute,
              {
                kind: "MenuLink",
                label: "ZZZCustom Label 2", // Force to be last link
                icon: ["fas", "tags"],
                tooltip: () => "Custom Tooltip 2",
                uri: "http://brokenlink/2"
              } as MenuLink
            ])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added links,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 4 - 2);

    let item = menuElements[defaultLinks.count() + 4 - 2 - 2].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 1");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[defaultLinks.count() + 4 - 2 - 1].querySelector(
      "app-menu-external-link a"
    );
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 2");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tags"
    );
  });
});
