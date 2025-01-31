import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'orders',  component: OrdersComponent, canActivate: [AuthGuard] },
    { path: 'products',  component: ProductsComponent, canActivate: [AuthGuard] },
    { path: 'payment',  component: PaymentComponent, canActivate: [AuthGuard] },
    { path: 'shipping',  component: ShippingComponent, canActivate: [AuthGuard] },
    { path: 'auth', component: AuthComponent },
    { path: '**', redirectTo: 'auth' },
    

    
];