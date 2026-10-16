import type { CollectionConfig } from "payload";
import { signedIn } from "../access";
import {
  featuredField,
  imageField,
  imagesField,
  previousSlugsField,
  rememberPreviousSlug,
  seoGroup,
  slugField,
  videoGroup,
  yearField,
} from "../fields";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { previewPath } from "../preview";

const PARAGRAPHS = "Leave a blank line between paragraphs.";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Projects" },
  orderable: true,
  admin: {
    group: "Portfolio",
    useAsTitle: "title",
    defaultColumns: ["title", "disciplines", "year", "_status"],
    listSearchableFields: ["title", "client", "summary"],
    description: "Work with a story — a commission, a film, a series. Drag to change the order they appear in.",
    preview: (doc) => previewPath(`/projects/${doc.slug}`),
  },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: "title", type: "text", required: true, label: "Title" },
    {
      type: "tabs",
      tabs: [
        {
          label: "Overview",
          fields: [
            {
              name: "summary",
              type: "textarea",
              maxLength: 400,
              label: "Summary",
              admin: { description: "Two or three sentences introducing the project." },
            },
            {
              name: "disciplines",
              type: "relationship",
              relationTo: "disciplines",
              hasMany: true,
              required: true,
              minRows: 1,
              label: "Disciplines",
              admin: { description: "The first one is the main label." },
            },
            imageField("cover", "Cover image", {
              required: true,
              admin: { description: "Shown in lists. Set the focal point on the image to control crops." },
            }),
            {
              name: "heroType",
              type: "radio",
              label: "Top of the project page",
              defaultValue: "cover",
              options: [
                { label: "Cover image", value: "cover" },
                { label: "A different image", value: "image" },
                { label: "A film", value: "video" },
              ],
              admin: { layout: "horizontal" },
            },
            imageField("heroImage", "Image at the top", {
              admin: { condition: (_, siblings) => siblings?.heroType === "image" },
            }),
            {
              ...videoGroup("heroVideo", "Film at the top"),
              admin: { condition: (_, siblings) => siblings?.heroType === "video" },
            },
          ],
        },
        {
          label: "Story",
          fields: [
            { name: "brief", type: "textarea", label: "The brief", admin: { description: `What was asked for. ${PARAGRAPHS}` } },
            { name: "approach", type: "textarea", label: "Approach", admin: { description: `How you approached it. ${PARAGRAPHS}` } },
            {
              name: "sections",
              type: "blocks",
              label: "Sections",
              labels: { singular: "Section", plural: "Sections" },
              admin: { description: "Text, images and films, shown in this order below the brief and approach." },
              blocks: [
                {
                  slug: "text",
                  labels: { singular: "Text", plural: "Text" },
                  fields: [
                    { name: "heading", type: "text", label: "Heading" },
                    { name: "body", type: "textarea", required: true, label: "Text", admin: { description: PARAGRAPHS } },
                  ],
                },
                {
                  slug: "images",
                  labels: { singular: "Images", plural: "Images" },
                  fields: [
                    { name: "heading", type: "text", label: "Heading" },
                    {
                      name: "layout",
                      type: "select",
                      defaultValue: "stack",
                      label: "Layout",
                      options: [
                        { label: "Stack — one per row, full width", value: "stack" },
                        { label: "Pairs — two side by side", value: "pairs" },
                        { label: "Sheet — small grid for process work", value: "sheet" },
                      ],
                    },
                    imagesField("images", "Images", { required: true, minRows: 1 } as never),
                  ],
                },
                {
                  slug: "video",
                  labels: { singular: "Film", plural: "Films" },
                  fields: [{ name: "heading", type: "text", label: "Heading" }, videoGroup("video", "Film")],
                },
              ],
            },
          ],
        },
        {
          label: "Details",
          fields: [
            {
              type: "row",
              fields: [
                yearField("25%"),
                { name: "client", type: "text", label: "Client", admin: { width: "40%" } },
                { name: "role", type: "text", label: "Your role", admin: { width: "35%" } },
              ],
            },
            { name: "duration", type: "text", label: "Length or duration", admin: { placeholder: "3:42, or 6 weeks" } },
            { name: "deliverables", type: "text", hasMany: true, label: "Deliverables", admin: { description: "Press Enter after each one." } },
            { name: "collaborators", type: "text", hasMany: true, label: "Collaborators", admin: { description: "Press Enter after each one." } },
            {
              name: "credits",
              type: "array",
              label: "Credits",
              labels: { singular: "Credit", plural: "Credits" },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "role", type: "text", required: true, label: "Role", admin: { width: "30%" } },
                    { name: "name", type: "text", required: true, label: "Name", admin: { width: "35%" } },
                    { name: "url", type: "text", label: "Link", admin: { width: "35%" } },
                  ],
                },
              ],
            },
            {
              name: "related",
              type: "relationship",
              relationTo: "projects",
              hasMany: true,
              maxRows: 4,
              label: "Related projects",
              admin: { description: "Optional. When empty, other projects from the same discipline are suggested." },
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
            },
          ],
        },
        { label: "Search and sharing", fields: [seoGroup] },
      ],
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
