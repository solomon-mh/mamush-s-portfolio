import type { CollectionBeforeChangeHook, Field, GroupField, NumberField, UploadField } from "payload";

/*
 * Field building blocks shared by the collections. Labels and descriptions
 * are written for the artist, not for developers.
 */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The web address of a page, filled in from the title when left empty. */
export const slugField: Field = {
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  label: "Web address",
  admin: {
    position: "sidebar",
    description: "Filled in from the title. Lowercase letters, numbers and dashes, e.g. blue-hour.",
  },
  hooks: {
    beforeValidate: [({ value, data }) => (typeof value === "string" && value.trim() ? slugify(value) : slugify(String(data?.title ?? "")))],
  },
  validate: (value: string | null | undefined) =>
    (value && SLUG.test(value)) || "Use lowercase letters, numbers and single dashes, e.g. blue-hour",
};

/** Former web addresses that redirect to this page. Filled in automatically when the address changes. */
export const previousSlugsField: Field = {
  name: "previousSlugs",
  type: "text",
  hasMany: true,
  label: "Old web addresses",
  admin: {
    position: "sidebar",
    description: "Added automatically when you change the web address, so old links keep working.",
  },
};

/** Remembers the old address whenever the web address changes. */
export const rememberPreviousSlug: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const before = originalDoc?.slug as string | undefined;
  const after = data.slug as string | undefined;
  const previous = new Set<string>((data.previousSlugs ?? originalDoc?.previousSlugs ?? []) as string[]);
  if (before && after && before !== after) previous.add(before);
  if (after) previous.delete(after);
  data.previousSlugs = [...previous];
  return data;
};

const IMAGE_ONLY = { mimeType: { contains: "image" } };

/** An image from the media library. */
export function imageField(name: string, label: string, options: Partial<UploadField> = {}): UploadField {
  return {
    name,
    label,
    type: "upload",
    relationTo: "media",
    filterOptions: IMAGE_ONLY,
    ...options,
  } as UploadField;
}

/** Several images from the media library, in the order chosen. */
export function imagesField(name: string, label: string, options: Partial<UploadField> = {}): UploadField {
  return imageField(name, label, { hasMany: true, ...options } as Partial<UploadField>);
}

const VIDEO_LINK = /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)\//;
const DURATION = /^(\d{1,2}:)?\d{1,2}:\d{2}$/;

type VideoSiblings = { url?: string | null; file?: unknown };

/** A film: a YouTube/Vimeo link (recommended) or an uploaded short clip, with a still shown before it plays. */
export function videoGroup(name: string, label: string, description?: string): GroupField {
  return {
    name,
    label,
    type: "group",
    admin: { description },
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "url",
            type: "text",
            label: "YouTube or Vimeo link",
            admin: { width: "60%", description: "Paste the normal link from the address bar." },
            validate: (value: string | null | undefined) =>
              !value || VIDEO_LINK.test(value) || "Only YouTube and Vimeo links are supported",
          },
          { name: "title", type: "text", label: "Title", admin: { width: "40%" } },
        ],
      },
      {
        name: "file",
        type: "upload",
        relationTo: "media",
        label: "Or upload a short clip",
        filterOptions: { mimeType: { contains: "video" } },
        admin: { description: "MP4, under about 20 MB. For anything longer, use YouTube or Vimeo." },
        validate: (value: unknown, { siblingData }: { siblingData: VideoSiblings }) =>
          !(value && siblingData?.url) || "Use either a link or an uploaded clip, not both",
      },
      imageField("poster", "Still image", {
        admin: { description: "Shown until the film is played. Required when there is a film." },
        validate: (value: unknown, { siblingData }: { siblingData: VideoSiblings }) =>
          Boolean(value) || !(siblingData?.url || siblingData?.file) || "Choose a still image for the film",
      } as Partial<UploadField>),
      {
        type: "row",
        fields: [
          {
            name: "duration",
            type: "text",
            label: "Running time",
            admin: { width: "50%", placeholder: "3:42" },
            validate: (value: string | null | undefined) => !value || DURATION.test(value) || "Use minutes:seconds, e.g. 3:42",
          },
          {
            name: "captions",
            type: "upload",
            relationTo: "media",
            label: "Captions (.vtt)",
            filterOptions: { mimeType: { contains: "vtt" } },
            admin: { width: "50%", description: "Only for uploaded clips with speech." },
          },
        ],
      },
      { name: "transcript", type: "textarea", label: "Transcript" },
    ],
  };
}

/** Search engine and sharing details. */
export const seoGroup: GroupField = {
  name: "seo",
  label: "Search and sharing",
  type: "group",
  admin: { description: "Optional. Leave empty to use the title, summary and main image." },
  fields: [
    { name: "title", type: "text", label: "Title for search results", maxLength: 70 },
    { name: "description", type: "textarea", label: "Description for search results", maxLength: 170 },
    imageField("image", "Image when shared"),
    { name: "noIndex", type: "checkbox", label: "Hide from search engines" },
  ],
};

export function yearField(width?: string): NumberField {
  return { name: "year", type: "number", label: "Year", min: 1000, max: 2100, admin: { step: 1, width } };
}

export const featuredField: Field = {
  name: "featured",
  type: "checkbox",
  label: "Featured",
  defaultValue: false,
  admin: { position: "sidebar", description: "Shown first in lists." },
};
