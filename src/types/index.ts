export type UserRole = 'buyer' | 'seller' | 'admin';
export type AnimalType = 'sheep' | 'camel' | 'cow' | 'goat';
export type DeliveryType = 'live' | 'slaughtered' | 'cut';
export type SlaughterType = 'full' | 'half';
export type FeedType = 'natural' | 'certified' | 'mixed';
export type OrderStatus =
  | 'pending' | 'accepted' | 'rejected' | 'in_progress'
  | 'seal_1' | 'seal_2' | 'seal_3' | 'seal_4'
  | 'delivered' | 'completed' | 'cancelled' | 'disputed';

export interface User {
  id: string;
  phone: string;
  name?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Farm {
  id: string;
  owner_id: string;
  name: string;
  region?: string;
  location_text?: string;
  bio?: string;
  feed_type?: FeedType;
  vet_cert_url?: string;
  is_verified: boolean;
  is_active: boolean;
  avg_rating: number;
  total_reviews: number;
  total_orders: number;
  created_at: string;
}

export interface Animal {
  id: string;
  farm_id: string;
  farm?: Farm;
  type: AnimalType;
  breed?: string;
  live_weight_kg: number;
  net_weight_estimate_kg?: number;
  price_sar: number;
  slaughter_options: DeliveryType[];
  feed_type?: FeedType;
  images?: string[];
  is_available: boolean;
  is_reserved: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  animal_id: string;
  farm_id: string;
  animal?: Animal;
  farm?: Farm;
  delivery_type: DeliveryType;
  slaughter_type?: SlaughterType;
  delivery_address?: string;
  delivery_date?: string;
  delivery_time_slot?: string;
  status: OrderStatus;
  subtotal_sar: number;
  service_fee_sar: number;
  total_sar: number;
  payment_status: string;
  acceptance_deadline?: string;
  created_at: string;
  seal_stages?: SealStage[];
}

export interface SealStage {
  id: string;
  order_id: string;
  stage: 1 | 2 | 3 | 4;
  image_url?: string;
  message?: string;
  uploaded_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  farm_id: string;
  weight_score: number;
  quality_score: number;
  cleanliness_score: number;
  delivery_score: number;
  avg_score: number;
  comment?: string;
  created_at: string;
}

export interface BrowseFilters {
  type?: AnimalType;
  sizeTag?: 'small' | 'mid' | 'large';
  sortBy?: 'rating' | 'price' | 'delivery';
}
