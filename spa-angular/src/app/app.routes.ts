import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ShippingComponent } from './components/shipping/shipping.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'orders',  component: OrdersComponent},
    { path: 'products',  component: ProductsComponent},
    { path: 'payment',  component: PaymentComponent},
    { path: 'shipping',  component: ShippingComponent},
    

    
];