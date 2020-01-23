import {
  defaultDeleteIcon,
  defaultEditIcon,
  defaultNewIcon,
  defaultPermissionsIcon,
  isLoggedInPredicate,
  isOwnerPredicate
} from "src/app/app.menus";
import {
  Category,
  MenuLink,
  MenuRoute
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

export const projectsRoute = StrongRoute.Base.add("projects");

export const projectsCategory: Category = {
  icon: ["fas", "globe-asia"],
  label: "Projects",
  route: projectsRoute
};

export const projectsMenuItem = MenuRoute({
  icon: ["fas", "globe-asia"],
  label: "Projects",
  route: projectsRoute,
  tooltip: () => "View projects I have access too",
  order: { priority: 4, indentation: 0 }
});

export const newProjectMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: "New project",
  route: projectsRoute.add("new"),
  tooltip: () => "Create a new project",
  predicate: isLoggedInPredicate,
  order: {
    priority: projectsMenuItem.order.priority,
    indentation: projectsMenuItem.order.indentation + 1
  }
});

export const requestProjectMenuItem = MenuRoute({
  icon: defaultPermissionsIcon,
  label: "Request access",
  route: projectsRoute.add("request"),
  tooltip: () => "Request access to a project not listed here",
  predicate: isLoggedInPredicate,
  order: {
    priority: projectsMenuItem.order.priority,
    indentation: projectsMenuItem.order.indentation + 1
  }
});

export const projectMenuItem = MenuRoute({
  icon: ["fas", "folder-open"],
  label: "Project",
  route: projectsRoute.add(":projectId"),
  tooltip: () => "The current project",
  order: {
    priority: projectsMenuItem.order.priority,
    indentation: projectsMenuItem.order.indentation + 1
  }
});

export const projectCategory: Category = {
  icon: projectsCategory.icon,
  label: "Project",
  route: projectMenuItem.route
};

export const editProjectMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: "Edit this project",
  route: projectMenuItem.route.add("edit"),
  parent: projectMenuItem,
  tooltip: () => "Change the details for this project",
  predicate: isOwnerPredicate,
  order: {
    priority: projectMenuItem.order.priority,
    indentation: projectMenuItem.order.indentation + 1
  }
});

export const exploreAudioProjectMenuItem = MenuLink({
  uri: "REPLACE_ME",
  icon: ["fas", "map"],
  label: "Explore audio",
  tooltip: () => "Explore audio"
});

export const editProjectPermissionsMenuItem = MenuLink({
  uri: "REPLACE_ME",
  icon: defaultPermissionsIcon,
  label: "Edit permissions",
  tooltip: () => "Edit this projects permissions",
  predicate: isOwnerPredicate
});

export const deleteProjectMenuItem = MenuRoute({
  icon: defaultDeleteIcon,
  label: "Delete Project",
  route: projectMenuItem.route.add("delete"),
  parent: projectMenuItem,
  tooltip: () => "Delete this project",
  predicate: isOwnerPredicate,
  order: {
    priority: projectMenuItem.order.priority,
    indentation: projectMenuItem.order.indentation + 1
  }
});
