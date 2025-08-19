import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Room from "@/pages/room";
import TeamSelection from "@/pages/team-selection";
import Auction from "@/pages/auction";
import Summary from "@/pages/summary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/r/:code" component={Room} />
      <Route path="/r/:code/teams" component={TeamSelection} />
      <Route path="/r/:code/auction" component={Auction} />
      <Route path="/r/:code/summary" component={Summary} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
