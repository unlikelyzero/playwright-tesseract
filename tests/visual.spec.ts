import { test, expect } from '@playwright/test';

test.describe('Visual Testing Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    // Wait for Cytoscape to initialize
    await page.waitForSelector('#cy');
  });

  test('should match initial graph layout', async ({ page }) => {
    // Take screenshot of the entire graph
    await expect(page.locator('#cy')).toHaveScreenshot('initial-graph.png');
  });

  test('should match node labels', async ({ page }) => {
    await expect(page.locator('#cy')).toHaveScreenshot('initial-graph.png');
    // Zoom in to make labels more visible
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(500); // Wait for zoom animation
    
    // Take screenshot of nodes
    await expect(page.locator('#cy')).toHaveScreenshot('node-labels.png');
  });

  test('should match edge labels', async ({ page }) => {
    await expect(page.locator('#cy')).toHaveScreenshot('initial-graph.png');
    // Pan to a different view
    await page.mouse.move(400, 300);
    await page.mouse.down();
    await page.mouse.move(200, 300);
    await page.mouse.up();
    await page.waitForTimeout(500); // Wait for pan animation
    
    // Take screenshot of edges
    await expect(page.locator('#cy')).toHaveScreenshot('edge-labels.png');
  });

  test('should match graph after interaction', async ({ page }) => {
    // Click a node
    await page.locator('#cy').click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(500); // Wait for any animations
    
    // Take screenshot after interaction
    await expect(page.locator('#cy')).toHaveScreenshot('after-interaction.png');
  });
}); 