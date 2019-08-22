import {
  AuthToken,
  ID,
  ImageURL,
  TimezoneInformation,
  UserName
} from "../interfaces/apiInterfaces";

/**
 * A user model.
 */
export interface UserInterface {
  id: ID;
  userName: UserName;
  rolesMask: number;
  rolesMaskNames: string[];
  timezoneInformation: TimezoneInformation;
  imageUrls: ImageURL[];
  lastSeenAt: string;
  preferences: any;
  isConfirmed: boolean;
}

/**
 * A user model for the website user
 */
export interface SessionUserInterface {
  userName: UserName;
  authToken: AuthToken;
}

/**
 * A user model.
 */
export class User implements UserInterface {
  public readonly id: ID;
  public readonly userName: UserName;
  public readonly timezoneInformation: TimezoneInformation;
  public readonly imageUrls: ImageURL[];
  public readonly lastSeenAt: string;
  public readonly preferences: any;
  public readonly isConfirmed: boolean;
  public readonly rolesMask: number;
  public readonly rolesMaskNames: string[];

  constructor(user: UserInterface) {
    this.id = user.id;
    this.userName = user.userName;
    this.timezoneInformation = user.timezoneInformation;
    this.imageUrls = user.imageUrls.map(image => {
      image.url = `/assets/${image.url}`;
      return image;
    });
    this.lastSeenAt = user.lastSeenAt;
    this.preferences = user.preferences;
    this.isConfirmed = user.isConfirmed;
    this.rolesMask = user.rolesMask;
    this.rolesMaskNames = user.rolesMaskNames;
  }

  // TODO Change this to reference the user account component
  get url(): string {
    return "/user_accounts/" + this.id;
  }

  /**
   * Determines if user is admin. Role mask stores user roles
   * as a power of 2 integer so that roles can be combined.
   * The admin role is 1, therefore a role mask of 1 (0001) or
   * 3 (0011) indicate an admin account.
   */
  get isAdmin(): boolean {
    // tslint:disable-next-line: no-bitwise
    return (this.rolesMask & 1) === 1;
  }
}

/**
 * A user model for the website user
 */
export class SessionUser implements SessionUserInterface {
  public readonly authToken: AuthToken;
  public readonly userName: UserName;

  /**
   * Constructor
   */
  constructor(user: SessionUserInterface) {
    this.authToken = user.authToken;
    this.userName = user.userName;
  }
}
