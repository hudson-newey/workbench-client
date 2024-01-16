import { Spectator, createComponentFactory } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { Duration, DurationLikeObject } from "luxon";
import { modelData } from "@test/helpers/faker";
import { assertTooltip } from "@test/helpers/html";
import { withDefaultZone } from "@test/helpers/mocks";
import { DurationComponent } from "./duration.component";

// I have created this interface for TypeScript LSP typing and auto completion
// it should not be used outside of this file
interface TestCase {
  name: string;
  value: Duration;
  expectedText: string;
  expectedTooltip: string;
  expectedDateTimeAttribute: string;
  iso8601?: boolean;
  humanized?: boolean;
  sexagesimal?: boolean;
}

function test(
  name: string,
  value: DurationLikeObject,
  expectedText: string,
  expectedTooltip: string,
  expectedDateTimeAttribute: string,
  iso8601?: boolean,
  humanized?: boolean,
  sexagesimal?: boolean
): TestCase {
  return {
    name,
    value: Duration.fromObject(value),
    expectedText,
    expectedTooltip,
    expectedDateTimeAttribute,
    iso8601,
    humanized,
    sexagesimal,
  };
}

// prettier-ignore
/* eslint-disable max-len */
const testCases: TestCase[] = [
  test("sexagesimal", { minutes: 10, seconds: 1.5 }, "00:10:01.500", "00:10:01.500 (PT10M1.5S)", "PT10M1.5S"),

  test("negative sexagesimal", { minutes: -10, seconds: -1.5 }, "-00:10:01.500", "-00:10:01.500 (-PT10M1.5S)", "-PT10M1.5S"),

  test("explicit sexagesimal", { minutes: 10, seconds: 1.5 }, "00:10:01.500", "00:10:01.500 (PT10M1.5S)", "PT10M1.5S", false, false, true),

  test("negative explicit sexagesimal", { minutes: -10, seconds: -1.5 }, "-00:10:01.500", "-00:10:01.500 (-PT10M1.5S)", "-PT10M1.5S", false, false, true),

  test("iso 8601", { minutes: 10, seconds: 1.5 }, "PT10M1.5S", "00:10:01.500 (PT10M1.5S)", "PT10M1.5S", true),

  test("negative iso 8601", { minutes: -10, seconds: -1.5 }, "-PT10M1.5S", "-00:10:01.500 (-PT10M1.5S)", "-PT10M1.5S", true),

  test("human readable", { minutes: 10, seconds: 1.5 }, "10 minutes 2 seconds", "00:10:01.500 (PT10M1.5S)", "PT10M1.5S", false, true),

  test("negative human readable", { minutes: -10, seconds: -1.5 }, "-10 minutes 2 seconds", "-00:10:01.500 (-PT10M1.5S)", "-PT10M1.5S", false, true),

  test("rebalanced sexagesimal duration", { minutes: 300, seconds: 3600 }, "06:00:00.00", "06:00:00.00 (PT6H)", "PT6H"),

  test("rebalanced iso 8601 duration", { minutes: 300, seconds: 3600 }, "PT6H", "06:00:00.00 (PT6H)", "PT6H", true),

  test("rebalanced human readable duration", { minutes: 300, seconds: 3600 }, "6 hours", "06:00:00.00 (PT6H)", "PT6H", false, true),
];
/* eslint-enable max-len */

describe("DurationComponent", () => {
  let spectator: Spectator<DurationComponent>;

  const createComponent = createComponentFactory({
    component: DurationComponent,
    imports: [SharedModule, MockBawApiModule],
  });

  function update(): void {
    spectator.detectChanges();
    spectator.component.ngOnChanges();
    spectator.detectChanges();
  }

  function timeElement(): HTMLTimeElement {
    return spectator.element.querySelector<HTMLTimeElement>("time");
  }

  beforeEach(() => (spectator = createComponent()));

  it("should create", () => {
    spectator.component.value = modelData.time();
    expect(spectator.component).toBeInstanceOf(DurationComponent);
  });

  withDefaultZone("Australia/Perth", () => {
    testCases.forEach((testCase) => {
      describe(testCase.name, () => {
        beforeEach(() => {
          spectator.component.value = testCase.value;
          spectator.component.iso8601 = testCase.iso8601;
          spectator.component.humanized = testCase.humanized;
          spectator.component.sexagesimal = testCase.sexagesimal;
          update();
        });

        it("should have the correct text", () => {
          expect(timeElement()).toHaveExactTrimmedText(testCase.expectedText);
        });

        it("should have the correct tooltip", () => {
          assertTooltip(timeElement(), testCase.expectedTooltip);
        });

        it("should have the correct dateTime attribute", () => {
          expect(timeElement().dateTime).toBe(
            testCase.expectedDateTimeAttribute
          );
        });
      });
    });
  });
});
