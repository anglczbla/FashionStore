import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './auth.guard';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ReviewComponent } from './components/review/review.component';
import { ProductsPriaComponent } from './components/products/pria/products-pria.component';
import { ProductsWanitaComponent } from './components/products/wanita/products-wanita.component';
import { ProductsanakComponent } from './components/products/anak/products-anak.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'aboutus', component: AboutusComponent },
    { path: 'orders',  component: OrdersComponent, canActivate: [AuthGuard] },
    { path: 'products',  component: ProductsComponent,  
        children: [
            {
                path: 'pria',
                component: ProductsPriaComponent // ganti jd component pria
            },
            {
                path: 'wanita',
                component: ProductsWanitaComponent // ganti jd component pria
            },
            {
                path: 'anak',
                component: ProductsanakComponent // ganti jd component pria
            },
            
        ]
     },
    { path: 'payment',  component: PaymentComponent, canActivate: [AuthGuard] },
    { path: 'shipping',  component: ShippingComponent},
    { path: 'review',  component: ReviewComponent },
    { path: 'auth', component: AuthComponent },
    { path: '**', redirectTo: 'auth' },
    

    
];