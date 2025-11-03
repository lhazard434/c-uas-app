import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-review.html',
  styleUrls: ['./product-review.scss']
})
export class ProductReviewComponent {
  product = {
  name: 'Roadrunner-M',
  manufacturer: 'Anduril Industries',
  category: 'Counter-UAS / Air Defense System',
  price: '200,000',
  image: 'https://cdn.sanity.io/images/z5s3oquj/production/cb086dde298ee0705a8a4afad32741324e8997cf-1075x1433.jpg?auto=format&fit=max&w=640&q=90',
  description: 'Revolutionary recoverable ground-based air defense interceptor. Twin-jet powered VTOL autonomous air vehicle capable of high subsonic speeds and high-G maneuvers. Features a high-explosive warhead for destroying aerial threats including UAS, cruise missiles, and low-flying aircraft. Uniquely reusable - can return to base, land vertically, refuel, and relaunch in minutes if not deployed against a target.',
  specifications: [
    'VTOL (Vertical Take-Off and Landing) capability',
    'Twin turbojet engines with thrust vectoring',
    'High subsonic speed capability',
    'Approximately 6 feet (1.5m) in length',
    'High-G force maneuvering',
    'Autonomous target tracking and interception',
    'Lands on four flip-down outriggers',
    'Quick refuel and relaunch (minutes, not hours)',
    'Integrated with Lattice AI command and control',
    'Compatible with existing air defense architectures'
  ]
};

  reviews: Review[] = [
    {
      id: 1,
      author: 'Sarah Johnson',
      rating: 5,
      date: '2024-10-15',
      title: 'Excellent quality!',
      comment: 'This product exceeded my expectations. The build quality is fantastic and it works exactly as described.'
    },
    {
      id: 2,
      author: 'Mike Chen',
      rating: 4,
      date: '2024-10-10',
      title: 'Great value for money',
      comment: 'Very satisfied with this purchase. Does everything I need it to do. Only minor issue is the setup instructions could be clearer.'
    }
  ];

  newReview = {
    author: '',
    rating: 5,
    title: '',
    comment: ''
  };

  hoveredRating = 0;

  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  handleSubmitReview(): void {
    const review: Review = {
      id: this.reviews.length + 1,
      ...this.newReview,
      date: new Date().toISOString().split('T')[0]
    };
    this.reviews.unshift(review);
    this.newReview = {
      author: '',
      rating: 5,
      title: '',
      comment: ''
    };
  }
}