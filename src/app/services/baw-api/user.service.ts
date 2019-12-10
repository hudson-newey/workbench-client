import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { User, UserInterface } from "src/app/models/User";
import { BawApiService } from "./base-api.service";

@Injectable({
  providedIn: "root"
})
export class UserService extends BawApiService {
  constructor(http: HttpClient) {
    super(http);

    this.paths = {
      myAccount: "/my_account",
      userAccount: "/user_accounts/:userId"
    };
  }

  /**
   * Get the account details of the current logged in user
   * @returns Observable returning current user details
   */
  getMyAccount(): Subject<User> {
    const subject = new Subject<User>();
    const callback = (user: UserInterface) => new User(user);

    if (this.isLoggedIn()) {
      this.details(subject, callback, this.paths.myAccount);
    } else {
      subject.error("User is not logged in");
      subject.complete();
    }

    return subject;
  }

  /**
   * Get the user account details of another user
   * @param id User ID
   * @returns Observable returning user details
   */
  getUserAccount(id: ID): Subject<User> {
    const subject = new Subject<User>();
    const callback = (user: UserInterface) => new User(user);

    if (this.isLoggedIn()) {
      this.details(subject, callback, this.paths.userAccount, {
        args: { userId: id }
      });
    } else {
      subject.error("User is not logged in");
    }

    return subject;
  }
}
