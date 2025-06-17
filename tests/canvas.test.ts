import { test, expect } from '@playwright/test';
import { performOCR, waitForCytoscape } from './utils';
import { PSM } from 'tesseract.js';
import { ANIMATION_TIMEOUT } from './constants';

/**
 * Configuration for OCR in tests
 */
const OCR_CONFIG = {
  minLineSize: 2.5,
  charWhitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  psm: PSM.SINGLE_BLOCK
};

/**
 * Configuration for waiting on Cytoscape
 */
const CYTO_WAIT_CONFIG = {
  timeout: 30000,
  additionalDelay: 5000
};

test.describe('Canvas OCR Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForCytoscape(page, CYTO_WAIT_CONFIG);
  });

  test('should detect node labels', async ({ page }) => {
    // Wait for any animations to complete
    await page.waitForTimeout(ANIMATION_TIMEOUT);
    
    // Take screenshot of the canvas
    await page.locator('#cy').screenshot({
      path: 'canvas.png',
      scale: 'device',
      type: 'png'
    });

    // Perform OCR on the screenshot
    const text = await performOCR('canvas.png', OCR_CONFIG);
    
    // Log the detected text for debugging
    console.log('Detected OCR text (node labels):', text);
    // Verify node labels are detected
    expect.soft(text).toContain('Node 1');
    expect.soft(text).toContain('Node 2');
    expect.soft(text).toContain('Node 3');

    expect.soft(text).toContain('Connection 1');
    expect.soft(text).toContain('Connection 2');
    expect.soft(text).toContain('Connection 3');
  });

  test('should detect connection labels', async ({ page }) => {
    // Wait for any animations to complete
    await page.waitForTimeout(ANIMATION_TIMEOUT);
    
    // Take screenshot of the canvas
    await page.locator('#cy').screenshot({
      path: 'canvas.png',
      scale: 'device',
      type: 'png'
    });

    // Perform OCR on the screenshot
    const text = await performOCR('canvas.png', OCR_CONFIG);
    
    // Log the detected text for debugging
    console.log('Detected OCR text (connection labels):', text);
    // Verify connection labels are detected
    expect.soft(text).toContain('Connection 1');
    expect.soft(text).toContain('Connection 2');
    expect.soft(text).toContain('Connection 3');
  });

  test('should display message when clicking Connection 1 label', async ({ page }) => {
    await page.goto('/');
    await waitForCytoscape(page, CYTO_WAIT_CONFIG);
    await page.waitForTimeout(ANIMATION_TIMEOUT);

    // Try clicking the overlay button if it exists
    const overlay = page.locator('#connection1-overlay');
    if (await overlay.count() > 0) {
      await overlay.click();
    } else {
      // Fallback: trigger Cytoscape edge click via JS
      await page.evaluate(() => {
        const cy = (window as any).cy;
        const edge = cy.edges().filter(e => e.data('label') === 'Connection 1')[0];
        if (edge) {
          cy.emit('tap', [edge]);
        }
      });
    }

    // Assert that the message appears
    await expect(page.locator('#message')).toHaveText('Connection 1 clicked!');
  });
}); 