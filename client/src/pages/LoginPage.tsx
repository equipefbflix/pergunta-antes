import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function LoginPage() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { toast } = useToast();
  const glassStyles = useGlassmorphism();
  
  const [loginType, setLoginType] = useState<"client" | "admin">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const success = await login({ email, password });
      
      if (!success) {
        toast({
          title: "Erro de login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      
      {/* Login Container */}
      <div className={`${glassStyles.className} rounded-2xl shadow-xl max-w-md w-full mx-auto z-10`}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-primary font-bold text-4xl tracking-tight">FBFLIX</h1>
            <p className="text-gray-400 mt-2">Plataforma de serviços</p>
          </div>
          
          {/* Login Tabs */}
          <div className="flex mb-6 border-b border-gray-700">
            <button 
              className={`flex-1 py-2 px-4 ${
                loginType === "client" 
                  ? "text-primary border-b-2 border-primary font-semibold" 
                  : "text-gray-400 hover:text-gray-200 transition-colors"
              }`}
              onClick={() => setLoginType("client")}
            >
              Cliente
            </button>
            <button 
              className={`flex-1 py-2 px-4 ${
                loginType === "admin" 
                  ? "text-primary border-b-2 border-primary font-semibold" 
                  : "text-gray-400 hover:text-gray-200 transition-colors"
              }`}
              onClick={() => setLoginType("admin")}
            >
              Admin
            </button>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
            <div className="text-center">
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Esqueceu sua senha?
              </a>
            </div>
          </form>
        </div>
      </div>
      
      {/* Theme Toggle */}
      <ThemeToggle />
    </section>
  );
}

export default LoginPage;
