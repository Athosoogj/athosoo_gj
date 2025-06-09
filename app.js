// Application data
const appData = {
    products: [
        {"name": "베이직", "price_male": 80000, "price_female": 70000},
        {"name": "플랫", "price_male": 90000, "price_female": 90000},
        {"name": "클래식", "price_male": 90000, "price_female": 80000},
        {"name": "젬스톤", "price_male": 90000, "price_female": 100000},
        {"name": "엥게이지", "price_male": 120000, "price_female": 110000},
        {"name": "파시넷", "price_male": 120000, "price_female": 110000},
        {"name": "쥬빌레", "price_male": 120000, "price_female": 120000},
        {"name": "루미에", "price_male": 120000, "price_female": 120000},
        {"name": "프로미스", "price_male": 120000, "price_female": 120000},
        {"name": "스텔라", "price_male": 120000, "price_female": 120000},
        {"name": "써밋", "price_male": 120000, "price_female": 120000},
        {"name": "키스톤", "price_male": 130000, "price_female": 130000},
        {"name": "포커스", "price_male": 130000, "price_female": 130000},
        {"name": "오르빗", "price_male": 130000, "price_female": 130000},
        {"name": "젬브릿지", "price_male": 140000, "price_female": 130000},
        {"name": "웨이브", "price_male": 140000, "price_female": 130000},
        {"name": "러브넛", "price_male": 140000, "price_female": 130000},
        {"name": "로미오와줄리엣", "price_male": 150000, "price_female": 140000},
        {"name": "새턴", "price_male": 150000, "price_female": 140000}
    ],
    sizes: [4, 7, 10, 13, 16, 20],
    gildingPrice: 20000,
    adminPassword: "admin2025",
    salesData: [],
    dailyStats: {
        regular: 0,
        experience: 0,
        other: 0,
        cardPayments: 0,
        transferPayments: 0,
        cashPayments: 0
    }
};

// Global variables
let currentGildingCount = 0;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initialized');
    initializeApp();
    setupEventListeners();
    updateStats();
    updateIPAddress();
});

function initializeApp() {
    const productSelect = document.getElementById('productSelect');
    
    // Clear existing options first
    productSelect.innerHTML = '<option value="">선택하세요</option>';
    
    // Populate product dropdown
    appData.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        productSelect.appendChild(option);
    });

    // Reset gilding counter
    updateGildingCount(0);
    
    console.log('App initialized successfully');
}

function setupEventListeners() {
    const elements = {
        partySize: document.getElementById('partySize'),
        productSelect: document.getElementById('productSelect'),
        gildingMinus: document.getElementById('gildingMinus'),
        gildingPlus: document.getElementById('gildingPlus'),
        submitBtn: document.getElementById('submitBtn'),
        adminBtn: document.getElementById('adminBtn'),
        closeModal: document.getElementById('closeModal'),
        adminLogin: document.getElementById('adminLogin'),
        closeDashboard: document.getElementById('closeDashboard'),
        exportData: document.getElementById('exportData'),
        clearData: document.getElementById('clearData'),
        adminModal: document.getElementById('adminModal'),
        adminPassword: document.getElementById('adminPassword')
    };
    
    // Party size change
    if (elements.partySize) {
        elements.partySize.addEventListener('change', handlePartySizeChange);
    }
    
    // Product selection
    if (elements.productSelect) {
        elements.productSelect.addEventListener('change', handleProductChange);
    }
    
    // Gilding controls
    if (elements.gildingMinus) {
        elements.gildingMinus.addEventListener('click', () => adjustGilding(-1));
    }
    if (elements.gildingPlus) {
        elements.gildingPlus.addEventListener('click', () => adjustGilding(1));
    }
    
    // Payment method checkboxes
    const paymentCheckboxes = document.querySelectorAll('.payment-checkbox');
    paymentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Form submission
    if (elements.submitBtn) {
        elements.submitBtn.addEventListener('click', handleFormSubmit);
    }
    
    // Admin modal
    if (elements.adminBtn) {
        elements.adminBtn.addEventListener('click', showModal);
    }
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', hideModal);
    }
    if (elements.adminLogin) {
        elements.adminLogin.addEventListener('click', handleAdminLogin);
    }
    if (elements.closeDashboard) {
        elements.closeDashboard.addEventListener('click', hideDashboard);
    }
    
    // Dashboard actions
    if (elements.exportData) {
        elements.exportData.addEventListener('click', exportSalesData);
    }
    if (elements.clearData) {
        elements.clearData.addEventListener('click', clearAllData);
    }
    
    // Close modal on outside click
    if (elements.adminModal) {
        elements.adminModal.addEventListener('click', (e) => {
            if (e.target === elements.adminModal) hideModal();
        });
    }
    
    // Enter key for admin login
    if (elements.adminPassword) {
        elements.adminPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAdminLogin();
        });
    }
    
    console.log('Event listeners set up successfully');
}

function handlePartySizeChange() {
    const partySize = parseInt(document.getElementById('partySize').value);
    const partyTable = document.getElementById('partyTable');
    
    if (partySize > 0) {
        generatePartyTable(partySize);
        partyTable.classList.remove('hidden');
        calculateTotalPrice();
    } else {
        partyTable.classList.add('hidden');
        document.getElementById('priceCalculation').classList.add('hidden');
    }
}

function handleProductChange() {
    const productSelect = document.getElementById('productSelect');
    const productPrice = document.getElementById('productPrice');
    const selectedProduct = productSelect.value;
    
    if (selectedProduct) {
        const product = appData.products.find(p => p.name === selectedProduct);
        if (product) {
            productPrice.textContent = `남성: ${formatPrice(product.price_male)}, 여성: ${formatPrice(product.price_female)}`;
            updateTableProductSelections(selectedProduct);
        }
    } else {
        productPrice.textContent = '';
    }
    calculateTotalPrice();
}

function generatePartyTable(partySize) {
    const tbody = document.getElementById('partyInfoTable').querySelector('tbody');
    tbody.innerHTML = '';
    
    const selectedProduct = document.getElementById('productSelect').value;
    
    for (let i = 0; i < partySize; i++) {
        const row = document.createElement('tr');
        
        // Product name dropdown
        const productCell = document.createElement('td');
        const productSelect = document.createElement('select');
        productSelect.className = 'form-control';
        productSelect.name = `product_${i}`;
        
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '선택하세요';
        productSelect.appendChild(emptyOption);
        
        appData.products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            if (selectedProduct && product.name === selectedProduct) {
                option.selected = true;
            }
            productSelect.appendChild(option);
        });
        
        productSelect.addEventListener('change', calculateTotalPrice);
        productCell.appendChild(productSelect);
        
        // Gender dropdown
        const genderCell = document.createElement('td');
        const genderSelect = document.createElement('select');
        genderSelect.className = 'form-control';
        genderSelect.name = `gender_${i}`;
        genderSelect.innerHTML = `
            <option value="">선택</option>
            <option value="M">M</option>
            <option value="F">F</option>
        `;
        genderSelect.addEventListener('change', calculateTotalPrice);
        genderCell.appendChild(genderSelect);
        
        // Measured size input
        const measuredSizeCell = document.createElement('td');
        const measuredSizeInput = document.createElement('input');
        measuredSizeInput.type = 'text';
        measuredSizeInput.className = 'form-control';
        measuredSizeInput.name = `measured_size_${i}`;
        measuredSizeInput.placeholder = '실측 사이즈';
        measuredSizeCell.appendChild(measuredSizeInput);
        
        // Stock size dropdown
        const stockSizeCell = document.createElement('td');
        const stockSizeSelect = document.createElement('select');
        stockSizeSelect.className = 'form-control';
        stockSizeSelect.name = `stock_size_${i}`;
        stockSizeSelect.innerHTML = '<option value="">선택</option>';
        appData.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            stockSizeSelect.appendChild(option);
        });
        stockSizeCell.appendChild(stockSizeSelect);
        
        row.appendChild(productCell);
        row.appendChild(genderCell);
        row.appendChild(measuredSizeCell);
        row.appendChild(stockSizeCell);
        tbody.appendChild(row);
    }
}

function updateTableProductSelections(selectedProduct) {
    const productSelects = document.querySelectorAll('select[name^="product_"]');
    productSelects.forEach(select => {
        if (!select.value && selectedProduct) {
            select.value = selectedProduct;
        }
    });
}

function adjustGilding(delta) {
    const newCount = Math.max(0, currentGildingCount + delta);
    updateGildingCount(newCount);
    calculateTotalPrice();
}

function updateGildingCount(count) {
    currentGildingCount = count;
    const gildingCountElement = document.getElementById('gildingCount');
    if (gildingCountElement) {
        gildingCountElement.textContent = count;
    }
}

function handlePaymentMethodChange(e) {
    const checkbox = e.target;
    const paymentType = checkbox.id.replace('Payment', '');
    const amountDiv = document.getElementById(`${paymentType}Amount`);
    
    if (amountDiv) {
        if (checkbox.checked) {
            amountDiv.classList.remove('hidden');
        } else {
            amountDiv.classList.add('hidden');
            const input = amountDiv.querySelector('input');
            if (input) input.value = '';
        }
    }
}

function calculateTotalPrice() {
    const partyTable = document.getElementById('partyTable');
    const priceCalculation = document.getElementById('priceCalculation');
    
    if (!partyTable.classList.contains('hidden')) {
        let totalSupplyPrice = 0;
        let priceBreakdownHTML = '';
        
        const productSelects = document.querySelectorAll('select[name^="product_"]');
        const genderSelects = document.querySelectorAll('select[name^="gender_"]');
        
        productSelects.forEach((productSelect, index) => {
            const product = appData.products.find(p => p.name === productSelect.value);
            const genderSelect = genderSelects[index];
            const gender = genderSelect ? genderSelect.value : '';
            
            if (product && gender) {
                const price = gender === 'M' ? product.price_male : product.price_female;
                totalSupplyPrice += price;
                priceBreakdownHTML += `<div class="price-item">
                    <span>${product.name} (${gender})</span>
                    <span>${formatPrice(price)}</span>
                </div>`;
            }
        });
        
        // Add gilding cost
        const gildingCost = currentGildingCount * appData.gildingPrice;
        if (currentGildingCount > 0) {
            totalSupplyPrice += gildingCost;
            priceBreakdownHTML += `<div class="price-item">
                <span>도금 ${currentGildingCount}개</span>
                <span>${formatPrice(gildingCost)}</span>
            </div>`;
        }
        
        // Calculate VAT
        const vat = Math.round(totalSupplyPrice * 0.1);
        const totalWithVat = totalSupplyPrice + vat;
        
        const priceBreakdown = document.getElementById('priceBreakdown');
        const totalPrice = document.getElementById('totalPrice');
        
        if (priceBreakdown) {
            priceBreakdown.innerHTML = priceBreakdownHTML;
        }
        if (totalPrice) {
            totalPrice.innerHTML = `공급가 ${formatPrice(totalSupplyPrice)} + 부가세 ${formatPrice(vat)} = 합계 ${formatPrice(totalWithVat)}`;
        }
        
        priceCalculation.classList.remove('hidden');
    }
}

function handleFormSubmit() {
    if (!validateForm()) return;
    
    const formData = collectFormData();
    appData.salesData.push(formData);
    updateDailyStats(formData);
    updateStats();
    
    alert('전송되었습니다');
    resetForm();
}

function validateForm() {
    const customerName = document.getElementById('customerName');
    const partySize = document.getElementById('partySize');
    
    if (!customerName.value.trim()) {
        alert('예약자 이름을 입력해주세요');
        customerName.focus();
        return false;
    }
    
    if (!partySize.value) {
        alert('일행 수를 선택해주세요');
        partySize.focus();
        return false;
    }
    
    const partySizeNum = parseInt(partySize.value);
    for (let i = 0; i < partySizeNum; i++) {
        const productSelect = document.querySelector(`select[name="product_${i}"]`);
        const genderSelect = document.querySelector(`select[name="gender_${i}"]`);
        
        if (!productSelect || !productSelect.value || !genderSelect || !genderSelect.value) {
            alert(`${i + 1}번째 일행의 제품명과 성별을 모두 선택해주세요`);
            return false;
        }
    }
    
    const paymentMethods = document.querySelectorAll('.payment-checkbox:checked');
    if (paymentMethods.length === 0) {
        alert('결제 방법을 선택해주세요');
        return false;
    }
    
    let hasValidPayment = false;
    paymentMethods.forEach(checkbox => {
        const paymentType = checkbox.id.replace('Payment', '');
        const amountInput = document.querySelector(`#${paymentType}Amount input`);
        if (amountInput && amountInput.value && parseInt(amountInput.value) > 0) {
            hasValidPayment = true;
        }
    });
    
    if (!hasValidPayment) {
        alert('결제 금액을 입력해주세요');
        return false;
    }
    
    return true;
}

function collectFormData() {
    const customerName = document.getElementById('customerName');
    const partySize = document.getElementById('partySize');
    const partySizeNum = parseInt(partySize.value);
    const partyInfo = [];
    
    for (let i = 0; i < partySizeNum; i++) {
        const productSelect = document.querySelector(`select[name="product_${i}"]`);
        const genderSelect = document.querySelector(`select[name="gender_${i}"]`);
        const measuredSizeInput = document.querySelector(`input[name="measured_size_${i}"]`);
        const stockSizeSelect = document.querySelector(`select[name="stock_size_${i}"]`);
        
        partyInfo.push({
            product: productSelect ? productSelect.value : '',
            gender: genderSelect ? genderSelect.value : '',
            measuredSize: measuredSizeInput ? measuredSizeInput.value : '',
            stockSize: stockSizeSelect ? stockSizeSelect.value : ''
        });
    }
    
    const paymentInfo = {};
    document.querySelectorAll('.payment-checkbox:checked').forEach(checkbox => {
        const paymentType = checkbox.id.replace('Payment', '');
        const amountInput = document.querySelector(`#${paymentType}Amount input`);
        if (amountInput && amountInput.value) {
            paymentInfo[paymentType] = parseInt(amountInput.value) * 1000;
        }
    });
    
    const customerType = document.querySelector('input[name="customerType"]:checked');
    const notes = document.getElementById('notes');
    
    return {
        timestamp: new Date().toISOString(),
        customerName: customerName.value,
        partySize: partySizeNum,
        partyInfo: partyInfo,
        gildingCount: currentGildingCount,
        paymentInfo: paymentInfo,
        customerType: customerType ? customerType.value : 'regular',
        notes: notes ? notes.value : ''
    };
}

function updateDailyStats(formData) {
    appData.dailyStats[formData.customerType] += formData.partySize;
    
    Object.keys(formData.paymentInfo).forEach(method => {
        if (method === 'cash') appData.dailyStats.cashPayments++;
        else if (method === 'transfer') appData.dailyStats.transferPayments++;
        else if (method === 'card') appData.dailyStats.cardPayments++;
    });
}

function updateStats() {
    const elements = {
        regularCustomers: document.getElementById('regularCustomers'),
        experienceCustomers: document.getElementById('experienceCustomers'),
        otherCustomers: document.getElementById('otherCustomers'),
        cardPayments: document.getElementById('cardPayments'),
        transferPayments: document.getElementById('transferPayments'),
        cashPayments: document.getElementById('cashPayments')
    };
    
    if (elements.regularCustomers) elements.regularCustomers.textContent = `${appData.dailyStats.regular}명`;
    if (elements.experienceCustomers) elements.experienceCustomers.textContent = `${appData.dailyStats.experience}명`;
    if (elements.otherCustomers) elements.otherCustomers.textContent = `${appData.dailyStats.other}명`;
    if (elements.cardPayments) elements.cardPayments.textContent = `${appData.dailyStats.cardPayments}건`;
    if (elements.transferPayments) elements.transferPayments.textContent = `${appData.dailyStats.transferPayments}건`;
    if (elements.cashPayments) elements.cashPayments.textContent = `${appData.dailyStats.cashPayments}건`;
}

function resetForm() {
    const elements = {
        customerName: document.getElementById('customerName'),
        partySize: document.getElementById('partySize'),
        productSelect: document.getElementById('productSelect'),
        productPrice: document.getElementById('productPrice'),
        partyTable: document.getElementById('partyTable'),
        priceCalculation: document.getElementById('priceCalculation'),
        notes: document.getElementById('notes')
    };
    
    if (elements.customerName) elements.customerName.value = '';
    if (elements.partySize) elements.partySize.value = '';
    if (elements.productSelect) elements.productSelect.value = '';
    if (elements.productPrice) elements.productPrice.textContent = '';
    if (elements.partyTable) elements.partyTable.classList.add('hidden');
    if (elements.priceCalculation) elements.priceCalculation.classList.add('hidden');
    if (elements.notes) elements.notes.value = '';
    
    updateGildingCount(0);
    
    document.querySelectorAll('.payment-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.payment-input').forEach(div => {
        div.classList.add('hidden');
        const input = div.querySelector('input');
        if (input) input.value = '';
    });
    
    const regularRadio = document.querySelector('input[name="customerType"][value="regular"]');
    if (regularRadio) regularRadio.checked = true;
}

// Admin functions
function showModal() {
    const adminModal = document.getElementById('adminModal');
    const adminPassword = document.getElementById('adminPassword');
    if (adminModal) adminModal.classList.remove('hidden');
    if (adminPassword) adminPassword.focus();
}

function hideModal() {
    const adminModal = document.getElementById('adminModal');
    const adminPassword = document.getElementById('adminPassword');
    if (adminModal) adminModal.classList.add('hidden');
    if (adminPassword) adminPassword.value = '';
}

function handleAdminLogin() {
    const adminPassword = document.getElementById('adminPassword');
    const password = adminPassword ? adminPassword.value : '';
    
    if (password === appData.adminPassword) {
        hideModal();
        showDashboard();
    } else {
        alert('비밀번호가 올바르지 않습니다');
        if (adminPassword) adminPassword.value = '';
    }
}

function showDashboard() {
    updateDashboardStats();
    updateSalesRecords();
    const adminDashboard = document.getElementById('adminDashboard');
    if (adminDashboard) adminDashboard.classList.remove('hidden');
}

function hideDashboard() {
    const adminDashboard = document.getElementById('adminDashboard');
    if (adminDashboard) adminDashboard.classList.add('hidden');
}

function updateDashboardStats() {
    const totalSales = appData.salesData.reduce((sum, sale) => {
        return sum + Object.values(sale.paymentInfo).reduce((a, b) => a + b, 0);
    }, 0);
    
    const totalCustomers = appData.dailyStats.regular + appData.dailyStats.experience + appData.dailyStats.other;
    const dashboardStats = document.getElementById('dashboardStats');
    
    if (dashboardStats) {
        dashboardStats.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">총 매출</div>
                    <div class="stat-value">${formatPrice(totalSales)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">총 고객 수</div>
                    <div class="stat-value">${totalCustomers}명</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">총 거래 건수</div>
                    <div class="stat-value">${appData.salesData.length}건</div>
                </div>
            </div>
        `;
    }
}

function updateSalesRecords() {
    const salesRecords = document.getElementById('salesRecords');
    if (!salesRecords) return;
    
    if (appData.salesData.length === 0) {
        salesRecords.innerHTML = '<p>아직 매출 기록이 없습니다.</p>';
        return;
    }
    
    let tableHTML = `
        <table class="sales-table">
            <thead>
                <tr>
                    <th>시간</th>
                    <th>예약자</th>
                    <th>일행수</th>
                    <th>고객유형</th>
                    <th>결제금액</th>
                    <th>결제방법</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    appData.salesData.forEach(sale => {
        const totalAmount = Object.values(sale.paymentInfo).reduce((a, b) => a + b, 0);
        const paymentMethods = Object.keys(sale.paymentInfo).join(', ');
        const time = new Date(sale.timestamp).toLocaleTimeString('ko-KR');
        
        tableHTML += `
            <tr>
                <td>${time}</td>
                <td>${sale.customerName}</td>
                <td>${sale.partySize}명</td>
                <td>${getCustomerTypeLabel(sale.customerType)}</td>
                <td>${formatPrice(totalAmount)}</td>
                <td>${paymentMethods}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    salesRecords.innerHTML = tableHTML;
}

function exportSalesData() {
    const dataStr = JSON.stringify(appData.salesData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function clearAllData() {
    if (confirm('정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        appData.salesData = [];
        appData.dailyStats = {
            regular: 0,
            experience: 0,
            other: 0,
            cardPayments: 0,
            transferPayments: 0,
            cashPayments: 0
        };
        updateStats();
        updateDashboardStats();
        updateSalesRecords();
        alert('모든 데이터가 삭제되었습니다.');
    }
}

function updateIPAddress() {
    const ipAddress = document.getElementById('ipAddress');
    if (ipAddress) {
        ipAddress.textContent = '192.168.1.100';
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
}

function getCustomerTypeLabel(type) {
    const labels = {
        regular: '일반',
        experience: '체험',
        other: '기타'
    };
    return labels[type] || type;
}