import type { GlobalConfig } from "payload";
import { signedIn } from "../access";
import { imageField } from "../fields";
import { revalidateGlobal } from "../hooks/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: { group: "Settings", description: "The homepage selection, contact wording and site-wide details." },
  access: { read: signedIn, update: signedIn },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Homepage",
          fields: [
            {
              name: "heroArtwork",
              type: "relationship",
              relationTo: "artworks",
              label: "Artwork beside your name",
              admin: { description: "The large image at the top of the homepage." },
            },
            {
              name: "heroLoop",
              type: "upload",
              relationTo: "media",
              label: "Short silent loop (optional)",
              filterOptions: { mimeType: { contains: "video" } },
              admin: { description: "A few seconds of MP4 shown instead of the image. Never plays for visitors who prefer reduced motion." },
            },
            {
              name: "announcement",
              type: "text",
              maxLength: 120,
              label: "Availability note",
              admin: { description: "A short line above your name, e.g. “Booking commissions for spring”. It opens an email. Leave empty to hide." },
            },
            {
              name: "selectedWork",
              type: "relationship",
              relationTo: ["projects", "artworks"],
              hasMany: true,
              maxRows: 8,
              label: "Selected work",
              admin: { description: "Your strongest 4–8 pieces, in order. Drag to reorder." },
            },
            {
              name: "featuredProject",
              type: "relationship",
              relationTo: "projects",
              label: "Featured project",
              admin: { description: "Shown large on a dark background." },
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "contactCta",
              type: "group",
              label: "Invitation at the end of each page",
              fields: [
                { name: "heading", type: "text", label: "Heading", admin: { placeholder: "Have a project in mind?" } },
                { name: "text", type: "textarea", label: "Text" },
                { name: "buttonLabel", type: "text", label: "Button", admin: { placeholder: "Start a conversation" } },
              ],
            },
            {
              name: "enquiryTypes",
              type: "text",
              hasMany: true,
              label: "Contact topics",
              admin: { description: "Shown on the contact page. Each opens an email with that subject. Press Enter after each one." },
            },
          ],
        },
        {
          label: "Site",
          fields: [
            { name: "siteName", type: "text", required: true, label: "Site name", defaultValue: "Mamush" },
            {
              name: "siteDescription",
              type: "textarea",
              maxLength: 170,
              label: "Description for search engines",
            },
            {
              name: "accentColor",
              type: "text",
              label: "Accent colour",
              admin: { placeholder: "#2B3A9E", description: "Six-digit hex colour used for highlights." },
              validate: (value: string | null | undefined) =>
                !value || /^#[0-9a-fA-F]{6}$/.test(value) || "Use a six-digit hex colour, e.g. #2B3A9E",
            },
            imageField("defaultShareImage", "Image when the site is shared", {
              admin: { description: "Optional. Defaults to the homepage artwork." },
            }),
            {
              name: "footerLinks",
              type: "array",
              label: "Extra footer links",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, label: "Label", admin: { width: "50%" } },
                    { name: "href", type: "text", required: true, label: "Link", admin: { width: "50%", placeholder: "/about#credits" } },
                  ],
                },
              ],
            },
            {
              name: "privacyPolicy",
              type: "textarea",
              label: "Privacy notice",
              admin: { description: "Optional. Replaces the default notice. Leave a blank line between paragraphs." },
            },
          ],
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
};
