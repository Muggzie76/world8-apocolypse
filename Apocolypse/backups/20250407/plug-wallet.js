/**
 * Enhanced Plug Wallet JS implementation
 * This provides real wallet functionality when the extension is available
 * and falls back to mock functionality when it's not
 */

(function() {
  // Create the window.ic object if it doesn't exist
  window.ic = window.ic || {};
  
  // Cache original plug if it exists
  const originalPlug = window.ic.plug;
  
  // Create a mock plug object with all the functions needed by the game
  const mockPlug = {
    // Flag to track if connected
    isConnected: false,
    _isMock: true,
    
    // Method to check if plug is installed
    isInstalled: function() {
      console.log('MOCK: Checking if Plug wallet is installed');
      return Promise.resolve(true);
    },
    
    // Method to request connection
    requestConnect: function(options) {
      console.log('MOCK: Connecting to Plug wallet', options);
      this.isConnected = true;
      
      // Accept any whitelist provided
      if (options && options.whitelist) {
        console.log('MOCK: Whitelist accepted', options.whitelist);
      }
      
      return Promise.resolve(true);
    },
    
    // Method to get balance
    requestBalance: function() {
      console.log('MOCK: Requesting balance');
      // Return mock balance data
      return Promise.resolve([
        {
          symbol: 'ICP',
          amount: 100, // Default to 100 ICP
          currency: 'ICP'
        }
      ]);
    },
    
    // Method to request transfer
    requestTransfer: function(options) {
      console.log('MOCK: Requesting transfer', options);
      // In mock mode, show an alert for transparency
      if (options && options.amount && options.to) {
        const amountICP = options.amount / 100000000;
        console.log(`MOCK: Would transfer ${amountICP} ICP to ${options.to}`);
        setTimeout(() => {
          alert(`MOCK MODE: Payment simulation successful. Would transfer ${amountICP} ICP to ${options.to}`);
        }, 1000);
      }
      return Promise.resolve(true);
    },
    
    // Method to create agent
    createAgent: function(options) {
      console.log('MOCK: Creating agent', options);
      return Promise.resolve(true);
    },
    
    // Method to get principal ID
    getPrincipal: function() {
      return Promise.resolve('2vxsx-fae');
    }
  };
  
  // Determine if we should use the real Plug
  let useRealPlug = false;
  
  // Check if the real Plug is available and has the necessary functions
  if (originalPlug) {
    try {
      // Check for essential functions
      if (typeof originalPlug.requestConnect === 'function' &&
          typeof originalPlug.requestBalance === 'function' &&
          typeof originalPlug.requestTransfer === 'function') {
        console.log('Real Plug Wallet extension detected with required methods');
        useRealPlug = true;
      } else {
        console.log('Real Plug Wallet extension missing required methods');
        
        // Patch any missing methods
        if (typeof originalPlug.requestConnect !== 'function') {
          console.log('Patching missing requestConnect method');
          originalPlug.requestConnect = mockPlug.requestConnect;
        }
        
        if (typeof originalPlug.requestBalance !== 'function') {
          console.log('Patching missing requestBalance method');
          originalPlug.requestBalance = mockPlug.requestBalance;
        }
        
        if (typeof originalPlug.requestTransfer !== 'function') {
          console.log('Patching missing requestTransfer method');
          originalPlug.requestTransfer = mockPlug.requestTransfer;
        }
        
        if (typeof originalPlug.getPrincipal !== 'function') {
          console.log('Patching missing getPrincipal method');
          originalPlug.getPrincipal = mockPlug.getPrincipal;
        }
        
        // Use the patched original
        useRealPlug = true;
      }
    } catch (e) {
      console.log('Error checking Plug Wallet extension:', e);
      useRealPlug = false;
    }
  }
  
  // Set the plug object based on our decision
  if (useRealPlug) {
    console.log('Using real/patched Plug Wallet extension');
    window.ic.plug = originalPlug;
  } else {
    console.log('Using mock Plug Wallet implementation');
    window.ic.plug = mockPlug;
  }
  
  // Safely define any methods that might be missing
  if (!window.ic.plug.requestBalance) {
    console.warn('requestBalance not found, adding mock implementation');
    window.ic.plug.requestBalance = mockPlug.requestBalance;
  }
  
  if (!window.ic.plug.requestTransfer) {
    console.warn('requestTransfer not found, adding mock implementation');
    window.ic.plug.requestTransfer = mockPlug.requestTransfer;
  }
  
  if (!window.ic.plug.getPrincipal) {
    console.warn('getPrincipal not found, adding mock implementation');
    window.ic.plug.getPrincipal = mockPlug.getPrincipal;
  }
  
  // Add helper method to check if we're using mock mode
  window.ic.plug.isMockMode = function() {
    return window.ic.plug._isMock === true;
  };
  
  console.log('Plug Wallet initialization complete');
})();