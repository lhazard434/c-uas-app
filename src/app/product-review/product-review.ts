// product-review.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, Review } from '../product.service';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-review.html',
  styleUrls: ['./product-review.scss']
})
export class ProductReviewComponent implements OnInit {
  product: Product | undefined;
  reviews: Review[] = [];
  Math = Math;
  
  newReview = {
    author: '',
    rating: 5,
    title: '',
    comment: ''
  };

  hoveredRating = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.product = this.productService.getProductById(productId);
      
      if (!this.product) {
        this.router.navigate(['/']);
        return;
      }
      
      this.reviews = this.productService.getReviewsForProduct(productId);
    });
  }

  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  handleSubmitReview(): void {
    if (!this.product) return;
    
    const review: Review = {
      id: this.reviews.length + 1,
      ...this.newReview,
      date: new Date().toISOString().split('T')[0]
    };
    
    this.productService.addReview(this.product.id, review);
    this.reviews = this.productService.getReviewsForProduct(this.product.id);
    
    this.newReview = {
      author: '',
      rating: 5,
      title: '',
      comment: ''
    };
  }
}