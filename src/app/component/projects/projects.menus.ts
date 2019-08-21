import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
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

export const projectMenuItem = MenuRoute({
  icon: ["fas", "folder-open"],
  label: "Project",
  route: projectsRoute.add(":projectId"),
  tooltip: () => "The current project",
  order: { priority: 4, indentation: 1 }
});
