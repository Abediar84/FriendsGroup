import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { getSeoConfig, getStructuredData } from './siteSeo';

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
};

const setLink = (rel, href) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

export default function SeoManager() {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const seo = getSeoConfig(pathname, language);
    document.title = seo.title;
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    setLink('canonical', seo.canonical);
    setMeta('meta[name="description"]', { name: 'description', content: seo.description });
    setMeta('meta[name="robots"]', { name: 'robots', content: seo.robots });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: seo.canonical });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: seo.image });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: seo.image });

    let schema = document.head.querySelector('#route-structured-data');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'route-structured-data';
      schema.type = 'application/ld+json';
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify(getStructuredData(pathname, language));
  }, [pathname, language]);

  return null;
}
