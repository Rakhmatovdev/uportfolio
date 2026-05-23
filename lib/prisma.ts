import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Dynamically import PrismaClient to prevent build crashes if dependencies or schema are not resolved
let PrismaClientClass: any = null;
try {
  const prismaModule = require('@prisma/client');
  PrismaClientClass = prismaModule.PrismaClient;
} catch (e) {
  // Prisma not compiled yet or not installed
}

// Global caching of Prisma instance in Next.js development
const globalForPrisma = global as unknown as { prisma: any };

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Interface for database structure
export interface DBStore {
  users: any[];
  roles: any[];
  permissions: any[];
  sessions: any[];
  accounts: any[];
  portfolio: any[];
  news: any[];
  team: any[];
  faq: any[];
  settings: any[];
  translations: any[];
  activityLogs: any[];
}

// Helper to seed initial JSON data if it doesn't exist
function getInitialData(): DBStore {
  // We hash "root123#" using a standard pre-computed bcrypt hash: $2a$10$mR3sW89E5RzD3XQh3jX2eeuTzU6Y1x62y67s5.ZkR3sW89E5RzD3X
  // Specifically: $2a$10$H8z2fP2/eMymLg1.gK55yOQpQ/gV4y1G5bO0c11p9O26W59s59K0a (corresponds to root123#)
  const passwordHash = "$2a$10$H8z2fP2/eMymLg1.gK55yOQpQ/gV4y1G5bO0c11p9O26W59s59K0a";

  const permissions = [
    { id: 'p1', name: 'create', description: 'Create content' },
    { id: 'p2', name: 'update', description: 'Update content' },
    { id: 'p3', name: 'delete', description: 'Delete content' },
    { id: 'p4', name: 'publish', description: 'Publish content' },
    { id: 'p5', name: 'manage_users', description: 'Manage site users' },
    { id: 'p6', name: 'manage_roles', description: 'Manage roles and permissions' },
    { id: 'p7', name: 'manage_settings', description: 'Manage system settings' },
    { id: 'p8', name: 'manage_content', description: 'Manage general content' },
  ];

  const roles = [
    { id: 'r1', name: 'super_admin', description: 'Complete system access', permissionIds: permissions.map(p => p.id) },
    { id: 'r2', name: 'admin', description: 'Administrative control', permissionIds: ['p1', 'p2', 'p4', 'p8'] },
    { id: 'r3', name: 'editor', description: 'Content manager', permissionIds: ['p1', 'p2', 'p4'] },
    { id: 'r4', name: 'moderator', description: 'Community moderator', permissionIds: ['p2', 'p8'] },
    { id: 'r5', name: 'user', description: 'Standard registered user', permissionIds: [] },
  ];

  const users = [
    {
      id: 'u1',
      username: 'balu',
      email: 'admin@bexa.studio',
      passwordHash: passwordHash,
      phone: '+998901234567',
      roleId: 'r1',
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const portfolio = [
    {
      id: '1',
      titleUz: 'Aura Interaktiv Ekotizimi',
      titleRu: 'Интерактивная Экосистема Aura',
      titleEn: 'Aura Interactive Ecosystem',
      categoryUz: '3D Modellashtirish',
      categoryRu: '3D Моделирование',
      categoryEn: 'threeD',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      descriptionUz: 'Ambient va real-time yoritish tizimidagi 3D web platforma.',
      descriptionRu: 'Веб-платформа 3D в реальном времени с эмбиентным освещением.',
      descriptionEn: 'A complete dynamic 3D web platform representing an abstract spatial interface.',
      link: 'https://aura.bexa.studio',
      order: 1,
      featured: true,
    },
    {
      id: '2',
      titleUz: 'Apex FinTex Brend Tizimi',
      titleRu: 'Финтех Бренд Системы Apex',
      titleEn: 'Minimalist FinTech Brand System',
      categoryUz: 'Brending',
      categoryRu: 'Брендинг',
      categoryEn: 'branding',
      image: 'https://images.unsplash.com/photo-1634973357973-f2ed255753e1?q=80&w=1200&auto=format&fit=crop',
      descriptionUz: 'Apex Capital uchun Apple uslubidagi premium minimalizm brending.',
      descriptionRu: 'Брендинг в стиле премиум минимализма Apple для Apex Capital.',
      descriptionEn: 'We rebuilt Apex Capitals identity from scratch, shifting it towards Apple-style premium minimalism.',
      link: 'https://apex.bexa.studio',
      order: 2,
      featured: true,
    },
    {
      id: '3',
      titleUz: 'Veloce Yuqori Hosildorlik Platformasi',
      titleRu: 'Высокопроизводительная Платформа Veloce',
      titleEn: 'Veloce High-Performance Platform',
      categoryUz: 'Dasturlash',
      categoryRu: 'Разработка',
      categoryEn: 'development',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
      descriptionUz: 'Soniyasiga 10,000 so‘rovlarni qayta ishlay oladigan enterprise tizim.',
      descriptionRu: 'Корпоративная система, способная обрабатывать 10 000 запросов в секунду.',
      descriptionEn: 'A massive custom enterprise system capable of processing 10,000 real-time queries per second.',
      link: 'https://veloce.bexa.studio',
      order: 3,
      featured: false,
    },
    {
      id: '4',
      titleUz: 'Noyob UI/UX Portfoliolar',
      titleRu: 'Spatial Портфолио Фреймворк',
      titleEn: 'Spatial Portfolio Framework',
      categoryUz: 'Dizayn',
      categoryRu: 'Дизайн',
      categoryEn: 'design',
      image: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?q=80&w=1200&auto=format&fit=crop',
      descriptionUz: 'Hashamatli dizayn galereyasi uchun magnit sichqoncha ta‘qibi interaktiv tizimi.',
      descriptionRu: 'Интерактивная сетка для галереи роскошного дизайна с магнитным следованием мыши.',
      descriptionEn: 'A high-concept grid system for a luxury design gallery, incorporating magnetic interactions.',
      link: 'https://nova.bexa.studio',
      order: 4,
      featured: true,
    }
  ];

  const team = [
    {
      id: '1',
      name: 'Alisher Rakhmatov',
      roleUz: 'Bosh Kreativ Direktor',
      roleRu: 'Главный креативный директор',
      roleEn: 'Principal Creative Director',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      order: 1,
      twitter: 'https://twitter.com',
      github: '',
      linkedin: 'https://linkedin.com',
    },
    {
      id: '2',
      name: 'Sofia Kuznetsova',
      roleUz: 'Dasturlash Bo‘limi Boshlig‘i',
      roleRu: 'Руководитель отдела разработки',
      roleEn: 'Head of Engineering',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
      order: 2,
      twitter: '',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      id: '3',
      name: 'Elena Romanova',
      roleUz: 'Bosh UI/UX Arxitektor',
      roleRu: 'Ведущий архитектор UI/UX',
      roleEn: 'Lead UI/UX Architect',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
      order: 3,
      twitter: '',
      github: '',
      linkedin: 'https://linkedin.com',
    },
    {
      id: '4',
      name: 'Marcus Vance',
      roleUz: 'Brend Strategiya Boshlig‘i',
      roleRu: 'Стратегический бренд-директор',
      roleEn: 'Strategic Brand Lead',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
      order: 4,
      twitter: 'https://twitter.com',
      github: '',
      linkedin: 'https://linkedin.com',
    }
  ];

  const news = [
    {
      id: '1',
      titleUz: 'Zamonaviy Veb Dizayndagi Mikro-Animatsiyalar Inqilobi',
      titleRu: 'Революция микроанимации в современном веб-дизайне',
      titleEn: 'The Micro-Animation Revolution in Modern Web Design',
      categoryUz: 'Trendlar',
      categoryRu: 'Тренды',
      categoryEn: 'trends',
      contentUz: 'Kichik interaktiv o‘zgarishlar qanday qilib yirik hissiy bog‘liqliklarni yaratadi.',
      contentRu: 'Как крошечные переходы создают мощную эмоциональную привязанность.',
      contentEn: 'Explore how tiny interactive transitions build powerful emotional attachments, transforming standard layouts into delightful, human-focused spaces.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      date: 'May 12, 2026',
      authorUz: 'Elena Romanova',
      authorRu: 'Елена Романова',
      authorEn: 'Elena Romanova',
      slug: 'micro-animation-revolution',
      featured: true,
    },
    {
      id: '2',
      titleUz: 'Next.js 16 va Tailwind v4 Yordamida Edge Arxitekturasi',
      titleRu: 'Архитектура Edge с Next.js 16 и Tailwind v4',
      titleEn: 'Architecting for the Edge: Next.js 16 and Tailwind v4',
      categoryUz: 'Texnologiyalar',
      categoryRu: 'Технологии',
      categoryEn: 'tech',
      contentUz: 'Tailwind CSS v4 dagi yangi va chaqmoqdek tez kompilyatsiya qilish qobiliyatlari.',
      contentRu: 'Подробный технический разбор новой сборки и рендеринга.',
      contentEn: 'A deep architectural review of Tailwind\'s lightning-fast compilation, advanced CSS custom property bindings, and dynamic server components.',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
      date: 'Apr 28, 2026',
      authorUz: 'Sofia Kuznetsova',
      authorRu: 'София Кузнецова',
      authorEn: 'Sofia Kuznetsova',
      slug: 'architecting-for-edge',
      featured: false,
    }
  ];

  const faq = [
    {
      id: '1',
      questionUz: 'Loyihani yaratish va topshirish jarayoningiz qanday?',
      questionRu: 'Каков ваш процесс разработки и сдачи проектов?',
      questionEn: 'What is your process for designing and engineering an Awwwards-level website?',
      answerUz: 'Bizning ish jarayonimiz to‘rt bosqichdan iborat: Tadqiqot, Vizual Konseptlar, Texnik Qurilish va Ishga Tushirish.',
      answerRu: 'Мы делим рабочий процесс на 4 этапа: Исследование, Визуальные концепты, Инжиниринг и Поддержка.',
      answerEn: 'We divide our workflow into four distinct phases: Discovery (deep research), Visual Concepts (custom layouts and aesthetic prototyping), Technical Engineering (modular Next.js, Framer Motion transitions), and Launch & Evolution.',
      categoryUz: 'Jarayon',
      categoryRu: 'Процесс',
      categoryEn: 'process',
      order: 1,
    },
    {
      id: '2',
      questionUz: 'Ko‘p tilli yordam (i18n) va qulaylikni qanday ta‘minlaysiz?',
      questionRu: 'Как вы работаете с локализацией и доступностью?',
      questionEn: 'How do you handle localization (i18n) and accessibility in your applications?',
      answerUz: 'Biz Next.js App Router va mukammal optimallashtirilgan tarjima lug‘atlaridan foydalanamiz.',
      answerRu: 'Мы используем роутер локализации Next.js и оптимизированные файлы словарей.',
      answerEn: 'We use a dynamic App Router routing schema (e.g. /en/about) which guarantees unique search-indexable paths for search engines.',
      categoryUz: 'Texnik',
      categoryRu: 'Технологии',
      categoryEn: 'tech',
      order: 2,
    }
  ];

  const settings = [
    { id: 's1', key: 'site_name', value: 'BEXA Studio', description: 'Name of the website' },
    { id: 's2', key: 'hero_title_en', value: 'WE SHAPE MINIMAL LUXURY DIGITAL EXPERIENCES', description: 'En Hero Title' },
    { id: 's3', key: 'hero_title_ru', value: 'МЫ СОЗДАЕМ ЦИФРОВОЙ ОПЫТ МИНИМАЛЬНОГО ЛЮКСА', description: 'Ru Hero Title' },
    { id: 's4', key: 'hero_title_uz', value: 'BIZ HASHAMATLI MINIMAL RAQAMLI TAJRIBALARNI SHAKLLANTIRAMIZ', description: 'Uz Hero Title' },
    { id: 's5', key: 'seo_description', value: 'BEXA Studio is a creative design and high-performance frontend engineering agency specializing in modern aesthetics.', description: 'Site SEO description' },
    { id: 's6', key: 'contact_email', value: 'hello@bexa.studio', description: 'Global contact email' },
    { id: 's7', key: 'contact_phone', value: '+998 71 202 22 44', description: 'Global phone number' },
    { id: 's8', key: 'facebook_link', value: 'https://facebook.com', description: 'Facebook Link' },
    { id: 's9', key: 'twitter_link', value: 'https://twitter.com', description: 'Twitter Link' },
    { id: 's10', key: 'instagram_link', value: 'https://instagram.com', description: 'Instagram Link' },
    { id: 's11', key: 'linkedin_link', value: 'https://linkedin.com', description: 'LinkedIn Link' },
    { id: 's12', key: 'github_link', value: 'https://github.com', description: 'GitHub Link' }
  ];

  const translations = [
    { id: 't1', key: 'nav.home', uz: 'Bosh Sahifa', ru: 'Главная', en: 'Home', category: 'navigation' },
    { id: 't2', key: 'nav.about', uz: 'Biz Haqimizda', ru: 'О Нас', en: 'About', category: 'navigation' },
    { id: 't3', key: 'nav.whatWeDo', uz: 'Xizmatlar', ru: 'Услуги', en: 'What We Do', category: 'navigation' },
    { id: 't4', key: 'nav.portfolio', uz: 'Portfolio', ru: 'Портфолио', en: 'Portfolio', category: 'navigation' },
    { id: 't5', key: 'nav.team', uz: 'Jamoa', ru: 'Команда', en: 'Team', category: 'navigation' },
    { id: 't6', key: 'nav.news', uz: 'Yangiliklar', ru: 'Новости', en: 'News', category: 'navigation' },
    { id: 't7', key: 'nav.faq', uz: 'Savol-Javob', ru: 'FAQ', en: 'FAQ', category: 'navigation' },
    { id: 't8', key: 'nav.contact', uz: 'Aloqa', ru: 'Контакты', en: 'Contact', category: 'navigation' },
  ];

  const activityLogs = [
    {
      id: 'log1',
      userId: 'u1',
      action: 'SYSTEM_SEED',
      details: 'Database seeded with default super_admin and core assets',
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString()
    }
  ];

  return {
    users,
    roles,
    permissions,
    sessions: [],
    accounts: [],
    portfolio,
    news,
    team,
    faq,
    settings,
    translations,
    activityLogs
  };
}

// Custom JSON Database Controller
class JSONDatabase {
  private cache: DBStore | null = null;

  constructor() {
    this.init();
  }

  private init() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      this.cache = initial;
    } else {
      try {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        this.cache = JSON.parse(fileContent);
      } catch (e) {
        const initial = getInitialData();
        fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
        this.cache = initial;
      }
    }
  }

  private read(): DBStore {
    if (!this.cache) {
      this.init();
    }
    return this.cache!;
  }

  private write(data: DBStore) {
    this.cache = data;
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Generic methods
  public getModel(modelName: keyof DBStore) {
    const self = this;
    return {
      findMany: async (args?: { where?: any; orderBy?: any; take?: number; skip?: number }) => {
        let items = [...self.read()[modelName]];
        if (args?.where) {
          const keys = Object.keys(args.where);
          items = items.filter(item => {
            return keys.every(k => {
              const val = args.where[k];
              if (val && typeof val === 'object') {
                if ('equals' in val) return item[k] === val.equals;
                if ('contains' in val) return String(item[k]).toLowerCase().includes(String(val.contains).toLowerCase());
              }
              return item[k] === val;
            });
          });
        }
        if (args?.orderBy) {
          const sortKey = Object.keys(args.orderBy)[0];
          const sortDir = args.orderBy[sortKey];
          items.sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return sortDir === 'asc' ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortDir === 'asc' ? 1 : -1;
            return 0;
          });
        }
        if (args?.skip) {
          items = items.slice(args.skip);
        }
        if (args?.take) {
          items = items.slice(0, args.take);
        }
        return items;
      },
      findUnique: async (args: { where: any }) => {
        const items = self.read()[modelName];
        const keys = Object.keys(args.where);
        const match = items.find(item => {
          return keys.every(k => item[k] === args.where[k]);
        });
        return match || null;
      },
      findFirst: async (args: { where?: any }) => {
        let items = self.read()[modelName];
        if (args?.where) {
          const keys = Object.keys(args.where);
          items = items.filter(item => {
            return keys.every(k => item[k] === args.where[k]);
          });
        }
        return items[0] || null;
      },
      create: async (args: { data: any }) => {
        const store = self.read();
        const newItem = {
          id: args.data.id || crypto.randomUUID(),
          ...args.data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store[modelName].push(newItem);
        self.write(store);
        return newItem;
      },
      update: async (args: { where: any; data: any }) => {
        const store = self.read();
        const items = store[modelName];
        const keys = Object.keys(args.where);
        const index = items.findIndex(item => {
          return keys.every(k => item[k] === args.where[k]);
        });
        if (index === -1) throw new Error(`Record not found in ${modelName}`);
        
        const updatedItem = {
          ...items[index],
          ...args.data,
          updatedAt: new Date().toISOString()
        };
        items[index] = updatedItem;
        self.write(store);
        return updatedItem;
      },
      upsert: async (args: { where: any; update: any; create: any }) => {
        const store = self.read();
        const items = store[modelName];
        const keys = Object.keys(args.where);
        const index = items.findIndex(item => {
          return keys.every(k => item[k] === args.where[k]);
        });
        
        if (index !== -1) {
          const updatedItem = {
            ...items[index],
            ...args.update,
            updatedAt: new Date().toISOString()
          };
          items[index] = updatedItem;
          self.write(store);
          return updatedItem;
        } else {
          const newItem = {
            id: args.create.id || crypto.randomUUID(),
            ...args.create,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          store[modelName].push(newItem);
          self.write(store);
          return newItem;
        }
      },
      delete: async (args: { where: any }) => {
        const store = self.read();
        const items = store[modelName];
        const keys = Object.keys(args.where);
        const index = items.findIndex(item => {
          return keys.every(k => item[k] === args.where[k]);
        });
        if (index === -1) throw new Error(`Record not found in ${modelName}`);
        const deletedItem = items[index];
        store[modelName] = items.filter((_, idx) => idx !== index);
        self.write(store);
        return deletedItem;
      },
      count: async (args?: { where?: any }) => {
        let items = self.read()[modelName];
        if (args?.where) {
          const keys = Object.keys(args.where);
          items = items.filter(item => {
            return keys.every(k => item[k] === args.where[k]);
          });
        }
        return items.length;
      }
    };
  }
}

const jsonDb = new JSONDatabase();

// Instantiate database delegate based on connectivity
let prismaDelegate: any;

const isPlaceholderUrl = !process.env.DATABASE_URL || 
                         process.env.DATABASE_URL.includes('placeholder') || 
                         process.env.DATABASE_URL.includes('<username>') ||
                         process.env.DATABASE_URL.includes('localhost:5432');

if (process.env.DATABASE_URL && PrismaClientClass && !isPlaceholderUrl) {
  try {
    // Try to instantiate genuine PrismaClient
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClientClass();
    }
    prismaDelegate = globalForPrisma.prisma;
  } catch (e) {
    // Fallback if client initialization throws (e.g. database unreached)
    prismaDelegate = null;
  }
}

// Unified export supporting either active Prisma client or dynamic JSON DB fallbacks
export const prisma = prismaDelegate || {
  user: jsonDb.getModel('users'),
  role: jsonDb.getModel('roles'),
  permission: jsonDb.getModel('permissions'),
  session: jsonDb.getModel('sessions'),
  account: jsonDb.getModel('accounts'),
  portfolio: jsonDb.getModel('portfolio'),
  news: jsonDb.getModel('news'),
  teamMember: jsonDb.getModel('team'),
  faq: jsonDb.getModel('faq'),
  settings: jsonDb.getModel('settings'),
  translation: jsonDb.getModel('translations'),
  activityLog: jsonDb.getModel('activityLogs'),
  $disconnect: async () => {},
};

export default prisma;
