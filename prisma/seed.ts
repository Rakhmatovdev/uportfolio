import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed operations...');

  // 1. Clean existing tables if needed
  try {
    await prisma.activityLog.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.portfolio.deleteMany();
    await prisma.news.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.faq.deleteMany();
    await prisma.settings.deleteMany();
    await prisma.translation.deleteMany();
  } catch (e) {
    console.log('Note: Some tables could not be cleared (may be first time running).');
  }

  // 2. Generate Permissions
  const permissionsData = [
    { name: 'create', description: 'Create content' },
    { name: 'update', description: 'Update content' },
    { name: 'delete', description: 'Delete content' },
    { name: 'publish', description: 'Publish content' },
    { name: 'manage_users', description: 'Manage site users' },
    { name: 'manage_roles', description: 'Manage roles and permissions' },
    { name: 'manage_settings', description: 'Manage system settings' },
    { name: 'manage_content', description: 'Manage general content' },
  ];

  const permissions: any[] = [];
  for (const perm of permissionsData) {
    const created = await prisma.permission.create({
      data: perm,
    });
    permissions.push(created);
  }
  console.log(`Seeded ${permissions.length} granular permissions.`);

  // 3. Generate Roles and Map Permissions
  const roles = {
    super_admin: {
      description: 'Complete system access',
      perms: permissions.map(p => p.id),
    },
    admin: {
      description: 'Administrative control',
      perms: permissions.filter(p => ['create', 'update', 'publish', 'manage_content'].includes(p.name)).map(p => p.id),
    },
    editor: {
      description: 'Content manager',
      perms: permissions.filter(p => ['create', 'update', 'publish'].includes(p.name)).map(p => p.id),
    },
    moderator: {
      description: 'Community moderator',
      perms: permissions.filter(p => ['update', 'manage_content'].includes(p.name)).map(p => p.id),
    },
    user: {
      description: 'Standard registered user',
      perms: [],
    },
  };

  const roleRecords: { [key: string]: any } = {};
  for (const [roleName, details] of Object.entries(roles)) {
    const created = await prisma.role.create({
      data: {
        name: roleName,
        description: details.description,
        permissions: {
          connect: details.perms.map(id => ({ id })),
        },
      },
    });
    roleRecords[roleName] = created;
  }
  console.log('Seeded roles and successfully associated permission graphs.');

  // 4. Hash and Seed the Default Super Administrator
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('root123#', salt);

  const superAdmin = await prisma.user.create({
    data: {
      username: 'balu',
      email: 'admin@bexa.studio',
      passwordHash: passwordHash,
      phone: '+998901234567',
      roleId: roleRecords.super_admin.id,
    },
  });

  console.log(`Seeded super administrator: ${superAdmin.username} / Password: root123#`);

  // 5. Pre-populate Portfolio Projects
  const portfolioItems = [
    {
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
  ];

  for (const item of portfolioItems) {
    await prisma.portfolio.create({ data: item });
  }
  console.log('Seeded default portfolio showcase cases.');

  // 6. Pre-populate Team Members
  const teamItems = [
    {
      name: 'Alisher Rakhmatov',
      roleUz: 'Bosh Kreativ Direktor',
      roleRu: 'Главный креативный директор',
      roleEn: 'Principal Creative Director',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      order: 1,
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Sofia Kuznetsova',
      roleUz: 'Dasturlash Bo‘limi Boshlig‘i',
      roleRu: 'Руководитель отдела разработки',
      roleEn: 'Head of Engineering',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
      order: 2,
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  ];

  for (const item of teamItems) {
    await prisma.teamMember.create({ data: item });
  }
  console.log('Seeded primary agency team members profiles.');

  // 7. Pre-populate FAQs
  const faqItems = [
    {
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
  ];

  for (const item of faqItems) {
    await prisma.fAQ.create({ data: item });
  }
  console.log('Seeded primary frequently asked questions.');

  // 8. General Site Settings
  const settingsData = [
    { key: 'site_name', value: 'BEXA Studio', description: 'Name of the website' },
    { key: 'hero_title_en', value: 'WE SHAPE MINIMAL LUXURY DIGITAL EXPERIENCES', description: 'En Hero Title' },
    { key: 'hero_title_ru', value: 'МЫ СОЗДАЕМ ЦИФРОВОЙ ОПЫТ МИНИМАЛЬНОГО ЛЮКСА', description: 'Ru Hero Title' },
    { key: 'hero_title_uz', value: 'BIZ HASHAMATLI MINIMAL RAQAMLI TAJRIBALARNI SHAKLLANTIRAMIZ', description: 'Uz Hero Title' },
    { key: 'seo_description', value: 'BEXA Studio is a creative design and high-performance frontend engineering agency specializing in modern aesthetics.', description: 'Site SEO description' },
    { key: 'contact_email', value: 'hello@bexa.studio', description: 'Global contact email' },
    { key: 'contact_phone', value: '+998 71 202 22 44', description: 'Global phone number' },
  ];

  for (const set of settingsData) {
    await prisma.settings.create({ data: set });
  }
  console.log('Seeded global custom variables and system configurations.');

  // 9. Initial Translations
  const translationsData = [
    { key: 'nav.home', uz: 'Bosh Sahifa', ru: 'Главная', en: 'Home', category: 'navigation' },
    { key: 'nav.about', uz: 'Biz Haqimizda', ru: 'О Нас', en: 'About', category: 'navigation' },
    { key: 'nav.whatWeDo', uz: 'Xizmatlar', ru: 'Услуги', en: 'What We Do', category: 'navigation' },
    { key: 'nav.portfolio', uz: 'Portfolio', ru: 'Портфолио', en: 'Portfolio', category: 'navigation' },
    { key: 'nav.team', uz: 'Jamoa', ru: 'Команда', en: 'Team', category: 'navigation' },
    { key: 'nav.news', uz: 'Yangiliklar', ru: 'Новости', en: 'News', category: 'navigation' },
    { key: 'nav.faq', uz: 'Savol-Javob', ru: 'FAQ', en: 'FAQ', category: 'navigation' },
    { key: 'nav.contact', uz: 'Aloqa', ru: 'Контакты', en: 'Contact', category: 'navigation' },
  ];

  for (const trans of translationsData) {
    await prisma.translation.create({ data: trans });
  }

  // 10. Audit log entry
  await prisma.activityLog.create({
    data: {
      userId: superAdmin.id,
      action: 'SYSTEM_SEED',
      details: 'PostgreSQL database successfully initialized and seeded with default administrative credentials and content models.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('Database seeding successfully completed.');
}

main()
  .catch((e) => {
    console.error('Seeding encountered an error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
