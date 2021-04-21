export type Strength = {
  id: number;
  title: string;
  description: string;
  link: {
    href: string;
    name: string;
  }
}

export type CTA = {
  title: string;
  href: string;
  page: string;
  'cta-text': string;
}

export type Step = {
  title: string;
  img: string;
}

export type ToolSection = {
  id: number;
  name: string;
  explain: string;
  links: {
    href: string;
    name: string;
  }[];
}

import { SupabaseClient } from '@supabase/supabase-js'

export async function ctaForPage(db: SupabaseClient, page: string): Promise<CTA | null> {
  const ctaReq = (await db.from<CTA>('cta').select('id, title, href, cta-text').match({ page })).data;

  if (ctaReq) {
    return ctaReq[0];
  }

  return null;
}

export async function loadTools(db: SupabaseClient): Promise<ToolSection[] | null> {
  return (await db.from<ToolSection>('tools').select('name, explain, links')).data;
}

export async function loadSteps(db: SupabaseClient): Promise<Step[] | null> {
  return (await db.from<Step>('how-to-steps').select('title, img')).data;
}