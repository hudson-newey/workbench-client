import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ConfigOption } from "@ngx-formly/core";
import { FormlyImageInput } from "./component/shared/formly/image-input.component";
import { FormlyQuestionAnswerAction } from "./component/shared/formly/question-answer-action.component";
import { FormlyQuestionAnswer } from "./component/shared/formly/question-answer.component";
import { FormlyTimezoneInput } from "./component/shared/formly/timezone-input.component";
import {
  apiRootFactory,
  API_ROOT,
  AppConfigService
} from "./services/app-config/app-config.service";
import { BawApiInterceptor } from "./services/baw-api/api.interceptor.service";

export function minLengthValidationMessage(err, field) {
  return `Input should have at least ${field.templateOptions.minLength} characters`;
}

export function maxLengthValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

export const formlyRoot = {
  types: [
    {
      name: "image",
      component: FormlyImageInput
    },
    {
      name: "timezone",
      component: FormlyTimezoneInput
    },
    {
      name: "question-answer",
      component: FormlyQuestionAnswer
    },
    {
      name: "question-answer-action",
      component: FormlyQuestionAnswerAction
    }
  ],
  validationMessages: [
    { name: "required", message: "This field is required" },
    { name: "minlength", message: minLengthValidationMessage },
    { name: "maxlength", message: maxLengthValidationMessage },
    { name: "min", message: minValidationMessage },
    { name: "max", message: maxValidationMessage }
  ]
} as ConfigOption;

export function fontAwesomeLibraries(library: FaIconLibrary) {
  library.addIconPacks(fas);
}

export const providers = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true
  },
  {
    provide: API_ROOT,
    useFactory: apiRootFactory,
    deps: [AppConfigService]
  }
];
