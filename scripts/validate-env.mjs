const requiredVariables = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_EMBEDSOCIAL_WIDGET_REF",
  "NEXT_PUBLIC_GOOGLE_REVIEWS_URL",
];

const errors = [];

for (const name of requiredVariables) {
  if (!process.env[name]?.trim()) {
    errors.push(`${name} is required`);
  }
}

for (const name of [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_GOOGLE_REVIEWS_URL",
]) {
  const value = process.env[name]?.trim();

  if (!value) continue;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      errors.push(`${name} must use HTTPS`);
    }

    if (name === "NEXT_PUBLIC_SITE_URL" && (url.pathname !== "/" || url.search || url.hash)) {
      errors.push(`${name} must be an origin without a path, query, or fragment`);
    }
  } catch {
    errors.push(`${name} must be a valid URL`);
  }
}

const embedSocialWidgetRef = process.env.NEXT_PUBLIC_EMBEDSOCIAL_WIDGET_REF?.trim();

if (embedSocialWidgetRef && !/^[A-Za-z0-9_-]{20,200}$/.test(embedSocialWidgetRef)) {
  errors.push("NEXT_PUBLIC_EMBEDSOCIAL_WIDGET_REF must contain only its data-ref identifier");
}

if (errors.length > 0) {
  console.error("Invalid production environment:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Production environment is valid.");
