import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../product.service';

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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    const allProducts = this.productService.getAllProducts();
    this.products = allProducts.map(product => {
      const reviews = this.productService.getReviewsForProduct(product.id);
      const averageRating = reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0;
      
      return {
        id: product.id,
        name: product.name,
        manufacturer: product.manufacturer,
        category: product.category,
        image: product.image,
        shortDescription: product.description.substring(0, 150) + '...',
        averageRating: averageRating,
        reviewCount: reviews.length
      };
    });
  }

  getStarFillPercentage(starPosition: number, rating: number): number {
    if (rating >= starPosition) {
      return 100;
    } else if (rating > starPosition - 1) {
      return (rating - (starPosition - 1)) * 100;
    } else {
      return 0;
    }
  }
}