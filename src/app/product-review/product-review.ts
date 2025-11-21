// product-review.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, CategoryRatings, Review } from '../product.service';
import { GeminiService } from '../gemini.service';

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
  displayedReviews: Review[] = [];
  categoryRatings: CategoryRatings & { overall: number, count: number } = {
    transportability: 0,
    easeOfUse: 0,
    interoperability: 0,
    detection: 0,
    reliability: 0,
    overall: 0,
    count: 0
  };
  reviewSummary: string = '';
  isGeneratingSummary: boolean = false;
  showSummary: boolean = false;
  reviewsToShow: number = 5;
  
  // Review form properties
  showReviewForm: boolean = false;
  isGeneratingReview: boolean = false;
  newReview: {
    author: string;
    milService: string;
    role: string;
    categoryRatings: {
      transportability: number;
      easeOfUse: number;
      interoperability: number;
      detection: number;
      reliability: number;
    };
    additionalComments: {
      transportability: string;
      easeOfUse: string;
      interoperability: string;
      detection: string;
      reliability: string;
    };
    otherUASSystems: string;
  } = {
    author: '',
    milService: '',
    role: '',
    categoryRatings: {
      transportability: 3,
      easeOfUse: 3,
      interoperability: 3,
      detection: 3,
      reliability: 3
    },
    additionalComments: {
      transportability: '',
      easeOfUse: '',
      interoperability: '',
      detection: '',
      reliability: ''
    },
    otherUASSystems: ''
  };
  
  Math = Math;

  obfuscateName(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length === 0) return 'Anonymous';
    
    // Show first initial and last initial with asterisks in between
    if (parts.length === 1) {
      return parts[0][0] + '***';
    }
    
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    
    return `${firstName[0]}${'*'.repeat(firstName.length - 1)} ${lastName[0]}${'*'.repeat(lastName.length - 1)}`;
  }

  async generateReviewSummary(): Promise<void> {
    if (this.categoryRatings.count === 0) {
      this.reviewSummary = 'No reviews available for this product yet.';
      this.showSummary = true;
      return;
    }

    this.isGeneratingSummary = true;

    try {
      this.reviewSummary = await this.geminiService.generateReviewSummary(this.product!.name, this.reviews);
    } catch (error) {
      this.reviewSummary = 'Unable to generate summary. Please check your API key configuration.';
      console.error('Error generating summary:', error);
    } finally {
      this.isGeneratingSummary = false;
      this.showSummary = true;
    }
  }

  toggleSummary(): void {
    this.showSummary = !this.showSummary;
  }

  loadMoreReviews(): void {
    this.reviewsToShow += 5;
    this.updateDisplayedReviews();
  }

  hasMoreReviews(): boolean {
    return this.displayedReviews.length < this.reviews.length;
  }

  private updateDisplayedReviews(): void {
    this.displayedReviews = this.reviews.slice(0, this.reviewsToShow);
  }

  // Review form methods
  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.resetReviewForm();
    }
  }

  async generateAIReview(): Promise<void> {
    if (!this.product) return;

    this.isGeneratingReview = true;

    try {
      const prompt = `Generate a detailed review for the ${this.product.name} counter-UAS system. 
      Focus on these categories: Transportability & Mobility, Ease of Use, Interoperability, Detection & Effectiveness, System Reliability.
      Provide specific, realistic feedback that a military operator might give based on actual system characteristics.
      Include both ratings (1-5 scale) and detailed comments for each category.
      Also suggest what other UAS systems this user might have experience with.
      
      Format the response as a JSON object with this structure:
      {
        "categoryRatings": {
          "transportability": number (1-5),
          "easeOfUse": number (1-5),
          "interoperability": number (1-5),
          "detection": number (1-5),
          "reliability": number (1-5)
        },
        "additionalComments": {
          "transportability": "detailed comment",
          "easeOfUse": "detailed comment",
          "interoperability": "detailed comment",
          "detection": "detailed comment",
          "reliability": "detailed comment"
        },
        "otherUASSystems": "list of other systems"
      }`;

      const aiResponse = await this.geminiService.generateCustomReview(prompt);
      
      // Parse the AI response and update the form
      try {
        const parsedResponse = JSON.parse(aiResponse);
        this.newReview.categoryRatings = parsedResponse.categoryRatings;
        this.newReview.additionalComments = parsedResponse.additionalComments;
        this.newReview.otherUASSystems = parsedResponse.otherUASSystems;
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback: show the raw response in comments
        this.newReview.additionalComments.transportability = aiResponse;
      }
    } catch (error) {
      console.error('Error generating AI review:', error);
      this.newReview.additionalComments.transportability = 'Unable to generate AI review. Please fill out the form manually.';
    } finally {
      this.isGeneratingReview = false;
    }
  }

  submitReview(): void {
    if (!this.product || !this.newReview.author.trim()) {
      alert('Please enter your name to submit a review.');
      return;
    }

    // Generate a unique ID for the review
    const reviewId = Date.now() + Math.random();

    const review: Review = {
      id: reviewId,
      ...this.newReview,
      date: new Date().toLocaleDateString(),
      author: this.newReview.author.trim(),
      milService: this.newReview.milService || 'Unknown',
      role: this.newReview.role || 'Operator'
    };

    // Add the review to the product's reviews
    this.productService.addReview(this.product.id, review);
    
    // Refresh the data
    this.categoryRatings = this.productService.getAverageCategoryRatings(this.product.id);
    this.reviews = this.productService.getReviewsForProduct(this.product.id);
    this.updateDisplayedReviews();
    
    // Reset and hide form
    this.resetReviewForm();
    this.showReviewForm = false;
    
    alert('Thank you for your review! It has been submitted successfully.');
  }

  private resetReviewForm(): void {
    this.newReview = {
      author: '',
      milService: '',
      role: '',
      categoryRatings: {
        transportability: 3,
        easeOfUse: 3,
        interoperability: 3,
        detection: 3,
        reliability: 3
      },
      additionalComments: {
        transportability: '',
        easeOfUse: '',
        interoperability: '',
        detection: '',
        reliability: ''
      },
      otherUASSystems: ''
    };
    this.isGeneratingReview = false;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private geminiService: GeminiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.product = this.productService.getProductById(productId);
      
      if (!this.product) {
        this.router.navigate(['/']);
        return;
      }
      
      this.categoryRatings = this.productService.getAverageCategoryRatings(productId);
      this.reviews = this.productService.getReviewsForProduct(productId);
      this.updateDisplayedReviews();
    });
  }
}