import { Helmet } from "react-helmet";

/**
 * SEO por página.
 * - title: máximo 60 caracteres.
 * - description: máximo 155 caracteres.
 */
const SITE_URL = "https://santoshayoga.com.co";
const DEFAULT_IMAGE = "https://lovable.dev/opengraph-image-p98pqg.png";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  jsonLd?: JsonLd;
}

const Seo = ({ title, description, path, image, jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const img = image || DEFAULT_IMAGE;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="es_CO" />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
