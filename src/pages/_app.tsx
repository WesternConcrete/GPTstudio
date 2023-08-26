import { type AppType } from "next/app";
import { api } from "@/utils/api";
import { ClerkLoaded, ClerkLoading, ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs'
import { Layout } from "@/components/layout"
import "@/styles/globals.css";
import { LoadingPage } from "@/components/loading/loading-page";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes"
import { useRouter } from "next/router";

export const metadata = {
  title: 'GPTstudio',
}


const MyApp: AppType = ({ Component, pageProps }) => {
  const clerk_pub_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <ThemeProvider attribute="class">
      <ClerkProvider publishableKey={clerk_pub_key}> 
      <ClerkLoading>
        <LoadingPage />
      </ClerkLoading>
      <ClerkLoaded>
        <Layout>
        <Component {...pageProps} />
        
        </Layout>
        <Toaster />
      </ClerkLoaded>
    </ClerkProvider>
    </ThemeProvider>
    
  )
};

export default api.withTRPC(MyApp);
