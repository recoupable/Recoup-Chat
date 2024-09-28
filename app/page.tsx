"use client";

import LandingPage from "@/components/LandingPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Home = () => (
  <QueryClientProvider client={queryClient}>
    <LandingPage />
  </QueryClientProvider>
);

export default Home;
