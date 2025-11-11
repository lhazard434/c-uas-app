// product.service.ts
import { Injectable } from '@angular/core';

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

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Roadrunner-M',
      manufacturer: 'Anduril Industries',
      category: 'Air Defense Interceptor',
      price: 'Contact for Pricing',
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
    },
    {
      id: 2,
      name: 'DroneBuster',
      manufacturer: 'DZYNE Technologies',
      category: 'Counter-UAS System',
      price: 'Contact for Pricing',
      image: 'https://dzyne.com/wp-content/uploads/2025/10/9.2025-CMG-Dzyne-WR-105-1536x1024.jpg',
      description: 'Combat-proven, handheld Counter-UAS system with more than 2,500 units deployed worldwide. Designed for soldier-level defense, it enables operators to detect, identify, and defeat hostile drones in real time. As the only American-made handheld C-sUAS with optional PNT Attack (GNSS spoofing), DroneBuster delivers unmatched tactical flexibility for U.S. and allied forces.',
      specifications: [
        'Handheld, portable design for individual operators',
        'Detection range up to 7 km across 400 MHz–6 GHz',
        'AI/ML-powered drone identification',
        'Continuously updated drone library',
        'PNT Attack (GNSS spoofing) capability',
        'Remote ID & Aeroscope integration',
        'Haptic, aural, and visual alerts',
        'Built-in LCD display',
        'Omnidirectional antennas',
        '2,500+ units deployed globally'
      ]
    },
    {
      id: 3,
      name: 'Beast+',
      manufacturer: 'CACI International',
      category: 'Multi-Channel SIGINT Receiver',
      price: 'Contact for Pricing',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs6q3tqBaE1JmdZYa1453TR6_rqkFla2hNHQ&s',
      description: 'Dismount multi-channel receiver that builds upon the battle-proven Beast platform with the addition of a third receive channel and transmit capabilities. Supports detection, direction finding (DF), and electronic attack of adversary signals. This multi-function device performs survey, drive test, and surveillance of multiple push-to-talk and cellular protocols.',
      specifications: [
        '3 simultaneous receive channels (500 kHz – 6 GHz)',
        '16 simultaneous demodulators',
        '80 MHz instantaneous bandwidth per channel',
        'Electronic attack (EA) capabilities',
        'Dedicated transmit port for jamming',
        'Rugged design (MIL-STD-810G)',
        '~8 hour battery life',
        'Weight: <4.0 lbs with battery',
        'ATAK integration via Reaper plug-in',
        'Compatible with PRC-148/152 and 2590/5590 batteries'
      ]
    }
  ];

  private reviews: { [productId: number]: Review[] } = {
    1: [
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
    ],
    2: [
      {
        id: 1,
        author: 'John Martinez',
        rating: 5,
        date: '2024-11-01',
        title: 'Best Counter-UAS on the market',
        comment: 'Deployed this in the field and it performed flawlessly. The PNT spoofing capability is a game changer. Highly recommended.'
      },
      {
        id: 2,
        author: 'Emily Rodriguez',
        rating: 5,
        date: '2024-10-28',
        title: 'Intuitive and effective',
        comment: 'Easy to use even under pressure. The AI identification is incredibly accurate and the range is impressive.'
      },
      {
        id: 3,
        author: 'David Thompson',
        rating: 4,
        date: '2024-10-20',
        title: 'Solid performer',
        comment: 'Works great for our needs. Battery life could be better but overall a very reliable system.'
      }
    ],
    3: [
      {
        id: 1,
        author: 'Robert Williams',
        rating: 5,
        date: '2024-11-05',
        title: 'Unmatched SIGINT capability',
        comment: 'The three channels make all the difference. Being able to intercept and DF simultaneously is exactly what we needed.'
      },
      {
        id: 2,
        author: 'Lisa Anderson',
        rating: 5,
        date: '2024-10-25',
        title: 'Professional grade equipment',
        comment: 'ATAK integration works seamlessly. The rugged build has held up perfectly in harsh conditions.'
      },
      {
        id: 3,
        author: 'James Brown',
        rating: 4,
        date: '2024-10-18',
        title: 'Very capable system',
        comment: 'Impressive frequency coverage and the EA capabilities are powerful. Learning curve is moderate but worth it.'
      }
    ]
  };

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getReviewsForProduct(productId: number): Review[] {
    return this.reviews[productId] || [];
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
}