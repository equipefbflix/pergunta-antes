import { Product, Subscription, Tutorial, Order, User, Banner, Notification, Category, ProductContent, Proxy } from '@/types';

// Mock Users
export const users: User[] = [
  {
    id: 1,
    name: 'João Silva',
    initials: 'JS',
    email: 'cliente@example.com',
    password: 'senha123',
    type: 'client',
    balance: 150.00,
  },
  {
    id: 2,
    name: 'Admin User',
    initials: 'AU',
    email: 'admin@example.com',
    password: 'admin123',
    type: 'admin',
    balance: 0,
  }
];

// Categorias de produtos
export const categories: Category[] = [
  {
    id: 1,
    name: 'Proxy',
    description: 'Proxies dedicados para uso em campanhas',
    productCount: 2
  },
  {
    id: 2,
    name: 'Perfil',
    description: 'Contas e perfis verificados',
    productCount: 2
  },
  {
    id: 3,
    name: 'BM',
    description: 'Business Managers com diferentes limites',
    productCount: 1
  },
  {
    id: 4,
    name: 'Páginas',
    description: 'Páginas verificadas e com histórico',
    productCount: 0
  },
  {
    id: 5,
    name: 'Contingência',
    description: 'Planos de recuperação e contingência',
    productCount: 0
  }
];

// Conteúdos dos produtos
export const productContents: ProductContent[] = [
  // Proxy Premium
  { id: 1, productId: 1, type: 'file', content: '45.123.45.67:8080:user:pass', fileName: 'proxy1.txt', fileType: 'text/plain', isAvailable: true },
  { id: 2, productId: 1, type: 'file', content: '72.234.21.45:8080:user:pass', fileName: 'proxy2.txt', fileType: 'text/plain', isAvailable: true },
  { id: 3, productId: 1, type: 'file', content: '92.118.39.25:8080:user:pass', fileName: 'proxy3.txt', fileType: 'text/plain', isAvailable: true },
  { id: 4, productId: 1, type: 'file', content: '103.245.67.189:8080:user:pass', fileName: 'proxy4.txt', fileType: 'text/plain', isAvailable: false, soldAt: '2023-05-12T15:30:00' },
  
  // Proxy Compartilhado (estoque interno)
  { id: 5, productId: 4, type: 'file', content: '187.123.45.67:8080:user:pass', fileName: 'proxy_shared1.txt', fileType: 'text/plain', isAvailable: true },
  { id: 6, productId: 4, type: 'file', content: '187.123.45.68:8080:user:pass', fileName: 'proxy_shared2.txt', fileType: 'text/plain', isAvailable: true },
  
  // Perfil Verificado
  { id: 7, productId: 2, type: 'file', content: 'email:senha:2fa_backup', fileName: 'perfil1.txt', fileType: 'text/plain', isAvailable: true },
  { id: 8, productId: 2, type: 'file', content: 'email:senha:2fa_backup', fileName: 'perfil2.txt', fileType: 'text/plain', isAvailable: true },
  { id: 9, productId: 2, type: 'file', content: 'email:senha:2fa_backup', fileName: 'perfil3.txt', fileType: 'text/plain', isAvailable: false, soldAt: '2023-05-13T10:15:00' },
  
  // Perfil Novo (estoque interno)
  { id: 10, productId: 5, type: 'file', content: 'email:senha:backup', fileName: 'perfil_novo1.txt', fileType: 'text/plain', isAvailable: true },
  { id: 11, productId: 5, type: 'file', content: 'email:senha:backup', fileName: 'perfil_novo2.txt', fileType: 'text/plain', isAvailable: true },
  
  // Business Manager
  { id: 12, productId: 3, type: 'link', content: 'https://business.facebook.com/business_locations/?business_id=1234567890', isAvailable: true },
  { id: 13, productId: 3, type: 'link', content: 'https://business.facebook.com/business_locations/?business_id=0987654321', isAvailable: true },
  { id: 14, productId: 3, type: 'link', content: 'https://business.facebook.com/business_locations/?business_id=5678901234', isAvailable: false, soldAt: '2023-05-14T09:20:00' },
];

// Mock Products
export const products: Product[] = [
  {
    id: 1,
    title: 'Proxy Premium',
    description: 'Proxy residencial de alta velocidade para suas necessidades.',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'proxy',
    productType: 'proxy',
    tags: ['Mais Popular'],
    period: '30 dias de acesso',
    stock: 8,
    soldToday: 5,
    temperature: 75,
    isPopular: true,
    status: 'active',
    dateCreated: '2023-04-15T10:00:00',
    dateModified: '2023-05-10T14:30:00'
  },
  {
    id: 2,
    title: 'Perfil Verificado',
    description: 'Perfil verificado com histórico premium para sua conta.',
    price: 149.90,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'perfil',
    productType: 'perfil',
    tags: [],
    period: '60 dias de acesso',
    stock: 2,
    soldToday: 3,
    temperature: 60,
    isLowStock: true,
    status: 'active',
    dateCreated: '2023-04-16T11:30:00',
    dateModified: '2023-05-11T09:15:00'
  },
  {
    id: 3,
    title: 'Business Manager',
    description: 'BM completo para gerenciamento profissional de campanhas.',
    price: 299.90,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'bm',
    productType: 'bm',
    tags: ['Novo'],
    period: '90 dias de acesso',
    stock: 10,
    soldToday: 2,
    temperature: 40,
    status: 'active',
    dateCreated: '2023-04-18T14:20:00',
    dateModified: '2023-05-12T16:45:00'
  },
  
  // Produtos em estoque interno
  {
    id: 4,
    title: 'Proxy Compartilhado',
    description: 'Proxy compartilhado para uso geral. Boa velocidade e custo acessível.',
    price: 49.90,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'proxy',
    productType: 'proxy',
    tags: ['compartilhado', 'custo-beneficio'],
    period: '30 dias',
    stock: 2,
    status: 'internal_stock',
    dateCreated: '2023-05-01T09:00:00',
    dateModified: '2023-05-01T09:00:00'
  },
  {
    id: 5,
    title: 'Perfil Novo',
    description: 'Conta recém criada sem histórico. Ideal para testes iniciais.',
    price: 79.90,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'perfil',
    productType: 'perfil',
    tags: ['novo', 'iniciante'],
    period: 'Acesso único',
    stock: 2,
    status: 'internal_stock',
    dateCreated: '2023-05-02T10:30:00',
    dateModified: '2023-05-02T10:30:00'
  }
];

// Mock Subscriptions
export const subscriptions: Subscription[] = [
  {
    id: 1,
    productId: 1,
    productTitle: 'Proxy Premium',
    status: 'active',
    icon: 'globe',
    details: {
      ip: '189.28.193.82',
      expirationDate: '2023-09-28'
    }
  },
  {
    id: 2,
    productId: 2,
    productTitle: 'Perfil Verificado',
    status: 'pending_renewal',
    icon: 'user-check',
    details: {
      id: 'PV-2023-0892',
      expirationDate: '2023-08-10'
    }
  }
];

// Mock Tutorials com categorias para estilo Netflix
export const tutorialCategories = [
  { id: 1, name: '🔥 Mais assistidos' },
  { id: 2, name: '📚 Básicos da Plataforma' },
  { id: 3, name: '⚙️ Configurações e Integrações' },
  { id: 4, name: '🛠️ Soluções avançadas' },
  { id: 5, name: '📱 Automatizações e Cookies' }
];

export const tutorials: Tutorial[] = [
  // 🔥 Mais assistidos
  {
    id: 1,
    title: 'Como configurar seu proxy',
    description: 'Aprenda a configurar corretamente seu proxy para máxima performance e evitar bloqueios.',
    image: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    duration: '4:32',
    link: '#',
    category: 1,
    year: '2025',
    featured: true
  },
  {
    id: 2,
    title: 'Segurança da sua conta',
    description: 'Dicas essenciais para manter sua conta protegida contra invasões e bloqueios.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    duration: '6:18',
    link: '#',
    category: 1,
    year: '2025',
    featured: false
  },
  
  // 📚 Básicos da Plataforma
  {
    id: 3,
    title: 'Maximizando seus lucros',
    description: 'Estratégias avançadas para aumentar seu ROI com nossas ferramentas.',
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    duration: '8:45',
    link: '#',
    category: 2,
    year: '2025',
    featured: false
  },
  {
    id: 4,
    title: 'Primeiros passos na plataforma',
    description: 'Guia completo para novos usuários começarem a usar nossa plataforma.',
    image: 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    duration: '5:12',
    link: '#',
    category: 2,
    year: '2025',
    featured: false
  },
  {
    id: 5,
    title: 'Conhecendo o Dashboard',
    description: 'Aprenda a navegar e usar todas as funcionalidades do seu painel de controle.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    duration: '3:55',
    link: '#',
    category: 2,
    year: '2025',
    featured: false
  },
  
  // ⚙️ Configurações e Integrações
  {
    id: 6,
    title: 'Integração com API de pagamentos',
    description: 'Como integrar nossa plataforma com sistemas de pagamento externos.',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    duration: '10:22',
    link: '#',
    category: 3,
    year: '2025',
    featured: false
  },
  {
    id: 7,
    title: 'Configuração para múltiplos browsers',
    description: 'Configure corretamente para usar em diferentes navegadores.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    duration: '7:41',
    link: '#',
    category: 3,
    year: '2025',
    featured: false
  },
  
  // 🛠️ Soluções avançadas
  {
    id: 8,
    title: 'Masterclass: Evitando bloqueios',
    description: 'Técnicas avançadas para maximizar o tempo de uso sem bloqueios.',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    duration: '15:30',
    link: '#',
    category: 4,
    year: '2025',
    featured: true
  },
  {
    id: 9,
    title: 'Anti-detecção avançado',
    description: 'Métodos avançados para evitar a detecção de automação em suas contas.',
    image: 'https://images.unsplash.com/photo-1510511233900-1982d92bd835?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    duration: '12:18',
    link: '#',
    category: 4,
    year: '2025',
    featured: false
  },
  
  // 📱 Automatizações e Cookies
  {
    id: 10,
    title: 'Automação com nossa API',
    description: 'Como criar scripts de automação usando nossa API REST.',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    duration: '9:45',
    link: '#',
    category: 5,
    year: '2025',
    featured: false
  },
  {
    id: 11,
    title: 'Gerenciamento de cookies',
    description: 'Aprenda a gerenciar, salvar e reutilizar cookies de sessão.',
    image: 'https://images.unsplash.com/photo-1542342352-3a95ece9bc58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    duration: '6:55',
    link: '#',
    category: 5,
    year: '2025',
    featured: false
  },
  {
    id: 12,
    title: 'Webhook para notificações',
    description: 'Configure webhooks para receber notificações de eventos importantes.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    duration: '8:12',
    link: '#',
    category: 5,
    year: '2025',
    featured: false
  }
];

// Mock Banners
export const banners: Banner[] = [
  {
    id: 1,
    title: 'Oferta Especial',
    description: 'Recarga acima de R$200 e ganhe 15% de bônus no seu saldo.',
    image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600',
    buttonText: 'Aproveitar',
    link: '#'
  },
  {
    id: 2,
    title: 'Novo Business Manager',
    description: 'Conheça nosso novo produto para gerenciar seus negócios com facilidade.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600',
    buttonText: 'Conhecer',
    link: '#'
  },
  {
    id: 3,
    title: 'Suporte Premium',
    description: 'Agora você pode contar com nossa equipe de suporte 24/7.',
    image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600',
    buttonText: 'Saiba mais',
    link: '#'
  }
];

// Mock Orders
export const orders: Order[] = [
  {
    id: 8364,
    userId: 1,
    userName: 'João Dias',
    userInitials: 'JD',
    productTitle: 'Proxy Premium',
    status: 'completed',
    price: 89.90,
    date: '2023-07-23'
  },
  {
    id: 8363,
    userId: 3,
    userName: 'Maria Silva',
    userInitials: 'MS',
    productTitle: 'Business Manager',
    status: 'pending',
    price: 299.90,
    date: '2023-07-23'
  },
  {
    id: 8362,
    userId: 4,
    userName: 'Ricardo Santos',
    userInitials: 'RS',
    productTitle: 'Perfil Verificado',
    status: 'completed',
    price: 149.90,
    date: '2023-07-22'
  }
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: 1,
    title: 'Sua assinatura vence em 2 dias',
    message: 'Renove agora para não perder acesso.',
    type: 'warning',
    primaryAction: {
      text: 'Renovar agora',
      link: '/assinaturas'
    },
    secondaryAction: {
      text: 'Mais tarde',
      link: '#'
    }
  },
  {
    id: 2,
    title: 'Saldo abaixo de R$50,00',
    message: 'Adicione saldo para continuar usando nossos serviços.',
    type: 'info',
    primaryAction: {
      text: 'Adicionar saldo',
      link: '#'
    },
    secondaryAction: {
      text: 'Ignorar',
      link: '#'
    }
  },
  {
    id: 3,
    title: 'Novo tutorial disponível',
    message: 'Aprenda como configurar seu proxy para melhor desempenho.',
    type: 'success',
    primaryAction: {
      text: 'Assistir agora',
      link: '/tutoriais'
    },
    secondaryAction: {
      text: 'Depois',
      link: '#'
    }
  }
];

// Mock KPI Data
export const kpiData = {
  activeClients: {
    value: 1248,
    percentChange: 12,
    icon: 'users',
    color: 'indigo'
  },
  activeProxies: {
    value: 456,
    percentChange: 8,
    icon: 'shield',
    color: 'green'
  },
  contingencySubscriptions: {
    value: 92,
    percentChange: 24,
    icon: 'life-buoy',
    color: 'amber'
  },
  totalTransactions: {
    value: 3576,
    percentChange: 8,
    icon: 'receipt',
    color: 'teal'
  },
  itemsSold: {
    value: 4328,
    percentChange: 15,
    icon: 'package',
    color: 'purple'
  },
  clientBalance: {
    value: 287492,
    percentChange: 17,
    icon: 'wallet',
    color: 'primary'
  }
};

// Mock Chart Data
export const chartData = {
  topProducts: [
    { name: "Proxy Premium", value: 187 },
    { name: "Perfil Verificado", value: 134 },
    { name: "Business Manager", value: 98 },
    { name: "Serviço de Contingência", value: 56 },
    { name: "Outros", value: 42 }
  ],
  dailyRevenue: [
    { date: "01/05", value: 12540 },
    { date: "02/05", value: 14230 },
    { date: "03/05", value: 9800 },
    { date: "04/05", value: 11670 },
    { date: "05/05", value: 13890 },
    { date: "06/05", value: 18450 },
    { date: "07/05", value: 16230 }
  ],
  productDistribution: [
    { name: "Proxy", value: 45 },
    { name: "Perfil", value: 30 },
    { name: "BM", value: 15 },
    { name: "Contingência", value: 10 }
  ],
  balanceGrowth: [
    { month: "Jan", value: 120000 },
    { month: "Fev", value: 145000 },
    { month: "Mar", value: 190000 },
    { month: "Abr", value: 220000 },
    { month: "Mai", value: 287492 }
  ],
  conversionRates: [
    { product: "Proxy Premium", rate: 68 },
    { product: "Perfil Verificado", rate: 52 },
    { product: "Business Manager", rate: 47 },
    { product: "Serviço de Contingência", rate: 72 }
  ]
};

// Mock Top Customers Data
export const topCustomers = [
  { 
    id: 1, 
    name: "João Dias", 
    email: "joao@example.com", 
    totalSpent: 14980, 
    orderCount: 12, 
    averageTicket: 1248.33 
  },
  { 
    id: 3, 
    name: "Maria Silva", 
    email: "maria@example.com", 
    totalSpent: 9240, 
    orderCount: 8, 
    averageTicket: 1155.00 
  },
  { 
    id: 4, 
    name: "Ricardo Santos", 
    email: "ricardo@example.com", 
    totalSpent: 7690, 
    orderCount: 6, 
    averageTicket: 1281.67 
  },
  { 
    id: 8, 
    name: "Fernanda Lima", 
    email: "fernanda@example.com", 
    totalSpent: 6780, 
    orderCount: 5, 
    averageTicket: 1356.00 
  },
  { 
    id: 12, 
    name: "Carlos Mendes", 
    email: "carlos@example.com", 
    totalSpent: 5890, 
    orderCount: 5, 
    averageTicket: 1178.00 
  },
  { 
    id: 16, 
    name: "Patrícia Oliveira", 
    email: "patricia@example.com", 
    totalSpent: 4990, 
    orderCount: 4, 
    averageTicket: 1247.50 
  },
  { 
    id: 19, 
    name: "Gabriel Martins", 
    email: "gabriel@example.com", 
    totalSpent: 4560, 
    orderCount: 4, 
    averageTicket: 1140.00 
  },
  { 
    id: 22, 
    name: "Luciana Costa", 
    email: "luciana@example.com", 
    totalSpent: 3870, 
    orderCount: 3, 
    averageTicket: 1290.00 
  },
  { 
    id: 25, 
    name: "André Pereira", 
    email: "andre@example.com", 
    totalSpent: 3250, 
    orderCount: 3, 
    averageTicket: 1083.33 
  },
  { 
    id: 27, 
    name: "Camila Rocha", 
    email: "camila@example.com", 
    totalSpent: 2980, 
    orderCount: 3, 
    averageTicket: 993.33 
  }
];

// Extra product for checkout
export const orderBump = {
  id: 4,
  title: 'Garantia Extra',
  description: 'Estenda sua garantia para 30 dias e ganhe suporte prioritário.',
  price: 19.90
};

// Mock Proxies
export const proxies: Proxy[] = [
  {
    id: 1,
    ipAddress: "185.14.238.7",
    port: "31404",
    username: "user_abc123",
    password: "pass_xyz789",
    profileName: "perfil_nx789",
    status: "active",
    expirationDate: "2025-05-20T23:59:59",
    autoRenewal: true,
    note: "Proxy para conta principal do Facebook"
  },
  {
    id: 2,
    ipAddress: "103.126.65.89",
    port: "8080",
    username: "user_def456",
    password: "pass_uvw321",
    profileName: "perfil_ab123",
    status: "active",
    expirationDate: "2025-04-15T23:59:59",
    autoRenewal: false
  },
  {
    id: 3,
    ipAddress: "45.89.173.142",
    port: "3128",
    username: "user_ghi789",
    password: "pass_rst654",
    profileName: "perfil_cd456",
    status: "expired",
    expirationDate: "2024-02-22T23:59:59",
    autoRenewal: true,
    note: "Proxy para testes de anúncios"
  },
  {
    id: 4,
    ipAddress: "23.145.67.210",
    port: "8888",
    username: "user_jkl012",
    password: "pass_opq987",
    profileName: "perfil_ef789",
    status: "cancelled",
    expirationDate: "2024-01-10T23:59:59",
    autoRenewal: false
  },
  {
    id: 5,
    ipAddress: "178.62.102.63",
    port: "1080",
    username: "user_mno345",
    password: "pass_mln456",
    profileName: "perfil_gh012",
    status: "active",
    expirationDate: "2025-03-18T23:59:59",
    autoRenewal: true
  },
  {
    id: 6,
    ipAddress: "91.203.145.72",
    port: "9090",
    username: "user_pqr678",
    password: "pass_kji321",
    profileName: "perfil_ij345",
    status: "active",
    expirationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    autoRenewal: false,
    note: "Vence amanhã, renovação manual necessária"
  },
  {
    id: 7,
    ipAddress: "5.252.179.36",
    port: "3333",
    username: "user_stu901",
    password: "pass_hgf654",
    profileName: "perfil_kl678",
    status: "active",
    expirationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    autoRenewal: true
  }
];
