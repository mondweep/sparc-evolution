
// order-manager.js - Poor maintainability example
function processOrder(o) { // BAD: Unclear parameter name
    // BAD: No documentation
    // BAD: Magic numbers
    if (o.total > 1000) {
        o.discount = 0.1;
    } else if (o.total > 500) {
        o.discount = 0.05;
    }
    
    // BAD: Long function with multiple responsibilities
    o.tax = o.total * 0.08;
    o.shipping = o.total > 50 ? 0 : 9.99;
    
    // BAD: Nested conditions and repeated code
    if (o.type === 'express') {
        if (o.weight > 10) {
            o.shipping = o.shipping * 2;
        }
        o.deliveryDays = 1;
    } else if (o.type === 'standard') {
        if (o.weight > 10) {
            o.shipping = o.shipping * 1.5;
        }
        o.deliveryDays = 5;
    } else {
        if (o.weight > 10) {
            o.shipping = o.shipping * 1.2;
        }
        o.deliveryDays = 10;
    }
    
    // BAD: Direct database access in business logic
    const db = require('./database');
    db.query("UPDATE orders SET status = 'processed' WHERE id = " + o.id);
    
    return o;
}

// BAD: Global variables
var orderCount = 0;
var lastOrderId = null;

module.exports = { processOrder };
