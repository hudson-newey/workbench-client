import { Component } from "@angular/core";
import { MenuService } from "@services/menu/menu.service";

// TODO Rename component
@Component({
  selector: "baw-side-nav",
  template: `
    <div
      class="menu-container bg-light"
      [class.fullscreen]="menu.isFullscreen"
      [class.show]="menu.isMenuOpen"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ["side-nav.component.scss"],
})
export class SideNavComponent {
  public constructor(public menu: MenuService) {}
}