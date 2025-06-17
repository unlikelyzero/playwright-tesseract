import { test, expect } from '@playwright/test';
import { ANIMATION_TIMEOUT } from './constants';

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
    await page.waitForTimeout(ANIMATION_TIMEOUT); // Wait for zoom animation
    
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
    await page.waitForTimeout(ANIMATION_TIMEOUT * 2); // Increased wait time for pan animation to complete
    
    // Take screenshot of edges with a higher threshold for pixel differences
    await expect(page.locator('#cy')).toHaveScreenshot('edge-labels.png', {
      maxDiffPixelRatio: 0.02 // Allow up to 2% pixel difference
    });
  });

  test('should match graph after interaction', async ({ page }) => {
    // Click a node
    await page.locator('#cy').click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(ANIMATION_TIMEOUT); // Wait for any animations
    
    // Take screenshot after interaction
    await expect(page.locator('#cy')).toHaveScreenshot('after-interaction.png');
  });
}); 