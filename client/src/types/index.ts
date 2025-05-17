// User types
export type UserType = 'client' | 'admin';

export interface User {
  id: number;
  name: string;
  initials: string;
  email: string;
  password: string;
  type: UserType;
  balance: number;
}

// Product types
export type ProductCategory = 'proxy' | 'perfil' | 'bm' | 'all';
export type ProductType = 'proxy' | 'perfil' | 'bm' | 'pagina' | 'contingencia' | 'outro';
export type ProductTag = 'popular' | 'promocao' | 'alta_demanda' | 'novo' | 'none';
export type ProductStatus = 'active' | 'inactive' | 'internal_stock';

export interface ProductContent {
  id: number;
  productId: number;
  type: 'file' | 'link';
  content: string;
  fileName?: string;
  fileType?: string;
  isAvailable: boolean;
  soldAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  productCount: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  productType: ProductType;
  tags: string[];
  period: string;
  stock?: number;
  soldToday?: number;
  temperature?: number;
  isPopular?: boolean;
  isLowStock?: boolean;
  status: ProductStatus;
  contents?: ProductContent[];
  dateCreated: string;
  dateModified: string;
}

// Subscription types
export type SubscriptionStatus = 'active' | 'expired' | 'pending_renewal' | 'canceled';

export interface Subscription {
  id: number;
  productId: number;
  productTitle: string;
  status: SubscriptionStatus;
  icon: string;
  details: {
    ip?: string;
    id?: string;
    expirationDate: string;
  };
}

// Proxy types
export type ProxyStatus = 'active' | 'expired' | 'cancelled';

export interface Proxy {
  id: number;
  ipAddress: string;
  port: string;
  username: string;
  password: string;
  profileName: string;
  status: ProxyStatus;
  expirationDate: string;
  autoRenewal: boolean;
  note?: string;
}

// Tutorial types
export interface TutorialCategory {
  id: number;
  name: string;
}

export interface Tutorial {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  link: string;
  category: number;
  year: string;
  featured?: boolean;
}

// Banner types
export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  link: string;
}

// Order types
export type OrderStatus = 'completed' | 'pending' | 'failed' | 'canceled';

export interface Order {
  id: number;
  userId: number;
  userName: string;
  userEmail?: string;
  userInitials: string;
  productTitle: string;
  status: OrderStatus;
  price: number;
  quantity?: number;
  discount?: number;
  invoiceNumber?: string;
  date: string;
  contents?: ProductContent[];
}

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationAction {
  text: string;
  link: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  primaryAction: NotificationAction;
  secondaryAction: NotificationAction;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userType: UserType | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

// Theme types
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Notification context types
export interface NotificationContextType {
  activeNotification: Notification | null;
  showNotification: (id: number) => void;
  dismissNotification: () => void;
  notifications: Notification[];
}

// Glassmorphism hook return type
export interface GlassmorphismStyles {
  className: string;
  style: React.CSSProperties;
}
