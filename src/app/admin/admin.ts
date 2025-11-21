// admin.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product, CategoryRatings } from '../product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit {
  activeTab: 'dashboard' | 'view-products' | 'add-product' = 'dashboard';
  
  // Statistics data
  totalProducts = 0;
  totalReviews = 0;
  reviewsByBranch: { [branch: string]: number } = {};
  reviewsByRole: { [role: string]: number } = {};
  averageRatings: CategoryRatings = {
    transportability: 0,
    easeOfUse: 0,
    interoperability: 0,
    detection: 0,
    reliability: 0
  };
  recentReviews: any[] = [];
  filteredWords: { word: string, count: number }[] = [];
  
  // Real-time traffic simulation
  currentVisitors = 0;
  todayVisitors = 0;
  weeklyVisitors = 0;
  
  // Products data
  products: Product[] = [];
  
  // Product form data
  product: Partial<Product> = {
    name: '',
    manufacturer: '',
    category: '',
    price: '',
    image: '',
    description: '',
    specifications: []
  };

  newSpecification = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.simulateTraffic();
    
    // Check for tab query parameter
    this.route.queryParams.subscribe(params => {
      if (params['tab'] && ['dashboard', 'view-products', 'add-product'].includes(params['tab'])) {
        this.activeTab = params['tab'] as 'dashboard' | 'view-products' | 'add-product';
      }
    });
  }

  loadStatistics(): void {
    this.totalProducts = this.productService.getTotalProducts();
    this.totalReviews = this.productService.getTotalReviews();
    this.reviewsByBranch = this.productService.getReviewsByServiceBranch();
    this.reviewsByRole = this.productService.getReviewsByRole();
    this.averageRatings = this.productService.getAverageRatingByCategory();
    this.recentReviews = this.productService.getRecentReviews(5);
    this.filteredWords = this.productService.getFilteredWords();
    this.products = this.productService.getAllProducts();
  }

  simulateTraffic(): void {
    // Simulate real-time traffic
    this.currentVisitors = Math.floor(Math.random() * 50) + 10;
    this.todayVisitors = Math.floor(Math.random() * 500) + 200;
    this.weeklyVisitors = Math.floor(Math.random() * 3000) + 1000;
    
    // Update every 30 seconds
    setInterval(() => {
      this.currentVisitors = Math.floor(Math.random() * 50) + 10;
      this.todayVisitors += Math.floor(Math.random() * 10);
      this.weeklyVisitors += Math.floor(Math.random() * 50);
    }, 30000);
  }

  switchTab(tab: 'dashboard' | 'view-products' | 'add-product'): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
    
    // Clear query parameters when switching tabs manually
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
  }

  addSpecification(): void {
    if (this.newSpecification.trim()) {
      if (!this.product.specifications) {
        this.product.specifications = [];
      }
      this.product.specifications.push(this.newSpecification.trim());
      this.newSpecification = '';
    }
  }

  removeSpecification(index: number): void {
    this.product.specifications?.splice(index, 1);
  }

  onSubmit(): void {
    // Validate required fields
    if (!this.product.name || !this.product.manufacturer || !this.product.category || 
        !this.product.price || !this.product.description) {
      this.errorMessage = 'Please fill in all required fields';
      this.successMessage = '';
      return;
    }

    try {
      this.productService.addProduct(this.product as Product);
      this.successMessage = 'Product added successfully!';
      this.errorMessage = '';
      
      // Reset form
      this.product = {
        name: '',
        manufacturer: '',
        category: '',
        price: '',
        image: '',
        description: '',
        specifications: []
      };
      this.newSpecification = '';

      // Redirect to products page after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } catch (error) {
      this.errorMessage = 'Error adding product. Please try again.';
      this.successMessage = '';
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
