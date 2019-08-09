import { Type } from "@angular/core";
import { Route, Router, Routes } from "@angular/router";
import { ActionMenuComponent } from "../component/shared/action-menu/action-menu.component";
import { SecondaryMenuComponent } from "../component/shared/secondary-menu/secondary-menu.component";
import { isPageInfo, PageComponentStatic, PageInfo } from "./page.decorator";

/**
 * Get the page info interface of an angular component
 * @param component Angular component
 */
export function GetPageInfo(component: Type<any>) {
  const pageComponent = component as PageComponentStatic;
  return pageComponent ? pageComponent.pageInfo : null;
}

/**
 * Get pageInfo from each component
 * @param components List of angular component
 * @returns Iterator containing a list of routes
 */
function* GetRoutes(components: Type<any>[]): IterableIterator<Route> {
  for (const component of components) {
    const page = GetPageInfo(component);
    if (page) {
      yield* GetRoutesForPage(page);
    }
  }
}

/**
 * Iterate through all components and generate a list of routes
 * @param components List of angular components
 * @returns List of routes
 */
export function GetRoutesForPages(components: Type<any>[]): Route[] {
  return Array.from(GetRoutes(components));
}

/**
 * Dynamically create routes for an angular component
 * @param page Angular component page info
 * @returns List of routes
 */
export function GetRoutesForPage(page: PageInfo): Routes {
  const route: Route = {
    path: page.routeFragment,
    // data is inherited in child routes
    data: page,
    children: [
      {
        path: "",
        component: page.component
      },
      {
        path: "",
        outlet: "secondary",
        component: SecondaryMenuComponent
      },
      {
        path: "",
        outlet: "action",
        component: ActionMenuComponent
      }
    ]
  };

  return [route];
}

/**
 * Recursively search the entire router tree to find all
 * page info components and update their routes.
 * @param router Router Service
 */
export function UpdateUriForPages(router: Router) {
  const searchRoutes = (routes: Routes, path: string) => {
    routes.forEach((route: Route) => {
      const subPath = path + "/" + route.path;

      // If route contains pageData
      if (route.data && isPageInfo(route.data)) {
        route.data.route = subPath;
      }

      // If route contains children
      if (route.children) {
        searchRoutes(route.children, subPath);
      }
    });

    return path;
  };

  searchRoutes(router.config, "");
}