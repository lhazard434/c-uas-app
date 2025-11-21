import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../product.service';
import { ClickOutsideDirective } from '../click-outside.directive';

interface ReviewCategory {
  id: string;
  title: string;
  description: string;
  rating: number;
  comment: string;
  notApplicable: boolean;
}

@Component({
  selector: 'app-review-system',
  imports: [CommonModule, FormsModule, RouterModule, ClickOutsideDirective],
  templateUrl: './review-system.html',
  styleUrl: './review-system.scss',
})
export class ReviewSystem implements OnInit {
  // Available products
  availableProducts: Product[] = [];
  // Form state
  currentStep: 'intro' | 'review' | 'complete' = 'intro';
  
  // System being reviewed
  systemName: string = '';
  isProductPageReview: boolean = false;
  
  // Operator experience
  cuasExperience: string = '';
  previousSystems: string = '';
  
  // Additional feedback
  additionalFeedback: string = '';
  
  // UI State
  showProductDropdown: boolean = false;
  
  // Review categories
  categories: ReviewCategory[] = [
    {
      id: 'transportability',
      title: 'Transportability & Mobility',
      description: 'Ease of deployment, movement, and setup in various operational environments',
      rating: 0,
      comment: '',
      notApplicable: false
    },
    {
      id: 'ease_of_use',
      title: 'Ease of Use',
      description: 'User interface intuitiveness, training requirements, and operator-friendliness',
      rating: 0,
      comment: '',
      notApplicable: false
    },
    {
      id: 'interoperability',
      title: 'Interoperability',
      description: 'Integration capability with existing command and control systems',
      rating: 0,
      comment: '',
      notApplicable: false
    },
    {
      id: 'detection_effectiveness',
      title: 'Detection & Effectiveness',
      description: 'Range, accuracy, and reliability in identifying and responding to threats',
      rating: 0,
      comment: '',
      notApplicable: false
    },
    {
      id: 'reliability',
      title: 'System Reliability',
      description: 'Consistency of performance and uptime in operational conditions',
      rating: 0,
      comment: '',
      notApplicable: false
    }
  ];
  
  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    this.availableProducts = this.productService.getAllProducts();
  }
  
  // Product selection methods
  selectProduct(product: Product): void {
    this.systemName = product.name;
    this.showProductDropdown = false;
  }
  
  toggleProductDropdown(): void {
    this.showProductDropdown = !this.showProductDropdown;
  }
  
  get filteredProducts(): Product[] {
    if (!this.systemName) {
      return this.availableProducts;
    }
    const searchTerm = this.systemName.toLowerCase();
    return this.availableProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.manufacturer.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  }
  
  // Validation
  get canProceedToReview(): boolean {
    if (this.isProductPageReview) {
      return true; // System name is pre-filled
    }
    return this.systemName.trim().length > 0;
  }
  
  get canSubmitReview(): boolean {
    const allRatingsComplete = this.categories.every(cat => cat.rating > 0 || cat.notApplicable);
    const experienceComplete = this.cuasExperience;
    return allRatingsComplete && !!experienceComplete;
  }
  
  // Navigation methods
  startReview(): void {
    if (this.canProceedToReview) {
      this.currentStep = 'review';
    }
  }
  
  submitReview(): void {
    if (this.canSubmitReview) {
      // In production, this would send to backend
      console.log('Review submitted:', {
        systemName: this.systemName,
        experience: {
          cuasExperience: this.cuasExperience,
          previousSystems: this.previousSystems
        },
        ratings: this.categories,
        additionalFeedback: this.additionalFeedback
      });
      
      this.currentStep = 'complete';
    }
  }
  
  // Star rating helper
  setRating(category: ReviewCategory, rating: number): void {
    category.rating = rating;
    category.notApplicable = false; // Clear N/A if they rate
  }
  
  // Toggle N/A
  toggleNotApplicable(category: ReviewCategory): void {
    category.notApplicable = !category.notApplicable;
    if (category.notApplicable) {
      category.rating = 0; // Clear rating if N/A is selected
    }
  }
  
  // Initialize with product name if coming from product page
  initializeWithProduct(productName: string): void {
    this.systemName = productName;
    this.isProductPageReview = true;
  }
}