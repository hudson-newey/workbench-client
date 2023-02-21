import { SpectatorDirective, createDirectiveFactory } from "@ngneat/spectator";
import { LoadingDirective } from "./loading.directive";

describe("LoadingDirective", () => {
  let spectator: SpectatorDirective<LoadingDirective>;
  const directiveElement = "<a [loadingPredicate]='loading' bawLoading>";

  const placeholderClasses = [
    "placeholder",
    "placeholder-wave",
  ];

  const createDirective = createDirectiveFactory<LoadingDirective>({
    directive: LoadingDirective,
  });

  function setup(): void {
    spectator = createDirective(directiveElement, { detectChanges: false });
    spectator.directive.isLoading = true;
    spectator.detectChanges();
  }

  function toggleLoading(state?: boolean): void {
    spectator.directive.isLoading = state ?? !spectator.directive.isLoading;
  }

  function assertPlaceholderAttributes(shouldExist = true): void {
    const element = spectator.query("a");

    // for more verbose logging during the testing process, we should assert using `.is` and `.not.is` so that when assertions fail
    // they are printed to the console correctly
    placeholderClasses.forEach((className) => {
      if (shouldExist) {
        expect(element.classList).toContain(className);
      } else {
        expect(element.classList).not.toContain(className);
      }
    });
  }

  beforeEach(() => setup());

  it("should create", () => {
    expect(spectator.directive).toBeInstanceOf(LoadingDirective);
  });

  it("should have the placeholder classes if the loadingPredicate has not been defined", () => {
    spectator.directive.isLoading = undefined;
    assertPlaceholderAttributes(true);
  });

  [false, true].forEach((isLoading: boolean): void => {
    it(`should ${isLoading ? "" : "not" } contain placeholder classes if the loadingPredicate ${isLoading ? "is" : "isn't"} set`, () => {
      toggleLoading(isLoading);
      assertPlaceholderAttributes(isLoading);
    });
  });
});
