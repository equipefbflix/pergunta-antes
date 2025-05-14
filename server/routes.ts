import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const apiPrefix = "/api";
  
  // Mock authentication endpoint
  app.post(`${apiPrefix}/auth/login`, (req, res) => {
    const { email, password } = req.body;
    
    // In a real app, we would validate credentials against the database
    if (email === "cliente@example.com" && password === "senha123") {
      res.json({
        success: true,
        user: {
          id: 1,
          name: "João Silva",
          initials: "JS",
          email: "cliente@example.com",
          type: "client",
          balance: 150.00,
        }
      });
    } else if (email === "admin@example.com" && password === "admin123") {
      res.json({
        success: true,
        user: {
          id: 2,
          name: "Admin User",
          initials: "AU",
          email: "admin@example.com",
          type: "admin",
          balance: 0,
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Credenciais inválidas"
      });
    }
  });
  
  // Mock products endpoint
  app.get(`${apiPrefix}/products`, (req, res) => {
    res.json({
      success: true,
      products: [
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
      ]
    });
  });
  
  // Mock subscriptions endpoint
  app.get(`${apiPrefix}/subscriptions`, (req, res) => {
    res.json({
      success: true,
      subscriptions: [
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
      ]
    });
  });
  
  // Mock orders endpoint
  app.get(`${apiPrefix}/orders`, (req, res) => {
    res.json({
      success: true,
      orders: [
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
      ]
    });
  });
  
  // Mock tutorials endpoint
  app.get(`${apiPrefix}/tutorials`, (req, res) => {
    res.json({
      success: true,
      tutorials: [
        {
          id: 1,
          title: 'Como configurar seu proxy',
          description: 'Aprenda a configurar corretamente seu proxy para máxima performance.',
          image: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
          duration: '4:32',
          link: '#'
        },
        {
          id: 2,
          title: 'Segurança da sua conta',
          description: 'Dicas essenciais para manter sua conta protegida.',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
          duration: '6:18',
          link: '#'
        },
        {
          id: 3,
          title: 'Maximizando seus lucros',
          description: 'Estratégias avançadas para aumentar seu ROI com nossas ferramentas.',
          image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400',
          duration: '8:45',
          link: '#'
        }
      ]
    });
  });
  
  // Mock add balance endpoint
  app.post(`${apiPrefix}/balance/add`, (req, res) => {
    const { amount, coupon } = req.body;
    
    // In a real app, we would validate the coupon and process the payment
    let cashbackPercentage = 5; // Default cashback
    
    if (coupon === "EXTRA10") {
      cashbackPercentage = 10;
    } else if (coupon === "VIP15") {
      cashbackPercentage = 15;
    }
    
    const cashbackAmount = amount * (cashbackPercentage / 100);
    const totalAmount = amount + cashbackAmount;
    
    res.json({
      success: true,
      balance: {
        amount,
        cashbackPercentage,
        cashbackAmount,
        totalAmount
      }
    });
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
