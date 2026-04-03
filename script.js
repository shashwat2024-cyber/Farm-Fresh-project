

/**
 * CART HELPER FUNCTIONS
 * Handles data persistence using the browser's localStorage.
 * Shared across Home, Products, Cart, and Checkout pages.
 */

/**
 * Retrieves all product objects currently stored in the cart.
 * Maps individual localStorage keys back into a clean array of objects.
 */
function getCart() {
  var ids = getCartIds();
  var cart = [];
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var name = localStorage.getItem("cart_name_" + id);
    var price = localStorage.getItem("cart_price_" + id);
    var qty = localStorage.getItem("cart_qty_" + id);

    // Ensure the item exists before pushing to the cart array
    if (name) {
      cart.push({
        id: Number(id),
        name: name,
        price: Number(price),
        qty: Number(qty),
      });
    }
  }
  return cart;
}

/**
 * Fetches the comma-separated string of IDs from storage and converts it to an array.
 * Returns an empty array if no items exist.
 */
function getCartIds() {
  var ids = localStorage.getItem("cart_ids");
  if (ids) {
    return ids.split(",");
  } else {
    return [];
  }
}

/**
 * Adds a new item or updates existing item details in localStorage.
 * Also manages the master 'cart_ids' list to keep track of all unique products.
 */
function addItemToCart(id, name, price, qty) {
  localStorage.setItem("cart_name_" + id, name);
  localStorage.setItem("cart_price_" + id, price);
  localStorage.setItem("cart_qty_" + id, qty);

  var ids = getCartIds();
  // Add ID to the master list only if it's not already present
  if (ids.indexOf(String(id)) === -1) {
    ids.push(String(id));
    localStorage.setItem("cart_ids", ids.join(","));
  }
}

/**
 * Updates only the quantity of a specific product ID.
 */
function updateQty(id, qty) {
  localStorage.setItem("cart_qty_" + id, qty);
}

/**
 * Removes all keys related to a specific product ID.
 * Filters the 'cart_ids' master list and removes the key entirely if empty.
 */
function removeItem(id) {
  localStorage.removeItem("cart_name_" + id);
  localStorage.removeItem("cart_price_" + id);
  localStorage.removeItem("cart_qty_" + id);

  var ids = getCartIds();
  var newIds = [];
  // Rebuild the ID list excluding the deleted item
  for (var i = 0; i < ids.length; i++) {
    if (ids[i] !== String(id)) {
      newIds.push(ids[i]);
    }
  }

  if (newIds.length > 0) {
    localStorage.setItem("cart_ids", newIds.join(","));
  } else {
    localStorage.removeItem("cart_ids");
  }
}

/**
 * Wipes all cart-related data from localStorage by iterating through the ID list.
 */
function clearCart() {
  var ids = getCartIds();
  for (var i = 0; i < ids.length; i++) {
    localStorage.removeItem("cart_name_" + ids[i]);
    localStorage.removeItem("cart_price_" + ids[i]);
    localStorage.removeItem("cart_qty_" + ids[i]);
  }
  localStorage.removeItem("cart_ids");
}

/**
 * Calculates the total sum of all item quantities.
 * Used primarily for the notification badge in the navigation bar.
 */
function getCartCount() {
  var ids = getCartIds();
  var count = 0;
  for (var i = 0; i < ids.length; i++) {
    var qty = localStorage.getItem("cart_qty_" + ids[i]);
    if (qty) {
      count += Number(qty);
    }
  }
  return count;
}
