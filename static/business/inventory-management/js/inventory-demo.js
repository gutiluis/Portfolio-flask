// file: inventory-demo.js
// descr: non persistent inventory demo
const STORAGE_KEY = "inventoryDemo";

const initialProducts = [
    {
        id: 1,
        product_name: "Wireless Keyboard",
        quantity: 15,
        price: 29.99,
        updated_at: "2026-11-01 10:00:00",
    },
    {
        id: 2,
        product_name: "USB-C Cable",
        quantity: 30,
        price: 9.99,
        updated_at: "2026-11-02 11:30:00",
    },
    {
        id: 3,
        product_name: "Wireless Mouse",
        quantity: 20,
        price: 19.99,
        updated_at: "2026-11-03 14:15:00",
    },
];

// DOM elements
const productForm = document.querySelector("#product-form");
const productIdInput = document.querySelector("#product-id");
const productNameInput = document.querySelector("#product-name");
const quantityInput = document.querySelector("#quantity");
const priceInput = document.querySelector("#price");
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
    if (localStorage.getItem(STORAGE_KEY) === null) {
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

// Display html table inventory
function displayInventory() {
    const products = getInventory();
    const fragment = document.createDocumentFragment();

    inventoryCount.textContent = `${products.length} ${products.length === 1 ? "product" : "products"}`;

    emptyMessage.hidden = products.length !== 0;

    products.forEach((product) => {
        const row = document.createElement("tr");

        const values = [
            product.id,
            product.product_name,
            product.quantity,
            `$${Number(product.price).toFixed(2)}`,
            product.updated_at,
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

// Create or update product
productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const products = getInventory();

    const product = {
        product_name: productNameInput.value.trim(),
        quantity: Number(quantityInput.value),
        price: Number(priceInput.value),
        updated_at: new Date().toLocaleString(),
    };

    if (!product.product_name) {
        return;
    }

    if (productIdInput.value) {
        // Update existing product
        const id = Number(productIdInput.value);

        const index = products.findIndex((item) => item.id === id);

        if (index === -1) {
            return;
        }

        products[index] = {
            ...products[index],
            ...product,
        };
    } else {
        // Create new product
        const nextId =
            products.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

        products.push({
            id: nextId,
            ...product,
        });
    }

    saveInventory(products);
    resetForm();
    displayInventory();
});

// Edit product
function editProduct(id) {
    const products = getInventory();

    const product = products.find((item) => item.id === id);

    if (!product) {
        return;
    }

    productIdInput.value = product.id;
    productNameInput.value = product.product_name;
    quantityInput.value = product.quantity;
    priceInput.value = product.price;
    updatedAtContainer.hidden = false;
    updatedAt.textContent = new Date(product.updated_at).toLocaleString();

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
    const confirmed = confirm("Restore the original demo inventory?");

    if (!confirmed) {
        return;
    }

    saveInventory(initialProducts);
    resetForm();
    displayInventory();
});

// Start application
initializeInventory();
