// Product data
const products = [
    {"name": "베이직", "price_male": 80, "price_female": 70},
    {"name": "플랫", "price_male": 90, "price_female": 90},
    {"name": "클래식", "price_male": 90, "price_female": 80},
    {"name": "젬스톤", "price_male": 90, "price_female": 100},
    {"name": "엥게이지", "price_male": 100, "price_female": 110},
    {"name": "파시넷", "price_male": 100, "price_female": 110},
    {"name": "쥬빌레", "price_male": 100, "price_female": 110},
    {"name": "루미에", "price_male": 100, "price_female": 110},
    {"name": "프로미스", "price_male": 100, "price_female": 110},
    {"name": "스텔라", "price_male": 110, "price_female": 120},
    {"name": "써밋", "price_male": 110, "price_female": 120},
    {"name": "키스톤", "price_male": 110, "price_female": 120},
    {"name": "포커스", "price_male": 110, "price_female": 120},
    {"name": "오르빗", "price_male": 110, "price_female": 120},
    {"name": "젬브릿지", "price_male": 120, "price_female": 130},
    {"name": "웨이브", "price_male": 120, "price_female": 130},
    {"name": "러브넛", "price_male": 120, "price_female": 130},
    {"name": "로미오와줄리엣", "price_male": 120, "price_female": 130},
    {"name": "새턴", "price_male": 120, "price_female": 130}
];

const platingPrice = 20;
const vatRate = 0.1;

// In-memory data storage (instead of localStorage for compatibility)
let salesData = [];
let todayStats = {
    general: 0,
    experience: 0,
    other: 0,
    cash: 0,
    transfer: 0,
    card: 0
};

// DOM elements
const productSelect = document.getElementById('productSelect');
const priceDisplay = document.getElementById('priceDisplay');
const malePrice = document.getElementById('malePrice');
const femalePrice = document.getElementById('femalePrice');
const platingCount = document.getElementById('platingCount');
const platingMinus = document.getElementById('platingMinus');
const platingPlus = document.getElementById('platingPlus');
const calculateBtn = document.getElementById('calculateBtn');
const priceCalculation = document.getElementById('priceCalculation');
const supplyPrice = document.getElementById('supplyPrice');
const vatPrice = document.getElementById('vatPrice');
const totalPrice = document.getElementById('totalPrice');
const salesForm = document.getElementById('salesForm');

// Payment checkboxes and inputs
const cashCheckbox = document.getElementById('cash');
const transferCheckbox = document.getElementById('transfer');
const cardCheckbox = document.getElementById('card');
const cashAmount = document.getElementById('cashAmount');
const transferAmount = document.getElementById('transferAmount');
const cardAmount = document.getElementById('cardAmount');

// Stats elements
const generalCount = document.getElementById('generalCount');
const experienceCount = document.getElementById('experienceCount');
const cardCount = document.getElementById('cardCount');
const transferCount = document.getElementById('transferCount');
const cashCountElement = document.getElementById('cashCount');

// Initialize application
function init() {
    populateProductSelect();
    setupEventListeners();
    updateStats();
}

// Populate product dropdown
function populateProductSelect() {
    // Clear existing options except the first one
    productSelect.innerHTML = '<option value="">제품을 선택하세요</option>';
    
    products.forEach((product, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = product.name;
        productSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Product selection
    productSelect.addEventListener('change', handleProductSelection);
    
    // Plating controls
    platingMinus.addEventListener('click', decreasePlating);
    platingPlus.addEventListener('click', increasePlating);
    
    // Calculate button
    calculateBtn.addEventListener('click', calculatePrice);
    
    // Payment method checkboxes
    cashCheckbox.addEventListener('change', () => togglePaymentInput(cashCheckbox, cashAmount));
    transferCheckbox.addEventListener('change', () => togglePaymentInput(transferCheckbox, transferAmount));
    cardCheckbox.addEventListener('change', () => togglePaymentInput(cardCheckbox, cardAmount));
    
    // Form submission
    salesForm.addEventListener('submit', handleFormSubmit);
}

// Handle product selection
function handleProductSelection() {
    const selectedIndex = productSelect.value;
    
    if (selectedIndex === '') {
        priceDisplay.classList.add('hidden');
        return;
    }
    
    const product = products[selectedIndex];
    malePrice.textContent = `${product.price_male}천원`;
    femalePrice.textContent = `${product.price_female}천원`;
    priceDisplay.classList.remove('hidden');
    
    // Reset calculation when product changes
    priceCalculation.classList.add('hidden');
}

// Plating controls
function decreasePlating() {
    const current = parseInt(platingCount.textContent);
    if (current > 0) {
        platingCount.textContent = current - 1;
        // Reset calculation when plating changes
        priceCalculation.classList.add('hidden');
    }
}

function increasePlating() {
    const current = parseInt(platingCount.textContent);
    platingCount.textContent = current + 1;
    // Reset calculation when plating changes
    priceCalculation.classList.add('hidden');
}

// Calculate reference price
function calculatePrice() {
    const selectedIndex = productSelect.value;
    
    if (selectedIndex === '') {
        alert('제품을 먼저 선택해주세요.');
        return;
    }
    
    const product = products[selectedIndex];
    const platingCnt = parseInt(platingCount.textContent);
    
    // Calculate supply price (male + female + plating)
    const basePrice = product.price_male + product.price_female;
    const platingCost = platingCnt * platingPrice;
    const supply = basePrice + platingCost;
    
    // Calculate VAT
    const vat = Math.round(supply * vatRate);
    
    // Calculate total
    const total = supply + vat;
    
    // Display calculation
    supplyPrice.textContent = `${supply}천원`;
    vatPrice.textContent = `${vat}천원`;
    totalPrice.textContent = `${total}천원`;
    
    priceCalculation.classList.remove('hidden');
}

// Toggle payment input
function togglePaymentInput(checkbox, input) {
    input.disabled = !checkbox.checked;
    if (!checkbox.checked) {
        input.value = '';
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate required fields
    if (!productSelect.value) {
        alert('제품을 선택해주세요.');
        return;
    }
    
    // Check if at least one payment method is selected
    const hasPayment = cashCheckbox.checked || transferCheckbox.checked || cardCheckbox.checked;
    if (!hasPayment) {
        alert('결제수단을 선택해주세요.');
        return;
    }
    
    // Check if customer type is selected
    const customerType = document.querySelector('input[name="customerType"]:checked');
    if (!customerType) {
        alert('손님 형태를 선택해주세요.');
        return;
    }
    
    // Validate payment amounts
    if (cashCheckbox.checked && !cashAmount.value) {
        alert('현금 결제 금액을 입력해주세요.');
        return;
    }
    if (transferCheckbox.checked && !transferAmount.value) {
        alert('계좌이체 금액을 입력해주세요.');
        return;
    }
    if (cardCheckbox.checked && !cardAmount.value) {
        alert('카드 결제 금액을 입력해주세요.');
        return;
    }
    
    // Create sales record
    const salesRecord = {
        product: products[productSelect.value].name,
        plating: parseInt(platingCount.textContent),
        payments: {
            cash: cashCheckbox.checked ? parseInt(cashAmount.value) : 0,
            transfer: transferCheckbox.checked ? parseInt(transferAmount.value) : 0,
            card: cardCheckbox.checked ? parseInt(cardAmount.value) : 0
        },
        customerType: customerType.value,
        notes: document.getElementById('notes').value,
        timestamp: new Date()
    };
    
    // Save record
    salesData.push(salesRecord);
    
    // Update statistics
    updateStatsFromRecord(salesRecord);
    
    // Show success message
    alert('전송되었습니다');
    
    // Reset form
    resetForm();
}

// Update statistics from new record
function updateStatsFromRecord(record) {
    // Update customer counts
    if (record.customerType === 'general') {
        todayStats.general++;
    } else {
        todayStats.experience++; // experience and other combined
    }
    
    // Update payment method counts
    if (record.payments.cash > 0) {
        todayStats.cash++;
    }
    if (record.payments.transfer > 0) {
        todayStats.transfer++;
    }
    if (record.payments.card > 0) {
        todayStats.card++;
    }
    
    updateStats();
}

// Update statistics display
function updateStats() {
    generalCount.textContent = `${todayStats.general}명`;
    experienceCount.textContent = `${todayStats.experience}명`;
    cardCount.textContent = `${todayStats.card}건`;
    transferCount.textContent = `${todayStats.transfer}건`;
    cashCountElement.textContent = `${todayStats.cash}건`;
}

// Reset form
function resetForm() {
    // Reset select
    productSelect.value = '';
    priceDisplay.classList.add('hidden');
    
    // Reset plating
    platingCount.textContent = '0';
    
    // Reset calculation
    priceCalculation.classList.add('hidden');
    
    // Reset payment methods
    cashCheckbox.checked = false;
    transferCheckbox.checked = false;
    cardCheckbox.checked = false;
    cashAmount.disabled = true;
    transferAmount.disabled = true;
    cardAmount.disabled = true;
    cashAmount.value = '';
    transferAmount.value = '';
    cardAmount.value = '';
    
    // Reset customer type
    const customerRadios = document.querySelectorAll('input[name="customerType"]');
    customerRadios.forEach(radio => radio.checked = false);
    
    // Reset notes
    document.getElementById('notes').value = '';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);