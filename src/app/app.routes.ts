import { Routes } from '@angular/router';
import { ProductReviewComponent } from './product-review/product-review';
import { NavSystem } from './nav-system/nav-system';


export const routes: Routes = [
    { 
        path: '', 
        component: NavSystem 
    },
    { 
        path: 'product-review/:id', 
        component: ProductReviewComponent
    }
];
