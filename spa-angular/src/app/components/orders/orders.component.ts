import { Component } from '@angular/core';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  cartItems: CartItem[] = []; // Define cartItems with type
  totalAmount: number = 0; // Define totalAmount with type

  constructor() {
    // Example data for demonstration purposes
    this.cartItems = [
      { name: 'Product 1', price: 10000, quantity: 1, imageUrl: 'path/to/image1.jpg' },
      { name: 'Product 2', price: 20000, quantity: 2, imageUrl: 'path/to/image2.jpg' }
    ];
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  increaseQuantity(item: CartItem) {
    item.quantity++;
    this.calculateTotal();
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
    }
  }

  removeProduct(item: CartItem) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
    this.calculateTotal();
  }
}
