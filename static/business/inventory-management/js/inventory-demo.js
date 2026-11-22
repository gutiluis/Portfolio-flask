// file: inventory-demo.js
// descr: non persistent inventory demo
const STORAGE_KEY = "inventoryDemo";

const initialProducts = [
    {
        id: 1,
        product_name: "Wireless Keyboard",
        quantity: 15,
        unit_cost: 29.99,
        selling_price: 40,
        updated_at: "2026-11-01T10:00:00",
    },
    {
        id: 2,
        product_name: "USB-C Cable",
        quantity: 30,
        unit_cost: 10,
        selling_price: 20,
        updated_at: "2026-11-02T11:30:00",
    },
    {
        id: 3,
        product_name: "Wireless Mouse",
        quantity: 20,
        unit_cost: 20,
        selling_price: 22.99,
        updated_at: "2026-11-03T14:15:00",
    },
];

// DOM elements
const productForm = document.querySelector("#product-form");
const productIdInput = document.querySelector("#product-id");
const productNameInput = document.querySelector("#product-name");
const quantityInput = document.querySelector("#quantity");
const unitCostInput = document.getElementById("unit-cost");
const sellingPriceInput = document.getElementById("selling-price");
const updatedAtContainer = document.getElementById("updated-at-container");
const updatedAt = document.querySelector("#updated-at");

const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");
const resetButton = document.querySelector("#reset-button");

const inventoryTableBody = document.querySelector("#inventory-table-body");
const inventoryCount = document.querySelector("#inventory-count");
const emptyMessage = document.querySelector("#empty-message");

// Initialize localStorage
function initializeInventory() {
    const storedProducts = localStorage.getItem(STORAGE_KEY);

    if (storedProducts === null) {
        saveInventory(initialProducts);
    }

    displayInventory();
}

// Read inventory
function getInventory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Save inventory
function saveInventory(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function formatDate(date) {
    return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
    });
}

// Display html table inventory
function displayInventory() {
    const products = getInventory();
    inventoryTableBody.replaceChildren();
    const fragment = document.createDocumentFragment();

    inventoryCount.textContent = `${products.length} ${products.length === 1 ? "product" : "products"}`;

    emptyMessage.hidden = products.length !== 0;

    products.forEach((product) => {
        const row = document.createElement("tr");
        const formattedDate = formatDate(product.updated_at);
        const values = [
            product.id,
            product.product_name,
            product.quantity,
            `$${Number(product.unit_cost).toFixed(2)}`,
            `$${Number(product.selling_price).toFixed(2)}`,
            formattedDate,
        ];

        values.forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            editProduct(product.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteProduct(product.id);
        });

        actionsCell.append(editButton, deleteButton);
        row.appendChild(actionsCell);

        fragment.appendChild(row);
    });

    inventoryTableBody.appendChild(fragment);
}

function getNextProductId(products) {
    return products.length
        ? Math.max(...products.map((product) => Number(product.id))) + 1
        : 1;
}

// Create or update product
productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const products = getInventory();
    const productId = Number(productIdInput.value);

    const product = {
        id: productId || getNextProductId(products),
        product_name: productNameInput.value.trim(),
        quantity: Number(quantityInput.value),
        unit_cost: Number(unitCostInput.value),
        selling_price: Number(sellingPriceInput.value),
        updated_at: new Date().toISOString(),
    };
    if (productId) {
        const index = products.findIndex((item) => item.id === productId);
        if (index === -1) {
            return;
        }
        products[index] = product;
    } else {
        products.push(product);
    }
    saveInventory(products);
    displayInventory();
    resetForm();
});

// Edit product
function editProduct(id) {
    const products = getInventory();

    const product = products.find((item) => item.id === id);

    if (!product) {
        return;
    }
    // value is a property
    productIdInput.value = product.id;
    productNameInput.value = product.product_name;
    quantityInput.value = product.quantity;
    unitCostInput.value = product.unit_cost;
    sellingPriceInput.value = product.selling_price;
    updatedAtContainer.hidden = false;
    updatedAt.textContent = formatDate(product.updated_at);

    submitButton.textContent = "Update Product";
    cancelButton.hidden = false;

    productNameInput.focus();
}

// Delete product
function deleteProduct(id) {
    const confirmed = confirm("Are you sure you want to delete this product?");

    if (!confirmed) {
        return;
    }

    const products = getInventory().filter((product) => product.id !== id);

    saveInventory(products);
    resetForm();
    displayInventory();
}

// Reset form
function resetForm() {
    productForm.reset();

    productIdInput.value = "";
    updatedAtContainer.hidden = true;
    updatedAt.textContent = "";

    submitButton.textContent = "Add Product";
    cancelButton.hidden = true;
}

// Cancel editing
cancelButton.addEventListener("click", resetForm);

// Reset demo inventory
resetButton.addEventListener("click", () => {
    saveInventory([]);
    resetForm();
    displayInventory();
});

// Start application
initializeInventory();
