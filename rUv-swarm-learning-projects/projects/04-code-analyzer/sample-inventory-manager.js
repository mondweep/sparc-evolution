
// inventory-manager.js - Code with potential bugs
class InventoryManager {
    constructor() {
        this.items = null; // BUG: Should be initialized as empty array
    }

    addItem(item) {
        // BUG: No null check for items array
        this.items.push(item);
    }

    removeItem(itemId) {
        // BUG: No bounds checking
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id == itemId) { // BUG: Using == instead of ===
                this.items.splice(i, 1);
                break; // BUG: What if there are duplicates?
            }
        }
    }

    calculateTotal() {
        let total = 0;
        // BUG: No null/undefined check
        this.items.forEach(item => {
            total += item.price * item.quantity; // BUG: What if price or quantity is undefined?
        });
        return total;
    }

    // BUG: Async function without proper error handling
    async updateInventory() {
        const response = await fetch('/api/inventory'); // No try-catch
        const data = response.json(); // BUG: Missing await
        this.items = data.items;
    }

    // BUG: Potential race condition
    processOrder(order) {
        order.items.forEach(orderItem => {
            const inventoryItem = this.findItem(orderItem.id);
            inventoryItem.quantity -= orderItem.quantity; // BUG: No check if item exists
        });
    }
}

module.exports = InventoryManager;
