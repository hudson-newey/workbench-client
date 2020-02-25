import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Configuration } from "./app-config.service";

@Injectable()
export class MockAppConfigService {
  constructor(private titleService: Title) {}

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
    return {
      environment: {
        environment: "testing",
        apiRoot: "http://apiroot",
        siteRoot: "<< siteRoot >>",
        siteDir: "<< siteDir >>",
        cmsRoot: "<< cmsRoot >>",
        ga: {
          trackingId: "<< placeholder >>"
        }
      },
      values: {
        keys: {
          googleMaps: "<< googleMaps >>"
        },
        brand: {
          name: "<< brandName >>",
          title: "<< brandTitle >>"
        },
        content: [
          {
            title: "<< content1 >>",
            url: "<< contentUrl1 >>"
          },
          {
            headerTitle: "<< content2 >>",
            items: [
              {
                title: "<< content3 >>",
                url: "<< contentUrl3 >>"
              },
              {
                title: "<< content4 >>",
                url: "<< contentUrl4 >>"
              }
            ]
          }
        ]
      }
    };
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
