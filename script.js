
// ========================================
// PRINTFLOW - MAIN JAVASCRIPT
// ========================================


// STORE ALL ORDERS

let orders = [];

let nextOrderId = 1001;


// ========================================
// 1. SHOW STUDENT OR SHOPKEEPER DASHBOARD
// ========================================

function showDashboard(role) {

    document.getElementById("roleSection").hidden = true;

    document.getElementById("studentDashboard").hidden = true;

    document.getElementById("shopkeeperDashboard").hidden = true;

    if (role === "student") {

        document.getElementById("studentDashboard").hidden = false;

        showStudentPage("orderPage");

    } else {

        document.getElementById("shopkeeperDashboard").hidden = false;

        renderShopOrders();

    }

}


// ========================================
// 2. GO BACK TO FIRST PAGE
// ========================================

function goHome() {

    document.getElementById("roleSection").hidden = false;

    document.getElementById("studentDashboard").hidden = true;

    document.getElementById("shopkeeperDashboard").hidden = true;

}


// ========================================
// 3. SWITCH STUDENT TABS
// ========================================

function showStudentPage(pageId, clickedButton) {

    document.getElementById("orderPage").hidden = true;

    document.getElementById("trackingPage").hidden = true;

    document.getElementById(pageId).hidden = false;

    document.querySelectorAll(".tab-btn").forEach(function(button) {

        button.classList.remove("active");

    });

    if (clickedButton) {

        clickedButton.classList.add("active");

    } else {

        let buttons = document.querySelectorAll(".tab-btn");

        buttons[0].classList.toggle("active", pageId === "orderPage");

        buttons[1].classList.toggle("active", pageId === "trackingPage");

    }

    if (pageId === "trackingPage") {

        renderStudentOrders();

    }

}


// ========================================
// 4. CALCULATE PRINTING PRICE
// ========================================

function calculatePrice() {

    let pages = Number(document.getElementById("pages").value) || 1;

    let copies = Number(document.getElementById("copies").value) || 1;

    let colour = document.querySelector(
        'input[name="colour"]:checked'
    ).value;

    let pricePerPage = colour === "Colour" ? 5 : 2;

    let totalPrice = pages * copies * pricePerPage;

    document.getElementById("price").textContent = "₹" + totalPrice;

    return totalPrice;

}


// Update price when pages or copies change

document.getElementById("pages").addEventListener(
    "input",
    calculatePrice
);

document.getElementById("copies").addEventListener(
    "input",
    calculatePrice
);


// Update price when colour changes

document.querySelectorAll('input[name="colour"]').forEach(function(radio) {

    radio.addEventListener("change", calculatePrice);

});


// ========================================
// 5. PLACE A NEW ORDER
// ========================================

document.getElementById("orderForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        let studentName = document.getElementById("studentName").value.trim();

        let file = document.getElementById("file").files[0];

        let pages = Number(document.getElementById("pages").value);

        let copies = Number(document.getElementById("copies").value);

        let colour = document.querySelector(
            'input[name="colour"]:checked'
        ).value;

        let sides = document.querySelector(
            'input[name="sides"]:checked'
        ).value;

        let payment = document.getElementById("payment").value;

        if (!studentName || !file || pages < 1 || copies < 1) {

            alert("Please fill all the details correctly.");

            return;

        }

        let price = calculatePrice();


        // CREATE NEW ORDER

        let newOrder = {

            id: nextOrderId++,

            name: studentName,

            file: file.name,

            pages: pages,

            copies: copies,

            colour: colour,

            sides: sides,

            payment: payment,

            price: price,

            status: "Waiting"

        };


        // ADD ORDER TO ARRAY

        orders.push(newOrder);


        alert("Your order has been placed successfully!");


        // RESET FORM

        document.getElementById("orderForm").reset();


        // UPDATE PRICE

        calculatePrice();


        // OPEN TRACKING PAGE

        showStudentPage("trackingPage");

    }

);


// ========================================
// 6. DISPLAY STUDENT ORDERS
// ========================================

function renderStudentOrders() {

    let container = document.getElementById("studentOrders");

    if (orders.length === 0) {

        container.innerHTML =
            "<p class='empty-message'>You have not placed any orders yet.</p>";

        return;

    }

    container.innerHTML = "";

    orders.slice().reverse().forEach(function(order) {

        let card = document.createElement("div");

        card.className = "order-card";

        card.innerHTML = `

            <h3>Order #${order.id}</h3>

            <p><b>Student:</b> ${escapeHTML(order.name)}</p>

            <p><b>Document:</b> ${escapeHTML(order.file)}</p>

            <p><b>Pages:</b> ${order.pages}</p>

            <p><b>Copies:</b> ${order.copies}</p>

            <p><b>Colour:</b> ${escapeHTML(order.colour)}</p>

            <p><b>Layout:</b> ${escapeHTML(order.sides)}</p>

            <p><b>Total Price:</b> ₹${order.price}</p>

            <span class="status ${order.status.toLowerCase()}">

                ${order.status}

            </span>

        `;

        container.appendChild(card);

    });

}


// ========================================
// 7. DISPLAY SHOPKEEPER ORDERS
// ========================================

function renderShopOrders() {

    let container = document.getElementById("shopOrders");

    container.innerHTML = "";

    if (orders.length === 0) {

        container.innerHTML =
            "<p class='empty-message'>No orders received yet.</p>";

    }

    orders.forEach(function(order) {

        let card = document.createElement("div");

        card.className = "order-card";

        card.innerHTML = `

            <h3>Order #${order.id}</h3>

            <p><b>Student:</b> ${escapeHTML(order.name)}</p>

            <p><b>Document:</b> ${escapeHTML(order.file)}</p>

            <p><b>Pages:</b> ${order.pages}</p>

            <p><b>Copies:</b> ${order.copies}</p>

            <p><b>Colour:</b> ${escapeHTML(order.colour)}</p>

            <p><b>Layout:</b> ${escapeHTML(order.sides)}</p>

            <p><b>Payment:</b> ${escapeHTML(order.payment)}</p>

            <p><b>Price:</b> ₹${order.price}</p>

            <p><b>Status:</b> ${order.status}</p>

            <br>

            ${
                order.status === "Waiting"
                ?
                `<button class="primary-btn"
                onclick="updateOrderStatus(${order.id}, 'Processing')">
                Start Printing
                </button>`
                :
                ""
            }

            ${
                order.status === "Processing"
                ?
                `<button class="primary-btn"
                onclick="updateOrderStatus(${order.id}, 'Completed')">
                Mark Completed
                </button>`
                :
                ""
            }

            ${
                order.status === "Completed"
                ?
                "<span class='status completed'>Ready for pickup</span>"
                :
                ""
            }

            <br>

            <span class="status ${order.status.toLowerCase()}">

                ${order.status}

            </span>

        `;

        container.appendChild(card);

    });

    updateStatistics();

}


// ========================================
// 8. UPDATE ORDER STATUS
// ========================================

function updateOrderStatus(orderId, newStatus) {

    let order = orders.find(function(item) {

        return item.id === orderId;

    });

    if (order) {

        order.status = newStatus;

        renderShopOrders();

        renderStudentOrders();

        alert("Order status changed to " + newStatus);

    }

}


// ========================================
// 9. UPDATE SHOPKEEPER STATISTICS
// ========================================

function updateStatistics() {

    let total = orders.length;

    let waiting = orders.filter(function(order) {

        return order.status === "Waiting";

    }).length;

    let completed = orders.filter(function(order) {

        return order.status === "Completed";

    }).length;

    document.getElementById("totalCount").textContent = total;

    document.getElementById("waitingCount").textContent = waiting;

    document.getElementById("doneCount").textContent = completed;

}


// ========================================
// 10. SAFE TEXT DISPLAY
// ========================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(character) {

        return {

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#39;"

        }[character];

    });

}


// ========================================
// 11. INITIAL PRICE
// ========================================

calculatePrice();
