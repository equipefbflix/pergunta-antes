import { useState, useEffect } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Sidebar from "@/components/layout/Sidebar";

export function AdminTermsPage() {
  const glassStyles = useGlassmorphism();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [termsContent, setTermsContent] = useState<string>(
    `Garantia de Acesso: reposição garantida em até 24h em caso de problemas

Acesso permanente ao perfil, exceto em casos de mau uso

Entrega de Perfis e BMs: política de envio automático

A FBFLIX é uma plataforma de gerenciamento de conteúdo e recursos digitais que oferece serviços conforme descritos neste documento. Ao utilizar nossos serviços, você concorda com os seguintes termos:

1. GARANTIA DE ACESSO
   - Todos os perfis adquiridos através da FBFLIX possuem garantia de reposição em até 24 horas em caso de problemas de acesso não causados pelo usuário.
   - A garantia cobre apenas problemas técnicos relacionados ao serviço, como indisponibilidade ou falhas no sistema.
   - A reposição será feita automaticamente por nosso sistema ou mediante solicitação no painel do cliente.

2. PERMANÊNCIA DE ACESSO
   - Garantimos acesso permanente aos perfis adquiridos, exceto em casos de uso inadequado ou violação dos termos de serviço.
   - Considera-se uso inadequado: compartilhamento não autorizado de credenciais, tentativas de alteração de senha, uso para atividades ilegais ou que violem os termos de uso da plataforma original.

3. ENTREGA DE PERFIS E BMs
   - A entrega de perfis e Business Managers (BMs) será realizada automaticamente após a confirmação do pagamento.
   - O cliente receberá notificação por email e no painel da plataforma quando seus recursos estiverem disponíveis.
   - Em casos excepcionais, a entrega pode levar até 24 horas.

4. LIMITAÇÕES DE RESPONSABILIDADE
   - A FBFLIX não se responsabiliza por ações realizadas pelos usuários utilizando nossos serviços.
   - Não nos responsabilizamos por perdas financeiras decorrentes do uso inadequado da plataforma.
   - A plataforma pode passar por manutenções programadas, com aviso prévio sempre que possível.

5. POLÍTICA DE REEMBOLSO
   - Solicitações de reembolso serão analisadas caso a caso.
   - Reembolsos integrais são garantidos apenas se o serviço não for entregue conforme especificado.
   - Após o uso do serviço, reembolsos parciais podem ser aplicados a critério da administração.

6. ATUALIZAÇÕES DOS TERMOS
   - Estes termos podem ser atualizados a qualquer momento, com notificação aos usuários.
   - O uso contínuo da plataforma após alterações nos termos implica na aceitação das novas condições.

Ao utilizar a plataforma FBFLIX, você confirma que leu, entendeu e concorda com estes termos de uso.`
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simular carregamento dos termos do servidor e data da última atualização
    const fetchData = () => {
      // Em uma implementação real, isso seria uma chamada API
      const mockLastUpdated = new Date(2025, 1, 18, 15, 5, 42); // 18/02/2025 15:05:42
      setLastUpdated(mockLastUpdated);
    };

    fetchData();
  }, []);

  const handleSaveTerms = async () => {
    setIsSaving(true);
    
    // Simular salvamento no servidor
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Atualizar a data da última atualização
    setLastUpdated(new Date());
    
    setIsSaving(false);
    
    toast({
      title: "Termos de uso atualizados",
      description: "Os termos de uso foram atualizados com sucesso.",
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Não disponível";
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`${glassStyles.className} z-10 py-4 px-6 flex justify-between items-center`}>
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-gray-400"
              onClick={() => setIsMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-foreground">Termos de Uso</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Última atualização: {formatDate(lastUpdated)}
            </div>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className={`${glassStyles.className} mb-6 rounded-lg p-6`}>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Editar Termos de Uso</h2>
              <Button 
                variant="default" 
                className="flex items-center space-x-2"
                onClick={handleSaveTerms}
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Salvando..." : "Salvar alterações"}</span>
              </Button>
            </div>
            
            <div className="mb-2 text-sm text-muted-foreground">
              <p>Edite os termos de uso da plataforma. Estas informações serão exibidas para todos os clientes.</p>
            </div>
            
            <Textarea 
              className="min-h-[500px] font-mono text-sm"
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              placeholder="Insira os termos de uso aqui..."
            />
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Dica: Utilize formatação simples para melhor organização. Linhas em branco serão preservadas.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminTermsPage;