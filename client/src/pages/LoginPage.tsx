import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Link, useLocation } from "wouter";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { users } from "@/mocks/data";

interface LoginPageProps {
  isAdmin?: boolean;
  isRegister?: boolean;
}

export function LoginPage({ isAdmin = false, isRegister = false }: LoginPageProps) {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { toast } = useToast();
  const glassStyles = useGlassmorphism();
  const [, setLocation] = useLocation();
  
  // Campos de login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Campos adicionais para cadastro
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro de login",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Usa o contexto AuthContext diretamente
      const success = await login({ email, password });
      
      if (success) {
        // O login foi bem-sucedido
        setIsLoading(false);
        
        // O redirecionamento será feito pelo Router baseado no usuário logado
        // mas vamos forçar o redirecionamento para garantir
        const userFound = users.find(u => u.email === email);
        
        if (userFound && userFound.type === 'admin') {
          setLocation('/admin');
        } else {
          setLocation('/dashboard');
        }
      } else {
        toast({
          title: "Erro de login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos de cadastro
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Erro de cadastro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro de cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulação de cadastro bem-sucedido
    setTimeout(() => {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode fazer login com suas credenciais.",
        variant: "default",
      });
      setIsLoading(false);
      setLocation("/login");
    }, 1000);
  };

  const getTitle = () => {
    if (isRegister) return "Criar Conta";
    if (isAdmin) return "Login Administrador";
    return "Login Cliente";
  };

  return (
    <section className="flex-1 flex items-center justify-center p-4 relative min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080" 
          alt="Background" 
          className="w-full h-full object-cover filter blur-sm" 
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>
      
      {/* Login/Register Container */}
      <div className={`${glassStyles.className} rounded-2xl shadow-xl max-w-md w-full mx-auto z-10`}>
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-primary font-bold text-4xl tracking-tight">FBFLIX</h1>
            <p className="text-gray-400 mt-2">Plataforma de serviços</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white text-center">{getTitle()}</h2>
          </div>
          
          {isRegister ? (
            // Formulário de Cadastro
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  E-mail
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Senha
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="********"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmar Senha
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="********"
                />
              </div>
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-primary hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isLoading ? "Processando..." : "Criar Conta"}
                </Button>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-400">
                  Já tem uma conta?{" "}
                  <Link href="/login">
                    <a className="text-primary hover:underline">Fazer login</a>
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            // Formulário de Login
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  E-mail
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Senha
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="********"
                />
              </div>
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-primary hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-center sm:text-left space-y-2 sm:space-y-0 mt-4">
                <Link href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Esqueceu sua senha?
                </Link>
                
                {!isAdmin && (
                  <Link href="/cadastro" className="text-sm text-primary hover:underline">
                    Criar conta
                  </Link>
                )}
              </div>
              
              {isAdmin ? (
                <div className="text-center mt-4">
                  <Link href="/login" className="text-sm text-primary hover:underline">
                    Ir para login de cliente
                  </Link>
                </div>
              ) : (
                <div className="text-center mt-4">
                  <Link href="/admin/login" className="text-sm text-primary hover:underline">
                    Área do administrador
                  </Link>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
      
      {/* Theme Toggle */}
      <ThemeToggle />
    </section>
  );
}

export default LoginPage;
