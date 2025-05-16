import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { PaymentComponent } from './components/orders/payment/payment.component';
import { ShippingComponent } from './components/orders/shipping/shipping.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './auth.guard';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ReviewComponent } from './components/review/review.component';
import { ProductsPriaComponent } from './components/products/pria/products-pria.component';
import { ProductsWanitaComponent } from './components/products/wanita/products-wanita.component';
import { ProductsAnakComponent } from './components/products/anak/products-anak.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { ProductsListComponent } from './components/products/products-list/products-list.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'aboutus', component: AboutusComponent },
    { path: 'orders',  component: OrdersComponent,canActivate: [AuthGuard] ,
        children: [
            {path: 'payment',
                component: PaymentComponent
            },
            {path: 'shipping',
                component: ShippingComponent
            },
        ]
    },
    { path: 'products',  component: ProductsComponent,  canActivate: [AuthGuard] ,
        children: [
            {
                path:'', component: ProductsListComponent

            },
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
                component: ProductsAnakComponent // ganti jd component pria
            },
            
        ]
     },
    { path: 'contactus',  component: ContactusComponent, canActivate: [AuthGuard] },
    { path: 'review',  component: ReviewComponent , canActivate: [AuthGuard] },
    { path: 'auth', component: AuthComponent },
    { path: '**', redirectTo: 'auth' },
    

    
];