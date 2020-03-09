import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Page } from "src/app/helpers/page/pageDecorator";
import { PagedTableTemplate } from "src/app/helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { AccountService } from "src/app/services/baw-api/account.service";
import {
  adminCategory,
  adminDashboardMenuItem,
  adminUserListMenuItem
} from "../admin.menus";
import { adminMenuItemActions } from "../dashboard/dashboard.component";
import { theirEditProfileMenuItem } from "../../profile/profile.menus";

@Page({
  category: adminCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminMenuItemActions
    ]),
    links: List()
  },
  self: adminUserListMenuItem
})
@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"]
})
export class AdminUserListComponent extends PagedTableTemplate<TableRow, User>
  implements OnInit {
  constructor(api: AccountService) {
    super(api, accounts =>
      accounts.map(account => ({
        account: account,
        user: account.userName,
        lastLogin: account.lastSeenAt.toString(),
        confirmed: account.isConfirmed ? "confirmed" : "no"
      }))
    );
  }

  ngOnInit(): void {
    this.columns = [
      { name: "Account" },
      { name: "User" },
      { name: "Last Login" },
      { name: "Confirmed" }
    ];
    this.getModels();
  }

  public redirectPath(user: User) {
    return theirEditProfileMenuItem.route
      .toString()
      .replace(":accountId", user.id.toString());
  }
}

interface TableRow {
  account: User;
  user: string;
  lastLogin: string;
  confirmed: "no" | "confirmed";
}