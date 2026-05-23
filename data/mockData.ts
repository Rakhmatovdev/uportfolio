export interface PortfolioProject {
  id: string;
  title: string;
  category: 'design' | 'development' | 'branding' | 'threeD';
  image: string;
  client: string;
  year: string;
  services: string[];
  overview: string;
  results: string;
  accentColor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'design' | 'engineering' | 'strategy' | 'management';
  image: string;
  bio: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    dribbble?: string;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'trends' | 'tech' | 'business';
  date: string;
  readTime: number;
  image: string;
  summary: string;
  body: string;
  author: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'process' | 'tech' | 'pricing';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: '1',
    title: 'Aura Interactive Ecosystem',
    category: 'threeD',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    client: 'Aura Technologies',
    year: '2025',
    services: ['Immersive 3D Space', 'Fluid Interactive Prototypes', 'Next.js 15 WebGL Integration'],
    overview: 'A complete dynamic 3D web platform representing an abstract spatial interface. Users navigate architectural blocks in an ambient, real-time lighting system, resulting in a 400% increase in average session duration.',
    results: 'Won an Awwwards Site of the Day, with average page interaction speeds of 85ms and a massive jump in organic business leads.',
    accentColor: 'from-blue-600 to-indigo-600',
  },
  {
    id: '2',
    title: 'Minimalist FinTech Brand System',
    category: 'branding',
    image: 'https://images.unsplash.com/photo-1634973357973-f2ed255753e1?q=80&w=1200&auto=format&fit=crop',
    client: 'Apex Capital',
    year: '2024',
    services: ['Brand Identity Strategy', 'Typography Design System', 'Sleek Mobile Interface Design'],
    overview: 'We rebuilt Apex Capitals identity from scratch, shifting it towards Apple-style premium minimalism. A custom geometric typeface was paired with structured layouts to establish immediate trust.',
    results: 'Successfully assisted in a $45M Series B funding round, scaling their user base by 3.5x within the first quarter of release.',
    accentColor: 'from-violet-600 to-purple-600',
  },
  {
    id: '3',
    title: 'Veloce High-Performance Platform',
    category: 'development',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    client: 'Veloce Logistics',
    year: '2024',
    services: ['Full-Stack SSR Platform', 'Real-Time Telemetry Dashboard', 'Custom CSS Architecture'],
    overview: 'A massive custom enterprise system capable of processing 10,000 real-time queries per second, packaged inside a gorgeous glassmorphic frontend built entirely on server components.',
    results: 'Reduced page loading times by 68% (LCP down to 0.6s) and completely eliminated layout shift warnings.',
    accentColor: 'from-emerald-600 to-teal-600',
  },
  {
    id: '4',
    title: 'Spatial Portfolio Framework',
    category: 'design',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop',
    client: 'Nova Artistry',
    year: '2025',
    services: ['Creative UI/UX Architecture', 'Micro-Animation Scripting', 'Custom Theme Engineering'],
    overview: 'A high-concept grid system for a luxury design gallery, incorporating magnetic mouse-chase interactions, smooth scroll velocity-based scaling, and instant color swaps.',
    results: 'Acclaimed across the design ecosystem, generating over 150k unique monthly visitors entirely via organic design index referrals.',
    accentColor: 'from-rose-600 to-pink-600',
  },
  {
    id: '5',
    title: 'Quantum Cryo Immersive App',
    category: 'threeD',
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop',
    client: 'Cryo Global',
    year: '2026',
    services: ['WebGL Spheres', 'Interactive Particle Physics', 'Three.js Camera Interpolation'],
    overview: 'An abstract, fully interactive galaxy and particle simulation platform displaying spatial science indexes in clean, real-time rendering containers.',
    results: 'Featured in various global CSS and JS showcase galleries with outstanding performance benchmarks.',
    accentColor: 'from-cyan-600 to-blue-600',
  },
  {
    id: '6',
    title: 'Lumina Glassmorphic OS',
    category: 'design',
    image: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?q=80&w=1200&auto=format&fit=crop',
    client: 'Lumina Systems',
    year: '2025',
    services: ['Aesthetic Layout System', 'Frosted Glass Modules', 'Micro-Acoustic Feedback'],
    overview: 'A conceptual operating system running completely inside standard browsers, leveraging advanced frosted glass panels, drop shadows, and vector-based interactive icons.',
    results: 'Increased conversion metrics by 220% during early beta trials, praised for outstanding visual beauty and tactile responsiveness.',
    accentColor: 'from-amber-600 to-orange-600',
  },
  {
    id: '7',
    title: 'Helios Clean Energy Brand',
    category: 'branding',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop',
    client: 'Helios Corp',
    year: '2026',
    services: ['Green Brand Identity', 'Sustainable Asset Strategy', 'Custom Typography Scale'],
    overview: 'An extensive rebranding effort for a next-generation clean energy enterprise, aligning wind and solar telemetry dashboards into a sleek, unified luxury aesthetic.',
    results: 'Successfully established immediate market authority, resulting in multiple enterprise partnerships.',
    accentColor: 'from-indigo-600 to-blue-600',
  },
  {
    id: '8',
    title: 'Zenith Real-Time Edge Engine',
    category: 'development',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    client: 'Zenith Technologies',
    year: '2026',
    services: ['Multi-region Deployment', 'Wasm-based Filtering', 'Edge Route Optimizations'],
    overview: 'High-fidelity edge integration system built completely with modular TypeScript, featuring super-low latencies and zero layout shifts under massive concurrent loads.',
    results: 'Achieved average response speed of 12ms globally with absolute safety and robust reliability.',
    accentColor: 'from-purple-600 to-pink-600',
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alisher Rakhmatov',
    role: 'Principal Creative Director',
    department: 'management',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    bio: 'Oversees the agency\'s aesthetic guidelines, combining extensive UX experience with a passion for architectural minimalism and typography.',
    socials: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com',
    },
  },
  {
    id: '2',
    name: 'Sofia Kuznetsova',
    role: 'Head of Engineering',
    department: 'engineering',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
    bio: 'Specialist in dynamic page optimization, server rendering patterns, and motion-heavy React structures. Loves clean code and fine coffee.',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: '3',
    name: 'Elena Romanova',
    role: 'Lead UI/UX Architect',
    department: 'design',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    bio: 'Pioneering sensory digital spaces, glassmorphism systems, and custom dynamic components. Strongly believes visual joy is as vital as utility.',
    socials: {
      dribbble: 'https://dribbble.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: '4',
    name: 'Marcus Vance',
    role: 'Strategic Brand Lead',
    department: 'strategy',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    bio: 'Focuses on structural brand positioning and digital market psychology. Translates complex business targets into memorable layout structures.',
    socials: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'The Micro-Animation Revolution in Modern Web Design',
    category: 'trends',
    date: 'May 12, 2026',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    summary: 'Explore how tiny interactive transitions build powerful emotional attachments, transforming standard layouts into delightful, human-focused spaces.',
    body: 'In the search for higher digital retention, agencies are shifting away from large, distracting structural flashes and focusing on subtle micro-animations. These include magnetic mouse alignment, springy scale toggles, and velocity-based letter spacing shifts. When designed correctly, they don\'t just look premium — they provide responsive feedback that tells the user that the site is truly alive. Our design philosophy heavily integrates these kinetic concepts to create memorable digital memories.',
    author: 'Elena Romanova',
  },
  {
    id: '2',
    title: 'Architecting for the Edge: Next.js 16 and Tailwind v4',
    category: 'tech',
    date: 'Apr 28, 2026',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    summary: 'A deep architectural review of Tailwind\'s lightning-fast compilation, advanced CSS custom property bindings, and dynamic server components.',
    body: 'Next.js 16 introduces major enhancements to dynamic static rendering, streaming, and page initialization. Combined with Tailwind CSS v4\'s complete engine rebuild—which operates entirely via standard CSS variables and native import configurations—engineers can build high-fidelity designs with virtually zero runtime impact. In this article, we outline our custom template structures and show how CSS-variable-based theme switches ensure immediate, flicker-free rendering.',
    author: 'Sofia Kuznetsova',
  },
  {
    id: '3',
    title: 'Defining Minimal Luxury in Modern B2B Branding',
    category: 'business',
    date: 'Mar 15, 2026',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1634973357973-f2ed255753e1?q=80&w=800&auto=format&fit=crop',
    summary: 'Why modern enterprises are shedding heavy enterprise interfaces and embracing minimalist, typography-centric premium design patterns.',
    body: 'The era of complex, cluttered dashboards in enterprise tech is rapidly closing. Contemporary brand directors realize that corporate users are human beings who crave clean lines, outstanding readability, and effortless actions. By reducing visual clutter, brands can project an immediate aura of luxury, technological confidence, and high competence. We break down the key design markers—asymmetrical grids, huge margins, and monochromatic themes—that establish instant prestige.',
    author: 'Marcus Vance',
  },
  {
    id: '4',
    title: 'Designing for the Vision Pro: Spatial UI Patterns',
    category: 'trends',
    date: 'Jun 02, 2026',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop',
    summary: 'A comprehensive study of depth layers, glassy dynamic materials, and gaze-selection hover animations in spatial operating systems.',
    body: 'Spatial computing presents a completely new vocabulary of user interaction. Standard flat patterns must adapt to three-dimensional depth, where light refraction, dynamic shadows, and relative z-indexing guide the human eye. We investigate how to code responsive glassy components that blend naturally with ambient background environments.',
    author: 'Elena Romanova',
  },
  {
    id: '5',
    title: 'Real-time Telemetry with Server Actions and WebSockets',
    category: 'tech',
    date: 'May 20, 2026',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    summary: 'How to combine lightweight Edge Server Actions with state-synced active WebSocket pipelines to stream visual telemetry without latency.',
    body: 'Managing real-time dashboards is historically complex. By integrating Next.js edge functions with optimized socket clusters, we can push sub-10ms dataset updates directly into client store systems. In this architectural drill-down, we examine frame-rate rendering and garbage collection strategies during high throughput.',
    author: 'Sofia Kuznetsova',
  },
  {
    id: '6',
    title: 'How Design Systems Save Modern Startups $150k Yearly',
    category: 'business',
    date: 'May 10, 2026',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    summary: 'A financial look at how building unified design tokens eliminates redundant engineering loops, accelerating products to market 3x faster.',
    body: 'Design debt accumulates rapidly. Startups that skip systematic component architectures spend up to 35% of their development hours rewriting buttons, form layouts, and navigation wrappers. We present multiple case studies demonstrating how a premium, pre-built design system pays for itself within the first quarter.',
    author: 'Marcus Vance',
  },
  {
    id: '7',
    title: 'Isomorphic React: The Future of Server-Side Rendering',
    category: 'tech',
    date: 'May 01, 2026',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    summary: 'A historical review of client-server hydration techniques, leading to modern server components that execute with zero client bundle footprint.',
    body: 'By splitting render pipelines between server nodes and client runtimes, we achieve optimal performance. We discuss async streaming chunk bounds, partial page hydration systems, and edge data-fetching mechanisms.',
    author: 'Sofia Kuznetsova',
  },
  {
    id: '8',
    title: 'Aesthetic Physics: Simulating Real-World Forces in CSS',
    category: 'trends',
    date: 'Apr 18, 2026',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    summary: 'Why standard linear transitions feel mechanical, and how to write custom bezier curves simulating inertia, gravity, and kinetic bounce.',
    body: 'Standard cubic-beziers often feel flat. By mirroring physical forces—such as spring tension, friction, and kinetic bounce—we create digital interfaces that respond organically, making interactions feel highly premium.',
    author: 'Elena Romanova',
  },
  {
    id: '9',
    title: 'Building Brand Equity Through Intentional Minimalism',
    category: 'business',
    date: 'Apr 02, 2026',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    summary: 'Why premium brands never scream for attention, and how quiet space, high typographic scales, and asymmetry project prestige.',
    body: 'Prestige is established by what you omit. By utilizing generous negative space and rigid typographic grids, modern luxury brands convey confidence, high competence, and visual supremacy.',
    author: 'Marcus Vance',
  },
  {
    id: '10',
    title: 'TypeScript 6.0: The Ultimate Type-Safety Guide for SaaS',
    category: 'tech',
    date: 'Mar 24, 2026',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    summary: 'A deep dive into advanced conditional types, template literal mapped types, and structural type variance in large next-generation SaaS architectures.',
    body: 'With TypeScript 6.0, compilers gain highly sophisticated capabilities. We walk through mapped types, conditional variance guards, and fast compilation configuration flags to streamline developer experiences.',
    author: 'Sofia Kuznetsova',
  },
];

export const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'What is your process for designing and engineering an Awwwards-level website?',
    answer: 'We divide our workflow into four distinct phases: Discovery (deep research), Visual Concepts (custom layouts and aesthetic prototyping), Technical Engineering (modular Next.js, Framer Motion transitions), and Launch & Evolution (optimizations and deployment). Each stage is highly collaborative, ensuring our design matches your technical constraints perfectly.',
    category: 'process',
  },
  {
    id: '2',
    question: 'How do you handle localization (i18n) and accessibility in your applications?',
    answer: 'We use a dynamic App Router routing schema (e.g. /en/about) which guarantees unique search-indexable paths for search engines. Our translation dictionary is highly optimized to load instantly without hydration delay. Additionally, we use semantic HTML and support keyboard navigation and screen-readers natively.',
    category: 'tech',
  },
  {
    id: '3',
    question: 'What is your typical project timeline and pricing structure?',
    answer: 'We focus on custom, high-fidelity digital systems rather than generic templates. Visual brand redesigns and immersive websites usually require 8 to 14 weeks. Pricing is based on custom scopes, features, and visual complexity, established transparently during our discovery meetings.',
    category: 'pricing',
  },
  {
    id: '4',
    question: 'Do you offer ongoing post-launch maintenance and SEO optimization?',
    answer: 'Yes, we provide ongoing support, continuous search visibility reviews, asset compression updates, and server monitoring to ensure your platform remains lightning-fast, modern, and completely secure as your audience scales.',
    category: 'general',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Jasur Rahmatov',
    role: 'Co-Founder & CEO',
    company: 'Aura Technologies',
    content: 'BEXA Studio completely transformed our product. Their obsessive focus on visual details, smooth transitions, and high-performance engineering gave us an identity that wowed our board and our customers.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Farrux Rahmatov',
    role: 'VP of Product Development',
    company: 'Apex Capital',
    content: 'Working with them felt like a true partnership. They grasped our strategic goals instantly and turned an complex financial concept into a breathtakingly simple, premium brand ecosystem.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Pavel Durov',
    role: 'Founder',
    company: 'Telegram',
    content: 'Aesthetics matter. BEXA Studio understands how to merge Apple-style minimalism with raw, high-performance visual fidelity. Exceptional design craftsmanship.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Elon Musk',
    role: 'CEO',
    company: 'Tesla & SpaceX',
    content: 'The attention to visual physics and transition details is incredible. BEXA Studio is building digital rocket ship interfaces for the modern web.',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=200&auto=format&fit=crop',
  },
];

export const clientLogos = [
  { name: 'Aura Tech', logo: '◈ AURA' },
  { name: 'Apex Capital', logo: '▲ APEX' },
  { name: 'Veloce Corp', logo: '✦ VELOCE' },
  { name: 'Nova Artistry', logo: '❖ NOVA' },
];

export const servicesList = [
  { id: 'design', iconName: 'Palette' },
  { id: 'development', iconName: 'Cpu' },
  { id: 'branding', iconName: 'Layers' },
  { id: 'immersive', iconName: 'Sparkles' },
];
