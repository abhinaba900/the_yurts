import type { SchemaTypeDefinition } from "sanity";

import { seo } from "./objects/seo";
import { blockContent } from "./objects/blockContent";
import { captionedImage } from "./objects/captionedImage";
import {
  specRow,
  sizeOption,
  namedNote,
  contactDetails,
  socialLinks,
} from "./objects/shared";

import { siteSettings } from "./documents/siteSettings";
import { product } from "./documents/product";
import { productCategory, postCategory, author } from "./documents/taxonomy";
import { post, project } from "./documents/editorial";
import {
  application,
  faq,
  resource,
  configuratorOption,
} from "./documents/support";
import { enquiry } from "./documents/enquiry";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  seo,
  blockContent,
  captionedImage,
  specRow,
  sizeOption,
  namedNote,
  contactDetails,
  socialLinks,

  // Documents
  siteSettings,
  product,
  productCategory,
  application,
  project,
  post,
  postCategory,
  author,
  faq,
  resource,
  configuratorOption,
  enquiry,
];
