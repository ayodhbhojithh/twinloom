import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/pages/article-view";
import { ARTICLES, articleBy } from "@/lib/articles";

/** Four articles, known at build time, so all four are rendered ahead of it. */
export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = articleBy((await params).slug);
  if (!article) return {};

  return { title: article.title, description: article.note };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = articleBy((await params).slug);
  if (!article) notFound();

  return <ArticleView article={article} />;
}
