import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { Order } from '../order/order.component';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="w4-sr-only">Order Summary</h1>
    @if (order.tacos.length > 0) {
      <ul class="w4-summary-list">
        @for (taco of order.tacos; track $index) {
          <li>
            <div class="w4-item-heading">
              <!-- Replaced quantity-first with generated Item identifier -->
              <strong>Item {{ $index + 1 }}: {{ taco.name }}</strong>
            </div>
            <div class="w4-detail-list">
              <p>Quantity: {{ taco.quantity }}</p>
              <p>Unit Price: {{ taco.price | currency:'USD':'symbol':'1.2-2' }}</p>
              <p>Line Subtotal: {{ (taco.price * (taco.quantity ?? 1)) | currency:'USD':'symbol':'1.2-2' }}</p>

              @if (taco.noOnions) {
                <p>Customization: No onions</p>
              }
              @if (taco.noCilantro) {
                <p>Customization: No cilantro</p>
              }
            </div>
            <!-- New Remove Button -->
            <button (click)="onRemove($index)" class="remove-btn">Remove Taco</button>
          </li>
        }
      </ul>
      <div class="w4-summary-total">
        <span>Total:</span>
        <strong>{{ getTotal() | currency:'USD':'symbol':'1.2-2' }}</strong>
      </div>
    } @else {
      <div class="w4-empty-state">
        <p>Your order is empty.</p>
      </div>
    }
  `
})
export class OrderSummaryComponent {
  private readonly orderState = signal<Order>({ orderId: 0, tacos: [] });

  // New Output Emitter for removing tacos
  @Output() removeTaco = new EventEmitter<number>();

  @Input()
  set order(value: Order) {
    this.orderState.set(value);
  }

  get order() {
    return this.orderState();
  }

  getTotal() {
    return this.order.tacos.reduce((acc, taco) => acc + (taco.price * (taco.quantity ?? 1)), 0);
  }

  // Method to trigger the event emitter
  onRemove(index: number): void {
    this.removeTaco.emit(index);
  }
}
