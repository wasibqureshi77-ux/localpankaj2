import mongoose, { Schema, model, models } from "mongoose";

const SiteConfigSchema = new Schema(
  {
    logo: { type: String },
    phone: { type: String },
    email: { type: String },
    themeColor: { type: String, default: "#4F46E5" },
    workingHours: { type: String },
    heroText: { type: String },
    heroSubtitle: { type: String },
    aboutTitle: { type: String },
    aboutText: { type: String },
    missionText: { type: String },
    footerText: { type: String },
    facebookUrl: { type: String },
    instagramUrl: { type: String },
    twitterUrl: { type: String },
    youtubeUrl: { type: String },
    logoSizeDesktop: { type: Number, default: 100 },
    logoSizeMobile: { type: Number, default: 50 },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
   delete models.SiteConfig;
}
export const SiteConfig = models.SiteConfig || model("SiteConfig", SiteConfigSchema);
