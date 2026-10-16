import type { GlobalConfig } from "payload";
import { signedIn } from "../access";
import { imageField, imagesField, seoGroup, yearField } from "../fields";
import { revalidateGlobal } from "../hooks/revalidate";

const PARAGRAPHS = "Leave a blank line between paragraphs.";

export const Profile: GlobalConfig = {
  slug: "profile",
  label: "Profile",
  admin: { group: "Settings", description: "Your name, biography and contact details, used on the About page and across the site." },
  access: { read: signedIn, update: signedIn },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "About",
          fields: [
            { name: "name", type: "text", required: true, label: "Name" },
            {
              name: "headline",
              type: "textarea",
              maxLength: 160,
              label: "Headline",
              admin: { description: "One sentence under your name on the homepage." },
            },
            { name: "shortBio", type: "textarea", label: "Short biography", admin: { description: "Shown on the homepage." } },
            { name: "fullBio", type: "textarea", label: "Full biography", admin: { description: `Shown on the About page. ${PARAGRAPHS}` } },
            { name: "statement", type: "textarea", label: "Artist statement", admin: { description: PARAGRAPHS } },
            { name: "approach", type: "textarea", label: "How you work", admin: { description: PARAGRAPHS } },
            imageField("portrait", "Portrait"),
            imagesField("studioImages", "Studio images", { maxRows: 6 } as never),
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "email",
              type: "email",
              label: "Email",
              admin: { description: "Every contact button opens an email to this address." },
            },
            {
              name: "location",
              type: "text",
              label: "Location",
              admin: { description: "Optional — only if you want it public." },
            },
            {
              name: "socialLinks",
              type: "array",
              label: "Social links",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "platform",
                      type: "select",
                      required: true,
                      label: "Platform",
                      admin: { width: "30%" },
                      options: ["instagram", "behance", "vimeo", "youtube", "linkedin", "artstation", "dribbble", "tiktok", "bluesky", "x", "other"].map(
                        (value) => ({ value, label: value === "x" ? "X" : value[0].toUpperCase() + value.slice(1) }),
                      ),
                    },
                    { name: "url", type: "text", required: true, label: "Link", admin: { width: "45%" } },
                    { name: "label", type: "text", label: "Label (optional)", admin: { width: "25%" } },
                  ],
                },
              ],
            },
            {
              name: "resume",
              type: "upload",
              relationTo: "media",
              label: "CV (PDF)",
              filterOptions: { mimeType: { equals: "application/pdf" } },
            },
          ],
        },
        {
          label: "Experience and recognition",
          fields: [
            {
              name: "experience",
              type: "array",
              label: "Experience",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "period", type: "text", required: true, label: "When", admin: { width: "25%", placeholder: "2021–2024" } },
                    { name: "title", type: "text", required: true, label: "Role", admin: { width: "40%" } },
                    { name: "organisation", type: "text", label: "Where", admin: { width: "35%" } },
                  ],
                },
              ],
            },
            {
              name: "recognition",
              type: "array",
              label: "Recognition",
              admin: { description: "Clients, exhibitions, publications and awards. Only list what you're happy to make public." },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "category",
                      type: "select",
                      required: true,
                      label: "Type",
                      admin: { width: "25%" },
                      options: [
                        { label: "Client", value: "client" },
                        { label: "Exhibition", value: "exhibition" },
                        { label: "Publication", value: "publication" },
                        { label: "Award", value: "award" },
                        { label: "Collaborator", value: "collaborator" },
                        { label: "Credit", value: "credit" },
                      ],
                    },
                    { name: "title", type: "text", required: true, label: "Name", admin: { width: "45%" } },
                    yearField("30%"),
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "detail", type: "text", label: "Detail", admin: { width: "50%" } },
                    { name: "url", type: "text", label: "Link", admin: { width: "50%" } },
                  ],
                },
              ],
            },
          ],
        },
        { label: "Search and sharing", fields: [seoGroup] },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
};
