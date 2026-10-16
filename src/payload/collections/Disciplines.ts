import type { CollectionConfig } from "payload";
import { signedIn } from "../access";
import { imageField, previousSlugsField, rememberPreviousSlug, seoGroup, slugField, videoGroup } from "../fields";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { previewPath } from "../preview";

export const Disciplines: CollectionConfig = {
  slug: "disciplines",
  labels: { singular: "Discipline", plural: "Disciplines" },
  orderable: true,
  admin: {
    group: "Portfolio",
    useAsTitle: "title",
    defaultColumns: ["title", "layout", "_status"],
    description: "The areas of work in the menu: Painting, Illustration, Animation… Drag to change their order.",
    preview: (doc) => previewPath(`/work/${doc.slug}`),
  },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: "title", type: "text", required: true, maxLength: 40, label: "Name" },
    {
      name: "layout",
      type: "select",
      required: true,
      defaultValue: "gallery",
      label: "Page layout",
      options: [
        { label: "Gallery — large works hung one by one (painting)", value: "gallery" },
        { label: "Grid — denser rows grouped by series (illustration)", value: "grid" },
        { label: "Screening — showreel and films on a dark background (animation)", value: "screening" },
        { label: "Index — a typographic list of projects (anything else)", value: "index" },
      ],
    },
    {
      name: "shortDescription",
      type: "textarea",
      maxLength: 220,
      label: "Short description",
      admin: { description: "One or two sentences, shown on the homepage and in the menu." },
    },
    {
      name: "introduction",
      type: "textarea",
      label: "Introduction",
      admin: { description: "Shown at the top of the discipline page. Leave a blank line between paragraphs." },
    },
    imageField("cover", "Cover image", { admin: { description: "Shown on the homepage tile. Set the focal point on the image to control the crop." } }),
    videoGroup("showreel", "Showreel", "Optional. Shown at the top of Screening pages."),
    {
      name: "featuredProjects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
      label: "Projects shown first",
    },
    slugField,
    previousSlugsField,
    seoGroup,
  ],
  hooks: {
    beforeChange: [rememberPreviousSlug],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
};
