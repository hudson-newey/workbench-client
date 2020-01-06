import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { ItemInterface } from "src/app/component/shared/items/item/item.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ImageSizes } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { UserService } from "src/app/services/baw-api/user.service";
import {
  editMyAccountMenuItem,
  editProfileMenuItem,
  myAccountCategory,
  myAccountMenuItem,
  profileCategory,
  profileMenuItem
} from "../../profile.menus";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([
      editMyAccountMenuItem,
      {
        kind: "MenuLink",
        icon: ["fas", "globe-asia"],
        label: "My Projects",
        uri: "BROKEN LINK",
        tooltip: user => `Projects ${user.userName} can access`,
        predicate: user => !!user
      },
      {
        kind: "MenuLink",
        icon: ["fas", "map-marker-alt"],
        label: "My Sites",
        uri: "BROKEN LINK",
        tooltip: user => `Sites ${user.userName} can access`,
        predicate: user => !!user
      },
      {
        kind: "MenuLink",
        icon: ["fas", "bookmark"],
        label: "My Bookmarks",
        uri: "BROKEN LINK",
        tooltip: user => `Bookmarks created by ${user.userName}`,
        predicate: user => !!user
      },
      {
        kind: "MenuLink",
        icon: ["fas", "bullseye"],
        label: "My Annotations",
        uri: "BROKEN LINK",
        tooltip: user => `Annotations created by ${user.userName}`,
        predicate: user => !!user
      }
    ]),
    links: List()
  },
  self: myAccountMenuItem
})
@Component({
  selector: "app-my-account-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class MyAccountProfileComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  error: APIErrorDetails;
  imageUrl: string;
  tags: ItemInterface[];
  thirdPerson = false;
  user: User;
  userStatistics: ItemInterface[];

  constructor(private api: UserService) {
    super();
  }

  ngOnInit() {
    this.api
      .getMyAccount()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (user: User) => {
          this.user = user;
          this.imageUrl = user.getImage(ImageSizes.large);
        },
        (err: APIErrorDetails) => {
          this.error = err;
        }
      );

    this.userStatistics = [
      { icon: ["fas", "globe-asia"], name: "Projects", value: "Unknown" },
      { icon: ["fas", "tags"], name: "Tags", value: "Unknown" },
      { icon: ["fas", "bookmark"], name: "Bookmarks", value: "Unknown" },
      { icon: ["fas", "map-marker-alt"], name: "Sites", value: "Unknown" },
      { icon: ["fas", "bullseye"], name: "Annotations", value: "Unknown" },
      { icon: ["fas", "comments"], name: "Comments", value: "Unknown" }
    ];

    this.tags = [
      {
        icon: ["fas", "tag"],
        name: "Test 1",
        value: 0,
        uri: "BROKEN LINK"
      },
      {
        icon: ["fas", "tag"],
        name: "Test 2",
        value: 0,
        uri: "BROKEN LINK"
      }
    ];
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

@Page({
  category: profileCategory,
  menus: {
    actions: List<AnyMenuItem>([
      editProfileMenuItem,
      {
        kind: "MenuLink",
        icon: ["fas", "globe-asia"],
        label: "Their Projects",
        uri: "BROKEN LINK",
        tooltip: () => "Projects they can access",
        predicate: user => !!user
      },
      {
        kind: "MenuLink",
        icon: ["fas", "map-marker-alt"],
        label: "Their Sites",
        uri: "BROKEN LINK",
        tooltip: () => "Sites they can access",
        predicate: user => !!user
      },
      {
        kind: "MenuLink",
        icon: ["fas", "bookmark"],
        label: "Their Bookmarks",
        uri: "BROKEN LINK",
        tooltip: () => "Bookmarks created by them",
        predicate: user => !!user
      },
      {
        kind: "MenuLink",
        icon: ["fas", "bullseye"],
        label: "Their Annotations",
        uri: "BROKEN LINK",
        tooltip: () => "Annotations created by them",
        predicate: user => !!user
      }
    ]),
    links: List()
  },
  self: profileMenuItem
})
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  error: APIErrorDetails;
  imageUrl: string;
  tags: ItemInterface[];
  thirdPerson = true;
  user: User;
  userStatistics: ItemInterface[];

  constructor(private api: UserService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.params
      .pipe(
        flatMap(params => {
          return this.api.getUserAccount(params.userId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (user: User) => {
          this.user = user;
          this.imageUrl = user.getImage(ImageSizes.large);
        },
        (err: APIErrorDetails) => {
          this.error = err;
        }
      );

    this.userStatistics = [
      { icon: ["fas", "globe-asia"], name: "Projects", value: "Unknown" },
      { icon: ["fas", "tags"], name: "Tags", value: "Unknown" },
      { icon: ["fas", "bookmark"], name: "Bookmarks", value: "Unknown" },
      { icon: ["fas", "map-marker-alt"], name: "Sites", value: "Unknown" },
      { icon: ["fas", "bullseye"], name: "Annotations", value: "Unknown" },
      { icon: ["fas", "comments"], name: "Comments", value: "Unknown" }
    ];

    this.tags = [
      {
        icon: ["fas", "tag"],
        name: "Test 1",
        value: 0,
        uri: "BROKEN LINK"
      },
      {
        icon: ["fas", "tag"],
        name: "Test 2",
        value: 0,
        uri: "BROKEN LINK"
      }
    ];
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
