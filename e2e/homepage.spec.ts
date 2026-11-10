import { expect, test } from "@playwright/test";

const path = "/e2e-fixtures/homepage/en";

test("homepage structure is localized-ready, labeled, and keyboard reachable", async ({
  page,
}) => {
  await page.goto(path);

  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Three connected areas of focus." }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await expect(page.getByText("Draft for EED review")).toBeVisible();
  await expect(page.getByRole("link", { name: "Get in touch" })).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Latest perspectives" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Explore our focus areas" }).first(),
  ).toHaveAttribute("href", "#focus");

  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await expect(page.getByRole("link", { name: "Skip to content" })).toHaveCSS(
    "outline-style",
    "solid",
  );
});

test("homepage cards reflow without horizontal overflow on narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(path);

  await expect(
    page.getByRole("heading", { name: "Energy", exact: true }),
  ).toBeVisible();
  const layout = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    cardColumns: getComputedStyle(document.querySelector(".eed-area-grid")!)
      .gridTemplateColumns.trim()
      .split(/\s+/).length,
  }));

  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.cardColumns).toBe(1);

  await page.setViewportSize({ width: 1280, height: 900 });
  const desktopColumns = await page
    .locator(".eed-area-grid")
    .evaluate(
      (grid) =>
        getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length,
    );
  expect(desktopColumns).toBe(3);
});

test("homepage draft labels and thematic areas render in German", async ({
  page,
}) => {
  await page.goto("/e2e-fixtures/homepage/de");

  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.getByText("Entwurf zur Prüfung durch EED")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Drei miteinander verbundene Themen." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Energie", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Wasser", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Klima", exact: true }),
  ).toBeVisible();
});

test("thematic body text meets normal-text contrast and stays visible without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(path);

  const text = page.getByText(
    "Draft positioning: perspectives for decisions across the energy sector.",
  );
  await expect(text).toBeVisible();
  const contrast = await text.evaluate((element) => {
    const parse = (value: string) =>
      value
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number);
    const linear = (channel: number) => {
      const normalized = channel / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    const luminance = (rgb: number[]) =>
      0.2126 * linear(rgb[0]) +
      0.7152 * linear(rgb[1]) +
      0.0722 * linear(rgb[2]);
    const foreground = luminance(parse(getComputedStyle(element).color));
    const background = luminance(
      parse(getComputedStyle(element.closest("article")!).backgroundColor),
    );
    return (
      (Math.max(foreground, background) + 0.05) /
      (Math.min(foreground, background) + 0.05)
    );
  });

  expect(contrast).toBeGreaterThanOrEqual(4.5);
  await expect(
    page.getByRole("heading", { name: "Climate", exact: true }),
  ).toBeVisible();
  await context.close();
});

test("reduced motion presents the homepage without waiting on animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".eed-area-energy")).toHaveAttribute(
    "data-motion-state",
    "done",
  );
});
