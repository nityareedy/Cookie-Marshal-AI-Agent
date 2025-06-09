/**
 * Cookie Marshal AI Agent - Content Script
 * Advanced anti-evasion system for modern cookie banner techniques
 */

(function() {
  'use strict';
  
  // Prevent multiple script executions
  if (window.cookieBannerKillerLoaded) {
    console.log('🍪 Cookie Banner Killer already loaded, skipping...');
    return;
  }
  window.cookieBannerKillerLoaded = true;

  // Global error handler for the extension
  const extensionErrorHandler = (error, context = 'unknown') => {
    console.error(`🚨 Cookie Banner Killer Error [${context}]:`, error);
    return true; // Continue execution
  };

  // PRODUCTION-READY LOGGING SYSTEM
  const Logger = {
    // Set to 'production' for release, 'development' for testing
    level: 'production', // Change this for production build
    
    log: function(...args) {
      if (this.level === 'development') {
        console.log(...args);
      }
    },
    
    warn: function(...args) {
      if (this.level === 'development') {
        console.warn(...args);
      }
    },
    
    error: function(...args) {
      // Always log errors, even in production
      console.error(...args);
    },
    
    info: function(...args) {
      if (this.level === 'development') {
        console.info(...args);
      }
    }
  };

  // Wrap critical operations in try-catch
  const safeExecute = (fn, context = 'operation') => {
    try {
      return fn();
    } catch (error) {
      extensionErrorHandler(error, context);
      return null;
    }
  };

  class AntiEvasionCookieKiller {
    constructor() {
      this.isEnabled = true;
      this.processedBanners = new Set();
      this.delayedBanners = new Set();
      this.shadowRoots = new Set();
      this.interceptedScripts = new Set();
      
      this.statistics = {
        bannersFound: 0,
        bannersHidden: 0,
        buttonsClicked: 0,
        delayedBannersDetected: 0,
        evasionAttempts: 0,
        sitesProcessed: new Set()
      };
      
      // Anti-evasion configuration
      this.evasionConfig = {
        maxScanDepth: 10,
        delayDetectionTimeout: 30000, // 30 seconds max wait
        aggressiveMode: true,
        proactiveBlocking: true,
        stealthMode: true
      };
      
      // Initialize components
      this.ruleBasedAgent = null;
      this.aiEngine = null;
      this.hybridCoordinator = null;
      this.isInitializing = false;
      
      // Advanced detection arrays
      this.observers = [];
      this.scanIntervals = [];
      this.retryCount = 0;
      this.maxRetries = 5;
      this.lastScanTime = 0;
      
      // Initialize timeout variables to prevent cleanup errors
      this.scanTimeout = null;
      this.periodicInterval = null;
      this.retryTimeout = null;
      
      // CRITICAL FIX: Initialize detectedFrameworks properly
      this.detectedFrameworks = new Set();
      
      // Pattern detection
      this.suspiciousPatterns = new Set();
      this.knownEvasionTechniques = this.initializeEvasionDetection();
      
      // SAFE INTEGRATION: Initialize multi-language detector if available
      this.multiLanguageDetector = null;
      this.initializeMultiLanguageSupport();
      
      // SAFE INTEGRATION: Initialize performance optimizer if available
      this.performanceOptimizer = null;
      this.initializePerformanceOptimizer();
      
      // NEW: Initialize toast notification system
      this.initializeToastSystem();
      
      console.log('🛡️ Anti-Evasion Cookie Banner Killer initialized');
    }

    // NEW: Initialize toast notification system
    initializeToastSystem() {
      // Create toast container if it doesn't exist
      if (!document.getElementById('cookie-killer-toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'cookie-killer-toast-container';
        toastContainer.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
      }
    }

    // NEW: Show toast notification
    showToast(type, message, buttonText = null, duration = 5000) {
      const container = document.getElementById('cookie-killer-toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      const isSuccess = type === 'success';
      const icon = isSuccess ? '✅' : '❌';
      const bgColor = isSuccess ? '#28a745' : '#dc3545';
      
      let fullMessage = `${icon} ${message}`;
      if (buttonText) {
        fullMessage += `\nButton: "${buttonText}"`;
      }

      toast.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 12px 16px;
        margin-bottom: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-size: 14px;
        font-weight: 500;
        line-height: 1.4;
        max-width: 350px;
        word-wrap: break-word;
        white-space: pre-line;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        pointer-events: auto;
        cursor: pointer;
      `;
      
      toast.textContent = fullMessage;
      
      // Add click to dismiss
      toast.addEventListener('click', () => {
        this.hideToast(toast);
      });
      
      container.appendChild(toast);
      
      // Animate in
      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
      }, 100);
      
      // Auto remove
      setTimeout(() => {
        this.hideToast(toast);
      }, duration);
    }

    hideToast(toast) {
      if (!toast.parentNode) return;
      
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }

    // SAFE INTEGRATION: Initialize multi-language support
    initializeMultiLanguageSupport() {
      try {
        if (window.MultiLanguageDetector) {
          this.multiLanguageDetector = new window.MultiLanguageDetector();
          console.log('🌍 Multi-language support enabled:', this.multiLanguageDetector.getLanguageStats());
        }
      } catch (error) {
        console.warn('Multi-language detector initialization failed:', error);
        // Graceful fallback - existing functionality continues
      }
    }

    // SAFE INTEGRATION: Initialize performance optimizer
    initializePerformanceOptimizer() {
      try {
        if (window.PerformanceOptimizer) {
          this.performanceOptimizer = new window.PerformanceOptimizer();
          console.log('⚡ Performance optimization enabled');
        }
      } catch (error) {
        console.warn('Performance optimizer initialization failed:', error);
        // Graceful fallback - existing functionality continues
      }
    }

    initializeEvasionDetection() {
      return {
        // Delayed loading patterns
        delayedLoadingIndicators: [
          'setTimeout', 'setInterval', 'requestAnimationFrame',
          'DOMContentLoaded', 'load', 'scroll', 'click',
          'onScroll', 'onLoad', 'onDOMReady'
        ],
        
        // Stealth techniques
        stealthClasses: [
          'hidden', 'invisible', 'opacity-0', 'display-none',
          'sr-only', 'screen-reader', 'visually-hidden'
        ],
        
        // Common cookie frameworks
        cookieFrameworks: [
          'cookiebot', 'onetrust', 'trustarc', 'quantcast',
          'didomi', 'usercentrics', 'cookiepro', 'termly',
          'iubenda', 'cookieyes', 'complianz', 'borlabs'
        ],
        
        // Advanced evasion signatures
        evasionSignatures: [
          'bot-detect', 'headless', 'automation', 'selenium',
          'webdriver', 'phantom', 'spider', 'crawler'
        ]
      };
    }

    async initialize() {
      if (this.isInitializing) return;
      this.isInitializing = true;
      
      try {
        console.log('🚀 Initializing Anti-Evasion Cookie Killer with advanced detection...');
        
        // Inject advanced blocking scripts
        await this.injectAdvancedScript();
        
        // Initialize core agents
        this.ruleBasedAgent = new CookieBannerAgent();
        
        // Initialize AI engine if available
        if (window.AIEngine) {
          this.aiEngine = new window.AIEngine();
          console.log('🧠 AI Engine initialized');
        }
        
        // Create hybrid coordinator
        if (window.HybridCoordinator && this.ruleBasedAgent) {
          this.hybridCoordinator = new window.HybridCoordinator(this.ruleBasedAgent, this.aiEngine);
          console.log('🤖 Hybrid Coordinator initialized');
        }
        
        // Initialize AI in background
        if (this.aiEngine) {
          this.aiEngine.initialize().catch(error => {
            console.warn('AI initialization failed, continuing with rules:', error);
          });
        }
        
        console.log('✅ Anti-Evasion Cookie Killer ready');
        
        // Start aggressive scanning
        await this.startAdvancedDetection();
        
      } catch (error) {
        console.error('❌ Failed to initialize:', error);
        this.ruleBasedAgent = new CookieBannerAgent();
        await this.startAdvancedDetection();
      }
      
      this.isInitializing = false;
    }

    async startAdvancedDetection() {
      console.log('🕵️ Starting advanced cookie banner detection...');
      
      // Phase 1: Immediate scan
      await this.performImmediateScan();
      
      // Phase 2: Setup continuous monitoring
      this.setupAdvancedObservers();
      
      // Phase 3: Setup delayed detection
      this.setupDelayedDetection();
      
      // Phase 4: Setup stealth detection
      this.setupStealthDetection();
      
      // Phase 5: Setup framework-specific detection
      this.setupFrameworkDetection();
      
      // Phase 6: Setup proactive blocking
      if (this.evasionConfig.proactiveBlocking) {
        this.setupProactiveBlocking();
      }
    }

    async performImmediateScan() {
      console.log('⚡ Performing immediate banner scan...');
      
      // Scan for existing banners
      await this.scanForBanners();
      
      // Scan shadow DOM
      this.scanShadowDOM();
      
      // Scan for hidden elements that might become visible
      this.scanHiddenElements();
      
      // Check for framework loading indicators
      this.detectFrameworkLoading();
    }

    setupAdvancedObservers() {
      console.log('👁️ Setting up advanced DOM observers...');
      
      // Main DOM observer with enhanced detection
      const mainObserver = new MutationObserver((mutations) => {
        this.handleDOMMutations(mutations);
      });
      
      mainObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true
      });
      
      this.observers.push(mainObserver);
      
      // Shadow DOM observer
      const shadowObserver = new MutationObserver((mutations) => {
        this.handleShadowDOMMutations(mutations);
      });
      
      // Monitor for new shadow roots
      this.monitorShadowRoots();
      
      // Style observer to catch CSS-based showing/hiding
      this.setupStyleObserver();
      
      // Script injection observer
      this.setupScriptObserver();
    }

    async handleDOMMutations(mutations) {
      let needsScan = false;
      let hasDelayedContent = false;
      
      for (const mutation of mutations) {
        // Check for added nodes
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check for cookie-related content
              if (this.isLikelyCookieElement(node)) {
                needsScan = true;
                console.log('🎯 Detected potential cookie element:', node);
              }
              
              // Check for delayed loading indicators
              if (this.hasDelayedLoadingIndicators(node)) {
                hasDelayedContent = true;
                this.statistics.delayedBannersDetected++;
              }
              
              // Check for framework components
              if (this.isFrameworkComponent(node)) {
                console.log('🏭 Detected cookie framework component:', node);
                needsScan = true;
              }
            }
          }
        }
        
        // Check for attribute changes that might reveal hidden banners
        if (mutation.type === 'attributes') {
          const element = mutation.target;
          if (this.isAttributeChangeRevealing(element, mutation.attributeName, mutation.oldValue)) {
            needsScan = true;
            console.log('👀 Detected revealing attribute change:', element);
          }
        }
      }
      
      // Debounced scanning
      if (needsScan) {
        this.debouncedScan();
      }
      
      // Extended monitoring for delayed content
      if (hasDelayedContent) {
        this.setupExtendedMonitoring();
      }
    }

    setupDelayedDetection() {
      console.log('⏱️ Setting up delayed banner detection...');
      
      // Multiple scan intervals to catch delayed banners
      const intervals = [2000, 5000, 10000, 15000, 20000, 30000];
      
      intervals.forEach((delay, index) => {
        const intervalId = setTimeout(async () => {
          console.log(`🔍 Delayed scan ${index + 1}/${intervals.length} (${delay}ms)`);
          
          await this.scanForBanners();
          this.scanForNewFrameworks();
          this.detectLazyLoadedContent();
          
          // Aggressive mode: scan deeper into page structure
          if (this.evasionConfig.aggressiveMode) {
            await this.performDeepScan();
          }
          
        }, delay);
        
        this.scanIntervals.push(intervalId);
      });
      
      // Event-based delayed detection
      this.setupEventBasedDetection();
    }

    setupEventBasedDetection() {
      const events = ['scroll', 'click', 'mousemove', 'keydown', 'resize', 'focus'];
      
      events.forEach(eventType => {
        let triggered = false;
        
        document.addEventListener(eventType, async () => {
          if (!triggered) {
            triggered = true;
            console.log(`🎯 Event-based scan triggered by: ${eventType}`);
            
            // Wait a bit for event-triggered content to load
            setTimeout(async () => {
              await this.scanForBanners();
              this.detectEventTriggeredBanners();
            }, 1000);
          }
        }, { once: true, passive: true });
      });
    }

    setupStealthDetection() {
      console.log('🥷 Setting up stealth banner detection...');
      
      // Monitor for elements becoming visible
      if ('IntersectionObserver' in window) {
        const visibilityObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && this.isLikelyCookieElement(entry.target)) {
              console.log('👁️ Hidden banner became visible:', entry.target);
              this.processBanner(entry.target);
            }
          });
        });
        
        // Observe all potentially hidden elements
        try {
          document.querySelectorAll('[style*="display"], [class*="hidden"], [style*="visibility"]')
            .forEach(el => {
              if (this.isLikelyCookieElement(el)) {
                visibilityObserver.observe(el);
              }
            });
        } catch (error) {
          console.warn('Failed to setup visibility observer for hidden elements:', error);
        }
      }
      
      // Monitor CSS changes that might reveal banners
      this.monitorCSSChanges();
      
      // Detect and handle iframe-based banners
      this.detectIframeBanners();
    }

    setupFrameworkDetection() {
      console.log('🏭 Setting up framework-specific detection...');
      
      // Monitor for OneTrust
      this.monitorFramework('OneTrust', ['optanon', 'onetrust', 'otBannerSdk']);
      
      // Monitor for CookieBot
      this.monitorFramework('CookieBot', ['cookiebot', 'cb']);
      
      // Monitor for TrustArc
      this.monitorFramework('TrustArc', ['trustarc', 'truste']);
      
      // Monitor for other frameworks
      this.knownEvasionTechniques.cookieFrameworks.forEach(framework => {
        this.monitorFrameworkByName(framework);
      });
      
      // Generic framework detection
      this.setupGenericFrameworkDetection();
    }

    monitorFramework(name, identifiers) {
      // Monitor global variables
      identifiers.forEach(id => {
        this.monitorGlobalVariable(id, () => {
          console.log(`🏭 Detected ${name} framework initialization`);
          this.handleFrameworkDetection(name, id);
        });
      });
      
      // Monitor script loading
      this.monitorScriptLoading(identifiers, name);
      
      // Monitor DOM for framework-specific elements
      this.monitorFrameworkElements(identifiers);
    }

    monitorGlobalVariable(variable, callback) {
      // Check if already exists
      if (window[variable]) {
        callback();
        return;
      }
      
      // Monitor for creation
      Object.defineProperty(window, variable, {
        configurable: true,
        set(value) {
          delete window[variable];
          window[variable] = value;
          callback();
        }
      });
    }

    setupProactiveBlocking() {
      console.log('🛡️ Setting up proactive banner blocking...');
      
      // Block known cookie script URLs
      this.blockCookieScripts();
      
      // Intercept fetch/XHR requests for cookie-related content
      this.interceptCookieRequests();
      
      // Block CSS that creates banners
      this.blockCookieCSS();
      
      // Create fake APIs to fool detection scripts
      this.createFakeAPIs();
      
      // Block specific cookie frameworks from loading
      this.blockFrameworkInitialization();
    }

    async scanForBanners() {
      const currentTime = Date.now();
      
      // Prevent excessive scanning
      if (currentTime - this.lastScanTime < 500) {
        return;
      }
      this.lastScanTime = currentTime;
      
      console.log('🔍 Advanced banner scanning...');
      
      // SAFE ENHANCEMENT: Use optimized scanning if available
      let banners;
      if (this.performanceOptimizer) {
        try {
          banners = await this.performanceOptimizer.optimizedScan(
            () => this.findAllCookieBanners(),
            this.performanceOptimizer.generateScanCacheKey()
          );
        } catch (error) {
          console.warn('Optimized scan failed, using fallback:', error);
          banners = await this.findAllCookieBanners();
        }
      } else {
        // ORIGINAL FUNCTIONALITY: Direct scan
        banners = await this.findAllCookieBanners();
      }
      
      if (banners.length > 0) {
        console.log(`🎯 Found ${banners.length} cookie banner(s)`);
        this.statistics.bannersFound += banners.length;
        this.statistics.sitesProcessed.add(window.location.hostname);
        
        for (const banner of banners) {
          if (!this.processedBanners.has(banner)) {
            await this.processBanner(banner);
            this.processedBanners.add(banner);
          }
        }
      }
      
      // Always check for delayed banners
      this.scheduleDelayedCheck();
    }

    async findAllCookieBanners() {
      const banners = [];
      
      // Enhanced selector patterns
      const advancedSelectors = this.getAdvancedSelectors();
      
      // SAFE ENHANCEMENT: Use batch queries if available
      if (this.performanceOptimizer) {
        try {
          const batchResults = this.performanceOptimizer.batchQuerySelectors(advancedSelectors);
          
          // Process batch results
          for (const [selector, elements] of batchResults) {
            elements.forEach(element => {
              if (this.isValidCookieBanner(element) && !this.processedBanners.has(element)) {
                banners.push(element);
              }
            });
          }
        } catch (error) {
          console.warn('Batch query failed, using individual queries:', error);
          // Fall back to original implementation
          for (const selector of advancedSelectors) {
            try {
              const elements = document.querySelectorAll(selector);
              elements.forEach(element => {
                if (this.isValidCookieBanner(element) && !this.processedBanners.has(element)) {
                  banners.push(element);
                }
              });
            } catch (error) {
              console.warn(`Error with selector ${selector}:`, error);
            }
          }
        }
      } else {
        // ORIGINAL FUNCTIONALITY: Individual selector queries
        for (const selector of advancedSelectors) {
          try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
              if (this.isValidCookieBanner(element) && !this.processedBanners.has(element)) {
                banners.push(element);
              }
            });
          } catch (error) {
            console.warn(`Error with selector ${selector}:`, error);
          }
        }
      }
      
      // Find by content analysis
      const contentBanners = this.findBannersByContent();
      banners.push(...contentBanners);
      
      // Find in shadow DOM
      const shadowBanners = this.findBannersInShadowDOM();
      banners.push(...shadowBanners);
      
      // Find dynamically created banners
      const dynamicBanners = this.findDynamicBanners();
      banners.push(...dynamicBanners);
      
      // Find framework-specific banners
      const frameworkBanners = this.findFrameworkBanners();
      banners.push(...frameworkBanners);
      
      return this.deduplicateBanners(banners);
    }

    getAdvancedSelectors() {
      return [
        // Generic cookie banner selectors - IMPROVED with exclusions
        '[class*="cookie" i]:not([class*="policy" i]):not(a):not(span):not([class*="cart" i]):not([class*="shop" i])',
        '[id*="cookie" i]:not([id*="policy" i]):not(a):not(span):not([id*="cart" i]):not([id*="shop" i])',
        '[class*="consent" i]:not(a):not(span):not([class*="terms" i]):not([class*="legal" i])',
        '[id*="consent" i]:not(a):not(span):not([id*="terms" i]):not([id*="legal" i])',
        
        // GDPR and privacy related - MORE SPECIFIC
        '[class*="gdpr" i]:not(a):not(span)',
        '[class*="privacy" i][class*="banner" i]:not([class*="policy" i]):not(a):not(span)',
        '[class*="cookie" i][class*="banner" i]:not(a):not(span)',
        '[class*="consent" i][class*="banner" i]:not(a):not(span)',
        
        // Framework-specific selectors (these are safe)
        '[class*="cookiebot" i]', '[id*="cookiebot" i]',
        '[class*="onetrust" i]', '[id*="onetrust" i]',
        '[class*="trustarc" i]', '[id*="trustarc" i]',
        '[class*="quantcast" i]', '[id*="quantcast" i]',
        '[class*="didomi" i]', '[id*="didomi" i]',
        '[class*="usercentrics" i]', '[id*="usercentrics" i]',
        '[class*="cookiepro" i]', '[id*="cookiepro" i]',
        '[class*="termly" i]', '[id*="termly" i]',
        '[class*="iubenda" i]', '[id*="iubenda" i]',
        '[class*="cookieyes" i]', '[id*="cookieyes" i]',
        '[class*="complianz" i]', '[id*="complianz" i]',
        '[class*="borlabs" i]', '[id*="borlabs" i]',
        
        // Specific banner patterns - ENHANCED with cookie context
        '.cookie-notice', '.privacy-notice', '.consent-banner',
        '#cookie-bar', '#privacy-bar', '#consent-bar',
        '.cookie-modal', '.privacy-modal', '.consent-modal',
        '.cookie-overlay', '.privacy-overlay', '.consent-overlay',
        
        // SAFE position-based selectors - ONLY with cookie context
        '[class*="cookie" i][style*="position: fixed"]',
        '[class*="consent" i][style*="position: fixed"]',
        '[class*="privacy" i][style*="position: fixed"]',
        '[id*="cookie" i][style*="position: fixed"]',
        '[id*="consent" i][style*="position: fixed"]',
        
        // SAFE role-based selectors - ONLY with cookie context
        '[role="dialog"][aria-label*="cookie" i]',
        '[role="dialog"][aria-label*="consent" i]', 
        '[role="dialog"][aria-label*="privacy" i]',
        '[role="banner"][class*="cookie" i]',
        '[role="alert"][class*="cookie" i]',
        
        // Data attribute selectors - SAFE, specific
        '[data-name*="cookie" i]', '[data-id*="cookie" i]',
        '[data-name*="consent" i]', '[data-id*="consent" i]',
        '[data-testid*="cookie" i]', '[data-testid*="consent" i]',
        '[data-cookie-banner]', '[data-consent-banner]',
        
        // REPLACED DANGEROUS SELECTORS with SPECIFIC ones
        '[class*="cookie" i][class*="banner" i]',
        '[class*="cookie" i][class*="notice" i]', 
        '[class*="cookie" i][class*="modal" i]',
        '[class*="consent" i][class*="popup" i]',
        '[class*="privacy" i][class*="overlay" i]',
        
        // Language-specific selectors - SAFE, specific
        '[class*="cookies" i]:not([class*="shopping" i]):not([class*="recipe" i])',
        '[class*="datenschutz" i]', '[class*="politique" i]',
        '[class*="politica" i]', '[class*="privacidad" i]'
      ];
    }

    findBannersByContent() {
      const banners = [];
      const cookieKeywords = [
        'cookie', 'cookies', 'consent', 'privacy', 'gdpr', 'ccpa',
        'accept', 'decline', 'reject', 'allow', 'deny',
        'datenschutz', 'politique', 'politica', 'privacidad',
        'tracking', 'analytics', 'functional', 'marketing'
      ];
      
      // Find elements by text content
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            const text = node.textContent?.toLowerCase() || '';
            const hasKeywords = cookieKeywords.some(keyword => text.includes(keyword));
            const isVisible = this.isElementVisible(node);
            const isValidSize = this.hasValidBannerSize(node);
            
            return hasKeywords && isVisible && isValidSize ? 
              NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
          }
        }
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (this.isValidCookieBanner(node)) {
          banners.push(node);
        }
      }
      
      return banners;
    }

    findBannersInShadowDOM() {
      const banners = [];
      
      // Find all elements with shadow roots
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach(element => {
        if (element.shadowRoot) {
          this.shadowRoots.add(element.shadowRoot);
          
          // Search within shadow DOM
          const shadowBanners = this.searchShadowRoot(element.shadowRoot);
          banners.push(...shadowBanners);
        }
      });
      
      return banners;
    }

    searchShadowRoot(shadowRoot) {
      const banners = [];
      const selectors = this.getAdvancedSelectors();
      
      selectors.forEach(selector => {
        try {
          const elements = shadowRoot.querySelectorAll(selector);
          elements.forEach(element => {
            if (this.isValidCookieBanner(element)) {
              banners.push(element);
            }
          });
        } catch (error) {
          // Shadow DOM selector failed, continue
        }
      });
      
      return banners;
    }

    findDynamicBanners() {
      const banners = [];
      
      // Check for elements that were recently added
      const recentElements = document.querySelectorAll('[data-recently-added], .dynamic-content');
      
      recentElements.forEach(element => {
        if (this.isLikelyCookieElement(element) && this.isValidCookieBanner(element)) {
          banners.push(element);
        }
      });
      
      return banners;
    }

    findFrameworkBanners() {
      const banners = [];
      
      // OneTrust specific
      const oneTrustBanners = [
        '#onetrust-banner-sdk', '#onetrust-consent-sdk',
        '.optanon-alert-box-wrapper', '.ot-sdk-container'
      ];
      
      // CookieBot specific
      const cookieBotBanners = [
        '#CybotCookiebotDialog', '.CybotCookiebotDialog',
        '#cookiebot', '.cookiebot-banner'
      ];
      
      // Combine all framework selectors
      const frameworkSelectors = [...oneTrustBanners, ...cookieBotBanners];
      
      frameworkSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (this.isValidCookieBanner(element)) {
              banners.push(element);
            }
          });
        } catch (error) {
          // Framework selector failed
        }
      });
      
      return banners;
    }

    isLikelyCookieElement(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
      
      const text = element.textContent?.toLowerCase() || '';
      const className = (element.className || '').toString().toLowerCase();
      const id = (element.id || '').toString().toLowerCase();
      
      // Check for cookie-related keywords
      const cookieKeywords = [
        'cookie', 'consent', 'privacy', 'gdpr', 'accept', 'decline', 'reject'
      ];
      
      return cookieKeywords.some(keyword => 
        text.includes(keyword) || className.includes(keyword) || id.includes(keyword)
      );
    }

    hasDelayedLoadingIndicators(element) {
      const scriptContent = element.textContent || '';
      const attributes = Array.from(element.attributes || []).map(attr => attr.value).join(' ');
      
      return this.knownEvasionTechniques.delayedLoadingIndicators.some(indicator =>
        scriptContent.includes(indicator) || attributes.includes(indicator)
      );
    }

    isFrameworkComponent(element) {
      const className = (element.className || '').toString().toLowerCase();
      const id = (element.id || '').toString().toLowerCase();
      
      return this.knownEvasionTechniques.cookieFrameworks.some(framework =>
        className.includes(framework) || id.includes(framework)
      );
    }

    isAttributeChangeRevealing(element, attributeName, oldValue) {
      if (!attributeName) return false;
      
      const revealingAttributes = ['style', 'class', 'hidden', 'aria-hidden'];
      
      if (revealingAttributes.includes(attributeName)) {
        const currentValue = element.getAttribute(attributeName) || '';
        
        // Check if element is becoming visible
        if (attributeName === 'style') {
          const wasHidden = oldValue?.includes('display: none') || oldValue?.includes('visibility: hidden');
          const isNowVisible = !currentValue.includes('display: none') && !currentValue.includes('visibility: hidden');
          return wasHidden && isNowVisible && this.isLikelyCookieElement(element);
        }
        
        if (attributeName === 'class') {
          const hadHiddenClass = this.knownEvasionTechniques.stealthClasses.some(cls => 
            oldValue?.includes(cls)
          );
          const hasVisibleClass = !this.knownEvasionTechniques.stealthClasses.some(cls => 
            currentValue.includes(cls)
          );
          return hadHiddenClass && hasVisibleClass && this.isLikelyCookieElement(element);
        }
      }
      
      return false;
    }

    async processBanner(banner) {
      // ENHANCED ERROR HANDLING: Prevent all types of errors from causing issues
      if (!banner || this.processedBanners.has(banner)) {
        return { success: false, reason: 'Banner already processed or invalid' };
      }

      // Add to processed set immediately to prevent duplicate processing
      this.processedBanners.add(banner);
      
      try {
        console.log('🎯 Processing banner with rule-based agent');
        
        // SAFETY CHECK: Ensure hybrid coordinator is available
        if (this.hybridCoordinator) {
          const result = await Promise.race([
            this.hybridCoordinator.processBanner(banner),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Processing timeout')), 5000)
            )
          ]);
          
          if (result && result.success) {
            this.markBannerSuccess(banner, result.method || 'HYBRID_SUCCESS', result);
            return result;
          }
        }

        // FALLBACK: Try rule-based agent directly with timeout
        if (this.ruleBasedAgent) {
          const fallbackResult = await Promise.race([
            this.ruleBasedAgent.processBanner(banner),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Fallback timeout')), 3000)
            )
          ]);
          
          if (fallbackResult && fallbackResult.success) {
            this.markBannerSuccess(banner, fallbackResult.method || 'RULE_BASED_SUCCESS', fallbackResult);
            return fallbackResult;
          }
        }

        // FINAL FALLBACK: Direct button clicking with maximum safety
        try {
          const directResult = await this.findAndClickRejectButton(banner);
          if (directResult && directResult.success) {
            // TOAST NOTIFICATION: Show success
            this.showToast(
              'success', 
              'Direct Button Click Successful!', 
              directResult.buttonText
            );
            
            this.markBannerSuccess(banner, 'DIRECT_BUTTON_CLICK', directResult.buttonText);
            return {
              success: true,
              method: 'direct-button-click',
              confidence: directResult.confidence || 0.5
            };
          }
        } catch (directError) {
          console.warn('Direct button click failed:', directError);
        }

        // COMPLETE FAILURE: Show failure toast
        this.showToast(
          'error', 
          'All Processing Methods Failed', 
          'Banner left visible for inspection'
        );
        
        this.markBannerFailure(banner, 'ALL_METHODS_FAILED');
        return {
          success: false,
          method: 'all-methods-failed',
          confidence: 0,
          reason: 'No processing method succeeded'
        };

      } catch (error) {
        console.error('❌ Banner processing failed with error:', error);
        
        // EMERGENCY ERROR HANDLING: Show error toast
        this.showToast(
          'error', 
          'Processing Error', 
          error.message || 'Unknown error occurred'
        );
        
        this.markBannerFailure(banner, `ERROR: ${error.message}`);
        return {
          success: false,
          method: 'error-occurred',
          error: error.message,
          confidence: 0
        };
      }
    }

    // NEW: Visual feedback methods
    markBannerSuccess(banner, method, details) {
      try {
        // Add visual indicator for successful processing
        banner.style.border = '3px solid #28a745';
        banner.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.5)';
        
        // Add success message overlay
        const successOverlay = document.createElement('div');
        successOverlay.innerHTML = `
          <div style="
            position: absolute;
            top: 0;
            right: 0;
            background: #28a745;
            color: white;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: bold;
            z-index: 999999;
            border-radius: 0 0 0 8px;
          ">
            ✅ ${method}${details ? `: ${details}` : ''}
          </div>
        `;
        banner.style.position = 'relative';
        banner.appendChild(successOverlay);
        
        // Remove indicator after 5 seconds
        setTimeout(() => {
          if (successOverlay.parentNode) {
            successOverlay.remove();
          }
          banner.style.border = '';
          banner.style.boxShadow = '';
        }, 5000);
        
        console.log(`✅ ${method}: ${details || 'Success'}`);
      } catch (error) {
        console.warn('Failed to add success indicator:', error);
      }
    }

    markBannerFailure(banner, reason) {
      try {
        // Add visual indicator for failed processing
        banner.style.border = '3px solid #dc3545';
        banner.style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.5)';
        
        // Add failure message overlay
        const failureOverlay = document.createElement('div');
        failureOverlay.innerHTML = `
          <div style="
            position: absolute;
            top: 0;
            right: 0;
            background: #dc3545;
            color: white;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: bold;
            z-index: 999999;
            border-radius: 0 0 0 8px;
          ">
            ❌ ${reason}
          </div>
        `;
        banner.style.position = 'relative';
        banner.appendChild(failureOverlay);
        
        // Keep indicator visible longer so you can see what failed
        setTimeout(() => {
          if (failureOverlay.parentNode) {
            failureOverlay.remove();
          }
          banner.style.border = '';
          banner.style.boxShadow = '';
        }, 10000);
        
        console.log(`❌ ${reason} - Banner left visible for inspection`);
      } catch (error) {
        console.warn('Failed to add failure indicator:', error);
      }
    }

    detectEvasionAttempt(banner) {
      const indicators = [];
      
      // Check for delayed appearance
      if (this.delayedBanners.has(banner)) {
        indicators.push('delayed-loading');
      }
      
      // Check for stealth techniques
      const style = window.getComputedStyle(banner);
      if (style.position === 'fixed' && parseInt(style.zIndex) > 9999) {
        indicators.push('high-z-index');
      }
      
      // Check for obfuscated attributes
      const classes = (banner.className || '').toString().split(' ');
      const hasObfuscatedClasses = classes.some(cls => 
        /^[a-f0-9]{8,}$/.test(cls) || cls.length > 20
      );
      if (hasObfuscatedClasses) {
        indicators.push('obfuscated-classes');
      }
      
      // Check for framework evasion
      if (this.isFrameworkEvasion(banner)) {
        indicators.push('framework-evasion');
      }
      
      return indicators.length > 0;
    }

    aggressiveRemoval(banner) {
      console.log('🗡️ Applying aggressive banner removal...');
      
      try {
        // REMOVED: No more hiding - only attempt button clicking
        console.log('❌ Aggressive removal disabled - using toast feedback only');
        
        // Try one more aggressive button search (FIXED: add await and proper error handling)
        this.findAndClickRejectButton(banner).then(result => {
          if (!result.success) {
            // Show failure toast
            this.showToast(
              'error',
              'Aggressive Removal Failed',
              'No safe buttons found even with aggressive scanning'
            );
          }
        }).catch(error => {
          console.warn('Aggressive button search failed:', error);
          this.showToast(
            'error',
            'Aggressive Removal Error',
            error.message || 'Button search failed'
          );
        });
        
        // REMOVED: DOM removal, overlay clearing, script blocking
        // Banner remains visible for inspection
        
      } catch (error) {
        console.warn('Aggressive removal failed:', error);
      }
    }

    clearAssociatedOverlays(banner) {
      // REMOVED: No longer hide overlays - just log for debugging
      console.log('🔍 Scanning for associated overlays (no longer hidden)');
      
      const overlays = document.querySelectorAll([
        '.modal-backdrop', '.overlay', '.backdrop',
        '[style*="position: fixed"]', '[style*="z-index"]'
      ].join(','));
      
      overlays.forEach(overlay => {
        const zIndex = parseInt(window.getComputedStyle(overlay).zIndex);
        if (zIndex > 1000) {
          console.log('👁️ Found high z-index overlay (left visible):', overlay);
          // REMOVED: this.hideBanner(overlay);
        }
      });
    }

    debouncedScan() {
      clearTimeout(this.scanTimeout);
      this.scanTimeout = setTimeout(() => this.scanForBanners(), 500);
    }

    scheduleDelayedCheck() {
      setTimeout(async () => {
        const newBanners = await this.findAllCookieBanners();
        if (newBanners.length > 0) {
          console.log('⏰ Found delayed banners:', newBanners.length);
          newBanners.forEach(banner => this.delayedBanners.add(banner));
          
          for (const banner of newBanners) {
            if (!this.processedBanners.has(banner)) {
              await this.processBanner(banner);
            }
          }
        }
      }, 3000);
    }

    isValidCookieBanner(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
      if (this.processedBanners.has(element)) return false;
      
      // ENHANCED VALIDATION with context analysis
      if (!this.isElementVisible(element) || !this.hasValidBannerSize(element)) {
        return false;
      }
      
      // Get element content including child elements
      const elementText = element.textContent || '';
      const elementHTML = element.innerHTML || '';
      
      // EXCLUSION CHECK: Skip obvious non-cookie elements
      if (this.isExcludedElement(element, elementText)) {
        return false;
      }
      
      // FRAMEWORK CHECK: High confidence for known frameworks
      if (this.isKnownCookieFramework(element)) {
        return true;
      }
      
      // CONTENT CHECK: Enhanced validation
      if (!this.containsCookieKeywords(elementText)) {
        return false;
      }
      
      // CONTEXT CHECK: Analyze parent/position context
      if (!this.hasValidCookieContext(element)) {
        return false;
      }
      
      // BUTTON CHECK: Must have actionable buttons
      if (!this.hasValidCookieButtons(element)) {
        return false;
      }
      
      return true;
    }

    isExcludedElement(element, text) {
      const tagName = element.tagName?.toLowerCase();
      const className = (element.className || '').toString().toLowerCase();
      const id = (element.id || '').toString().toLowerCase();
      const role = element.getAttribute('role') || '';
      
      // Skip navigation elements
      if (tagName === 'nav' || tagName === 'header' || tagName === 'footer' || 
          role === 'navigation' || role === 'menubar') {
        return true;
      }
      
      // Skip form elements (login, checkout, etc.)
      if (tagName === 'form' || element.closest('form')) {
        const formText = text.toLowerCase();
        if (formText.includes('login') || formText.includes('sign in') || 
            formText.includes('email') || formText.includes('password')) {
          return true;
        }
      }
      
      // Skip shopping/commerce elements
      const commercePatterns = [
        'cart', 'shop', 'buy', 'price', 'checkout', 'payment',
        'product', 'order', 'purchase', 'sale', 'discount'
      ];
      
      if (commercePatterns.some(pattern => 
        className.includes(pattern) || id.includes(pattern) || text.toLowerCase().includes(pattern)
      )) {
        return true;
      }
      
      // Skip media/video elements
      if (tagName === 'video' || tagName === 'audio' || 
          className.includes('video') || className.includes('player')) {
        return true;
      }
      
      // Skip notification/alert elements that aren't cookie-related
      if ((className.includes('notification') || className.includes('alert')) && 
          !text.toLowerCase().includes('cookie') && !text.toLowerCase().includes('privacy')) {
        return true;
      }
      
      return false;
    }

    isKnownCookieFramework(element) {
      const className = (element.className || '').toString().toLowerCase();
      const id = (element.id || '').toString().toLowerCase();
      
      const frameworkIdentifiers = [
        'cookiebot', 'onetrust', 'trustarc', 'quantcast', 'didomi',
        'usercentrics', 'termly', 'iubenda', 'optanon'
      ];
      
      return frameworkIdentifiers.some(framework => 
        className.includes(framework) || id.includes(framework)
      );
    }

    hasValidCookieContext(element) {
      // Check positioning (cookie banners are usually fixed/sticky)
      const style = getComputedStyle(element);
      const position = style.position;
      const zIndex = parseInt(style.zIndex) || 0;
      
      // Must be positioned prominently or be a framework element
      const isWellPositioned = (
        position === 'fixed' || 
        position === 'sticky' || 
        zIndex > 100
      );
      
      // Or be in a typical banner location
      const rect = element.getBoundingClientRect();
      const isAtTop = rect.top < window.innerHeight * 0.2;
      const isAtBottom = rect.bottom > window.innerHeight * 0.8;
      const isFullWidth = rect.width > window.innerWidth * 0.8;
      
      const isBannerPosition = (isAtTop || isAtBottom) && isFullWidth;
      
      return isWellPositioned || isBannerPosition || this.isKnownCookieFramework(element);
    }

    hasValidCookieButtons(element) {
      const buttons = element.querySelectorAll('button, a[role="button"], input[type="button"], [onclick]');
      
      if (buttons.length === 0) {
        return false; // No actionable elements
      }
      
      // Check if any button has cookie-related text
      const buttonTexts = Array.from(buttons).map(btn => 
        (btn.textContent || '').toLowerCase()
      ).join(' ');
      
      const cookieButtonKeywords = [
        'accept', 'decline', 'reject', 'allow', 'deny', 'manage',
        'ok', 'close', 'dismiss', 'preferences', 'settings'
      ];
      
      return cookieButtonKeywords.some(keyword => 
        buttonTexts.includes(keyword)
      );
    }

    isElementVisible(element) {
      if (!element) return false;
      
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      
      return style.display !== 'none' &&
             style.visibility !== 'hidden' &&
             style.opacity !== '0' &&
             rect.width > 0 &&
             rect.height > 0;
    }

    hasValidBannerSize(element) {
      const rect = element.getBoundingClientRect();
      return rect.width >= 200 && rect.height >= 50;
    }

    containsCookieKeywords(content) {
      // SAFE ENHANCEMENT: Use multi-language detection if available
      if (this.multiLanguageDetector) {
        try {
          const enhancedResult = this.multiLanguageDetector.containsCookieContent(content);
          if (enhancedResult) {
            return true; // Multi-language detection found a match
          }
        } catch (error) {
          console.warn('Multi-language detection error, using fallback:', error);
          // Continue to original implementation
        }
      }
      
      // ENHANCED VALIDATION: Require multiple signals to avoid false positives
      const lowerContent = content.toLowerCase();
      
      // Primary cookie/privacy indicators (REQUIRED)
      const primaryKeywords = [
        'cookie', 'cookies', 'consent', 'privacy', 'gdpr', 'ccpa',
        'datenschutz', 'politique', 'politica', 'privacidad'
      ];
      
      // Secondary context indicators (strengthen confidence)
      const secondaryKeywords = [
        'accept', 'decline', 'reject', 'allow', 'deny', 'manage', 'preferences',
        'tracking', 'analytics', 'functional', 'marketing', 'necessary',
        'third party', 'advertising', 'personalization'
      ];
      
      // Framework indicators (high confidence)
      const frameworkKeywords = [
        'optanon', 'onetrust', 'cookiebot', 'trustarc', 'quantcast',
        'didomi', 'usercentrics', 'termly', 'iubenda'
      ];
      
      // ENHANCEMENT: Domain-specific pattern learning
      const domainPatterns = this.getDomainSpecificPatterns(window.location.hostname);
      
      // ENHANCEMENT: Context-aware scoring  
      const contextScore = this.calculateContextScore(lowerContent);
      
      // EXCLUSION patterns (automatic rejection)
      const exclusionPatterns = [
        // Shopping/commerce
        'add to cart', 'shopping cart', 'checkout', 'payment', 'order',
        'buy now', 'purchase', 'price', 'discount', 'sale',
        
        // User account/auth
        'sign in', 'sign up', 'login', 'register', 'account', 'profile',
        'username', 'password', 'email address',
        
        // Navigation/UI
        'menu', 'navigation', 'search', 'filter', 'sort by',
        'previous', 'next', 'page', 'results',
        
        // Media/content
        'play video', 'watch now', 'download', 'share', 'like',
        'subscribe', 'newsletter', 'notification',
        
        // Errors/system
        'error', 'warning', 'success', 'loading', 'please wait'
      ];
      
      // Check for exclusions first
      const hasExclusions = exclusionPatterns.some(pattern => 
        lowerContent.includes(pattern)
      );
      
      if (hasExclusions) {
        return false; // Definitely not a cookie banner
      }
      
      // Check for framework indicators (high confidence)
      const hasFramework = frameworkKeywords.some(keyword => 
        lowerContent.includes(keyword)
      );
      
      if (hasFramework) {
        return true; // Framework detected = very likely cookie banner
      }
      
      // ENHANCEMENT: Multi-signal validation with scoring
      const hasPrimary = primaryKeywords.some(keyword => 
        lowerContent.includes(keyword)
      );
      
      const hasSecondary = secondaryKeywords.some(keyword => 
        lowerContent.includes(keyword)
      );
      
      const hasDomainPattern = domainPatterns.some(pattern => 
        lowerContent.includes(pattern)
      );
      
      // Weighted scoring system for more accurate detection
      let confidenceScore = 0;
      if (hasPrimary) confidenceScore += 0.4;
      if (hasSecondary) confidenceScore += 0.3;
      if (hasDomainPattern) confidenceScore += 0.2;
      confidenceScore += contextScore * 0.1;
      
      // Conservative threshold: require 0.6+ confidence
      return confidenceScore >= 0.6;
    }

    // ENHANCEMENT: Domain-specific pattern learning
    getDomainSpecificPatterns(hostname) {
      try {
        const stored = localStorage.getItem(`patterns_${hostname}`);
        if (stored) {
          const data = JSON.parse(stored);
          return data.successfulPatterns || [];
        }
      } catch (error) {
        // Graceful fallback
      }
      return [];
    }

    // ENHANCEMENT: Context-aware scoring
    calculateContextScore(content) {
      let score = 0;
      
      // Check for banner-specific contexts
      if (content.includes('this website') || content.includes('this site')) score += 0.2;
      if (content.includes('we use') || content.includes('we collect')) score += 0.2;
      if (content.includes('your experience') || content.includes('browsing experience')) score += 0.1;
      if (content.includes('third party') || content.includes('partners')) score += 0.1;
      
      return Math.min(score, 0.5); // Cap at 0.5
    }

    // ENHANCEMENT: Learn successful patterns for future use
    learnSuccessfulPattern(banner, buttonText) {
      try {
        const hostname = window.location.hostname;
        const key = `patterns_${hostname}`;
        
        // Extract useful patterns from successful interactions
        const bannerText = banner.textContent?.toLowerCase() || '';
        const patterns = [];
        
        // Learn button text patterns
        if (buttonText) {
          const normalizedButtonText = buttonText.toLowerCase().trim();
          patterns.push(normalizedButtonText);
        }
        
        // Learn banner context patterns
        const contextWords = bannerText.split(' ').filter(word => 
          word.length > 3 && 
          ['cookie', 'consent', 'privacy', 'gdpr', 'tracking'].some(keyword => word.includes(keyword))
        );
        patterns.push(...contextWords.slice(0, 3)); // Max 3 context words
        
        // Store patterns (limit to prevent excessive storage)
        const stored = localStorage.getItem(key);
        const data = stored ? JSON.parse(stored) : { successfulPatterns: [] };
        
        patterns.forEach(pattern => {
          if (!data.successfulPatterns.includes(pattern)) {
            data.successfulPatterns.push(pattern);
          }
        });
        
        // Keep only recent patterns (max 20 per domain)
        data.successfulPatterns = data.successfulPatterns.slice(-20);
        
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`🧠 Learned patterns for ${hostname}:`, patterns);
        
      } catch (error) {
        // Silent failure - learning is optional
        console.warn('Pattern learning failed:', error);
      }
    }

    isNotNavigationElement(element) {
      const tagName = element.tagName?.toLowerCase();
      const role = element.getAttribute('role');
      
      return tagName !== 'nav' && 
             tagName !== 'header' && 
             tagName !== 'footer' && 
             role !== 'navigation';
    }

    deduplicateBanners(banners) {
      const unique = new Set();
      const result = [];
      
      banners.forEach(banner => {
        if (!unique.has(banner) && banner.isConnected) {
          unique.add(banner);
          result.push(banner);
        }
      });
      
      return result;
    }

    // Missing methods implementation
    scanShadowDOM() {
      console.log('🌑 Scanning Shadow DOM for banners...');
      
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        if (element.shadowRoot) {
          this.shadowRoots.add(element.shadowRoot);
          
          // Search within shadow DOM
          const shadowBanners = this.searchShadowRoot(element.shadowRoot);
          shadowBanners.forEach(banner => {
            if (!this.processedBanners.has(banner)) {
              this.processBanner(banner);
            }
          });
        }
      });
    }

    searchShadowRoot(shadowRoot) {
      const banners = [];
      const selectors = this.getAdvancedSelectors();
      
      selectors.forEach(selector => {
        try {
          const elements = shadowRoot.querySelectorAll(selector);
          elements.forEach(element => {
            if (this.isValidCookieBanner(element)) {
              banners.push(element);
            }
          });
        } catch (error) {
          // Shadow DOM selector failed, continue
        }
      });
      
      return banners;
    }

    scanHiddenElements() {
      console.log('👁️ Scanning hidden elements...');
      
      const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"], .hidden, .invisible');
      
      hiddenElements.forEach(element => {
        if (this.isLikelyCookieElement(element)) {
          // Check if it might become visible
          const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
              if (mutation.type === 'attributes' && 
                  (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                if (this.isElementVisible(element) && this.isValidCookieBanner(element)) {
                  console.log('👀 Hidden element became visible:', element);
                  this.processBanner(element);
                }
              }
            });
          });
          
          observer.observe(element, { attributes: true, attributeFilter: ['style', 'class'] });
          this.observers.push(observer);
        }
      });
    }

    detectFrameworkLoading() {
      console.log('🏭 Detecting framework loading...');
      
      // Check for existing framework globals
      const frameworks = ['OneTrust', 'Cookiebot', 'TrustArc', 'Didomi', 'UC_UI'];
      
      frameworks.forEach(framework => {
        if (window[framework]) {
          console.log(`🏭 Found ${framework} framework`);
          setTimeout(() => this.scanForBanners(), 500);
        }
      });
    }

    handleShadowDOMMutations(mutations) {
      // Handle shadow DOM changes
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && this.isLikelyCookieElement(node)) {
              if (this.isValidCookieBanner(node)) {
                console.log('🌑 Banner found in shadow DOM:', node);
                this.processBanner(node);
              }
            }
          });
        }
      });
    }

    setupExtendedMonitoring() {
      console.log('🔬 Setting up extended monitoring...');
      
      // Monitor for late-loading scripts
      const scriptObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'SCRIPT') {
              const src = node.src || '';
              const content = node.textContent || '';
              
              if (this.containsCookieKeywords(src + ' ' + content)) {
                console.log('📜 Cookie-related script detected:', src || 'inline');
                setTimeout(() => this.scanForBanners(), 1000);
              }
            }
          });
        });
      });
      
      scriptObserver.observe(document.documentElement, { childList: true, subtree: true });
      this.observers.push(scriptObserver);
    }

    detectIframeBanners() {
      console.log('🖼️ Detecting iframe banners...');
      
      document.querySelectorAll('iframe').forEach(iframe => {
        iframe.addEventListener('load', () => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc) {
              this.searchIframeForBanners(iframeDoc);
            }
          } catch (error) {
            // Cross-origin iframe, can't access content
          }
        });
      });
    }

    searchIframeForBanners(iframeDoc) {
      const selectors = this.getAdvancedSelectors();
      selectors.forEach(selector => {
        try {
          const elements = iframeDoc.querySelectorAll(selector);
          elements.forEach(element => {
            if (this.isValidCookieBanner(element)) {
              console.log('🎯 Found banner in iframe:', element);
              this.processBanner(element);
            }
          });
        } catch (error) {
          // Selector failed in iframe
        }
      });
    }

    setupGenericFrameworkDetection() {
      console.log('🏭 Setting up generic framework detection...');
      
      // Monitor for framework initialization
      const checkFrameworks = () => {
        const frameworkChecks = [
          'window.OneTrust', 'window.Cookiebot', 'window.TrustArc',
          'window.Didomi', 'window.UC_UI', 'window.__tcfapi'
        ];
        
        frameworkChecks.forEach(check => {
          try {
            if (eval(check)) {
              console.log(`🏭 Framework detected: ${check}`);
              setTimeout(() => this.scanForBanners(), 500);
            }
          } catch (error) {
            // Framework not available
          }
        });
      };
      
      // Check immediately and periodically
      checkFrameworks();
      const intervalId = setInterval(checkFrameworks, 2000);
      setTimeout(() => clearInterval(intervalId), 30000); // Stop after 30 seconds
    }

    isFrameworkEvasion(banner) {
      const className = (banner.className || '').toString().toLowerCase();
      const id = (banner.id || '').toString().toLowerCase();
      
      // Check for framework-specific patterns that indicate evasion
      const evasionPatterns = [
        'dynamic', 'lazy', 'delayed', 'async', 'defer',
        'stealth', 'hidden', 'invisible', 'ghost'
      ];
      
      return evasionPatterns.some(pattern => 
        className.includes(pattern) || id.includes(pattern)
      );
    }

    clearBannerRetries(banner) {
      // Clear any retry mechanisms for this banner
      if (banner._retryTimeout) {
        clearTimeout(banner._retryTimeout);
        delete banner._retryTimeout;
      }
    }

    blockRecreationScripts(banner) {
      console.log('🚫 Blocking banner recreation scripts...');
      
      try {
        // Look for parent elements that might contain recreation logic
        let parent = banner.parentElement;
        while (parent) {
          const scripts = parent.querySelectorAll('script');
          scripts.forEach(script => {
            if (this.containsCookieKeywords(script.textContent || '')) {
              script.type = 'text/blocked';
              script.remove();
            }
          });
          parent = parent.parentElement;
          if (parent === document.body) break;
        }
      } catch (error) {
        console.warn('Failed to block recreation scripts:', error);
      }
    }

    // Additional utility methods...
    async injectAdvancedScript() {
      // Implementation for injecting advanced scripts
      console.log('💉 Injecting advanced anti-evasion scripts...');
      
      try {
        // Inject CSS to block common banner patterns
        const style = document.createElement('style');
        style.textContent = `
          [class*="cookie-banner"],
          [class*="consent-banner"],
          [id*="cookie-consent"],
          .cookiebot-banner,
          #onetrust-banner-sdk {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
        `;
        document.head.appendChild(style);
        
        return true;
      } catch (error) {
        console.warn('Failed to inject advanced scripts:', error);
        return false;
      }
    }

    getStatistics() {
      const baseStats = {
        ...this.statistics,
        processedBannersCount: this.processedBanners.size,
        evasionDetection: {
          delayedBanners: this.delayedBanners.size,
          evasionAttempts: this.statistics.evasionAttempts
        }
      };
      
      // SAFE ENHANCEMENT: Add performance metrics if available
      if (this.performanceOptimizer) {
        try {
          baseStats.performance = this.performanceOptimizer.getMetrics();
        } catch (error) {
          console.warn('Failed to get performance metrics:', error);
        }
      }
      
      // SAFE ENHANCEMENT: Add language detection stats if available
      if (this.multiLanguageDetector) {
        try {
          baseStats.language = this.multiLanguageDetector.getLanguageStats();
        } catch (error) {
          console.warn('Failed to get language stats:', error);
        }
      }
      
      return baseStats;
    }

    cleanup() {
      // Clean up all observers and intervals
      this.observers.forEach(observer => {
        try {
          observer.disconnect();
        } catch (error) {
          console.warn('Observer cleanup error:', error);
        }
      });
      this.scanIntervals.forEach(id => clearTimeout(id));
      
      if (this.scanTimeout) clearTimeout(this.scanTimeout);
      if (this.periodicInterval) clearInterval(this.periodicInterval);
      if (this.retryTimeout) clearTimeout(this.retryTimeout);
      
      // ENHANCEMENT: Clear all arrays and sets to prevent memory leaks
      this.observers = [];
      this.scanIntervals = [];
      this.processedBanners.clear();
      this.delayedBanners.clear();
      this.shadowRoots.clear();
      this.interceptedScripts.clear();
      this.detectedFrameworks.clear();
      this.suspiciousPatterns.clear();
      
      // SAFE ENHANCEMENT: Clean up performance optimizer if available
      if (this.performanceOptimizer) {
        try {
          this.performanceOptimizer.cleanup();
        } catch (error) {
          console.warn('Performance optimizer cleanup failed:', error);
        }
      }
      
      // Multi-language detector doesn't need explicit cleanup (no resources to free)
      console.log('🧹 Cookie killer cleanup completed');
    }

    // Proactive blocking methods
    blockCookieScripts() {
      console.log('🚫 Blocking cookie scripts...');
      
      const blockedDomains = [
        'cookiebot.com', 'onetrust.com', 'trustarc.com',
        'quantcast.com', 'didomi.io', 'usercentrics.com'
      ];
      
      // Block scripts by modifying their loading
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'SCRIPT' && node.src) {
              const shouldBlock = blockedDomains.some(domain => 
                node.src.includes(domain)
              );
              
              if (shouldBlock) {
                console.log('🚫 Blocked cookie script:', node.src);
                node.type = 'text/blocked';
                node.remove();
              }
            }
          });
        });
      });
      
      observer.observe(document.documentElement, { childList: true, subtree: true });
      this.observers.push(observer);
    }

    interceptCookieRequests() {
      console.log('🕵️ Intercepting cookie requests...');
      
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const url = args[0];
        if (typeof url === 'string' && this.mightContainBannerContent(url)) {
          console.log('🚫 Blocked cookie request:', url);
          return new Response('{}', { status: 200 });
        }
        return originalFetch.apply(this, args);
      };
    }

    mightContainBannerContent(url) {
      if (!url) return false;
      
      const bannerIndicators = [
        'cookie', 'consent', 'privacy', 'banner', 'modal',
        'onetrust', 'cookiebot', 'trustarc'
      ];
      
      return bannerIndicators.some(indicator => 
        url.toLowerCase().includes(indicator)
      );
    }

    blockCookieCSS() {
      console.log('🎨 Blocking cookie CSS...');
      
      // Monitor for CSS that creates banners
      const cssObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
              const content = node.textContent || node.href || '';
              if (this.containsCookieKeywords(content)) {
                console.log('🚫 Blocked cookie CSS:', node);
                node.disabled = true;
                node.remove();
              }
            }
          });
        });
      });
      
      cssObserver.observe(document.documentElement, { childList: true, subtree: true });
      this.observers.push(cssObserver);
    }

    createFakeAPIs() {
      console.log('🎭 Creating fake APIs...');
      
      // Create fake consent APIs to fool detection scripts
      window.__tcfapi = function(command, version, callback) {
        if (callback) {
          callback({ gdprApplies: false }, true);
        }
      };
      
      window.__cmp = function(command, parameter, callback) {
        if (callback) {
          callback({ consentData: null }, true);
        }
      };
    }

    blockFrameworkInitialization() {
      console.log('🏭 Blocking framework initialization...');
      
      const blockedGlobals = [
        'OneTrust', 'Cookiebot', 'TrustArc', 'Didomi', 'UC_UI'
      ];
      
      blockedGlobals.forEach(globalName => {
        Object.defineProperty(window, globalName, {
          configurable: true,
          set: function(value) {
            console.log(`🚫 Blocked ${globalName} initialization`);
            // Don't actually set the value
          },
          get: function() {
            return undefined;
          }
        });
      });
    }

    // Setup framework-specific monitoring
    setupFrameworkSpecificMonitoring(frameworkName) {
      console.log(`🔬 Setting up ${frameworkName} monitoring...`);
      
      // Framework-specific element monitoring
      const frameworkSelectors = this.getFrameworkSelectors(frameworkName);
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const className = (node.className || '').toString().toLowerCase();
              const id = (node.id || '').toString().toLowerCase();
              
              const isFrameworkElement = frameworkSelectors.some(selector =>
                className.includes(selector) || id.includes(selector)
              );
              
              if (isFrameworkElement && this.isValidCookieBanner(node)) {
                console.log(`🎯 ${frameworkName} element detected:`, node);
                this.processBanner(node);
              }
            }
          });
        });
      });
      
      observer.observe(document.documentElement, { childList: true, subtree: true });
      this.observers.push(observer);
    }

    getFrameworkSelectors(frameworkName) {
      const selectors = {
        'OneTrust': [
          '#onetrust-banner-sdk', '.optanon-alert-box-wrapper', 
          '[class*="onetrust"]', '[id*="onetrust"]'
        ],
        'CookieBot': [
          '#CybotCookiebotDialog', '.CybotCookiebotDialog',
          '[class*="cookiebot"]', '[id*="cookiebot"]'
        ],
        'TrustArc': [
          '#truste-consent-track', '.truste-banner',
          '[class*="trustarc"]', '[id*="trustarc"]'
        ]
      };
      
      return selectors[frameworkName] || [`[class*="${frameworkName.toLowerCase()}"]`];
    }

    // Missing methods that are referenced but not defined
    monitorShadowRoots() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.shadowRoot) {
              console.log('🌑 New shadow root detected:', node);
              this.shadowRoots.add(node.shadowRoot);
              this.searchShadowRoot(node.shadowRoot);
            }
          });
        });
      });
      
      observer.observe(document.documentElement, { childList: true, subtree: true });
      this.observers.push(observer);
    }

    setupStyleObserver() {
      const styleObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const element = mutation.target;
            if (this.isLikelyCookieElement(element)) {
              console.log('🎨 Style change detected on potential banner:', element);
              this.debouncedScan();
            }
          }
        });
      });
      
      // Observe all potential banner elements
      document.querySelectorAll('*').forEach(el => {
        if (this.isLikelyCookieElement(el)) {
          styleObserver.observe(el, { attributes: true, attributeFilter: ['style'] });
        }
      });
      
      this.observers.push(styleObserver);
    }

    monitorCSSChanges() {
      console.log('🎨 Setting up CSS change monitoring...');
      
      // Create a MutationObserver to watch for style changes
      const cssObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          // Monitor for style attribute changes
          if (mutation.type === 'attributes' && 
              (mutation.attributeName === 'style' || 
               mutation.attributeName === 'class')) {
            const element = mutation.target;
            
            // Check if this element might be a cookie banner becoming visible
            if (this.isLikelyCookieElement(element)) {
              const currentStyle = getComputedStyle(element);
              const isNowVisible = currentStyle.display !== 'none' && 
                                  currentStyle.visibility !== 'hidden' && 
                                  currentStyle.opacity !== '0';
              
              if (isNowVisible && this.isValidCookieBanner(element)) {
                console.log('🎯 CSS change revealed cookie banner:', element);
                this.processBanner(element);
              }
            }
          }
          
          // Monitor for new style sheets being added
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
                // New CSS might reveal previously hidden banners
                setTimeout(() => {
                  this.scanForBanners();
                }, 100);
              }
            });
          }
        });
      });
      
      // Observe the entire document for style changes
      cssObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: true,
        subtree: true
      });
      
      // Store observer for cleanup
      if (!this.observers) this.observers = [];
      this.observers.push(cssObserver);
      
      // Also monitor for dynamically inserted stylesheets
      this.monitorStyleSheetChanges();
    }

    monitorStyleSheetChanges() {
      // Watch for new stylesheets being loaded
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'style' || tagName.toLowerCase() === 'link') {
          element.addEventListener('load', () => {
            // New stylesheet loaded, check for revealed banners
            setTimeout(() => {
              if (window.cookieKiller) {
                window.cookieKiller.scanForBanners();
              }
            }, 100);
          });
        }
        
        return element;
      };
    }

    setupScriptObserver() {
      const scriptObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'SCRIPT') {
              const src = node.src || '';
              const content = node.textContent || '';
              
              if (this.isCookieFrameworkScript(src, content)) {
                console.log('📜 Cookie framework script detected:', src || 'inline');
                this.handleFrameworkScriptInjection(node);
              }
            }
          });
        });
      });
      
      scriptObserver.observe(document.documentElement, { childList: true, subtree: true });
      this.observers.push(scriptObserver);
    }

    isCookieFrameworkScript(src, content) {
      const frameworkIndicators = [
        'cookiebot', 'onetrust', 'trustarc', 'quantcast', 'didomi',
        'usercentrics', 'cookiepro', 'termly', 'iubenda', 'borlabs'
      ];
      
      return frameworkIndicators.some(indicator => 
        src.toLowerCase().includes(indicator) || 
        content.toLowerCase().includes(indicator)
      );
    }

    handleFrameworkScriptInjection(scriptElement) {
      console.log('🏭 Handling framework script injection');
      
      if (this.evasionConfig.proactiveBlocking) {
        scriptElement.type = 'text/blocked';
        scriptElement.remove();
      }
      
      setTimeout(() => {
        this.scanForBanners();
        this.setupExtendedMonitoring();
      }, 1000);
    }

    scanForNewFrameworks() {
      console.log('🏭 Scanning for newly loaded cookie frameworks...');
      
      // Check for new global variables
      this.knownEvasionTechniques.cookieFrameworks.forEach(framework => {
        const variations = [
          framework, framework.toUpperCase(), 
          framework + 'API', framework + '_api',
          framework + 'SDK', framework + '_sdk'
        ];
        
        variations.forEach(variation => {
          if (window[variation]) {
            if (!this.detectedFrameworks) this.detectedFrameworks = new Set();
            
            if (!this.detectedFrameworks.has(variation)) {
              console.log(`🏭 New framework detected: ${variation}`);
              this.detectedFrameworks.add(variation);
              this.handleNewFrameworkDetection(variation);
            }
          }
        });
      });
      
      // Check for new framework-specific DOM elements
      const frameworkSelectors = [
        '[class*="cookiebot"]', '[class*="onetrust"]', '[class*="trustarc"]',
        '[class*="quantcast"]', '[class*="didomi"]', '[class*="usercentrics"]'
      ];
      
      frameworkSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`🏭 Framework elements found: ${selector}`);
          elements.forEach(el => {
            if (this.isValidCookieBanner(el)) {
              this.processBanner(el);
            }
          });
        }
      });
    }

    handleNewFrameworkDetection(variation) {
      console.log(`🎯 Handling new framework detection: ${variation}`);
      setTimeout(() => {
        this.scanForBanners();
      }, 500);
    }

    detectLazyLoadedContent() {
      console.log('⏳ Detecting lazy-loaded banner content...');
      
      const lazyElements = document.querySelectorAll('[data-src], [loading="lazy"], .lazy-load');
      
      lazyElements.forEach(element => {
        if (this.isLikelyCookieElement(element)) {
          if (element.dataset.src) {
            element.src = element.dataset.src;
            delete element.dataset.src;
          }
          
          element.dispatchEvent(new Event('load'));
          setTimeout(() => this.scanForBanners(), 1000);
        }
      });
    }

    async performDeepScan() {
      console.log('🔍 Performing deep scan for hidden banners...');
      
      const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"], .hidden, .invisible');
      
      for (const element of hiddenElements) {
        if (this.isLikelyCookieElement(element)) {
          const originalStyle = element.style.cssText;
          element.style.display = 'block';
          element.style.visibility = 'visible';
          
          if (this.isValidCookieBanner(element)) {
            console.log('🕵️ Found hidden banner during deep scan:', element);
            await this.processBanner(element);
          }
          
          element.style.cssText = originalStyle;
        }
      }
      
      const highZElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const zIndex = parseInt(window.getComputedStyle(el).zIndex);
        return zIndex > 1000;
      });
      
      for (const element of highZElements) {
        if (this.isLikelyCookieElement(element) && this.isValidCookieBanner(element)) {
          console.log('🎯 Found high z-index banner:', element);
          await this.processBanner(element);
        }
      }
    }

    detectEventTriggeredBanners() {
      console.log('🎭 Detecting event-triggered banners...');
      
      const triggerEvents = [
        new Event('scroll'),
        new Event('mousemove'),
        new Event('click', { bubbles: true }),
        new Event('focus'),
        new Event('resize')
      ];
      
      triggerEvents.forEach(event => {
        document.dispatchEvent(event);
        window.dispatchEvent(event);
      });
      
      setTimeout(() => this.scanForBanners(), 1500);
    }

    monitorFrameworkByName(frameworkName) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'SCRIPT') {
              const src = node.src || '';
              const content = node.textContent || '';
              
              if (src.toLowerCase().includes(frameworkName) || 
                  content.toLowerCase().includes(frameworkName)) {
                console.log(`🏭 ${frameworkName} framework detected`);
                this.handleFrameworkDetection(frameworkName, frameworkName);
              }
            }
          });
        });
      });
      
      observer.observe(document.documentElement, { childList: true, subtree: true });
      this.observers.push(observer);
    }

    handleFrameworkDetection(frameworkName, identifier) {
      console.log(`🎯 Handling ${frameworkName} framework detection`);
      
      setTimeout(() => {
        this.scanForBanners();
        
        if (frameworkName.toLowerCase().includes('onetrust')) {
          this.scanOneTrustElements();
        } else if (frameworkName.toLowerCase().includes('cookiebot')) {
          this.scanCookieBotElements();
        }
      }, 500);
      
      this.setupFrameworkSpecificMonitoring(frameworkName);
    }

    scanOneTrustElements() {
      const oneTrustSelectors = [
        '#onetrust-banner-sdk', '#onetrust-consent-sdk',
        '.optanon-alert-box-wrapper', '.ot-sdk-container',
        '[class*="optanon"]', '[id*="optanon"]'
      ];
      
      oneTrustSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (this.isValidCookieBanner(el)) {
            console.log('🎯 OneTrust banner found:', el);
            this.processBanner(el);
          }
        });
      });
    }

    scanCookieBotElements() {
      const cookieBotSelectors = [
        '#CybotCookiebotDialog', '.CybotCookiebotDialog',
        '#cookiebot', '.cookiebot-banner',
        '[id*="cookiebot"]', '[class*="cookiebot"]'
      ];
      
      cookieBotSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (this.isValidCookieBanner(el)) {
            console.log('🎯 CookieBot banner found:', el);
            this.processBanner(el);
          }
        });
      });
    }

    // Missing methods found by validation
    monitorScriptLoading(identifiers, frameworkName) {
      const scriptObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'SCRIPT') {
              const src = node.src || '';
              
              const isFrameworkScript = identifiers.some(identifier =>
                src.toLowerCase().includes(identifier)
              );
              
              if (isFrameworkScript) {
                console.log(`📜 ${frameworkName} script loading:`, src);
                
                // Wait for script to execute and create elements
                setTimeout(() => {
                  this.scanForBanners();
                }, 1000);
              }
            }
          });
        });
      });
      
      scriptObserver.observe(document.documentElement, { childList: true, subtree: true });
      this.observers.push(scriptObserver);
    }

    monitorFrameworkElements(identifiers) {
      const elementObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const className = (node.className || '').toString().toLowerCase();
              const id = (node.id || '').toString().toLowerCase();
              
              const isFrameworkElement = identifiers.some(identifier =>
                className.includes(identifier) || id.includes(identifier)
              );
              
              if (isFrameworkElement && this.isValidCookieBanner(node)) {
                console.log('🏭 Framework element added to DOM:', node);
                this.processBanner(node);
              }
            }
          });
        });
      });
      
      elementObserver.observe(document.documentElement, { childList: true, subtree: true });
      this.observers.push(elementObserver);
    }

    // CRITICAL FIX: Add calculateRejectScore method to main class
    calculateRejectScore(text, button) {
      // FIXED: Remove recursive delegation to prevent infinite loop
      // DO NOT delegate to rule-based agent - implement directly
      
      const normalizedText = text.toLowerCase().trim();
      let score = 0;
      
      // High confidence reject patterns
      const rejectPatterns = ['reject all', 'decline all', 'deny all', 'refuse all'];
      if (rejectPatterns.some(pattern => normalizedText.includes(pattern))) {
        score += 0.8;
      }
      
      // Medium confidence patterns
      const mediumPatterns = ['reject', 'decline', 'deny', 'refuse'];
      if (mediumPatterns.some(pattern => normalizedText === pattern)) {
        score += 0.5;
      }
      
      // Penalty for accept words
      const acceptPatterns = ['accept', 'allow', 'agree', 'enable'];
      if (acceptPatterns.some(pattern => normalizedText.includes(pattern))) {
        score -= 0.4;
      }
      
      return Math.max(0, Math.min(1, score));
    }

    async findAndClickRejectButton(banner) {
      // FIXED: Remove recursive delegation to prevent infinite loop
      // DO NOT delegate to window.cookieKiller - implement directly
      
      const buttons = banner.querySelectorAll('button, a[role="button"], input[type="button"], [onclick]');
      
      for (const button of buttons) {
        const text = button.textContent?.toLowerCase().trim() || '';
        const ariaLabel = (button.getAttribute('aria-label') || '').toString().toLowerCase();
        const title = (button.getAttribute('title') || '').toString().toLowerCase();
        const fullText = `${text} ${ariaLabel} ${title}`;
        
        const rejectScore = this.calculateRejectScore(fullText, button);
        
        if (rejectScore > 0.7) {
          const result = await this.clickButton(button);
          if (result.success) {
            return {
              success: true,
              confidence: rejectScore,
              buttonText: result.buttonText
            };
          }
        }
      }
      
      return { success: false, confidence: 0 };
    }

    async clickButton(button) {
      // FIXED: Remove recursive delegation to prevent infinite loop
      // DO NOT delegate to window.cookieKiller - implement directly
      
      return new Promise(resolve => {
        try {
          const buttonText = button.textContent?.trim() || button.getAttribute('aria-label') || 'Unknown button';
          
          // Multiple click strategies
          button.click();
          
          // Trigger other events
          ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            const event = new MouseEvent(eventType, {
              bubbles: true,
              cancelable: true,
              view: window
            });
            button.dispatchEvent(event);
          });
          
          // Check success after short delay
          setTimeout(() => {
            const stillVisible = this.isElementVisible(button.closest('[class*="cookie"], [class*="consent"], [class*="banner"]'));
            resolve({
              success: !stillVisible,
              buttonText: buttonText
            });
          }, 1000);
          
        } catch (error) {
          console.warn('Button click failed:', error);
          resolve({
            success: false,
            buttonText: button.textContent?.trim() || 'Unknown button'
          });
        }
      });
    }
  }

  // Rule-based agent for fallback and basic processing
  class CookieBannerAgent {
    constructor() {
      this.smartDecisionEngine = {
        patterns: this.loadKnownPatterns(),
        determineStrategy: this.determineStrategy.bind(this)
      };
      this.blockingStrategies = this.initializeBlockingStrategies();
    }

    async processBanner(banner) {
      // ENHANCED ERROR HANDLING: Prevent all types of errors
      if (!banner) {
        return { success: false, reason: 'Invalid banner element' };
      }

      console.log('🎯 Processing banner with rule-based agent');
      const startTime = Date.now();
      
      try {
        // 1. Try to click reject button with timeout and error handling
        const rejectResult = await Promise.race([
          this.findAndClickRejectButton(banner),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Reject button timeout')), 3000)
          )
        ]).catch(error => {
          console.warn('Reject button operation failed:', error);
          return { success: false, error: error.message };
        });
        
        if (rejectResult && rejectResult.success) {
          // TOAST NOTIFICATION: Show success via main instance
          if (window.cookieKiller) {
            window.cookieKiller.showToast(
              'success', 
              'Cookie Rejection Successful!', 
              rejectResult.buttonText
            );
          }
          
          // VISUAL FEEDBACK: Mark successful rejection
                  this.markBannerSuccess(banner, 'REJECT BUTTON CLICKED', rejectResult.buttonText);
        
        // ENHANCEMENT: Learn successful patterns for this domain
        this.learnSuccessfulPattern(banner, rejectResult.buttonText);
        
        return {
          success: true,
          method: 'button-click',
          buttonClicked: true,
          confidence: rejectResult.confidence || 0.5,
          processingTime: Date.now() - startTime
        };
        }
        
        // 2. Try strategy-based approach with timeout and error handling
        const strategy = this.determineStrategy(banner);
        const strategyResult = await Promise.race([
          this.executeStrategy(strategy, banner),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Strategy timeout')), 3000)
          )
        ]).catch(error => {
          console.warn('Strategy execution failed:', error);
          return { success: false, error: error.message };
        });
        
        if (strategyResult && strategyResult.success) {
          // TOAST NOTIFICATION: Show strategy success
          if (window.cookieKiller) {
            window.cookieKiller.showToast(
              'success', 
              `Strategy Success: ${strategy.name}`, 
              strategyResult.buttonText || 'Multiple actions'
            );
          }
          
          // VISUAL FEEDBACK: Mark successful strategy
          this.markBannerSuccess(banner, 'STRATEGY SUCCESS', strategy.name);
          return {
            success: true,
            method: 'strategy-execution',
            strategy: strategy.name,
            confidence: strategyResult.confidence || 0.7,
            processingTime: Date.now() - startTime
          };
        }
        
        // 3. NO FALLBACK HIDING - Show failure toast
        if (window.cookieKiller) {
          window.cookieKiller.showToast(
            'error', 
            'No Safe Reject Button Found', 
            'Banner left visible for inspection'
          );
        }
        
        this.markBannerFailure(banner, 'NO REJECT BUTTON FOUND');
        console.warn('🚫 Could not find safe reject button for banner:', banner);
        
        return {
          success: false,
          method: 'no-safe-button-found',
          confidence: 0,
          processingTime: Date.now() - startTime,
          reason: 'No reject button with sufficient confidence found'
        };
        
      } catch (error) {
        console.error('❌ Rule-based processing failed:', error);
        
        // EMERGENCY ERROR HANDLING: Show error toast
        if (window.cookieKiller) {
          window.cookieKiller.showToast(
            'error', 
            'Processing Error', 
            error.message || 'Unknown error occurred'
          );
        }
        
        this.markBannerFailure(banner, `PROCESSING ERROR: ${error.message}`);
        return {
          success: false,
          method: 'rule-based-error',
          error: error.message,
          confidence: 0,
          processingTime: Date.now() - startTime
        };
      }
    }

    // NEW: Visual feedback methods
    markBannerSuccess(banner, method, details) {
      try {
        // Add visual indicator for successful processing
        banner.style.border = '3px solid #28a745';
        banner.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.5)';
        
        // Add success message overlay
        const successOverlay = document.createElement('div');
        successOverlay.innerHTML = `
          <div style="
            position: absolute;
            top: 0;
            right: 0;
            background: #28a745;
            color: white;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: bold;
            z-index: 999999;
            border-radius: 0 0 0 8px;
          ">
            ✅ ${method}${details ? `: ${details}` : ''}
          </div>
        `;
        banner.style.position = 'relative';
        banner.appendChild(successOverlay);
        
        // Remove indicator after 5 seconds
        setTimeout(() => {
          if (successOverlay.parentNode) {
            successOverlay.remove();
          }
          banner.style.border = '';
          banner.style.boxShadow = '';
        }, 5000);
        
        console.log(`✅ ${method}: ${details || 'Success'}`);
      } catch (error) {
        console.warn('Failed to add success indicator:', error);
      }
    }

    markBannerFailure(banner, reason) {
      try {
        // Add visual indicator for failed processing
        banner.style.border = '3px solid #dc3545';
        banner.style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.5)';
        
        // Add failure message overlay
        const failureOverlay = document.createElement('div');
        failureOverlay.innerHTML = `
          <div style="
            position: absolute;
            top: 0;
            right: 0;
            background: #dc3545;
            color: white;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: bold;
            z-index: 999999;
            border-radius: 0 0 0 8px;
          ">
            ❌ ${reason}
          </div>
        `;
        banner.style.position = 'relative';
        banner.appendChild(failureOverlay);
        
        // Keep indicator visible longer so you can see what failed
        setTimeout(() => {
          if (failureOverlay.parentNode) {
            failureOverlay.remove();
          }
          banner.style.border = '';
          banner.style.boxShadow = '';
        }, 10000);
        
        console.log(`❌ ${reason} - Banner left visible for inspection`);
      } catch (error) {
        console.warn('Failed to add failure indicator:', error);
      }
    }

    calculateRejectScore(text, button) {
      // FIXED: Remove recursive delegation to prevent infinite loop
      // DO NOT delegate to window.cookieKiller - implement directly
      
      const normalizedText = text.toLowerCase().trim();
      let score = 0;
      
      // High confidence reject patterns
      const rejectPatterns = ['reject all', 'decline all', 'deny all', 'refuse all'];
      if (rejectPatterns.some(pattern => normalizedText.includes(pattern))) {
        score += 0.8;
      }
      
      // Medium confidence patterns
      const mediumPatterns = ['reject', 'decline', 'deny', 'refuse'];
      if (mediumPatterns.some(pattern => normalizedText === pattern)) {
        score += 0.5;
      }
      
      // Penalty for accept words
      const acceptPatterns = ['accept', 'allow', 'agree', 'enable'];
      if (acceptPatterns.some(pattern => normalizedText.includes(pattern))) {
        score -= 0.4;
      }
      
      return Math.max(0, Math.min(1, score));
    }

    async findAndClickRejectButton(banner) {
      // FIXED: Remove recursive delegation to prevent infinite loop
      // DO NOT delegate to window.cookieKiller - implement directly
      
      const buttons = banner.querySelectorAll('button, a[role="button"], input[type="button"], [onclick]');
      
      for (const button of buttons) {
        const text = button.textContent?.toLowerCase().trim() || '';
        const ariaLabel = (button.getAttribute('aria-label') || '').toString().toLowerCase();
        const title = (button.getAttribute('title') || '').toString().toLowerCase();
        const fullText = `${text} ${ariaLabel} ${title}`;
        
        const rejectScore = this.calculateRejectScore(fullText, button);
        
        if (rejectScore > 0.7) {
          const result = await this.clickButton(button);
          if (result.success) {
            return {
              success: true,
              confidence: rejectScore,
              buttonText: result.buttonText
            };
          }
        }
      }
      
      return { success: false, confidence: 0 };
    }

    async clickButton(button) {
      // FIXED: Remove recursive delegation to prevent infinite loop
      // DO NOT delegate to window.cookieKiller - implement directly
      
      return new Promise(resolve => {
        try {
          const buttonText = button.textContent?.trim() || button.getAttribute('aria-label') || 'Unknown button';
          
          // Multiple click strategies
          button.click();
          
          // Trigger other events
          ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            const event = new MouseEvent(eventType, {
              bubbles: true,
              cancelable: true,
              view: window
            });
            button.dispatchEvent(event);
          });
          
          // Check success after short delay
          setTimeout(() => {
            const stillVisible = this.isElementVisible(button.closest('[class*="cookie"], [class*="consent"], [class*="banner"]'));
            resolve({
              success: !stillVisible,
              buttonText: buttonText
            });
          }, 1000);
          
        } catch (error) {
          console.warn('Button click failed:', error);
          resolve({
            success: false,
            buttonText: button.textContent?.trim() || 'Unknown button'
          });
        }
      });
    }

    isElementVisible(element) {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0' &&
             rect.width > 0 && 
             rect.height > 0;
    }

    determineStrategy(banner) {
      const text = banner.textContent?.toLowerCase() || '';
      const className = (banner.className || '').toString().toLowerCase();
      const buttonCount = banner.querySelectorAll('button').length;
      
      // Strategy selection logic
      if (buttonCount >= 3) {
        return { name: 'multi-button', priority: 1 };
      } else if (/cookiebot|onetrust/.test(className)) {
        return { name: 'framework-specific', priority: 2 };
      } else if (buttonCount === 1) {
        return { name: 'single-button', priority: 3 };
      } else {
        return { name: 'generic-hiding', priority: 4 };
      }
    }

    async executeStrategy(strategy, banner) {
      try {
        switch (strategy.name) {
          case 'multi-button':
            return await this.tryMultipleButtons(banner);
          case 'framework-specific':
            return await this.handleFrameworkBanner(banner);
          case 'single-button':
            return await this.handleSingleButton(banner);
          default:
            // NO FALLBACK HIDING - Return failure instead
            return { success: false, confidence: 0, reason: 'No valid strategy found' };
        }
      } catch (error) {
        console.error('Strategy execution failed:', error);
        return { success: false };
      }
    }

    async tryMultipleButtons(banner) {
      const buttons = Array.from(banner.querySelectorAll('button, a[role="button"]'));
      
      // Sort by reject likelihood
      buttons.sort((a, b) => {
        const scoreA = this.calculateRejectScore(a.textContent?.toLowerCase() || '', a);
        const scoreB = this.calculateRejectScore(b.textContent?.toLowerCase() || '', b);
        return scoreB - scoreA;
      });
      
      for (const button of buttons.slice(0, 3)) { // Try top 3
        const result = await this.clickButton(button);
        if (result.success) {
          return { 
            success: true, 
            confidence: 0.8,
            buttonText: result.buttonText
          };
        }
      }
      
      return { success: false };
    }

    async handleFrameworkBanner(banner) {
      const className = (banner.className || '').toString().toLowerCase();
      
      if (className.includes('cookiebot')) {
        return await this.handleCookiebot(banner);
      } else if (className.includes('onetrust')) {
        return await this.handleOneTrust(banner);
      }
      
      return { success: false };
    }

    async handleCookiebot(banner) {
      // Cookiebot specific handling
      const rejectBtn = banner.querySelector('[id*="reject"], [class*="reject"]');
      if (rejectBtn) {
        const result = await this.clickButton(rejectBtn);
        return { 
          success: result.success, 
          confidence: 0.9,
          buttonText: result.buttonText
        };
      }
      return { success: false };
    }

    async handleOneTrust(banner) {
      // OneTrust specific handling
      const rejectBtn = banner.querySelector('#onetrust-reject-all-handler, .onetrust-close-btn-ui');
      if (rejectBtn) {
        const result = await this.clickButton(rejectBtn);
        return { 
          success: result.success, 
          confidence: 0.9,
          buttonText: result.buttonText
        };
      }
      return { success: false };
    }

    async handleSingleButton(banner) {
      const button = banner.querySelector('button, a[role="button"]');
      if (button) {
        const text = button.textContent?.toLowerCase() || '';
        
        // Only click if it seems safe
        if (!/accept|allow|agree|enable/.test(text)) {
          const result = await this.clickButton(button);
          return { 
            success: result.success, 
            confidence: 0.6,
            buttonText: result.buttonText
          };
        }
      }
      
      // NO FALLBACK HIDING - Return failure instead
      return { success: false, confidence: 0, reason: 'Unsafe button or no button found' };
    }

    loadKnownPatterns() {
      return {
        reject: ['reject', 'decline', 'deny', 'refuse', 'dismiss', 'close', 'no'],
        accept: ['accept', 'allow', 'agree', 'enable', 'yes'],
        necessary: ['necessary', 'essential', 'required', 'functional'],
        manage: ['manage', 'customize', 'preferences', 'settings']
      };
    }

    initializeBlockingStrategies() {
      return {
        immediate: { priority: 1, delay: 0 },
        delayed: { priority: 2, delay: 1000 },
        observer: { priority: 3, delay: 0 }
      };
    }
  }

  // Initialize the system when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCookieKiller);
  } else {
    initializeCookieKiller();
  }

  async function initializeCookieKiller() {
    try {
      console.log('🍪 Initializing Cookie Marshal AI Agent...');
      
      // ENHANCED ERROR BOUNDARY: Prevent initialization failures
      const maxRetries = 3;
      let retryCount = 0;
      
      while (retryCount < maxRetries) {
        try {
          // Small delay to ensure page is settled
          await new Promise(resolve => setTimeout(resolve, 1000 + (retryCount * 500)));
          
          // Initialize with error recovery
          window.cookieKiller = new AntiEvasionCookieKiller();
          await window.cookieKiller.initialize();
          
          console.log('✅ Cookie Banner Killer initialized successfully');
          break;
          
        } catch (initError) {
          retryCount++;
          console.warn(`⚠️ Initialization attempt ${retryCount} failed:`, initError);
          
          if (retryCount >= maxRetries) {
            console.error('❌ Failed to initialize after maximum retries');
            
            // Create minimal fallback instance
            window.cookieKiller = {
              isEnabled: false,
              showToast: (type, message) => console.log(`Toast: ${type} - ${message}`),
              getStatistics: () => ({ error: 'Initialization failed', retries: retryCount }),
              scanForBanners: () => console.log('Fallback: Scanner not available'),
              cleanup: () => console.log('Fallback: Cleanup completed')
            };
            break;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
    } catch (criticalError) {
      console.error('🚨 CRITICAL ERROR during initialization:', criticalError);
      
      // Emergency fallback
      window.cookieKiller = {
        isEnabled: false,
        error: criticalError.message,
        showToast: () => {},
        getStatistics: () => ({ criticalError: criticalError.message }),
        scanForBanners: () => {},
        cleanup: () => {}
      };
    }
  }

  // Enhanced cleanup on page unload with error protection
  window.addEventListener('beforeunload', () => {
    try {
      if (window.cookieKiller && typeof window.cookieKiller.cleanup === 'function') {
        window.cookieKiller.cleanup();
      }
    } catch (cleanupError) {
      console.warn('Cleanup error (non-critical):', cleanupError);
    }
  });

  // GLOBAL ERROR HANDLER: Catch any remaining unhandled errors
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && 
        (event.error.message.includes('Maximum call stack') || 
         event.error.message.includes('cookieKiller') ||
         event.error.message.includes('calculateRejectScore'))) {
      
      console.error('🚨 CRITICAL: Detected potential recursion error:', event.error);
      
      // Try to recover by disabling problematic functions
      if (window.cookieKiller) {
        window.cookieKiller.isEnabled = false;
        console.log('🛡️ Disabled extension to prevent further recursion');
      }
      
      // Prevent default error handling to avoid browser crash
      event.preventDefault();
      return false;
    }
  });

})(); 