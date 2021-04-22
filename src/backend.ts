export type Strength = {
  id: number;
  order: number;
  title: string;
  description: string;
  link: {
    href: string;
    name: string;
  };
};

export type CTA = {
  id: number;
  title: string;
  href: string;
  page: string;
  'cta-text': string;
};

export type Step = {
  title: string;
  img: string;
};

export type ToolSection = {
  id: number;
  name: string;
  explain: string;
  order: number;
  links: {
    href: string;
    name: string;
  }[];
};

export type Word = {
  title: string;
  text: string;
};

export type MenuItem = {
  id: number;
  url: string;
  name: string;
  class?: string;
  component?: string;
  order: string;
};

import {SupabaseClient} from '@supabase/supabase-js';

export async function ctaForPage(
  db: SupabaseClient,
  page: string
): Promise<CTA | null> {
  const ctaReq = (
    await db.from<CTA>('cta').select('id, title, href, cta-text').match({page})
  ).data;

  if (ctaReq) {
    return ctaReq[0];
  }

  return null;
}

export async function loadTools(
  db: SupabaseClient
): Promise<ToolSection[] | null> {
  return (
    await db
      .from<ToolSection>('tools')
      .select('id, name, explain, links, order')
      .order('order', {
        ascending: true,
      })
  ).data;
}

export async function loadSteps(db: SupabaseClient): Promise<Step[] | null> {
  return (await db.from<Step>('how-to-steps').select('title, img')).data;
}

export async function loadGlossary(db: SupabaseClient): Promise<Word[] | null> {
  return (await db.from<Word>('how-to-glossary').select('title, text')).data;
}

export async function loadMenu(db: SupabaseClient): Promise<MenuItem[] | null> {
  return (
    await db
      .from<MenuItem>('menu-items')
      .select('id, url, name, order')
      .order('order', {ascending: true})
  )?.data;
}
