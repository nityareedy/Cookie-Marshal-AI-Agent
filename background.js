/**
 * Cookie Marshal AI Agent - Background Script
 * Minimal background script for essential functionality
 */

class BackgroundManager {
  constructor() {
    this.defaultSettings = {
      isEnabled: true,
      stats: {
        bannersRejected: 0,
        sitesProcessed: 0
      }
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeSettings();
    console.log('🍪 Cookie Marshal AI Agent background script loaded');
  }

  setupEventListeners() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Handle essential messages from content scripts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async response
    });
  }

  async handleInstallation(details) {
    if (details.reason === 'install') {
      // First time installation
      await this.initializeSettings();
      
      console.log('🍪 Cookie Marshal AI Agent installed successfully');
    } else if (details.reason === 'update') {
      // Extension updated
      console.log('🍪 Extension updated from version', details.previousVersion);
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ success: true, data: settings });
          break;

        case 'updateSettings':
          await this.updateSettings(request.settings);
          sendResponse({ success: true });
          break;

        case 'updateStats':
          await this.updateStats(request.stats);
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background message handler error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async initializeSettings() {
    try {
      const stored = await chrome.storage.sync.get(['isEnabled', 'stats']);
      
      if (stored.isEnabled === undefined) {
        await chrome.storage.sync.set(this.defaultSettings);
        console.log('🍪 Initialized default settings');
      }
    } catch (error) {
      console.error('Failed to initialize settings:', error);
    }
  }

  async getSettings() {
    try {
      const result = await chrome.storage.sync.get(['isEnabled', 'stats']);
      return {
        isEnabled: result.isEnabled !== false, // Default to true
        stats: result.stats || this.defaultSettings.stats
      };
    } catch (error) {
      console.error('Failed to get settings:', error);
      return this.defaultSettings;
    }
  }

  async updateSettings(settings) {
    try {
      await chrome.storage.sync.set(settings);
      console.log('🍪 Settings updated');
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }

  async updateStats(stats) {
    try {
      await chrome.storage.sync.set({ stats });
      console.log('🍪 Stats updated');
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  }
}

// Initialize the background manager
new BackgroundManager(); 