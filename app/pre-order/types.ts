
export type PersonaLink = { href: string; label: string };

export type Character = {
  name: string;
  role: string;
  image: string;
  tone: string;
  description: string;
  sample: string;
  cadence: string; // human-readable frequency
  links?: PersonaLink[];
};

export type Tier = {
  title: string;
  price: string;
  benefits: string[];
  popular?: boolean;
  link: string;
};

export type DLC = {
  title: string;
  tagline: string;
  image: string;
  features: string[];
  price: string;
  link: string;
};
