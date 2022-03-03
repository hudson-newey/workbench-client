import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { MenuType } from "@helpers/generalTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  AnyMenuItem,
  isButton,
  isExternalLink,
  isInternalRoute,
  LabelAndIcon,
} from "@interfaces/menusInterfaces";
import { User } from "@models/User";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MenuService } from "@services/menu/menu.service";
import { Set } from "immutable";
import { ModalComponent } from "../widget/widget.component";
import { WidgetDirective } from "../widget/widget.directive";
import {
  isMenuModal,
  menuModal,
  MenuModal,
  MenuModalWithoutAction,
  WidgetMenuItem,
} from "../widget/widgetItem";

/**
 * Menu Component.
 * Used to display menu links, routes, and actions.
 */
@Component({
  selector: "baw-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnChanges, AfterViewInit {
  @Input() public isSideNav: boolean;
  @Input() public title?: LabelAndIcon;
  @Input() public links!: Set<AnyMenuItem | MenuModalWithoutAction>;
  @Input() public menuType!: MenuType;
  @Input() public widgets?: Set<WidgetMenuItem>;
  @ViewChild(WidgetDirective, { read: ViewContainerRef })
  private menuWidget!: ViewContainerRef;

  public formattedLinks: Set<AnyMenuItem | MenuModal> = Set();
  public user: User;

  public isInternalLink = isInternalRoute;
  public isExternalLink = isExternalLink;
  public isAction = isButton;
  public isModal = isMenuModal;

  public constructor(
    public menuService: MenuService,
    private session: BawSessionService,
    private modalService: NgbModal
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.links ??= Set();
    this.widgets ??= Set();

    // Get user details
    this.user = this.session.loggedInUser;
    // Filter links
    this.formattedLinks = this.setModalActions();

    if (changes.widgets?.previousValue !== changes.widgets?.currentValue) {
      this.clearWidgets();
      this.insertWidgets();
    }
  }

  public ngAfterViewInit(): void {
    this.insertWidgets();
  }

  /** Determine whether to show widgets */
  public hasWidgets(): boolean {
    return isInstantiated(this.widgets) && this.widgets.count() > 0;
  }

  /** Determine whether to show links */
  public hasLinks(): boolean {
    return this.formattedLinks.size > 0;
  }

  /** Is the a secondary menu */
  public isSecondaryMenu(): boolean {
    return this.menuType === "secondary";
  }

  /**
   * Calculate the indentation of a secondary link item
   *
   * @param link Link to calculate padding for
   */
  public calculateIndentation(link: AnyMenuItem | MenuModal): number {
    // Only the secondary menu implements this option
    return this.isSecondaryMenu() && link.indentation ? link.indentation : 0;
  }

  /** Update modal menu items to include an action which will open/close the modal */
  private setModalActions(): Set<AnyMenuItem | MenuModal> {
    return (
      this.links
        /*
         * Change modal menu item links into menu actions
         */
        .map((link) =>
          isMenuModal(link) ? this.createModalAction(link) : link
        )
    );
  }

  /**
   * Generates a menuAction for the modal menu item which allows it to
   * create a modal on click
   *
   * @param modal Modal menu item
   * @returns Menu Action
   */
  private createModalAction(link: MenuModalWithoutAction): MenuModal {
    const action = (): void => {
      const modalRef = this.modalService.open(link.component, link.modalOpts);
      const component: ModalComponent = modalRef.componentInstance;
      link.assignComponentData(component, this.menuService.pageInfo, modalRef);
    };
    return menuModal({ ...link, action }) as MenuModal;
  }

  /** Clear widgets */
  private clearWidgets() {
    this.menuWidget?.clear();
  }

  /** Insert widgets into menu */
  private insertWidgets(): void {
    if (!this.menuWidget) {
      return;
    }
    this.widgets?.forEach((widget) => this.insertWidget(widget));
  }

  /**
   * Insert widget into menu
   *
   * @param widget Widget Component
   */
  private insertWidget(widget: WidgetMenuItem): void {
    const componentRef = this.menuWidget.createComponent(widget.component);
    widget.assignComponentData(componentRef.instance);
  }
}