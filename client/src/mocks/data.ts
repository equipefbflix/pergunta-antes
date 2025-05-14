import { Product, Subscription, Tutorial, Order, User, Banner, Notification } from '@/types';

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

// Mock Products
export const products: Product[] = [
  {
    id: 1,
    title: 'Proxy Premium',
    description: 'Proxy residencial de alta velocidade para suas necessidades.',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'proxy',
    tags: ['Mais Popular'],
    period: '30 dias de acesso'
  },
  {
    id: 2,
    title: 'Perfil Verificado',
    description: 'Perfil verificado com histórico premium para sua conta.',
    price: 149.90,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'perfil',
    tags: [],
    period: '60 dias de acesso'
  },
  {
    id: 3,
    title: 'Business Manager',
    description: 'BM completo para gerenciamento profissional de campanhas.',
    price: 299.90,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
    category: 'bm',
    tags: ['Novo'],
    period: '90 dias de acesso'
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
  totalUsers: {
    value: 1248,
    percentChange: 12,
    icon: 'users',
    color: 'indigo'
  },
  totalOrders: {
    value: 3576,
    percentChange: 8,
    icon: 'shopping-cart',
    color: 'green'
  },
  revenue: {
    value: 287492,
    percentChange: 17,
    icon: 'dollar-sign',
    color: 'primary'
  },
  activeSubscriptions: {
    value: 892,
    percentChange: 5,
    icon: 'sync',
    color: 'blue'
  }
};

// Extra product for checkout
export const orderBump = {
  id: 4,
  title: 'Garantia Extra',
  description: 'Estenda sua garantia para 30 dias e ganhe suporte prioritário.',
  price: 19.90
};
