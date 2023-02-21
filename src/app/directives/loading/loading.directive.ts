import {
  Directive,
  ElementRef,
  Input,
  OnChanges
} from "@angular/core";

/**
 * Provides a common attributes to turn an element into a placeholder element if the required information
 * Does not exist yet
 *
 * ####  Example
 * ```html
 * <span [isLoading]="loading" bawLoading>{{ project.name }}</span>
 * ```
 * The project name element will display a skeleton / placeholder element without the project name before the project name has been fetched
 * The project name will be filled, and the placeholder / skeleton element will be removed once the `loading` attribute is set to `false`
 */
@Directive({ selector: "[bawLoading]" })
export class LoadingDirective implements OnChanges {
  public constructor(
    private element: ElementRef<HTMLElement>,
  ) { }

  @Input() public isLoading: boolean;

  private skeletonClasses = [
    "placeholder",
    "placeholder-wave",
  ];

  public ngOnChanges(): void {
    this.skeletonClasses.forEach((placeHolderClass) =>
      this.element.nativeElement.classList.toggle(placeHolderClass, this.isLoading ?? true)
    );
  }
}
