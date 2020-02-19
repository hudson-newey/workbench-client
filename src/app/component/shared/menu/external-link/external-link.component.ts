import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { MenuLink } from "src/app/interfaces/menusInterfaces";
import { AppConfigService } from "src/app/services/app-config/app-config.service";

@Component({
  selector: "app-menu-external-link",
  template: `
    <a
      class="nav-link"
      href="{{ uri }}"
      placement="{{ placement }}"
      ngbTooltip="{{ tooltip }}"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
      <span class="d-none" [id]="id">
        {{ tooltip }}
      </span>
    </a>
  `,
  styleUrls: ["./external-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuExternalLinkComponent implements OnInit {
  @Input() id: string;
  @Input() link: MenuLink;
  @Input() placement: "left" | "right";
  @Input() tooltip: string;
  @Input() uri: string;

  constructor(private config: AppConfigService) {}

  ngOnInit() {
    if (this.uri.charAt(0) === "/") {
      this.uri = this.config.getConfig().environment.apiRoot + this.uri;
    }
  }
}
