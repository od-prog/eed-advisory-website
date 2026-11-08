import { expect, test } from "@playwright/test";
import type { MotionDefinition } from "../web/src/animations/registry";

const fixturePath = "/e2e-fixtures/motion";

test("motion fixture renders main content and supports SVG stagger children", async ({
  page,
}) => {
  await page.goto(fixturePath);
  await expect(page.locator("main h1")).toHaveText("Motion fixture home");
  await expect(page.getByText("Reveal fixture stays readable")).toBeVisible();

  const svg = page.getByRole("img", { name: "SVG stagger child" });
  await expect(svg).toBeVisible();
  await expect(page.locator('[data-motion="stagger"]')).toHaveAttribute(
    "data-motion-state",
    "done",
    {
      timeout: 10_000,
    },
  );
});

test("reduced motion keeps word content in normal inline layout", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(fixturePath);

  const word = page.locator(".motion-word").first();
  await expect(page.locator('[data-motion="reveal"]')).toHaveAttribute(
    "data-motion-state",
    "done",
  );
  await expect(word).toBeVisible();
  await expect(word).toHaveCSS("display", "inline");
  await expect(word).toHaveCSS("opacity", "1");
});

test("initialized motion uses inline-block word reveal layout", async ({
  page,
}) => {
  await page.goto(fixturePath);

  const word = page.locator(".motion-word").first();
  await expect(page.locator("html")).toHaveClass(/motion-js/);
  await expect(word).toHaveCSS("display", "inline-block");
});

test("navigation reaches the known fixture destination and cleans up old behavior", async ({
  page,
}) => {
  await page.goto(fixturePath);
  await expect(page.locator('[data-behavior-state="active"]')).toHaveCount(1);
  await page.getByRole("link", { name: "Known destination" }).click();

  await expect(page).toHaveURL(/\/e2e-fixtures\/motion\/destination$/);
  await expect(page.locator("main h1")).toHaveText(
    "Motion fixture destination",
  );
  await expect(
    page.getByText(
      "This deterministic destination verifies a full Astro page transition.",
    ),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as Window & { __motionFixtureCleanups?: number })
            .__motionFixtureCleanups ?? 0,
      ),
    )
    .toBe(1);
});

test("motion setup is idempotent and late registration initializes a matching element", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(fixturePath);
  await page.evaluate(() => {
    const fixtureWindow = window as Window & {
      __initialiseMotionLifecycle?: () => void;
    };
    fixtureWindow.__initialiseMotionLifecycle?.();
    fixtureWindow.__initialiseMotionLifecycle?.();
  });

  await page.evaluate(() => {
    const fixtureWindow = window as Window & {
      __registerMotion?: (name: string, definition: MotionDefinition) => void;
    };
    const target = document.querySelector<HTMLElement>(
      '[data-motion="late-fixture"]',
    )!;
    fixtureWindow.__registerMotion?.("late-fixture", {
      init(element) {
        element.dataset.initCount = String(
          Number(element.dataset.initCount ?? 0) + 1,
        );
      },
    });
    fixtureWindow.__registerMotion?.("late-fixture", {
      init(element) {
        element.dataset.initCount = String(
          Number(element.dataset.initCount ?? 0) + 1,
        );
      },
    });
  });

  const target = page.locator('[data-motion="late-fixture"]');
  await expect(target).toHaveAttribute("data-init-count", "1");
  await expect(target).toHaveAttribute("data-motion-state", "done");
  await expect(page.locator('[data-behavior="fixture-cleanup"]')).toHaveCount(
    1,
  );
  await expect(page.locator('[data-behavior-state="active"]')).toHaveCount(1);
});

test("no-JavaScript motion and word content remains visible and unstyled for reveal", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(fixturePath);

  const reveal = page.locator('[data-motion="reveal"]');
  const word = page.locator(".motion-word").first();
  await expect(reveal).toBeVisible();
  await expect(reveal).toHaveText("Reveal fixture stays readable");
  await expect(reveal).not.toHaveCSS("opacity", "0");
  await expect(word).toBeVisible();
  await expect(word).toHaveCSS("display", "inline");
  await expect(word).toHaveCSS("opacity", "1");

  await context.close();
});
