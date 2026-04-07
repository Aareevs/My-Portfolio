import { expect, test } from "@playwright/test";

test("uses a public wallpaper URL on the login screen", async ({ page }) => {
  await page.addInitScript(() => {
    window.DEBUG_DEFAULT_SESSION = {
      wallpaperImage: "/Users/Public/Pictures/Tahoe Day.jpg",
    };
  });

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();

  await expect(
    page.locator("body > #__next > div > div").first()
  ).toHaveCSS(
    "background-image",
    /Tahoe%20Day\.jpg|Tahoe Day\.jpg/
  );
});
