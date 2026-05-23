import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { locales, getDictionary, Locale } from '@/lib/i18n';
import { I18nProvider } from '@/components/I18nProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIChatbot from '@/components/AIChatbot';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BEXA Studio | Premium Multilingual Creative Agency',
  description: 'We fuse Apple-style minimalism, cutting-edge engineering, and emotional design to create premium products.',
  other: {
    'darkreader-lock': 'true',
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocalizedLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  const dictionary = getDictionary(activeLocale);

  return (
    <html
      lang={activeLocale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-500 selection:bg-indigo-500/30 relative">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={true}
        >
          <I18nProvider locale={activeLocale} dictionary={dictionary}>
            <Navbar />
            
            {/* Global Premium SaaS Visual Assets */}
            <div className="aurora-container">
              <div className="aurora-blob aurora-1" />
              <div className="aurora-blob aurora-2" />
              <div className="aurora-blob aurora-3" />
            </div>
            <div className="noise-grain" />

            <main className="flex-grow relative z-10">{children}</main>
            <AIChatbot />
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
