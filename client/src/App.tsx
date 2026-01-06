import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Utentes from "./pages/Utentes";
import UtenteDetail from "./pages/UtenteDetail";
import AgendaAvancadaV2 from "./pages/AgendaAvancadaV2";
import Faturacao from "./pages/Faturacao";
import Tratamentos from "./pages/Tratamentos";
import PrescricoesPage from "./pages/PrescricoesPage";
import Orcamentos from "./pages/Orcamentos";
import Relatorios from "./pages/Relatorios";
import Stocks from "./pages/Stocks";
import Lembretes from "./pages/Lembretes";
import PEM from "./pages/PEM";
import AnaliseRadiografica from "./pages/AnaliseRadiografica";
import Seguranca from "./pages/Seguranca";
import Periodontograma from "./pages/Periodontograma";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/utentes"} component={Utentes} />
      <Route path={"/utentes/:id"} component={UtenteDetail} />
      <Route path={"/agenda"} component={AgendaAvancadaV2} />
      <Route path={"/consultas"} component={AgendaAvancadaV2} />
      <Route path={"/faturacao"} component={Faturacao} />
      <Route path={"/tratamentos"} component={Tratamentos} />
      <Route path={"/periodontograma"} component={Periodontograma} />
      <Route path={"/prescricoes"} component={PrescricoesPage} />
      <Route path={"/orcamentos"} component={Orcamentos} />
      <Route path={"/relatorios"} component={Relatorios} />
      <Route path={"/stocks"} component={Stocks} />
      <Route path={"/lembretes"} component={Lembretes} />
      <Route path={"/pem"} component={PEM} />
      <Route path={"/analise-ia"} component={AnaliseRadiografica} />
      <Route path={"/seguranca"} component={Seguranca} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
