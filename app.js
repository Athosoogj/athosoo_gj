// Product data
const products = [
    {"name": "베이직", "price_male": 80, "price_female": 70},
    {"name": "플랫", "price_male": 90, "price_female": 90},
    {"name": "클래식", "price_male": 90, "price_female": 80},
    {"name": "젬스톤", "price_male": 90, "price_female": 100},
    {"name": "엥게이지", "price_male": 110, "price_female": 110},
    {"name": "파시넷", "price_male": 110, "price_female": 100},
    {"name": "쥬빌레", "price_male": 100, "price_female": 110},
    {"name": "루미에", "price_male": 120, "price_female": 120},
    {"name": "프로미스", "price_male": 100, "price_female": 90},
    {"name": "스텔라", "price_male": 110, "price_female": 120},
    {"name": "써밋", "price_male": 120, "price_female": 110},
    {"name": "키스톤", "price_male": 90, "price_female": 100},
    {"name": "포커스", "price_male": 100, "price_female": 100},
    {"name": "오르빗", "price_male": 130, "price_female": 130},
    {"name": "젬브릿지", "price_male": 110, "price_female": 110},
    {"name": "웨이브", "price_male": 120, "price_female": 120},
    {"name": "러브넛", "price_male": 140, "price_female": 130},
    {"name": "로미오와줄리엣", "price_male": 150, "price_female": 140},
    {"name": "새턴", "price_male": 120, "price_female": 110}
];

const stockSizes = [4, 7, 10, 13, 16, 20];

// Statistics data
let stats = {
    regularCustomers: 0,
    experienceCustomers: 0,
    cardPayments: 0,
    transferPayments: 0,
    cashPayments: 0
};

// Sample dashboard data
let dashboardData = {
    dailySales: [120, 190, 300, 500, 200, 300, 450],
    monthlySales: [2500, 3200, 2800, 4100, 3800, 4500],
    customerCounts: [15, 25, 20, 35, 22, 30, 28],
    productSales: {},
    inventory: {}
};

// Initialize product sales and inventory
products.forEach(product => {
    dashboardData.productSales[product.name] = Math.floor(Math.random() * 50) + 10;
    dashboardData.inventory[product.name] = {
        M: {},
        F: {}
    };
    
    stockSizes.forEach(size => {
        dashboardData.inventory[product.name].M[size] = Math.floor(Math.random() * 20) + 5;
        dashboardData.inventory[product.name].F[size] = Math.floor(Math.random() * 20) + 5;
    });
});

// DOM elements
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const groupSizeSelect = document.getElementById('groupSize');
const peopleCountSelect = document.getElementById('peopleCount');
const productSelection = document.getElementById('productSelection');
const tableSection = document.getElementById('tableSection');
const tableBody = document.getElementById('tableBody');
const priceSection = document.getElementById('priceSection');
const priceBreakdown = document.getElementById('priceBreakdown');
const paymentMethodCheckboxes = document.querySelectorAll('input[name="paymentMethod"]');
const paymentAmountInput = document.getElementById('paymentAmount');
const reservationForm = document.getElementById('reservationForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');

// Chart variables
let dailySalesChart, monthlySalesChart, customerChart, productRankingChart;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    populateProductDropdowns();
    setupEventListeners();
    updateStatistics();
    initializeCharts();
    generateInventoryTable();
});

// Navigation
function initializeNavigation() {
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            switchTab(targetTab);
        });
    });
}

function switchTab(targetTab) {
    navTabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');
    document.getElementById(`${targetTab}-tab`).classList.add('active');
    
    if (targetTab === 'dashboard') {
        updateCharts();
    }
}

// Populate dropdowns
function populateProductDropdowns() {
    // Product selection dropdown
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        productSelection.appendChild(option);
    });
}

// Event listeners
function setupEventListeners() {
    groupSizeSelect.addEventListener('change', handleGroupSizeChange);
    peopleCountSelect.addEventListener('change', handlePeopleCountChange);
    
    paymentMethodCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handlePaymentMethodChange);
    });
    
    reservationForm.addEventListener('submit', handleFormSubmit);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal on background click
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
    });
}

// Group size and people count sync
function handleGroupSizeChange() {
    const groupSize = parseInt(groupSizeSelect.value);
    
    // Sync people count
    peopleCountSelect.value = groupSize || '';
    
    if (groupSize) {
        generateTable(groupSize);
        tableSection.style.display = 'block';
        priceSection.style.display = 'block';
    } else {
        tableSection.style.display = 'none';
        priceSection.style.display = 'none';
    }
}

function handlePeopleCountChange() {
    const peopleCount = parseInt(peopleCountSelect.value);
    
    // Sync group size
    groupSizeSelect.value = peopleCount || '';
    
    if (peopleCount) {
        generateTable(peopleCount);
        tableSection.style.display = 'block';
        priceSection.style.display = 'block';
    } else {
        tableSection.style.display = 'none';
        priceSection.style.display = 'none';
    }
}

// Generate dynamic table
function generateTable(rowCount) {
    tableBody.innerHTML = '';
    
    for (let i = 0; i < rowCount; i++) {
        const row = document.createElement('tr');
        
        // Product name column
        const productCell = document.createElement('td');
        const productSelect = document.createElement('select');
        productSelect.classList.add('product-select');
        productSelect.dataset.row = i;
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '제품 선택';
        productSelect.appendChild(defaultOption);
        
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            productSelect.appendChild(option);
        });
        
        productSelect.addEventListener('change', calculatePrice);
        productCell.appendChild(productSelect);
        
        // Gender column
        const genderCell = document.createElement('td');
        const genderSelect = document.createElement('select');
        genderSelect.classList.add('gender-select');
        genderSelect.dataset.row = i;
        
        const genderDefaultOption = document.createElement('option');
        genderDefaultOption.value = '';
        genderDefaultOption.textContent = '선택';
        genderSelect.appendChild(genderDefaultOption);
        
        const maleOption = document.createElement('option');
        maleOption.value = 'M';
        maleOption.textContent = 'M';
        genderSelect.appendChild(maleOption);
        
        const femaleOption = document.createElement('option');
        femaleOption.value = 'F';
        femaleOption.textContent = 'F';
        genderSelect.appendChild(femaleOption);
        
        genderSelect.addEventListener('change', calculatePrice);
        genderCell.appendChild(genderSelect);
        
        // Size column
        const sizeCell = document.createElement('td');
        const sizeInput = document.createElement('input');
        sizeInput.type = 'text';
        sizeInput.classList.add('size-input');
        sizeInput.dataset.row = i;
        sizeInput.placeholder = '사이즈';
        sizeCell.appendChild(sizeInput);
        
        // Stock size column
        const stockSizeCell = document.createElement('td');
        const stockSizeSelect = document.createElement('select');
        stockSizeSelect.classList.add('stock-size-select');
        stockSizeSelect.dataset.row = i;
        
        const stockDefaultOption = document.createElement('option');
        stockDefaultOption.value = '';
        stockDefaultOption.textContent = '선택';
        stockSizeSelect.appendChild(stockDefaultOption);
        
        stockSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            stockSizeSelect.appendChild(option);
        });
        
        stockSizeSelect.addEventListener('change', updateInventory);
        stockSizeCell.appendChild(stockSizeSelect);
        
        row.appendChild(productCell);
        row.appendChild(genderCell);
        row.appendChild(sizeCell);
        row.appendChild(stockSizeCell);
        
        tableBody.appendChild(row);
    }
    
    calculatePrice();
}

// Price calculation
function calculatePrice() {
    const productSelects = document.querySelectorAll('.product-select');
    const genderSelects = document.querySelectorAll('.gender-select');
    
    let totalPrice = 0;
    let priceDetails = [];
    
    productSelects.forEach((productSelect, index) => {
        const product = products.find(p => p.name === productSelect.value);
        const gender = genderSelects[index].value;
        
        if (product && gender) {
            const price = gender === 'M' ? product.price_male : product.price_female;
            totalPrice += price;
            priceDetails.push({
                product: product.name,
                gender: gender,
                price: price
            });
        }
    });
    
    displayPriceBreakdown(priceDetails, totalPrice);
}

function displayPriceBreakdown(details, total) {
    if (details.length === 0) {
        priceBreakdown.innerHTML = '<div class="price-item">제품과 성별을 선택해주세요.</div>';
        return;
    }
    
    let html = '';
    
    details.forEach((detail, index) => {
        html += `<div class="price-item">
            <span>${index + 1}. ${detail.product} (${detail.gender})</span>
            <span>${detail.price}천원</span>
        </div>`;
    });
    
    const supplyPrice = Math.round(total / 1.1);
    const vat = total - supplyPrice;
    
    html += `<div class="price-total">
        <div class="price-item">
            <span>공급가</span>
            <span>${supplyPrice}천원</span>
        </div>
        <div class="price-item">
            <span>부가세</span>
            <span>${vat}천원</span>
        </div>
        <div class="price-item">
            <strong>합계</strong>
            <strong>${total}천원</strong>
        </div>
    </div>`;
    
    priceBreakdown.innerHTML = html;
}

// Payment method handling
function handlePaymentMethodChange() {
    const checkedMethods = document.querySelectorAll('input[name="paymentMethod"]:checked');
    paymentAmountInput.disabled = checkedMethods.length === 0;
    
    if (checkedMethods.length === 0) {
        paymentAmountInput.value = '';
    }
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(reservationForm);
    const customerType = formData.get('customerType');
    const paymentMethods = Array.from(document.querySelectorAll('input[name="paymentMethod"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Update statistics
    if (customerType === '일반') {
        stats.regularCustomers++;
    } else {
        stats.experienceCustomers++;
    }
    
    paymentMethods.forEach(method => {
        if (method === '카드') stats.cardPayments++;
        else if (method === '계좌이체') stats.transferPayments++;
        else if (method === '현금') stats.cashPayments++;
    });
    
    // Update inventory based on table data
    updateInventoryFromReservation();
    
    // Update dashboard data
    updateDashboardData();
    
    updateStatistics();
    showSuccessModal();
}

function updateInventoryFromReservation() {
    const productSelects = document.querySelectorAll('.product-select');
    const genderSelects = document.querySelectorAll('.gender-select');
    const stockSizeSelects = document.querySelectorAll('.stock-size-select');
    
    productSelects.forEach((productSelect, index) => {
        const productName = productSelect.value;
        const gender = genderSelects[index].value;
        const stockSize = parseInt(stockSizeSelects[index].value);
        
        if (productName && gender && stockSize) {
            if (dashboardData.inventory[productName] && 
                dashboardData.inventory[productName][gender] && 
                dashboardData.inventory[productName][gender][stockSize] > 0) {
                dashboardData.inventory[productName][gender][stockSize]--;
            }
            
            // Update product sales
            dashboardData.productSales[productName] = (dashboardData.productSales[productName] || 0) + 1;
        }
    });
}

function updateInventory() {
    // This function can be used for real-time inventory updates
    generateInventoryTable();
}

function updateDashboardData() {
    // Add to daily sales (random amount for demo)
    const todayIndex = dashboardData.dailySales.length - 1;
    dashboardData.dailySales[todayIndex] += Math.floor(Math.random() * 100) + 50;
    
    // Add to customer count
    const todayCustomerIndex = dashboardData.customerCounts.length - 1;
    dashboardData.customerCounts[todayCustomerIndex]++;
}

function showSuccessModal() {
    successModal.style.display = 'block';
}

function closeModal() {
    successModal.style.display = 'none';
    resetForm();
}

function resetForm() {
    reservationForm.reset();
    tableSection.style.display = 'none';
    priceSection.style.display = 'none';
    paymentAmountInput.disabled = true;
}

// Statistics update
function updateStatistics() {
    document.getElementById('regularCustomers').textContent = stats.regularCustomers;
    document.getElementById('experienceCustomers').textContent = stats.experienceCustomers;
    document.getElementById('cardPayments').textContent = stats.cardPayments;
    document.getElementById('transferPayments').textContent = stats.transferPayments;
    document.getElementById('cashPayments').textContent = stats.cashPayments;
}

// Chart initialization
function initializeCharts() {
    const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
    
    // Daily Sales Chart
    const dailySalesCtx = document.getElementById('dailySalesChart').getContext('2d');
    dailySalesChart = new Chart(dailySalesCtx, {
        type: 'line',
        data: {
            labels: ['월', '화', '수', '목', '금', '토', '일'],
            datasets: [{
                label: '매출 (천원)',
                data: dashboardData.dailySales,
                borderColor: chartColors[0],
                backgroundColor: chartColors[0] + '20',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Monthly Sales Chart
    const monthlySalesCtx = document.getElementById('monthlySalesChart').getContext('2d');
    monthlySalesChart = new Chart(monthlySalesCtx, {
        type: 'bar',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            datasets: [{
                label: '매출 (천원)',
                data: dashboardData.monthlySales,
                backgroundColor: chartColors[1],
                borderColor: chartColors[1],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Customer Chart
    const customerCtx = document.getElementById('customerChart').getContext('2d');
    customerChart = new Chart(customerCtx, {
        type: 'bar',
        data: {
            labels: ['월', '화', '수', '목', '금', '토', '일'],
            datasets: [{
                label: '손님 수',
                data: dashboardData.customerCounts,
                backgroundColor: chartColors[2],
                borderColor: chartColors[2],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Product Ranking Chart
    const productCtx = document.getElementById('productRankingChart').getContext('2d');
    const topProducts = Object.entries(dashboardData.productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    productRankingChart = new Chart(productCtx, {
        type: 'doughnut',
        data: {
            labels: topProducts.map(([name,]) => name),
            datasets: [{
                data: topProducts.map(([, sales]) => sales),
                backgroundColor: chartColors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function updateCharts() {
    if (dailySalesChart) {
        dailySalesChart.data.datasets[0].data = dashboardData.dailySales;
        dailySalesChart.update();
    }
    
    if (monthlySalesChart) {
        monthlySalesChart.data.datasets[0].data = dashboardData.monthlySales;
        monthlySalesChart.update();
    }
    
    if (customerChart) {
        customerChart.data.datasets[0].data = dashboardData.customerCounts;
        customerChart.update();
    }
    
    if (productRankingChart) {
        const topProducts = Object.entries(dashboardData.productSales)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        productRankingChart.data.labels = topProducts.map(([name,]) => name);
        productRankingChart.data.datasets[0].data = topProducts.map(([, sales]) => sales);
        productRankingChart.update();
    }
}

// Inventory table generation
function generateInventoryTable() {
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    inventoryTableBody.innerHTML = '';
    
    products.forEach(product => {
        ['M', 'F'].forEach(gender => {
            const row = document.createElement('tr');
            
            // Product name
            const productCell = document.createElement('td');
            productCell.textContent = product.name;
            row.appendChild(productCell);
            
            // Gender
            const genderCell = document.createElement('td');
            genderCell.textContent = gender;
            row.appendChild(genderCell);
            
            // Stock sizes
            stockSizes.forEach(size => {
                const stockCell = document.createElement('td');
                const stockCount = dashboardData.inventory[product.name][gender][size];
                stockCell.textContent = stockCount;
                
                // Color coding based on stock level
                if (stockCount <= 5) {
                    stockCell.classList.add('inventory-low');
                } else if (stockCount <= 10) {
                    stockCell.classList.add('inventory-medium');
                } else {
                    stockCell.classList.add('inventory-high');
                }
                
                row.appendChild(stockCell);
            });
            
            inventoryTableBody.appendChild(row);
        });
    });
}