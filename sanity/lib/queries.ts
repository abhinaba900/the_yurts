import { groq } from "next-sanity";

/**
 * GROQ queries.
 *
 * Every query projects explicitly rather than returning whole documents. That
 * keeps the payload small, makes the TypeScript types in `types.ts` a real
 * contract, and means adding a field in the Studio cannot silently change what
 * a page receives.
 *
 * Nothing here reads `enquiry`. That document holds personal data and must never
 * appear in a query the site can run.
 */

/**
 * The asset id is projected alongside the flattened convenience fields because
 * the image-url builder needs a reference to generate sized, hotspot-cropped
 * URLs. Projecting only `asset->url` gives back the original upload and no way
 * to ask for a crop — which would mean shipping full-resolution photographs.
 */
const imageFields = groq`
  "assetId": asset->_id,
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  alt,
  caption,
  hotspot,
  crop
`;

const seoFields = groq`
  seo {
    metaTitle,
    metaDescription,
    noIndex,
    shareImage { ${imageFields} }
  }
`;

/* -------------------------------------------------------------------------- */
/* Settings                                                                   */
/* -------------------------------------------------------------------------- */

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    tagline,
    description,
    contact,
    social,
    defaultShareImage { ${imageFields} }
  }
`;

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

export const productsQuery = groq`
  *[_type == "product" && defined(slug.current)]
    | order(order asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      tagline,
      summary,
      "category": category->{ title, "slug": slug.current },
      specs[] { label, value, unit, note },
      heroImage { ${imageFields} }
    }
`;

export const productSlugsQuery = groq`
  *[_type == "product" && defined(slug.current)].slug.current
`;

export const productQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    tagline,
    summary,
    body,
    "category": category->{ title, "slug": slug.current },
    heroImage { ${imageFields} },
    gallery[] { ${imageFields} },
    specs[] { label, value, unit, note },
    sizes[] {
      name,
      specs[] { label, value, unit, note },
      floorPlan { ${imageFields} }
    },
    technical,
    materials[] { title, body },
    features[] { title, body },
    customisation[] { title, body },
    interiorOptions[] { title, body },
    "applications": applications[]->{ title, "slug": slug.current, line },
    "downloads": downloads[]->{
      title,
      "slug": slug.current,
      description,
      gated,
      "fileUrl": file.asset->url,
      "fileSize": file.asset->size
    },
    "faqs": faqs[]->{ _id, question, answer, category },
    ${seoFields}
  }
`;

/* -------------------------------------------------------------------------- */
/* Applications                                                               */
/* -------------------------------------------------------------------------- */

export const applicationsQuery = groq`
  *[_type == "application" && defined(slug.current)]
    | order(order asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      line,
      summary,
      heroImage { ${imageFields} }
    }
`;

export const applicationSlugsQuery = groq`
  *[_type == "application" && defined(slug.current)].slug.current
`;

export const applicationQuery = groq`
  *[_type == "application" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    line,
    summary,
    body,
    heroImage { ${imageFields} },
    considerations[] { title, body },
    "products": products[]->{ title, "slug": slug.current, tagline, heroImage { ${imageFields} } },
    ${seoFields}
  }
`;

/* -------------------------------------------------------------------------- */
/* Projects — published only                                                  */
/* -------------------------------------------------------------------------- */

export const projectsQuery = groq`
  *[_type == "project" && published == true && defined(slug.current)]
    | order(completedAt desc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      location,
      projectType,
      completedAt,
      heroImage { ${imageFields} }
    }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && published == true && defined(slug.current)].slug.current
`;

export const projectQuery = groq`
  *[_type == "project" && published == true && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    story,
    location,
    projectType,
    clientName,
    completedAt,
    videoUrl,
    specs[] { label, value, unit, note },
    testimonial { quote, attribution, role },
    heroImage { ${imageFields} },
    gallery[] { ${imageFields} },
    floorPlans[] { ${imageFields} },
    "products": products[]->{ title, "slug": slug.current },
    ${seoFields}
  }
`;

/* -------------------------------------------------------------------------- */
/* Journal — published, and not future-dated                                  */
/* -------------------------------------------------------------------------- */

const postIsLive = groq`_type == "post" && defined(slug.current) && publishedAt <= now()`;

export const postsQuery = groq`
  *[${postIsLive}] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readingTime,
    heroImage { ${imageFields} },
    "author": author->{ name, "slug": slug.current, role },
    "categories": categories[]->{ title, "slug": slug.current }
  }
`;

export const postCountQuery = groq`count(*[${postIsLive}])`;

export const postSlugsQuery = groq`*[${postIsLive}].slug.current`;

export const postQuery = groq`
  *[${postIsLive} && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    publishedAt,
    readingTime,
    heroImage { ${imageFields} },
    "author": author->{ name, "slug": slug.current, role, bio, image { ${imageFields} } },
    "categories": categories[]->{ title, "slug": slug.current },
    "related": select(
      count(related) > 0 => related[]->{
        _id, title, "slug": slug.current, excerpt, publishedAt, readingTime,
        heroImage { ${imageFields} }
      },
      *[${postIsLive} && slug.current != $slug
        && count(categories[@._ref in ^.^.categories[]._ref]) > 0]
        | order(publishedAt desc) [0...3] {
          _id, title, "slug": slug.current, excerpt, publishedAt, readingTime,
          heroImage { ${imageFields} }
        }
    ),
    ${seoFields}
  }
`;

export const postCategoriesQuery = groq`
  *[_type == "postCategory"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "count": count(*[${postIsLive} && references(^._id)])
  }
`;

export const postCategorySlugsQuery = groq`
  *[_type == "postCategory" && defined(slug.current)].slug.current
`;

export const postCategoryQuery = groq`
  *[_type == "postCategory" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, description
  }
`;

export const postsByCategoryQuery = groq`
  *[${postIsLive} && $slug in categories[]->slug.current]
    | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      readingTime,
      heroImage { ${imageFields} },
      "author": author->{ name, "slug": slug.current, role },
      "categories": categories[]->{ title, "slug": slug.current }
    }
`;

/* -------------------------------------------------------------------------- */
/* Questions and resources                                                    */
/* -------------------------------------------------------------------------- */

export const faqsQuery = groq`
  *[_type == "faq"] | order(category asc, order asc) {
    _id,
    question,
    answer,
    category
  }
`;

export const resourcesQuery = groq`
  *[_type == "resource"] | order(category asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    category,
    gated,
    coverImage { ${imageFields} },
    "fileUrl": file.asset->url,
    "fileSize": file.asset->size
  }
`;

/* -------------------------------------------------------------------------- */
/* Configurator                                                               */
/* -------------------------------------------------------------------------- */

export const configuratorOptionsQuery = groq`
  *[_type == "configuratorOption"] | order(group asc, order asc) {
    _id,
    group,
    label,
    description,
    assetKey,
    isDefault,
    swatch { ${imageFields} }
  }
`;
