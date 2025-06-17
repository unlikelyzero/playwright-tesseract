import fs from 'fs';
import { Page } from '@playwright/test';
import { createWorker, PSM } from 'tesseract.js';

/**
 * Reads a screenshot file from disk and returns its contents as a buffer
 * @param path - The file path to read
 * @returns A Buffer containing the file contents
 * @throws {Error} If the file cannot be read
 */
function readScreenshotBuffer(path: string): Buffer {
  return fs.readFileSync(path);
}

/**
 * Configuration options for OCR processing
 */
interface OCRConfig {
  /** Minimum line size for text detection */
  minLineSize?: number;
  /** Character whitelist for OCR */
  charWhitelist?: string;
  /** Page segmentation mode */
  psm?: PSM;
}

/**
 * Performs OCR on a screenshot using Tesseract.js
 * @param screenshotPath - Path to the screenshot file
 * @param config - Optional configuration for OCR processing
 * @returns Promise resolving to the recognized text
 * @throws {Error} If OCR processing fails
 */
export async function performOCR(
  screenshotPath: string,
  config: OCRConfig = {}
): Promise<string> {
  const buffer = readScreenshotBuffer(screenshotPath);
  
  // Create a new worker for each OCR operation
  const worker = await createWorker();
  
  try {
    // Set parameters for better accuracy
    await worker.setParameters({
      tessedit_pageseg_mode: config.psm || PSM.SINGLE_BLOCK,
      preserve_interword_spaces: '1',
      textord_heavy_nr: '1',
      textord_min_linesize: config.minLineSize?.toString() || '2.5',
      tessjs_create_pdf: '0',
      tessjs_create_hocr: '0',
      tessjs_create_tsv: '0',
      tessjs_create_box: '0',
      tessjs_create_unlv: '0',
      tessjs_create_osd: '0'
    });

    // Perform OCR
    const { data: { text } } = await worker.recognize(buffer);
    return text;
  } finally {
    // Always terminate the worker
    await worker.terminate();
  }
}

/**
 * Configuration options for waiting on Cytoscape
 */
interface CytoscapeWaitConfig {
  /** Timeout in milliseconds to wait for Cytoscape initialization */
  timeout?: number;
  /** Additional delay in milliseconds after Cytoscape is ready */
  additionalDelay?: number;
}

/**
 * Waits for Cytoscape to be fully initialized and ready for interaction
 * @param page - Playwright page object
 * @param config - Optional configuration for waiting behavior
 * @returns Promise that resolves when Cytoscape is ready
 * @throws {Error} If Cytoscape fails to initialize within timeout
 */
export async function waitForCytoscape(
  page: Page,
  config: CytoscapeWaitConfig = {}
): Promise<void> {
  const {
    timeout = 30000,
    additionalDelay = 2000
  } = config;

  // Wait for the container element
  await page.waitForSelector('#cy', { timeout });
  
  // Wait for Cytoscape instance to be available
  await page.waitForFunction(
    () => typeof (window as any).cy !== 'undefined',
    { timeout }
  );

  // Additional delay to ensure rendering is complete
  await page.waitForTimeout(additionalDelay);
} 