import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

async function moduleUrl(path, dependencies = {}) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  let code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  for (const [specifier, url] of Object.entries(dependencies)) code = code.replace(`"${specifier}"`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
}

const toursUrl = await moduleUrl("../src/admin/tours.ts");
const { initialTours, tourImages } = await import(toursUrl);
const { initialWebsiteContent, validateWebsiteContent, featuredTours } = await import(await moduleUrl("../src/shared/website/content.ts", { "../../admin/tours": toursUrl }));

test("initial content and catalogue reproduce the existing public hero and experiences", () => {
  assert.equal(initialWebsiteContent.headline, "Experience Mombasa");
  assert.equal(initialWebsiteContent.headlineEmphasis, "Like a Local.");
  assert.equal(initialWebsiteContent.primaryAction, "Explore experiences");
  assert.equal(initialWebsiteContent.heroImage, "/images/tudor-creek-dhow.jpg");
  assert.deepEqual(featuredTours(initialWebsiteContent, initialTours).map((tour) => tour.name), [
    "Old Town Heritage Tour", "Tudor Creek Dhow Ride", "Fort Jesus Experience",
  ]);
  assert.deepEqual(validateWebsiteContent(initialWebsiteContent, initialTours), {});
});

test("validates required fields and rejects paths outside the local image allowlist", () => {
  const content = { ...initialWebsiteContent, headline: " ", description: "", primaryAction: "", secondaryAction: "", aboutTitle: "", aboutDescription: "", heroImage: "https://example.invalid/image" };
  const errors = validateWebsiteContent(content, initialTours);
  for (const key of ["headline", "description", "primaryAction", "secondaryAction", "aboutTitle", "aboutDescription", "heroImage"]) assert.ok(errors[key]);
  assert.equal(validateWebsiteContent({ ...initialWebsiteContent, heroImage: tourImages[0].value }, initialTours).heroImage, undefined);
});

test("featured tours follow saved order and hide unpublished or missing records", () => {
  const original = JSON.stringify({ initialWebsiteContent, initialTours });
  const tours = initialTours.map((tour) => tour.id === "MTD-T-001" ? { ...tour, status: "Unpublished" } : tour);
  const content = { ...initialWebsiteContent, featuredTourIds: ["MTD-T-003", "MTD-T-001", "missing", "MTD-T-002"] };
  assert.deepEqual(featuredTours(content, tours).map((tour) => tour.id), ["MTD-T-003", "MTD-T-002"]);
  assert.ok(validateWebsiteContent(content, tours).featuredTourIds);
  assert.ok(validateWebsiteContent({ ...content, featuredTourIds: ["MTD-T-004"] }, tours).featuredTourIds);
  assert.ok(validateWebsiteContent({ ...content, featuredTourIds: ["MTD-T-003", "MTD-T-003"] }, tours).featuredTourIds);
  assert.deepEqual(validateWebsiteContent({ ...content, featuredTourIds: [] }, tours), {});
  assert.equal(JSON.stringify({ initialWebsiteContent, initialTours }), original);
});
