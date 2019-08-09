import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { CardImageComponent } from "./card-image/card-image.component";
import { CardComponent } from "./card/card.component";
import { CardsComponent } from "./cards.component";

@NgModule({
  declarations: [CardsComponent, CardComponent, CardImageComponent],
  imports: [CommonModule],
  exports: [CardsComponent, CardComponent, CardImageComponent]
})
export class CardsModule {}