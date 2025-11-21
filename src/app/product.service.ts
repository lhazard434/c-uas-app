// product.service.ts
import { Injectable } from '@angular/core';
import productsData from '../assets/data/products.json';

export interface Product {
  id: number;
  name: string;
  manufacturer: string;
  category: string;
  price: string;
  image: string;
  description: string;
  specifications: string[];
}

export interface CategoryRatings {
  transportability: number;
  easeOfUse: number;
  interoperability: number;
  detection: number;
  reliability: number;
}

export interface Review {
  id: number;
  author: string;
  milService: string;
  role: string;
  otherUASSystems?: string;
  categoryRatings: CategoryRatings;
  additionalComments: {
    transportability?: string;
    easeOfUse?: string;
    interoperability?: string;
    detection?: string;
    reliability?: string;
  };
  date: string;
}

interface ProductData {
  products: Product[];
  reviews: { [key: string]: Review[] };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[];
  private reviews: { [productId: number]: Review[] };

  constructor() {
    const data = productsData as ProductData;
    this.products = data.products;
    // Convert string keys to number keys for reviews
    this.reviews = Object.keys(data.reviews).reduce((acc, key) => {
      acc[Number(key)] = data.reviews[key];
      return acc;
    }, {} as { [productId: number]: Review[] });
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getReviewsForProduct(productId: number): Review[] {
    return this.reviews[productId] || [];
  }

  getAverageCategoryRatings(productId: number): CategoryRatings & { overall: number, count: number } {
    const reviews = this.getReviewsForProduct(productId);
    if (reviews.length === 0) {
      return {
        transportability: 0,
        easeOfUse: 0,
        interoperability: 0,
        detection: 0,
        reliability: 0,
        overall: 0,
        count: 0
      };
    }

    const totals = reviews.reduce((acc, review) => {
      acc.transportability += review.categoryRatings.transportability;
      acc.easeOfUse += review.categoryRatings.easeOfUse;
      acc.interoperability += review.categoryRatings.interoperability;
      acc.detection += review.categoryRatings.detection;
      acc.reliability += review.categoryRatings.reliability;
      return acc;
    }, {
      transportability: 0,
      easeOfUse: 0,
      interoperability: 0,
      detection: 0,
      reliability: 0
    });

    const count = reviews.length;
    const averages = {
      transportability: Math.round((totals.transportability / count) * 10) / 10,
      easeOfUse: Math.round((totals.easeOfUse / count) * 10) / 10,
      interoperability: Math.round((totals.interoperability / count) * 10) / 10,
      detection: Math.round((totals.detection / count) * 10) / 10,
      reliability: Math.round((totals.reliability / count) * 10) / 10,
      overall: 0,
      count: count
    };

    averages.overall = Math.round(((averages.transportability + averages.easeOfUse + averages.interoperability + averages.detection + averages.reliability) / 5) * 10) / 10;

    return averages;
  }

  addReview(productId: number, review: Review): void {
    if (!this.reviews[productId]) {
      this.reviews[productId] = [];
    }
    this.reviews[productId].unshift(review);
  }

  getAllProducts(): Product[] {
    return this.products;
  }

  // Statistics methods
  getTotalReviews(): number {
    return Object.values(this.reviews).reduce((total, productReviews) => total + productReviews.length, 0);
  }

  getTotalProducts(): number {
    return this.products.length;
  }

  getReviewsByServiceBranch(): { [branch: string]: number } {
    const branchStats: { [branch: string]: number } = {};
    
    Object.values(this.reviews).forEach(productReviews => {
      productReviews.forEach(review => {
        const branch = review.milService;
        branchStats[branch] = (branchStats[branch] || 0) + 1;
      });
    });
    
    return branchStats;
  }

  getReviewsByRole(): { [role: string]: number } {
    const roleStats: { [role: string]: number } = {};
    
    Object.values(this.reviews).forEach(productReviews => {
      productReviews.forEach(review => {
        const role = review.role;
        roleStats[role] = (roleStats[role] || 0) + 1;
      });
    });
    
    return roleStats;
  }

  getAverageRatingByCategory(): CategoryRatings {
    const allReviews = Object.values(this.reviews).flat();
    if (allReviews.length === 0) {
      return {
        transportability: 0,
        easeOfUse: 0,
        interoperability: 0,
        detection: 0,
        reliability: 0
      };
    }

    const totals = allReviews.reduce((acc, review) => {
      acc.transportability += review.categoryRatings.transportability;
      acc.easeOfUse += review.categoryRatings.easeOfUse;
      acc.interoperability += review.categoryRatings.interoperability;
      acc.detection += review.categoryRatings.detection;
      acc.reliability += review.categoryRatings.reliability;
      return acc;
    }, {
      transportability: 0,
      easeOfUse: 0,
      interoperability: 0,
      detection: 0,
      reliability: 0
    });

    return {
      transportability: Math.round((totals.transportability / allReviews.length) * 10) / 10,
      easeOfUse: Math.round((totals.easeOfUse / allReviews.length) * 10) / 10,
      interoperability: Math.round((totals.interoperability / allReviews.length) * 10) / 10,
      detection: Math.round((totals.detection / allReviews.length) * 10) / 10,
      reliability: Math.round((totals.reliability / allReviews.length) * 10) / 10
    };
  }

  getRecentReviews(limit: number = 10): Review[] {
    const allReviews: Review[] = [];
    
    Object.entries(this.reviews).forEach(([productId, productReviews]) => {
      productReviews.forEach(review => {
        allReviews.push({
          ...review,
          productId: Number(productId),
          productName: this.getProductById(Number(productId))?.name || 'Unknown Product'
        } as Review & { productId: number, productName: string });
      });
    });
    
    return allReviews
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  getFilteredWords(): { word: string, count: number }[] {
    const wordCounts: { [word: string]: number } = {};
    const filteredWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'an', 'a', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'whose', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could'];

    Object.values(this.reviews).forEach(productReviews => {
      productReviews.forEach(review => {
        // Check additional comments
        Object.values(review.additionalComments).forEach(comment => {
          if (comment) {
            const words = comment.toLowerCase().split(/\s+/);
            words.forEach(word => {
              const cleanWord = word.replace(/[^\w]/g, '');
              if (cleanWord.length > 2 && !filteredWords.includes(cleanWord)) {
                wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
              }
            });
          }
        });
      });
    });

    return Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  addProduct(product: Partial<Product>): void {
    // Generate a new ID based on the highest existing ID
    const maxId = this.products.length > 0 
      ? Math.max(...this.products.map(p => p.id)) 
      : 0;
    
    const newProduct: Product = {
      id: maxId + 1,
      name: product.name || '',
      manufacturer: product.manufacturer || '',
      category: product.category || '',
      price: product.price || '',
      image: product.image || '',
      description: product.description || '',
      specifications: product.specifications || []
    };

    this.products.push(newProduct);
    
    // Note: In a real application, this would make an API call to save to the backend
    // For now, the product will be available in memory until the page is refreshed
    console.log('Product added successfully:', newProduct);
  }
}