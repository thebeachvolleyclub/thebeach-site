const RETIRED_WEBSITE_FORM = "andringsanmalan";

/** The retired public change form must never reach storage or email delivery. */
export function isRetiredWebsiteForm(form: unknown): boolean {
  return form === RETIRED_WEBSITE_FORM;
}
