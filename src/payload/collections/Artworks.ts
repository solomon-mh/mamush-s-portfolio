import type { CollectionConfig } from "payload";
import { signedIn } from "../access";
import { featuredField, imageField, previousSlugsField, rememberPreviousSlug, slugField, yearField } from "../fields";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { previewPath } from "../preview";

export const Artworks: CollectionConfig = {
  slug: "artworks",
  labels: { singular: "Artwork", plural: "Artworks" },
  orderable: true,
  admin: {
    group: "Portfolio",
    useAsTitle: "title",
    defaultColumns: ["title", "discipline", "year", "_status"],
    listSearchableFields: ["title", "series", "medium"],
    description: "Single works, each with its own page. Drag to change the order they appear in.",
    preview: (doc) => previewPath(`/artwork/${doc.slug}`),
  },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: "title", type: "text", required: true, label: "Title" },
    imageField("image", "Image", {
      required: true,
      admin: { description: "The whole work, uncropped. Ideally 2000–3000 px on the long edge." },
    }),
    {
      type: "row",
      fields: [
        {
          name: "discipline",
          type: "relationship",
          relationTo: "disciplines",
          required: true,
          label: "Discipline",
          admin: { width: "50%" },
        },
        {
          name: "series",
          type: "text",
          label: "Series",
          admin: { width: "50%", description: "Works with the same series name are grouped together." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        yearField("25%"),
        { name: "medium", type: "text", label: "Medium", admin: { width: "40%", placeholder: "Oil on linen" } },
        { name: "dimensions", type: "text", label: "Dimensions", admin: { width: "35%", placeholder: "120 × 90 cm" } },
      ],
    },
    {
      name: "description",
      type: "textarea",
      label: "About this work",
      admin: { description: "Optional. Leave a blank line between paragraphs." },
    },
    {
      name: "project",
      type: "relationship",
      relationTo: "projects",
      label: "Part of project",
      admin: { description: "Optional. Works in a project appear on the project page instead of the main work list." },
    },
    {
      name: "rights",
      type: "text",
      label: "Credit or rights line",
      admin: { placeholder: "Private collection" },
    },
    featuredField,
    slugField,
    previousSlugsField,
  ],
  hooks: {
    beforeChange: [rememberPreviousSlug],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
};
