export default {
  ci: {
    collect: {
      // Collect lighthouse data for built static site
      staticDistDir: './dist',
      url: ['http://localhost/'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        // Simulate real device conditions
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      },
    },
    assert: {
      // Set performance budgets and accessibility thresholds
      assertions: {
        // Performance budgets
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],

        // Resource budgets
        'resource-summary:total:size': ['error', { maxNumericValue: 2000000 }], // 2MB
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }], // 500KB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }], // 100KB
        'resource-summary:image:size': ['error', { maxNumericValue: 1000000 }], // 1MB

        // Performance metrics
        'speed-index': ['error', { maxNumericValue: 3000 }],
        interactive: ['error', { maxNumericValue: 3000 }],

        // Accessibility requirements
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-description': 'error',
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'aria-valid-attr': 'error',
        'button-name': 'error',
        'link-name': 'error',
        'image-alt': 'error',
        'input-image-alt': 'error',
        label: 'error',

        // Best practices
        'uses-https': 'error',
        'no-vulnerable-libraries': 'error',
        charset: 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
      // Optional: Upload to LHCI server if configured
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: 'your-token',
    },
    server: {
      // Configuration for starting a local server
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lhci.db',
      },
    },
  },
};
