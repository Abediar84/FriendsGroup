export const SITE_URL = 'https://friendsgrp.com';
export const LAST_UPDATED = '2026-07-16';

export const SEO_ROUTES = {
  '/': {
    canonical: '/',
    index: true,
    en: {
      title: 'Spa at Azur One Eleven, New Alamein | Friends Group',
      description: 'Discover Friends Group spa treatments and relaxation experiences at Azur One Eleven Hotel in New Alamein on Egypt’s North Coast. View the spa menu and prices.'
    },
    ar: {
      title: 'سبا أزور وان إليفن في العلمين الجديدة | Friends Group',
      description: 'اكتشف علاجات السبا وتجارب الاسترخاء من Friends Group داخل فندق أزور وان إليفن في العلمين الجديدة بالساحل الشمالي، مع قائمة الخدمات والأسعار.'
    }
  },
  '/menu': {
    canonical: '/menu/',
    index: true,
    en: {
      title: 'Spa Treatments at Azur One Eleven | Friends Group',
      description: 'View spa treatments, massage, Egyptian hammam, sauna, steam and jacuzzi prices and durations at Azur One Eleven Hotel in New Alamein, North Coast.'
    },
    ar: {
      title: 'علاجات السبا في أزور وان إليفن | Friends Group',
      description: 'تعرف على أسعار ومدد علاجات السبا والمساج والحمام المصري والساونا والبخار والجاكوزي داخل فندق أزور وان إليفن في العلمين الجديدة بالساحل الشمالي.'
    }
  },
  '/promotions': {
    canonical: '/promotions/',
    index: false,
    en: {
      title: 'Friends Group B2B Partner Offers',
      description: 'Private Friends Group partner portal for hotel offer enquiries.'
    },
    ar: {
      title: 'عروض شركاء Friends Group',
      description: 'بوابة Friends Group الخاصة لاستفسارات شركاء الفنادق.'
    }
  },
  '/roadmap': {
    canonical: '/roadmap/',
    index: false,
    en: { title: 'Friends Group Roadmap', description: 'Internal Friends Group product roadmap.' },
    ar: { title: 'خطة Friends Group', description: 'خطة المنتج الداخلية لـ Friends Group.' }
  }
};

const normalizePath = (pathname = '/') => {
  const clean = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  if (clean.startsWith('/programs/')) return '/menu';
  return SEO_ROUTES[clean] ? clean : '/';
};

export const getSeoConfig = (pathname = '/', language = 'en') => {
  const route = normalizePath(pathname);
  const config = SEO_ROUTES[route];
  const localized = config[language] || config.en;
  return {
    ...localized,
    route,
    canonical: `${SITE_URL}${config.canonical}`,
    robots: config.index ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, nofollow',
    index: config.index,
    image: `${SITE_URL}/og-image.jpg`
  };
};

const organization = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Friends Group',
  description: 'Friends Group operates spa treatment and relaxation services at Azur One Eleven Hotel in New Alamein on Egypt’s North Coast.',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/og-image.jpg`,
  foundingDate: '2003',
  email: 'info@friendsgrp.com',
  telephone: '+201207776033',
  sameAs: [
    'https://facebook.com/Friendsgrp.AzurOneEleven',
    'https://instagram.com/Friendsgrp.AzurOneEleven',
    'https://www.linkedin.com/company/friends-group-spa-travel'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+201207776033',
    contactType: 'customer service',
    availableLanguage: ['English', 'Arabic']
  }
};

const daySpa = {
  '@type': 'DaySpa',
  '@id': `${SITE_URL}/#spa`,
  name: 'Friends Group Spa & Wellness',
  alternateName: 'Friends Spa at Azur One Eleven',
  description: 'Spa treatments, massage, Egyptian hammam, sauna, steam and jacuzzi relaxation experiences at Azur One Eleven Hotel in New Alamein, North Coast.',
  url: `${SITE_URL}/menu/`,
  telephone: '+201207776033',
  image: `${SITE_URL}/og-image.jpg`,
  priceRange: '600-8000 EGP',
  parentOrganization: { '@id': `${SITE_URL}/#organization` },
  containedInPlace: {
    '@type': 'Hotel',
    name: 'Azur One Eleven Hotel',
    url: 'https://www.azurhospitality.com/en/north-coast/azur-one-eleven-hotel'
  },
  areaServed: [
    { '@type': 'City', name: 'New Alamein' },
    { '@type': 'AdministrativeArea', name: 'North Coast, Egypt' }
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Azur One Eleven Hotel',
    addressLocality: 'New Alamein City',
    addressRegion: 'North Coast',
    addressCountry: 'EG'
  },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '22:00'
  }]
};

const menuServices = [
  ['Red Sea Spa Program', '4200', 'PT120M'],
  ['Paradise Spa Program', '4200', 'PT120M'],
  ['Egyptian Hammam', '4200', 'PT120M'],
  ['Friends VIP Wellness Program', '8000', 'PT150M'],
  ['Medical Massage', '2800', 'PT50M'],
  ['Sports Massage', '2800', 'PT50M'],
  ['Swedish Relaxing Massage', '2800', 'PT50M'],
  ['Hot Stone Therapy', '3500', 'PT50M'],
  ['Sauna, Steam and Jacuzzi', '1800', 'PT60M']
];

export const getStructuredData = (pathname = '/', language = 'en') => {
  const seo = getSeoConfig(pathname, language);
  const graph = [organization];

  if (seo.route === '/' || seo.route === '/menu') graph.push(daySpa);
  graph.push({
    '@type': 'WebPage',
    '@id': `${seo.canonical}#webpage`,
    url: seo.canonical,
    name: seo.title,
    description: seo.description,
    inLanguage: language === 'ar' ? 'ar-EG' : 'en',
    dateModified: LAST_UPDATED,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': seo.route === '/menu' ? `${SITE_URL}/#spa` : `${SITE_URL}/#organization` }
  });

  if (seo.route === '/') {
    graph.push({ '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Friends Group', publisher: { '@id': `${SITE_URL}/#organization` }, inLanguage: ['en', 'ar'] });
  }

  if (seo.route === '/menu') {
    graph.push({
      '@type': 'ItemList',
      name: 'Spa Treatments at Azur One Eleven Hotel, New Alamein',
      itemListElement: menuServices.map(([name, price, duration], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name,
          duration,
          provider: { '@id': `${SITE_URL}/#spa` },
          offers: { '@type': 'Offer', price, priceCurrency: 'EGP', availability: 'https://schema.org/InStock', url: `${SITE_URL}/menu/` }
        }
      }))
    });
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Spa Menu', item: `${SITE_URL}/menu/` }
      ]
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
};
