const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/testing/reset");
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Peyton",
        username: "peyton01",
        password: "test",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Login to Application")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("peyton01");
      await page.getByTestId("password").fill("test");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("peyton logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("peyton01");
      await page.getByTestId("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("Incorrect Credentials");
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId("username").fill("peyton01");
      await page.getByTestId("password").fill("test");
      await page.getByRole("button", { name: "login" }).click();
      await page.getByRole("button", { name: "add blog" }).click();
      await page.getByTestId("title").fill("test title");
      await page.getByTestId("author").fill("test author");
      await page.getByTestId("URL").fill("test url");
      await page.getByTestId("likes").fill("1");
      await page.getByRole("button", { name: "save" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await expect(page.getByText("test title by test author")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("Likes: 2")).toBeVisible();
    });

    test("a blog can be removed", async ({ page }) => {
      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "remove" }).click();
      const blogDiv = page.locator(".blogdiv");
      await expect(blogDiv).toBeEmpty
    });
  });
});
