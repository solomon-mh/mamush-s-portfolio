import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_artworks_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__artworks_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_blocks_images_layout" AS ENUM('stack', 'pairs', 'sheet');
  CREATE TYPE "public"."enum_projects_hero_type" AS ENUM('cover', 'image', 'video');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_blocks_images_layout" AS ENUM('stack', 'pairs', 'sheet');
  CREATE TYPE "public"."enum__projects_v_version_hero_type" AS ENUM('cover', 'image', 'video');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_disciplines_layout" AS ENUM('gallery', 'grid', 'screening', 'index');
  CREATE TYPE "public"."enum_disciplines_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__disciplines_v_version_layout" AS ENUM('gallery', 'grid', 'screening', 'index');
  CREATE TYPE "public"."enum__disciplines_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_profile_social_links_platform" AS ENUM('instagram', 'behance', 'vimeo', 'youtube', 'linkedin', 'artstation', 'dribbble', 'tiktok', 'bluesky', 'x', 'other');
  CREATE TYPE "public"."enum_profile_recognition_category" AS ENUM('client', 'exhibition', 'publication', 'award', 'collaborator', 'credit');
  CREATE TABLE "artworks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"image_id" integer,
  	"discipline_id" integer,
  	"series" varchar,
  	"year" numeric,
  	"medium" varchar,
  	"dimensions" varchar,
  	"description" varchar,
  	"project_id" integer,
  	"rights" varchar,
  	"featured" boolean DEFAULT false,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_artworks_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "artworks_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_artworks_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_image_id" integer,
  	"version_discipline_id" integer,
  	"version_series" varchar,
  	"version_year" numeric,
  	"version_medium" varchar,
  	"version_dimensions" varchar,
  	"version_description" varchar,
  	"version_project_id" integer,
  	"version_rights" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__artworks_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_artworks_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_projects_blocks_images_layout" DEFAULT 'stack',
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"video_url" varchar,
  	"video_title" varchar,
  	"video_file_id" integer,
  	"video_poster_id" integer,
  	"video_duration" varchar,
  	"video_captions_id" integer,
  	"video_transcript" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"summary" varchar,
  	"cover_id" integer,
  	"hero_type" "enum_projects_hero_type" DEFAULT 'cover',
  	"hero_image_id" integer,
  	"hero_video_url" varchar,
  	"hero_video_title" varchar,
  	"hero_video_file_id" integer,
  	"hero_video_poster_id" integer,
  	"hero_video_duration" varchar,
  	"hero_video_captions_id" integer,
  	"hero_video_transcript" varchar,
  	"brief" varchar,
  	"approach" varchar,
  	"year" numeric,
  	"client" varchar,
  	"role" varchar,
  	"duration" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean,
  	"featured" boolean DEFAULT false,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"disciplines_id" integer,
  	"media_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "_projects_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum__projects_v_blocks_images_layout" DEFAULT 'stack',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"video_url" varchar,
  	"video_title" varchar,
  	"video_file_id" integer,
  	"video_poster_id" integer,
  	"video_duration" varchar,
  	"video_captions_id" integer,
  	"video_transcript" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_version_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_hero_type" "enum__projects_v_version_hero_type" DEFAULT 'cover',
  	"version_hero_image_id" integer,
  	"version_hero_video_url" varchar,
  	"version_hero_video_title" varchar,
  	"version_hero_video_file_id" integer,
  	"version_hero_video_poster_id" integer,
  	"version_hero_video_duration" varchar,
  	"version_hero_video_captions_id" integer,
  	"version_hero_video_transcript" varchar,
  	"version_brief" varchar,
  	"version_approach" varchar,
  	"version_year" numeric,
  	"version_client" varchar,
  	"version_role" varchar,
  	"version_duration" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean,
  	"version_featured" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"disciplines_id" integer,
  	"media_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "disciplines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"layout" "enum_disciplines_layout" DEFAULT 'gallery',
  	"short_description" varchar,
  	"introduction" varchar,
  	"cover_id" integer,
  	"showreel_url" varchar,
  	"showreel_title" varchar,
  	"showreel_file_id" integer,
  	"showreel_poster_id" integer,
  	"showreel_duration" varchar,
  	"showreel_captions_id" integer,
  	"showreel_transcript" varchar,
  	"slug" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_disciplines_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "disciplines_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "disciplines_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "_disciplines_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_layout" "enum__disciplines_v_version_layout" DEFAULT 'gallery',
  	"version_short_description" varchar,
  	"version_introduction" varchar,
  	"version_cover_id" integer,
  	"version_showreel_url" varchar,
  	"version_showreel_title" varchar,
  	"version_showreel_file_id" integer,
  	"version_showreel_poster_id" integer,
  	"version_showreel_duration" varchar,
  	"version_showreel_captions_id" integer,
  	"version_showreel_transcript" varchar,
  	"version_slug" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__disciplines_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_disciplines_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_disciplines_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"decorative" boolean,
  	"caption" varchar,
  	"blur_data_u_r_l" varchar,
  	"prefix" varchar DEFAULT '',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artworks_id" integer,
  	"projects_id" integer,
  	"disciplines_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_artwork_id" integer,
  	"hero_loop_id" integer,
  	"announcement" varchar,
  	"featured_project_id" integer,
  	"contact_cta_heading" varchar,
  	"contact_cta_text" varchar,
  	"contact_cta_button_label" varchar,
  	"site_name" varchar DEFAULT 'Mamush' NOT NULL,
  	"site_description" varchar,
  	"accent_color" varchar,
  	"default_share_image_id" integer,
  	"privacy_policy" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"artworks_id" integer
  );
  
  CREATE TABLE "profile_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_profile_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "profile_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"period" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"organisation" varchar
  );
  
  CREATE TABLE "profile_recognition" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" "enum_profile_recognition_category" NOT NULL,
  	"title" varchar NOT NULL,
  	"year" numeric,
  	"detail" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"headline" varchar,
  	"short_bio" varchar,
  	"full_bio" varchar,
  	"statement" varchar,
  	"approach" varchar,
  	"portrait_id" integer,
  	"email" varchar,
  	"location" varchar,
  	"resume_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "profile_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "artworks" ADD CONSTRAINT "artworks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks" ADD CONSTRAINT "artworks_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks" ADD CONSTRAINT "artworks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_texts" ADD CONSTRAINT "artworks_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_parent_id_artworks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_version_discipline_id_disciplines_id_fk" FOREIGN KEY ("version_discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_texts" ADD CONSTRAINT "_artworks_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_artworks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_text" ADD CONSTRAINT "projects_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_images" ADD CONSTRAINT "projects_blocks_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_video" ADD CONSTRAINT "projects_blocks_video_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_video" ADD CONSTRAINT "projects_blocks_video_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_video" ADD CONSTRAINT "projects_blocks_video_video_captions_id_media_id_fk" FOREIGN KEY ("video_captions_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_video" ADD CONSTRAINT "projects_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_credits" ADD CONSTRAINT "projects_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_video_file_id_media_id_fk" FOREIGN KEY ("hero_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_video_poster_id_media_id_fk" FOREIGN KEY ("hero_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_video_captions_id_media_id_fk" FOREIGN KEY ("hero_video_captions_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_texts" ADD CONSTRAINT "projects_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_disciplines_fk" FOREIGN KEY ("disciplines_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_text" ADD CONSTRAINT "_projects_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_images" ADD CONSTRAINT "_projects_v_blocks_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_video" ADD CONSTRAINT "_projects_v_blocks_video_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_video" ADD CONSTRAINT "_projects_v_blocks_video_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_video" ADD CONSTRAINT "_projects_v_blocks_video_video_captions_id_media_id_fk" FOREIGN KEY ("video_captions_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_video" ADD CONSTRAINT "_projects_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_credits" ADD CONSTRAINT "_projects_v_version_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_video_file_id_media_id_fk" FOREIGN KEY ("version_hero_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_video_poster_id_media_id_fk" FOREIGN KEY ("version_hero_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_video_captions_id_media_id_fk" FOREIGN KEY ("version_hero_video_captions_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_texts" ADD CONSTRAINT "_projects_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_disciplines_fk" FOREIGN KEY ("disciplines_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_showreel_file_id_media_id_fk" FOREIGN KEY ("showreel_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_showreel_poster_id_media_id_fk" FOREIGN KEY ("showreel_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_showreel_captions_id_media_id_fk" FOREIGN KEY ("showreel_captions_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "disciplines_texts" ADD CONSTRAINT "disciplines_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "disciplines_rels" ADD CONSTRAINT "disciplines_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "disciplines_rels" ADD CONSTRAINT "disciplines_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_disciplines_v" ADD CONSTRAINT "_disciplines_v_parent_id_disciplines_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."disciplines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_disciplines_v" ADD CONSTRAINT "_disciplines_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_disciplines_v" ADD CONSTRAINT "_disciplines_v_version_showreel_file_id_media_id_fk" FOREIGN KEY ("version_showreel_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_disciplines_v" ADD CONSTRAINT "_disciplines_v_version_showreel_poster_id_media_id_fk" FOREIGN KEY ("version_showreel_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_disciplines_v" ADD CONSTRAINT "_disciplines_v_version_showreel_captions_id_media_id_fk" FOREIGN KEY ("version_showreel_captions_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_disciplines_v" ADD CONSTRAINT "_disciplines_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_disciplines_v_texts" ADD CONSTRAINT "_disciplines_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_disciplines_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_disciplines_v_rels" ADD CONSTRAINT "_disciplines_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_disciplines_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_disciplines_v_rels" ADD CONSTRAINT "_disciplines_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_disciplines_fk" FOREIGN KEY ("disciplines_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_links" ADD CONSTRAINT "site_settings_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_artwork_id_artworks_id_fk" FOREIGN KEY ("hero_artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_loop_id_media_id_fk" FOREIGN KEY ("hero_loop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_featured_project_id_projects_id_fk" FOREIGN KEY ("featured_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_share_image_id_media_id_fk" FOREIGN KEY ("default_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_texts" ADD CONSTRAINT "site_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_social_links" ADD CONSTRAINT "profile_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_experience" ADD CONSTRAINT "profile_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_recognition" ADD CONSTRAINT "profile_recognition_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_resume_id_media_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_rels" ADD CONSTRAINT "profile_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_rels" ADD CONSTRAINT "profile_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "artworks__order_idx" ON "artworks" USING btree ("_order");
  CREATE INDEX "artworks_image_idx" ON "artworks" USING btree ("image_id");
  CREATE INDEX "artworks_discipline_idx" ON "artworks" USING btree ("discipline_id");
  CREATE INDEX "artworks_project_idx" ON "artworks" USING btree ("project_id");
  CREATE UNIQUE INDEX "artworks_slug_idx" ON "artworks" USING btree ("slug");
  CREATE INDEX "artworks_updated_at_idx" ON "artworks" USING btree ("updated_at");
  CREATE INDEX "artworks_created_at_idx" ON "artworks" USING btree ("created_at");
  CREATE INDEX "artworks__status_idx" ON "artworks" USING btree ("_status");
  CREATE INDEX "artworks_texts_order_parent" ON "artworks_texts" USING btree ("order","parent_id");
  CREATE INDEX "_artworks_v_parent_idx" ON "_artworks_v" USING btree ("parent_id");
  CREATE INDEX "_artworks_v_version_version__order_idx" ON "_artworks_v" USING btree ("version__order");
  CREATE INDEX "_artworks_v_version_version_image_idx" ON "_artworks_v" USING btree ("version_image_id");
  CREATE INDEX "_artworks_v_version_version_discipline_idx" ON "_artworks_v" USING btree ("version_discipline_id");
  CREATE INDEX "_artworks_v_version_version_project_idx" ON "_artworks_v" USING btree ("version_project_id");
  CREATE INDEX "_artworks_v_version_version_slug_idx" ON "_artworks_v" USING btree ("version_slug");
  CREATE INDEX "_artworks_v_version_version_updated_at_idx" ON "_artworks_v" USING btree ("version_updated_at");
  CREATE INDEX "_artworks_v_version_version_created_at_idx" ON "_artworks_v" USING btree ("version_created_at");
  CREATE INDEX "_artworks_v_version_version__status_idx" ON "_artworks_v" USING btree ("version__status");
  CREATE INDEX "_artworks_v_created_at_idx" ON "_artworks_v" USING btree ("created_at");
  CREATE INDEX "_artworks_v_updated_at_idx" ON "_artworks_v" USING btree ("updated_at");
  CREATE INDEX "_artworks_v_latest_idx" ON "_artworks_v" USING btree ("latest");
  CREATE INDEX "_artworks_v_texts_order_parent" ON "_artworks_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "projects_blocks_text_order_idx" ON "projects_blocks_text" USING btree ("_order");
  CREATE INDEX "projects_blocks_text_parent_id_idx" ON "projects_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_text_path_idx" ON "projects_blocks_text" USING btree ("_path");
  CREATE INDEX "projects_blocks_images_order_idx" ON "projects_blocks_images" USING btree ("_order");
  CREATE INDEX "projects_blocks_images_parent_id_idx" ON "projects_blocks_images" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_images_path_idx" ON "projects_blocks_images" USING btree ("_path");
  CREATE INDEX "projects_blocks_video_order_idx" ON "projects_blocks_video" USING btree ("_order");
  CREATE INDEX "projects_blocks_video_parent_id_idx" ON "projects_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_video_path_idx" ON "projects_blocks_video" USING btree ("_path");
  CREATE INDEX "projects_blocks_video_video_video_file_idx" ON "projects_blocks_video" USING btree ("video_file_id");
  CREATE INDEX "projects_blocks_video_video_video_poster_idx" ON "projects_blocks_video" USING btree ("video_poster_id");
  CREATE INDEX "projects_blocks_video_video_video_captions_idx" ON "projects_blocks_video" USING btree ("video_captions_id");
  CREATE INDEX "projects_credits_order_idx" ON "projects_credits" USING btree ("_order");
  CREATE INDEX "projects_credits_parent_id_idx" ON "projects_credits" USING btree ("_parent_id");
  CREATE INDEX "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_hero_video_hero_video_file_idx" ON "projects" USING btree ("hero_video_file_id");
  CREATE INDEX "projects_hero_video_hero_video_poster_idx" ON "projects" USING btree ("hero_video_poster_id");
  CREATE INDEX "projects_hero_video_hero_video_captions_idx" ON "projects" USING btree ("hero_video_captions_id");
  CREATE INDEX "projects_seo_seo_image_idx" ON "projects" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_texts_order_parent" ON "projects_texts" USING btree ("order","parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_disciplines_id_idx" ON "projects_rels" USING btree ("disciplines_id");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX "projects_rels_projects_id_idx" ON "projects_rels" USING btree ("projects_id");
  CREATE INDEX "_projects_v_blocks_text_order_idx" ON "_projects_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_text_parent_id_idx" ON "_projects_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_text_path_idx" ON "_projects_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_images_order_idx" ON "_projects_v_blocks_images" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_images_parent_id_idx" ON "_projects_v_blocks_images" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_images_path_idx" ON "_projects_v_blocks_images" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_video_order_idx" ON "_projects_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_video_parent_id_idx" ON "_projects_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_video_path_idx" ON "_projects_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_video_video_video_file_idx" ON "_projects_v_blocks_video" USING btree ("video_file_id");
  CREATE INDEX "_projects_v_blocks_video_video_video_poster_idx" ON "_projects_v_blocks_video" USING btree ("video_poster_id");
  CREATE INDEX "_projects_v_blocks_video_video_video_captions_idx" ON "_projects_v_blocks_video" USING btree ("video_captions_id");
  CREATE INDEX "_projects_v_version_credits_order_idx" ON "_projects_v_version_credits" USING btree ("_order");
  CREATE INDEX "_projects_v_version_credits_parent_id_idx" ON "_projects_v_version_credits" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version__order_idx" ON "_projects_v" USING btree ("version__order");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_version_hero_image_idx" ON "_projects_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_projects_v_version_hero_video_version_hero_video_file_idx" ON "_projects_v" USING btree ("version_hero_video_file_id");
  CREATE INDEX "_projects_v_version_hero_video_version_hero_video_poster_idx" ON "_projects_v" USING btree ("version_hero_video_poster_id");
  CREATE INDEX "_projects_v_version_hero_video_version_hero_video_captio_idx" ON "_projects_v" USING btree ("version_hero_video_captions_id");
  CREATE INDEX "_projects_v_version_seo_version_seo_image_idx" ON "_projects_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_texts_order_parent" ON "_projects_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_disciplines_id_idx" ON "_projects_v_rels" USING btree ("disciplines_id");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_rels_projects_id_idx" ON "_projects_v_rels" USING btree ("projects_id");
  CREATE INDEX "disciplines__order_idx" ON "disciplines" USING btree ("_order");
  CREATE INDEX "disciplines_cover_idx" ON "disciplines" USING btree ("cover_id");
  CREATE INDEX "disciplines_showreel_showreel_file_idx" ON "disciplines" USING btree ("showreel_file_id");
  CREATE INDEX "disciplines_showreel_showreel_poster_idx" ON "disciplines" USING btree ("showreel_poster_id");
  CREATE INDEX "disciplines_showreel_showreel_captions_idx" ON "disciplines" USING btree ("showreel_captions_id");
  CREATE UNIQUE INDEX "disciplines_slug_idx" ON "disciplines" USING btree ("slug");
  CREATE INDEX "disciplines_seo_seo_image_idx" ON "disciplines" USING btree ("seo_image_id");
  CREATE INDEX "disciplines_updated_at_idx" ON "disciplines" USING btree ("updated_at");
  CREATE INDEX "disciplines_created_at_idx" ON "disciplines" USING btree ("created_at");
  CREATE INDEX "disciplines__status_idx" ON "disciplines" USING btree ("_status");
  CREATE INDEX "disciplines_texts_order_parent" ON "disciplines_texts" USING btree ("order","parent_id");
  CREATE INDEX "disciplines_rels_order_idx" ON "disciplines_rels" USING btree ("order");
  CREATE INDEX "disciplines_rels_parent_idx" ON "disciplines_rels" USING btree ("parent_id");
  CREATE INDEX "disciplines_rels_path_idx" ON "disciplines_rels" USING btree ("path");
  CREATE INDEX "disciplines_rels_projects_id_idx" ON "disciplines_rels" USING btree ("projects_id");
  CREATE INDEX "_disciplines_v_parent_idx" ON "_disciplines_v" USING btree ("parent_id");
  CREATE INDEX "_disciplines_v_version_version__order_idx" ON "_disciplines_v" USING btree ("version__order");
  CREATE INDEX "_disciplines_v_version_version_cover_idx" ON "_disciplines_v" USING btree ("version_cover_id");
  CREATE INDEX "_disciplines_v_version_showreel_version_showreel_file_idx" ON "_disciplines_v" USING btree ("version_showreel_file_id");
  CREATE INDEX "_disciplines_v_version_showreel_version_showreel_poster_idx" ON "_disciplines_v" USING btree ("version_showreel_poster_id");
  CREATE INDEX "_disciplines_v_version_showreel_version_showreel_caption_idx" ON "_disciplines_v" USING btree ("version_showreel_captions_id");
  CREATE INDEX "_disciplines_v_version_version_slug_idx" ON "_disciplines_v" USING btree ("version_slug");
  CREATE INDEX "_disciplines_v_version_seo_version_seo_image_idx" ON "_disciplines_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_disciplines_v_version_version_updated_at_idx" ON "_disciplines_v" USING btree ("version_updated_at");
  CREATE INDEX "_disciplines_v_version_version_created_at_idx" ON "_disciplines_v" USING btree ("version_created_at");
  CREATE INDEX "_disciplines_v_version_version__status_idx" ON "_disciplines_v" USING btree ("version__status");
  CREATE INDEX "_disciplines_v_created_at_idx" ON "_disciplines_v" USING btree ("created_at");
  CREATE INDEX "_disciplines_v_updated_at_idx" ON "_disciplines_v" USING btree ("updated_at");
  CREATE INDEX "_disciplines_v_latest_idx" ON "_disciplines_v" USING btree ("latest");
  CREATE INDEX "_disciplines_v_texts_order_parent" ON "_disciplines_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_disciplines_v_rels_order_idx" ON "_disciplines_v_rels" USING btree ("order");
  CREATE INDEX "_disciplines_v_rels_parent_idx" ON "_disciplines_v_rels" USING btree ("parent_id");
  CREATE INDEX "_disciplines_v_rels_path_idx" ON "_disciplines_v_rels" USING btree ("path");
  CREATE INDEX "_disciplines_v_rels_projects_id_idx" ON "_disciplines_v_rels" USING btree ("projects_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_artworks_id_idx" ON "payload_locked_documents_rels" USING btree ("artworks_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_disciplines_id_idx" ON "payload_locked_documents_rels" USING btree ("disciplines_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_footer_links_order_idx" ON "site_settings_footer_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_links_parent_id_idx" ON "site_settings_footer_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_hero_artwork_idx" ON "site_settings" USING btree ("hero_artwork_id");
  CREATE INDEX "site_settings_hero_loop_idx" ON "site_settings" USING btree ("hero_loop_id");
  CREATE INDEX "site_settings_featured_project_idx" ON "site_settings" USING btree ("featured_project_id");
  CREATE INDEX "site_settings_default_share_image_idx" ON "site_settings" USING btree ("default_share_image_id");
  CREATE INDEX "site_settings_texts_order_parent" ON "site_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_projects_id_idx" ON "site_settings_rels" USING btree ("projects_id");
  CREATE INDEX "site_settings_rels_artworks_id_idx" ON "site_settings_rels" USING btree ("artworks_id");
  CREATE INDEX "profile_social_links_order_idx" ON "profile_social_links" USING btree ("_order");
  CREATE INDEX "profile_social_links_parent_id_idx" ON "profile_social_links" USING btree ("_parent_id");
  CREATE INDEX "profile_experience_order_idx" ON "profile_experience" USING btree ("_order");
  CREATE INDEX "profile_experience_parent_id_idx" ON "profile_experience" USING btree ("_parent_id");
  CREATE INDEX "profile_recognition_order_idx" ON "profile_recognition" USING btree ("_order");
  CREATE INDEX "profile_recognition_parent_id_idx" ON "profile_recognition" USING btree ("_parent_id");
  CREATE INDEX "profile_portrait_idx" ON "profile" USING btree ("portrait_id");
  CREATE INDEX "profile_resume_idx" ON "profile" USING btree ("resume_id");
  CREATE INDEX "profile_seo_seo_image_idx" ON "profile" USING btree ("seo_image_id");
  CREATE INDEX "profile_rels_order_idx" ON "profile_rels" USING btree ("order");
  CREATE INDEX "profile_rels_parent_idx" ON "profile_rels" USING btree ("parent_id");
  CREATE INDEX "profile_rels_path_idx" ON "profile_rels" USING btree ("path");
  CREATE INDEX "profile_rels_media_id_idx" ON "profile_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "artworks" CASCADE;
  DROP TABLE "artworks_texts" CASCADE;
  DROP TABLE "_artworks_v" CASCADE;
  DROP TABLE "_artworks_v_texts" CASCADE;
  DROP TABLE "projects_blocks_text" CASCADE;
  DROP TABLE "projects_blocks_images" CASCADE;
  DROP TABLE "projects_blocks_video" CASCADE;
  DROP TABLE "projects_credits" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_texts" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_blocks_text" CASCADE;
  DROP TABLE "_projects_v_blocks_images" CASCADE;
  DROP TABLE "_projects_v_blocks_video" CASCADE;
  DROP TABLE "_projects_v_version_credits" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_texts" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "disciplines" CASCADE;
  DROP TABLE "disciplines_texts" CASCADE;
  DROP TABLE "disciplines_rels" CASCADE;
  DROP TABLE "_disciplines_v" CASCADE;
  DROP TABLE "_disciplines_v_texts" CASCADE;
  DROP TABLE "_disciplines_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_footer_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_texts" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TABLE "profile_social_links" CASCADE;
  DROP TABLE "profile_experience" CASCADE;
  DROP TABLE "profile_recognition" CASCADE;
  DROP TABLE "profile" CASCADE;
  DROP TABLE "profile_rels" CASCADE;
  DROP TYPE "public"."enum_artworks_status";
  DROP TYPE "public"."enum__artworks_v_version_status";
  DROP TYPE "public"."enum_projects_blocks_images_layout";
  DROP TYPE "public"."enum_projects_hero_type";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_blocks_images_layout";
  DROP TYPE "public"."enum__projects_v_version_hero_type";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_disciplines_layout";
  DROP TYPE "public"."enum_disciplines_status";
  DROP TYPE "public"."enum__disciplines_v_version_layout";
  DROP TYPE "public"."enum__disciplines_v_version_status";
  DROP TYPE "public"."enum_profile_social_links_platform";
  DROP TYPE "public"."enum_profile_recognition_category";`)
}
