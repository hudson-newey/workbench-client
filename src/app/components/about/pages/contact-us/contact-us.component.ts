import { Component, OnInit } from "@angular/core";
import {
  aboutCategory,
  contactUsMenuItem,
} from "@components/about/about.menus";
import { withFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { fields } from "./contact-us.schema.json";

@Component({
  selector: "baw-about-contact-us",
  template: `
    <baw-wip>
      <baw-form
        title="Contact Us"
        [model]="model"
        [fields]="fields"
        submitLabel="Submit"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></baw-form>
    </baw-wip>
  `,
})
class ContactUsComponent
  extends withFormCheck(PageComponent)
  implements OnInit {
  public model = {};
  public fields = fields;
  public loading: boolean;

  public constructor() {
    super();
  }

  public ngOnInit() {}

  /**
   * Form submission
   *
   * @param $event Form response
   */
  public submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}

ContactUsComponent.linkComponentToPageInfo({
  category: aboutCategory,
}).andMenuRoute(contactUsMenuItem);

export { ContactUsComponent };
