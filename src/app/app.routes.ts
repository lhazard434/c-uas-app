import { Routes } from '@angular/router';
import { ProductReviewComponent } from './product-review/product-review';
import { NavSystem } from './nav-system/nav-system';
import { ReviewSystem } from './review-system/review-system';
import { Login } from './login/login';
import { AdminComponent } from './admin/admin';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { 
        path: '', 
        component: NavSystem, 
        canActivate: [authGuard] 
    },
    { 
        path: 'product-review/:id', 
        component: ProductReviewComponent, 
        canActivate: [authGuard]
    },
    { 
        path: 'review-system', 
        component: ReviewSystem,
        canActivate: [authGuard]
    },
    { 
        path: 'admin', 
        component: AdminComponent,
        canActivate: [authGuard]
    },
    { 
        path: 'login', 
        component: Login 
    }
];
