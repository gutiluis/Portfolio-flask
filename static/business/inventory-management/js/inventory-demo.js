// file: inventory-demo.js
// descr: non persistent inventory demo
const STORAGE_KEY = "inventoryDemo";
const SUPPLIER_STORAGE_KEY = "supplierDemo";

const initialSuppliers = [
    {
        id: 1,
        supplier_name: "Tech Supplies Co.",
        contact_person: "Hanna Smith",
        email: "hanna@techsupplies.com",
        phone: "640-333-4323",
        address: "123 Anzio Drive",
        payment_terms: "Net 30",
        status: "Active",
    },
    {
        id: 2,
        supplier_name: "Digital Comp. Ltd.",
        contact_person: "Jeff Earling",
        email: "jeff@digital.com",
        phone: "332-945-0021",
        address: "9542 Main Street",
        payment_terms: "Net 15",
        status: "Active",
    },
];

const initialProducts = [
    {
        id: 1,
        product_name: "Wireless Keyboard",
        supplier_id: 1,
        quantity: 15,
        unit_cost: 29.99,
        selling_price: 40,
        updated_at: "2026-11-01T10:00:00",
    },
    {
        id: 2,
        product_name: "USB-C Cable",
        supplier_id: 2,
        quantity: 30,
        unit_cost: 10,
        selling_price: 20,
        updated_at: "2026-11-02T11:30:00",
    },
    {
        id: 3,
        product_name: "Wireless Mouse",
        supplier_id: 1,
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
const inventoryKPIs = document.getElementById("inventory-kpis");
const supplierSearchInput = document.getElementById("supplier-search");
const supplierKPIs = document.getElementById("supplier-kpis");
const supplierIdInput = document.getElementById("supplier-id");
const supplierForm = document.getElementById("supplier-form");
const supplierNameInput = document.getElementById("supplier-name");
const contactPersonInput = document.getElementById("contact-person");
const supplierEmailInput = document.getElementById("supplier-email");
const supplierPhoneInput = document.getElementById("supplier-phone");
const supplierAddressInput = document.getElementById("supplier-address");
const paymentTermsInput = document.getElementById("payment-terms");
const supplierStatusInput = document.getElementById("supplier-status");
const addSupplierButton = document.getElementById("add-supplier-button");
const cancelSupplierButton = document.getElementById("cancel-supplier-button");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");
const resetButton = document.querySelector("#reset-button");
const resetSuppliersButton = document.querySelector("#reset-suppliers");
const supplierTableBody = document.getElementById("supplier-table-body");
const inventoryTableBody = document.querySelector("#inventory-table-body");
const inventoryCount = document.querySelector("#inventory-count");
const supplierCount = document.querySelector("#supplier-count");
const productSupplierSelect = document.getElementById("product-supplier");
const emptyMessage = document.querySelector("#empty-message");
const supplierEmptyMessage = document.querySelector("#supplier-empty-message");
// current year display
document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
});

// supplier product relationship
function displaySupplierOptions() {
    const suppliers = getSuppliers();

    productSupplierSelect.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Supplier";

    productSupplierSelect.append(defaultOption);

    suppliers.forEach((supplier) => {
        const option = document.createElement("option");

        option.value = supplier.id;
        option.textContent = supplier.supplier_name;

        productSupplierSelect.append(option);
    });
}
function getSuppliers() {
    return JSON.parse(localStorage.getItem(SUPPLIER_STORAGE_KEY)) || [];
}

function saveSuppliers(suppliers) {
    localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(suppliers));
}

function searchSuppliers(searchTerm) {
    const suppliers = getSuppliers();
    const filteredSuppliers = suppliers.filter((supplier) =>
        Object.values(supplier).some((value) =>
            String(value)
                .toLowerCase()
                .includes(searchTerm.toLowerCase().trim()),
        ),
    );
    displaySuppliers(filteredSuppliers);
}
supplierSearchInput.addEventListener("input", (event) => {
    searchSuppliers(event.target.value);
});
supplierForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const suppliers = getSuppliers();
    const supplierId = Number(supplierIdInput.value);

    const newSupplier = {
        id: supplierId || getNextSupplierId(suppliers),
        supplier_name: supplierNameInput.value.trim(),
        contact_person: contactPersonInput.value.trim(),
        email: supplierEmailInput.value.trim(),
        phone: supplierPhoneInput.value.trim(),
        address: supplierAddressInput.value.trim(),
        payment_terms: paymentTermsInput.value.trim(),
        status: supplierStatusInput.value,
    };
    if (supplierId) {
        const index = suppliers.findIndex((item) => item.id === supplierId);
        if (index === -1) {
            return;
        }
        suppliers[index] = newSupplier;
    } else {
        suppliers.push(newSupplier);
    }
    saveSuppliers(suppliers);
    displaySuppliers();
    resetForm();
});

// Edit Supplier
function editSupplier(id) {
    const suppliers = getSuppliers();
    const supplier = suppliers.find((item) => item.id === id);
    if (!supplier) {
        return;
    }
    supplierIdInput.value = supplier.id;
    supplierNameInput.value = supplier.supplier_name;
    contactPersonInput.value = supplier.contact_person;
    supplierEmailInput.value = supplier.email;
    supplierPhoneInput.value = supplier.phone;
    supplierAddressInput.value = supplier.address;
    paymentTermsInput.value = supplier.payment_terms;
    supplierStatusInput.value = supplier.status;

    submitButton.textContent = "Edit Supplier";
    cancelButton.hidden = false;

    supplierNameInput.focus();
}
function calculateSupplierKPIs(suppliers) {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(
        (supplier) => supplier.status === "Active",
    ).length;

    return {
        totalSuppliers,
        activeSuppliers,
    };
}
function displaySupplierKPIs(suppliers) {
    const kpis = calculateSupplierKPIs(suppliers);
    const metrics = [
        {
            label: "Total Suppliers",
            value: kpis.totalSuppliers,
        },
        {
            label: "Active Suppliers",
            value: kpis.activeSuppliers,
        },
    ];
    supplierKPIs.replaceChildren();
    metrics.forEach((metric) => {
        const card = document.createElement("article");
        const heading = document.createElement("h3");
        const value = document.createElement("p");

        card.className = "border border-green-400 bg-black p-4";

        heading.className = "mb-2 text-sm text-green-200";
        heading.textContent = metric.label;

        value.className = "text-2xl font-bold text-green-400";
        value.textContent = metric.value;
        card.append(heading, value);
        supplierKPIs.append(card);
    });
}

function displaySuppliers(suppliers = getSuppliers()) {
    displaySupplierKPIs(suppliers);
    supplierTableBody.replaceChildren();
    const fragment = document.createDocumentFragment();

    supplierCount.textContent = `${suppliers.length} ${suppliers.length === 1 ? "supplier" : "suppliers"}`;

    supplierEmptyMessage.hidden = suppliers.length !== 0;

    suppliers.forEach((supplier) => {
        const row = document.createElement("tr");
        const values = [
            supplier.id,
            supplier.supplier_name,
            supplier.contact_person,
            supplier.email,
            supplier.phone,
            supplier.status,
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
            editSupplier(supplier.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteSupplier(supplier.id);
        });

        actionsCell.append(editButton, deleteButton);
        row.appendChild(actionsCell);

        fragment.appendChild(row);
    });

    supplierTableBody.appendChild(fragment);
}

// Initialize localStorage
function initializeInventory() {
    const storedProducts = localStorage.getItem(STORAGE_KEY);

    const storedSuppliers = localStorage.getItem(SUPPLIER_STORAGE_KEY);

    if (storedProducts === null) {
        saveInventory(initialProducts);
    }

    if (storedSuppliers === null) {
        saveSuppliers(initialSuppliers);
    }
    displaySupplierOptions();
    displayInventory();
    displaySuppliers();
}

function calculateInventoryKPIs(products) {
    const totalProducts = products.length;
    const totalStock = products.reduce(
        (total, product) => total + product.quantity,
        0,
    );

    const totalInventoryValue = products.reduce(
        (total, product) => total + product.quantity * product.unit_cost,
        0,
    );

    const averageUnitCost = totalProducts
        ? products.reduce((total, product) => total + product.unit_cost, 0) /
          totalProducts
        : 0;
    return {
        totalProducts,
        totalStock,
        totalInventoryValue,
        averageUnitCost,
    };
}

// kpi rendering function with cards in tailwindcss
function displayInventoryKPIs(products) {
    const kpis = calculateInventoryKPIs(products);
    const metrics = [
        {
            label: "Total Products",
            value: kpis.totalProducts,
        },
        {
            label: "Total Stock",
            value: kpis.totalStock,
        },
        {
            label: "Inventory Value",
            value: `$${kpis.totalInventoryValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`,
        },
        {
            label: "Average Unit Cost",
            value: `$${kpis.averageUnitCost.toFixed(2)}`,
        },
    ];
    inventoryKPIs.replaceChildren();
    metrics.forEach((metric) => {
        const card = document.createElement("article");
        const heading = document.createElement("h3");
        const value = document.createElement("p");

        card.className = "border border-green-400 bg-black p-4";

        heading.className = "mb-2 text-sm text-green-200";
        heading.textContent = metric.label;

        value.className = "text-2xl font-bold text-green-400";
        value.textContent = metric.value;

        card.append(heading, value);
        inventoryKPIs.append(card);
    });
}

let unitCostChart;
let inventoryValueChart;
function displayInventoryCharts(products) {
    const labels = products.map((product) => product.product_name);
    const unitCosts = products.map((product) => product.unit_cost);
    const inventoryValues = products.map(
        (product) => product.quantity * product.unit_cost,
    );
    const chartOptions = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: "#4ade80",
                },
            },
            y: {
                ticks: {
                    color: "#4ade80",
                },
            },
        },
    };
    if (unitCostChart) {
        unitCostChart.destroy();
    }
    unitCostChart = new Chart(document.getElementById("unit-cost-chart"), {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Unit Cost ($)",
                    data: unitCosts,
                    backgroundColor: "rgba(34, 197, 94, 0.75)",
                    borderColor: "#22c55e",
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 14,
                },
            ],
        },
        options: chartOptions,
    });
    if (inventoryValueChart) {
        inventoryValueChart.destroy();
    }
    inventoryValueChart = new Chart(
        document.getElementById("inventory-value-chart"),
        {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Inventory Value ($)",
                        data: inventoryValues,
                        backgroundColor: "rgba(34, 197, 94, 0.75)",
                        borderColor: "#22c55e",
                        borderWidth: 1,
                        borderRadius: 6,
                        borderSkipped: false,
                        barThickness: 14,
                    },
                ],
            },
            options: chartOptions,
        },
    );
}
function getSupplierName(supplierId) {
    const suppliers = getSuppliers();
    const supplier = suppliers.find((supplier) => supplier.id === supplierId);
    return supplier ? supplier.supplier_name : "Unknown supplier";
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
    displayInventoryKPIs(products);
    displayInventoryCharts(products);
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
            getSupplierName(product.supplier_id),
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

function getNextSupplierId(suppliers) {
    return suppliers.length
        ? Math.max(...suppliers.map((supplier) => Number(supplier.id))) + 1
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
        supplier_id: Number(productSupplierSelect.value),
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
    supplierIdInput.value = product.supplier_id;
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

function deleteSupplier(supplierId) {
    const products = getInventory();
    const hasProducts = products.some(
        (product) => product.supplierId === Number(supplierId),
    );
    if (hasProducts) {
        alert(
            "Cannot delete this Supplier because products are assigned to it.",
        );
        return;
    }
    const confirmed = confirm("Are you sure you want to delete the supplier?");
    if (!confirmed) {
        return;
    }

    const suppliers = getSuppliers().filter(
        (supplier) => supplier.id !== Number(supplierId),
    );

    saveSuppliers(suppliers);
    resetSupplierForm();
    displaySupplierOptions();
    displaySuppliers();
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

function resetSupplierForm() {
    supplierForm.reset();
    supplierIdInput.value = "";

    submitButton.textContent = "Add Supplier";
    cancelButton.hidden = true;
}

resetSuppliersButton.addEventListener("click", () => {
    saveSuppliers([]);
    resetSupplierForm();
    displaySuppliers();
});

// Start application
initializeInventory();
