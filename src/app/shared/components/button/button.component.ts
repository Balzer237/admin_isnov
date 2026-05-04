import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [ngClass]="buttonClasses"
      (click)="onClick()">
      @if (icon) {
        <span class="icon" [ngClass]="iconClass"></span>
      }
      <span class="label">{{ label }}</span>
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
      border: 1px solid transparent;
      outline: none;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Primary variant */
    button.primary {
      background-color: #3B82F6;
      color: white;
      border-color: #3B82F6;
    }

    button.primary:hover:not(:disabled) {
      background-color: #2563EB;
      border-color: #2563EB;
    }

    button.primary:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Secondary variant */
    button.secondary {
      background-color: white;
      color: #374151;
      border-color: #D1D5DB;
    }

    button.secondary:hover:not(:disabled) {
      background-color: #F9FAFB;
      border-color: #9CA3AF;
    }

    button.secondary:focus {
      box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
    }

    /* Danger variant */
    button.danger {
      background-color: #EF4444;
      color: white;
      border-color: #EF4444;
    }

    button.danger:hover:not(:disabled) {
      background-color: #DC2626;
      border-color: #DC2626;
    }

    button.danger:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .icon {
      width: 1rem;
      height: 1rem;
      display: inline-block;
    }

    /* Simple icon placeholders - in real app, use proper icon library */
    .icon.plus::before { content: '+'; }
    .icon.edit::before { content: '✏'; }
    .icon.eye::before { content: '👁'; }
    .icon.trash::before { content: '🗑'; }
    .icon.database::before { content: '🗃'; }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() label = '';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() icon = '';
  @Input() disabled = false;
  @Output() click = new EventEmitter<void>();

  get buttonClasses(): string {
    return this.variant;
  }

  get iconClass(): string {
    return `icon-${this.icon}`;
  }

  onClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }
}