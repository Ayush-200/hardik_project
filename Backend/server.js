// Add debugging for route registration
import express from 'express';

// Patch the express application to debug route registration
const originalUse = express.application.use;
express.application.use = function() {
    if (typeof arguments[0] === 'string') {
        console.log('🔍 Registering route:', arguments[0]);
        // Check for problematic patterns
        if (arguments[0].includes(':') && (arguments[0].endsWith(':') || arguments[0].match(/:[^/]*$/))) {
            console.log('🚨 POTENTIAL PROBLEM ROUTE:', arguments[0]);
            console.log('   This route might be missing a parameter name after colon');
        }
    }
    return originalUse.apply(this, arguments);
};

// Also patch router methods
const methods = ['get', 'post', 'put', 'delete', 'patch', 'all'];
methods.forEach(method => {
    const original = express.Router.prototype[method];
    express.Router.prototype[method] = function() {
        if (typeof arguments[0] === 'string') {
            console.log(`🔍 Registering ${method.toUpperCase()} route:`, arguments[0]);
            // Check for problematic patterns
            if (arguments[0].includes(':') && (arguments[0].endsWith(':') || arguments[0].match(/:[^/]*$/))) {
                console.log('🚨 POTENTIAL PROBLEM ROUTE:', arguments[0]);
                console.log('   This route might be missing a parameter name after colon');
            }
        }
        return original.apply(this, arguments);
    };
});

// Now import your app (this will trigger route registration)
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;

// Add error handling to catch the route error specifically
try {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} catch (error) {
    console.error('❌ Server failed to start due to route error:');
    console.error(error.message);
    
    // Additional debugging
    if (error.message.includes('Missing parameter name')) {
        console.log('\n💡 This error usually means a route has a colon without a parameter name');
        console.log('💡 Example: "/users:" instead of "/users:id"');
        console.log('💡 Check your route definitions for missing parameter names');
    }
}
