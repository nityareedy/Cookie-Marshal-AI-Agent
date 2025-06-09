/**
 * Performance Optimization Utilities
 * SAFE ENHANCEMENT - Improves performance without breaking existing functionality
 */

class PerformanceOptimizer {
  constructor() {
    this.scanCache = new Map();
    this.cacheTimeout = 30000; // 30 seconds cache
    this.debouncedFunctions = new Map();
    this.lastScanResults = new Map();
    
    // Performance metrics
    this.metrics = {
      scanCount: 0,
      cacheHits: 0,
      totalScanTime: 0,
      averageScanTime: 0
    };
    
    console.log('⚡ Performance Optimizer initialized');
  }

  /**
   * Generate cache key for current page state
   * SAFE: Read-only operation
   */
  generateScanCacheKey() {
    const url = window.location.href;
    const domElements = document.querySelectorAll('*').length;
    const timestamp = Math.floor(Date.now() / this.cacheTimeout); // Cache per 30s window
    
    return `${url}-${domElements}-${timestamp}`;
  }

  /**
   * Check if scan results are cached
   * SAFE: Read-only cache check
   */
  getCachedScanResult(cacheKey = null) {
    const key = cacheKey || this.generateScanCacheKey();
    
    if (this.scanCache.has(key)) {
      this.metrics.cacheHits++;
      console.log('⚡ Using cached scan result');
      return this.scanCache.get(key);
    }
    
    return null;
  }

  /**
   * Cache scan results
   * SAFE: Simple data storage
   */
  cacheScanResult(result, cacheKey = null) {
    const key = cacheKey || this.generateScanCacheKey();
    
    // Cache with expiration
    this.scanCache.set(key, {
      result,
      timestamp: Date.now()
    });
    
    // Clean old cache entries
    this.cleanExpiredCache();
  }

  /**
   * Clean expired cache entries
   * SAFE: Memory management only
   */
  cleanExpiredCache() {
    const now = Date.now();
    const expiredKeys = [];
    
    for (const [key, value] of this.scanCache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.scanCache.delete(key));
  }

  /**
   * Debounce function calls to prevent excessive execution
   * SAFE: Only delays execution, doesn't change behavior
   */
  debounce(func, delay, key = 'default') {
    if (this.debouncedFunctions.has(key)) {
      clearTimeout(this.debouncedFunctions.get(key));
    }
    
    const timeoutId = setTimeout(() => {
      func();
      this.debouncedFunctions.delete(key);
    }, delay);
    
    this.debouncedFunctions.set(key, timeoutId);
  }

  /**
   * Optimized scanning wrapper
   * SAFE: Enhances existing scanning without changing logic
   */
  async optimizedScan(scanFunction, cacheKey = null) {
    const startTime = performance.now();
    this.metrics.scanCount++;
    
    // Check cache first
    const cached = this.getCachedScanResult(cacheKey);
    if (cached) {
      return cached.result;
    }
    
    try {
      // Execute original scan function
      const result = await scanFunction();
      
      // Cache the result
      this.cacheScanResult(result, cacheKey);
      
      // Update metrics
      const scanTime = performance.now() - startTime;
      this.metrics.totalScanTime += scanTime;
      this.metrics.averageScanTime = this.metrics.totalScanTime / this.metrics.scanCount;
      
      console.log(`⚡ Scan completed in ${scanTime.toFixed(2)}ms`);
      
      return result;
      
    } catch (error) {
      console.warn('Optimized scan error:', error);
      throw error; // Re-throw to maintain original error handling
    }
  }

  /**
   * Batch DOM queries for better performance
   * SAFE: Same results, better performance
   */
  batchQuerySelectors(selectors) {
    const results = new Map();
    const startTime = performance.now();
    
    // Group similar selectors
    const groupedSelectors = this.groupSimilarSelectors(selectors);
    
    // Execute grouped queries
    for (const [group, selectorList] of groupedSelectors) {
      try {
        const elements = document.querySelectorAll(selectorList.join(', '));
        
        // Map results back to original selectors
        selectorList.forEach(selector => {
          const matching = Array.from(elements).filter(el => el.matches(selector));
          results.set(selector, matching);
        });
        
      } catch (error) {
        // Handle individual selectors if batch fails
        selectorList.forEach(selector => {
          try {
            const elements = document.querySelectorAll(selector);
            results.set(selector, Array.from(elements));
          } catch (e) {
            results.set(selector, []);
          }
        });
      }
    }
    
    const queryTime = performance.now() - startTime;
    console.log(`⚡ Batch query completed in ${queryTime.toFixed(2)}ms for ${selectors.length} selectors`);
    
    return results;
  }

  /**
   * Group similar selectors for batch processing
   * SAFE: Internal optimization logic
   */
  groupSimilarSelectors(selectors) {
    const groups = new Map();
    
    selectors.forEach(selector => {
      // Simple grouping by selector type
      const type = this.getSelectorType(selector);
      
      if (!groups.has(type)) {
        groups.set(type, []);
      }
      
      groups.get(type).push(selector);
    });
    
    return groups;
  }

  /**
   * Determine selector type for grouping
   * SAFE: Read-only analysis
   */
  getSelectorType(selector) {
    if (selector.startsWith('#')) return 'id';
    if (selector.startsWith('.')) return 'class';
    if (selector.startsWith('[')) return 'attribute';
    if (selector.includes('[class*=')) return 'class-wildcard';
    if (selector.includes('[id*=')) return 'id-wildcard';
    return 'other';
  }

  /**
   * Throttle function execution
   * SAFE: Only limits frequency, doesn't change behavior
   */
  throttle(func, limit, key = 'default') {
    const throttleKey = `throttle_${key}`;
    
    if (!this.lastScanResults.has(throttleKey)) {
      this.lastScanResults.set(throttleKey, 0);
    }
    
    const lastExecution = this.lastScanResults.get(throttleKey);
    const now = Date.now();
    
    if (now - lastExecution >= limit) {
      this.lastScanResults.set(throttleKey, now);
      return func();
    }
    
    console.log(`⚡ Throttled execution (${key})`);
    return null;
  }

  /**
   * Smart delay based on page complexity
   * SAFE: Adaptive timing without breaking functionality
   */
  getAdaptiveDelay() {
    const domSize = document.querySelectorAll('*').length;
    const isComplexPage = domSize > 1000;
    const hasFrameworks = this.detectPerformanceHeavyFrameworks();
    
    let delay = 500; // Base delay
    
    if (isComplexPage) delay += 300;
    if (hasFrameworks) delay += 200;
    
    // Cap at reasonable maximum
    return Math.min(delay, 1500);
  }

  /**
   * Detect performance-heavy frameworks
   * SAFE: Read-only detection
   */
  detectPerformanceHeavyFrameworks() {
    const heavyFrameworks = [
      'React', 'Vue', 'Angular', 'jQuery', 
      'OneTrust', 'Cookiebot', 'TrustArc'
    ];
    
    return heavyFrameworks.some(framework => 
      window[framework] || 
      document.querySelector(`script[src*="${framework.toLowerCase()}"]`)
    );
  }

  /**
   * Get performance metrics
   * SAFE: Read-only statistics
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.scanCache.size,
      cacheHitRate: this.metrics.scanCount > 0 
        ? (this.metrics.cacheHits / this.metrics.scanCount * 100).toFixed(2) + '%'
        : '0%',
      averageScanTime: this.metrics.averageScanTime.toFixed(2) + 'ms'
    };
  }

  /**
   * Reset metrics and cache
   * SAFE: Cleanup operation
   */
  reset() {
    this.scanCache.clear();
    this.lastScanResults.clear();
    this.debouncedFunctions.forEach(timeoutId => clearTimeout(timeoutId));
    this.debouncedFunctions.clear();
    
    this.metrics = {
      scanCount: 0,
      cacheHits: 0,
      totalScanTime: 0,
      averageScanTime: 0
    };
    
    console.log('⚡ Performance optimizer reset');
  }

  /**
   * Cleanup on page unload
   * SAFE: Resource cleanup
   */
  cleanup() {
    this.reset();
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.PerformanceOptimizer = PerformanceOptimizer;
}

console.log('⚡ Performance Optimization utilities loaded'); 