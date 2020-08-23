import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { Card } from "../cards.component";

/**
 * Card Component
 */
@Component({
  selector: "baw-card",
  styleUrls: ["./card.component.scss"],
  template: `
    <div class="card h-100">
      <h4 class="card-header text-center">
        <ng-container *ngIf="card.link || card.route; else noLinkTitle">
          <ng-container *ngIf="card.link; else route">
            <a [href]="card.link">{{ card.title }}</a>
          </ng-container>

          <ng-template #route>
            <a [routerLink]="card.route">
              {{ card.title }}
            </a>
          </ng-template>
        </ng-container>

        <ng-template #noLinkTitle>{{ card.title }}</ng-template>
      </h4>
      <div class="card-body">
        <p class="card-text" [ngClass]="{ 'font-italic': !card.description }">
          {{ card.description ? card.description : "No description given" }}
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnInit {
  @Input() public card: Card;

  constructor() {}

  public ngOnInit() {}
}