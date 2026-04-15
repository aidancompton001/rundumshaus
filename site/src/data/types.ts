/* ── Site ── */

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  company: string;
  owner: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  phone: string;
  email: string;
  navigation: NavLink[];
  footer: {
    copyright: string;
    legalLinks: NavLink[];
  };
}

/* ── Homepage ── */

export interface HeroCTA {
  label: string;
  href: string;
  variant: "primary" | "ghost";
}

export interface HeroData {
  heading: string;
  subheading: string;
  ctas: HeroCTA[];
}

export interface AboutData {
  heading: string;
  body: string;
  image: string;
  imageAlt: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface HomepageData {
  hero: HeroData;
  about: AboutData;
  stats: StatItem[];
}

/* ── Services ── */

export interface Service {
  id: string;
  title: string;
  description: string;
  detailDescription: string;
  icon: string;
  image?: string;
}

/* ── Contact Form ── */

export interface ContactFormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "checkbox";
  required: boolean;
  placeholder?: string;
}

export interface ContactFormSection {
  heading: string;
  fields: ContactFormField[];
}

export interface ContactFormData {
  title: string;
  heading: string;
  body: string;
  sections: ContactFormSection[];
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
}

/* ── Referenzen ── */

export interface Referenz {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
  date: string;
}

export interface ReferenzenData {
  heading: string;
  emptyState: string;
  items: Referenz[];
}
