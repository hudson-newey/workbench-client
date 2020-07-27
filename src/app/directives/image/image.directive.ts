import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { SecurityService } from "@baw-api/security/security.service";
import { API_ROOT, ASSET_ROOT } from "@helpers/app-initializer/app-initializer";
import { ImageSizes, ImageUrl } from "@interfaces/apiInterfaces";
import { OrderedSet } from "immutable";

export const image404RelativeSrc = "/assets/images/404.png";

@Directive({
  // Directive applies directly to all image tags instead of being
  // explicitly called
  // tslint:disable-next-line: directive-selector
  selector: "img",
})
export class AuthenticatedImageDirective implements OnChanges {
  @Input() public src: ImageUrl[];
  @Input() public thumbnail: ImageSizes;
  @Input() public disableAuth: boolean;

  /**
   * Tracks potential url options to be used for src
   */
  private urls = OrderedSet<string>();
  /**
   * Tracks used url options
   */
  private usedUrls = OrderedSet<string>();
  /**
   * Tracks whether to display src matching thumbnail size
   */
  private displayThumbnail = false;
  /**
   * Contains url for default image
   */
  private defaultImage: string;

  constructor(
    @Inject(API_ROOT) private apiRoot: string,
    @Inject(ASSET_ROOT) private assetRoot: string,
    private securityApi: SecurityService,
    private imageRef: ElementRef<HTMLImageElement>
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    // On Component Initial Load
    if (changes.src.isFirstChange()) {
      this.imageRef.nativeElement.onerror = () => {
        // Prevent overriding of 'this'
        this.errorHandler();
      };
    }

    // Re-enable use of current src
    if (this.usedUrls.count() > 0) {
      this.usedUrls = this.usedUrls.delete(this.usedUrls.last());
    }

    // Prepend new urls (except default urls) to urls set
    this.urls = OrderedSet<string>(
      this.src
        ?.filter((imageUrl) => imageUrl.size !== ImageSizes.DEFAULT)
        .map((imageUrl) => imageUrl.url) ?? []
    ).concat(this.urls);

    // Retrieve default image if exists
    this.defaultImage =
      this.src?.find((imageUrl) => imageUrl.size === ImageSizes.DEFAULT)?.url ??
      this.defaultImage;

    this.displayThumbnail = !!this.thumbnail;
    this.setImageSrc();
  }

  /**
   * Set src for image element
   */
  private setImageSrc(): void {
    let url: string;

    if (this.use404Image()) {
      url = image404RelativeSrc;
    }

    if (this.useDefaultImage(url)) {
      url = this.defaultImage;
    }

    // Find thumbnail if exists
    if (!url && this.displayThumbnail) {
      url = this.src.find((imageUrl) => imageUrl.size === this.thumbnail)?.url;
    }

    // Retrieve first url from set
    if (!url) {
      url = this.urls.subtract(this.usedUrls).first();
    }

    // Catch any final edge cases
    if (!url) {
      url = image404RelativeSrc;
    }

    this.usedUrls = this.usedUrls.add(url);
    url = this.formatIfLocalUrl(url);
    url = this.appendAuthToken(url);
    this.imageRef.nativeElement.src = url;
  }

  /**
   * Handle image error event
   */
  private errorHandler() {
    // tslint:disable-next-line: no-console
    console.warn("Failed to load image: ", this.imageRef.nativeElement.src);

    // No longer attempt to use thumbnail
    if (this.displayThumbnail) {
      this.displayThumbnail = false;
    }

    this.setImageSrc();
  }

  /**
   * Prepend the asset root to any local urls
   * @param url Url to potentially format
   */
  private formatIfLocalUrl(url: string): string {
    if (url.startsWith("/") && !url.startsWith(this.assetRoot)) {
      return this.assetRoot + url;
    }
    return url;
  }

  /**
   * Append authentication token to url if logged in
   * and disableAuthentication is not set.
   * @param url Url to append to, must be fully formed (not a relative path)
   */
  private appendAuthToken(url: string): string {
    if (this.disableAuth || !url.startsWith(this.apiRoot)) {
      return url;
    }

    const user = this.securityApi.getLocalUser();
    if (user?.authToken) {
      const tokenUrl = new URL(url);
      tokenUrl.searchParams.set("authToken", user.authToken);
      return tokenUrl.toString();
    }
    return url;
  }

  /**
   * Returns true is there are no image options available
   */
  private use404Image(): boolean {
    const hasDefaultImageAvailable = this.defaultImage
      ? this.urls.count() + 1 === this.usedUrls.count()
      : this.urls.count() === this.usedUrls.count();

    return !this.src || hasDefaultImageAvailable;
  }

  /**
   * Returns true if the default image is the only option available
   * @param url Url
   */
  private useDefaultImage(url: string): boolean {
    return (
      !url && this.defaultImage && this.urls.count() === this.usedUrls.count()
    );
  }
}