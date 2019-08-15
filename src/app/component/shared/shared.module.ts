import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";

import { RouterModule } from "@angular/router";
import { CardsModule } from "./cards/cards.modules";
import { sharedComponents } from "./shared.components";

@NgModule({
  declarations: sharedComponents,
  imports: [
    RouterModule,
    CommonModule,
    LoadingBarHttpClientModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    CardsModule
  ],
  exports: [
    RouterModule,
    CommonModule,
    LoadingBarHttpClientModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    CardsModule,
    sharedComponents
  ]
})
export class SharedModule {}
