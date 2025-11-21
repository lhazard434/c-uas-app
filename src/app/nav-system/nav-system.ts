// nav-system.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import { AuthService } from '../auth.service';

interface Product {
  id: number;
  name: string;
  manufacturer: string;
  category: string;
  image: string;
  shortDescription: string;
  averageRating: number;
  reviewCount: number;
}

@Component({
  selector: 'app-nav-system',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-system.html',
  styleUrls: ['./nav-system.scss']
})
export class NavSystem implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const allProducts = this.productService.getAllProducts();
    this.products = allProducts.map(product => {
      const categoryRatings = this.productService.getAverageCategoryRatings(product.id);
      
      return {
        id: product.id,
        name: product.name,
        manufacturer: product.manufacturer,
        category: product.category,
        image: product.image,
        shortDescription: product.description.substring(0, 150) + '...',
        averageRating: categoryRatings.overall,
        reviewCount: categoryRatings.count
      };
    });
  }  getStarFillPercentage(starPosition: number, rating: number): number {
    if (rating >= starPosition) {
      return 100;
    } else if (rating > starPosition - 1) {
      return (rating - (starPosition - 1)) * 100;
    } else {
      return 0;
    }
  }
}