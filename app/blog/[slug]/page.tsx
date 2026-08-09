import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/pages/article-view";
import { JsonLd } from "@/components/seo/json-ld";
import { ARTICLES, articleBy } from "@/lib/articles";
import { articleLd, breadcrumbLd, pageMeta } from "@/lib/seo";
import { ROUTES, SITE } from "@/lib/site";

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
  /* An unknown slug renders the 404 below, so it must describe itself as
     nothing at all. A title here would give a soft 404 a real listing. */
  if (!article) return {};

  return pageMeta({
    title: article.title,
    description: article.note,
    path: `${ROUTES.blog}/${article.slug}`,
    /* `article` rather than `website`. It is what puts a piece into the
       surfaces that treat writing differently from pages, instead of into the
       pile where everything looks like a home page. */
    type: "article",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = articleBy((await params).slug);
  if (!article) notFound();

  return (
    <>
      {/* The piece, and the way to it. Google draws the trail in place of the
          URL in a result, so the second block is not decoration - it is what
          the listing gives as the address. */}
      <JsonLd
        data={[
          articleLd(article),
          breadcrumbLd([
            { name: SITE.name, path: ROUTES.home },
            { name: "Insight", path: ROUTES.blog },
            { name: article.title, path: `${ROUTES.blog}/${article.slug}` },
          ]),
        ]}
      />

      <ArticleView article={article} />
    </>
  );
}
