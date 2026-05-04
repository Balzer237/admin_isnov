import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CardComponent],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <app-page-header
        [title]="title"
        [subtitle]="subtitle"
      ></app-page-header>

      <app-card>
        <div class="max-w-2xl">
          <div class="inline-flex items-center rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Preview
          </div>
          <h2 class="mt-4 text-xl font-semibold text-gray-900">Section disponible mais non activée dans le sidebar</h2>
          <p class="mt-3 text-gray-600 leading-7">
            Cette page reste routable pour préserver la structure de navigation existante, mais l'accès principal
            depuis le menu latéral est volontairement désactivé tant que le module n'est pas ouvert.
          </p>
        </div>
      </app-card>
    </div>
  `,
  styles: []
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);

  get title(): string {
    return this.route.snapshot.data['title'] ?? 'Section';
  }

  get subtitle(): string {
    return this.route.snapshot.data['subtitle'] ?? 'Cette section sera activée ultérieurement.';
  }
}
