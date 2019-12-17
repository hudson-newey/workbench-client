import { List } from "immutable";
import { dataRequestMenuItem } from "src/app/component/data-request/data-request.menus";
import { homeCategory, homeMenuItem } from "src/app/component/home/home.menus";
import { myAccountMenuItem } from "src/app/component/profile/profile.menus";
import { projectsMenuItem } from "src/app/component/projects/projects.menus";
import { reportProblemMenuItem } from "src/app/component/report-problem/report-problem.menus";
import {
  loginMenuItem,
  registerMenuItem
} from "src/app/component/security/security.menus";
import { statisticsMenuItem } from "src/app/component/statistics/statistics.menus";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";

export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    homeMenuItem,
    loginMenuItem,
    registerMenuItem,
    myAccountMenuItem,
    {
      kind: "MenuLink",
      icon: ["fas", "border-all"],
      label: "My Annotations",
      tooltip: () => "View my recent annotations",
      predicate: user => !!user,
      order: { priority: 3, indentation: 0 },
      uri: "REPLACE_ME"
    },
    projectsMenuItem,
    {
      kind: "MenuLink",
      icon: ["fas", "server"],
      label: "Audio Analysis",
      tooltip: () => "View audio analysis jobs",
      order: { priority: 5, indentation: 0 },
      uri: "/audio_analysis"
    },
    {
      kind: "MenuLink",
      icon: ["fas", "book"],
      label: "Library",
      tooltip: () => "Annotation library",
      order: { priority: 6, indentation: 0 },
      uri: "/library"
    },
    dataRequestMenuItem,
    {
      kind: "MenuLink",
      icon: ["fas", "envelope"],
      label: "Send Audio",
      tooltip: () => "Send us audio recordings to upload",
      order: { priority: 8, indentation: 0 },
      uri: "/data_upload"
    },
    reportProblemMenuItem,
    statisticsMenuItem
  ]),
  defaultCategory: homeCategory
};
