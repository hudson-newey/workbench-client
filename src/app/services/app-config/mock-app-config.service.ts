import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Title } from "@angular/platform-browser";
import {
  environment,
  values
} from "../../../assets/tests/remoteEnvironment.json";
import { Configuration } from "./app-config.service.js";

export let APP_CONFIG = new InjectionToken("app.config");

@Injectable()
export class MockAppConfigService {
  constructor(
    @Inject(APP_CONFIG) private config: string,
    private titleService: Title
  ) {}

  /**
   * Load the application config from the ecosounds website
   */
  async loadAppConfig(): Promise<any> {
    this.titleService.setTitle("TESTING");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 10);
    });
  }

  /**
   * Get the application config.
   * Returned undefined if config has not loaded yet.
   * Returns null if an error has occurred
   */
  getConfig(): Configuration {
    return { environment, values };
  }

  /**
   * Get the url for a url link from the application config
   * @param content Application config
   * @param titles Title of link (titles if link is a subset of another)
   */
  getContentUrl(content: any, titles: string[]) {
    return "<< contentUrl >>";
  }
}
