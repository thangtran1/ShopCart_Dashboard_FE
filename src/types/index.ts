export interface Image {
  asset: {
    url: string;
  };
}

export interface Slug {
  current: string;
}

export interface Category {
  _id: string;
  _ref?: string;
  name: string;
  slug: Slug;
  description?: string;
  productCount?: number;
  image?: Image;
}

export interface Brand {
  _id: string;
  _ref?: string;
  name: string;
  slug: Slug;
  description?: string;
  image?: Image;
}

export interface Product {
  _id: string;
  name: string;
  slug: Slug;
  price: number;
  discount?: number;
  description?: string;
  image?: string;
  images?: Image[];
  category?: Category;
  brand?: Brand;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  specifications?: string[];
}

export interface Author {
  name: string;
  image?: Image;
}

export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string
  notes: string
  fullName: string
}

export interface Order {
  _id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddress;
  notes?: string;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  orderDate: string;
  items: OrderItem[];
  createdAt?: string
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  image: string;
  _id: string;
  name: string;
}
