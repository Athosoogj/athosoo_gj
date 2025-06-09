// 반지 제품 데이터
const ringProducts = [
    {"name": "베이직", "male_price": 80, "female_price": 70},
    {"name": "플랫", "male_price": 90, "female_price": 90},
    {"name": "클래식", "male_price": 90, "female_price": 80},
    {"name": "젬스톤", "male_price": 90, "female_price": 100},
    {"name": "엥게이지", "male_price": 110, "female_price": 120},
    {"name": "파시넷", "male_price": 100, "female_price": 110},
    {"name": "쥬빌레", "male_price": 95, "female_price": 105},
    {"name": "루미에", "male_price": 105, "female_price": 115},
    {"name": "프로미스", "male_price": 115, "female_price": 125},
    {"name": "스텔라", "male_price": 120, "female_price": 130},
    {"name": "써밋", "male_price": 125, "female_price": 135},
    {"name": "키스톤", "male_price": 110, "female_price": 120},
    {"name": "포커스", "male_price": 100, "female_price": 110},
    {"name": "오르빗", "male_price": 130, "female_price": 140},
    {"name": "젬브릿지", "male_price": 135, "female_price": 145},
    {"name": "웨이브", "male_price": 85, "female_price": 95},
    {"name": "러브넛", "male_price": 95, "female_price": 105},
    {"name": "로미오와줄리엣", "male_price": 140, "female_price": 150},
    {"name": "새턴", "male_price": 120, "female_price": 130}
];

const platingPrice = 20; // 천원 단위
const vatRate = 0.1;

// DOM 요소들
let elements = {};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initializeElements();
    initializeRingProducts();
    setupEventListeners();
    updateDailySummary();
});

function initializeElements() {
    elements = {
        ringProduct: document.getElementById('ringProduct'),
        selectedProductPrice: document.getElementById('selectedProductPrice'),
        platingCount: document.getElementById('platingCount'),
        platingMinus: document.getElementById('platingMinus'),
        platingPlus: document.getElementById('platingPlus'),
        calculatePrice: document.getElementById('calculatePrice'),
        priceResult: document.getElementById('priceResult'),
        
        // 결제수단
        cashPayment: document.getElementById('cashPayment'),
        transferPayment: document.getElementById('transferPayment'),
        cardPayment: document.getElementById('cardPayment'),
        cashAmount: document.getElementById('cashAmount'),
        transferAmount: document.getElementById('transferAmount'),
        cardAmount: document.getElementById('cardAmount'),
        
        // 기타
        notes: document.getElementById('notes'),
        submitSales: document.getElementById('submitSales'),
        
        // 모달
        successModal: document.getElementById('successModal'),
        closeModal: document.getElementById('closeModal'),
        errorAlert: document.getElementById('errorAlert'),
        
        // 요약 데이터
        totalOrders: document.getElementById('totalOrders'),
        totalSales: document.getElementById('totalSales'),
        cashTotal: document.getElementById('cashTotal'),
        transferTotal: document.getElementById('transferTotal'),
        cardTotal: document.getElementById('cardTotal'),
        popularProducts: document.getElementById('popularProducts'),
        generalRatio: document.getElementById('generalRatio'),
        experienceRatio: document.getElementById('experienceRatio'),
        otherRatio: document.getElementById('otherRatio')
    };
    console.log('Elements initialized:', Object.keys(elements).length);
}

function initializeRingProducts() {
    console.log('Initializing ring products...');
    if (!elements.ringProduct) {
        console.error('Ring product select element not found');
        return;
    }
    
    // 기존 옵션들 제거 (기본 옵션 제외)
    while (elements.ringProduct.children.length > 1) {
        elements.ringProduct.removeChild(elements.ringProduct.lastChild);
    }
    
    ringProducts.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = `${product.name} (남: ${product.male_price}천원, 여: ${product.female_price}천원)`;
        elements.ringProduct.appendChild(option);
    });
    console.log('Ring products added:', ringProducts.length);
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // 반지 제품 선택
    if (elements.ringProduct) {
        elements.ringProduct.addEventListener('change', handleProductChange);
    }
    
    // 도금 개수 조절
    if (elements.platingMinus) {
        elements.platingMinus.addEventListener('click', () => adjustPlating(-1));
    }
    if (elements.platingPlus) {
        elements.platingPlus.addEventListener('click', () => adjustPlating(1));
    }
    
    // 참고가격 계산
    if (elements.calculatePrice) {
        elements.calculatePrice.addEventListener('click', calculateReferencePrice);
    }
    
    // 결제수단 체크박스
    if (elements.cashPayment) {
        elements.cashPayment.addEventListener('change', () => togglePaymentInput('cash'));
    }
    if (elements.transferPayment) {
        elements.transferPayment.addEventListener('change', () => togglePaymentInput('transfer'));
    }
    if (elements.cardPayment) {
        elements.cardPayment.addEventListener('change', () => togglePaymentInput('card'));
    }
    
    // 매출 입력
    if (elements.submitSales) {
        elements.submitSales.addEventListener('click', handleSubmitSales);
    }
    
    // 모달 닫기
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeSuccessModal);
    }
    if (elements.successModal) {
        elements.successModal.addEventListener('click', function(e) {
            if (e.target === elements.successModal) {
                closeSuccessModal();
            }
        });
    }
    
    console.log('Event listeners set up');
}

function handleProductChange() {
    console.log('Product changed to:', elements.ringProduct.value);
    const selectedProduct = ringProducts.find(p => p.name === elements.ringProduct.value);
    
    if (selectedProduct) {
        elements.selectedProductPrice.innerHTML = `
            <strong>선택된 제품:</strong> ${selectedProduct.name}<br>
            남자 반지: ${selectedProduct.male_price}천원 | 여자 반지: ${selectedProduct.female_price}천원
        `;
        elements.selectedProductPrice.classList.add('show');
    } else {
        elements.selectedProductPrice.classList.remove('show');
    }
}

function adjustPlating(delta) {
    const currentCount = parseInt(elements.platingCount.textContent);
    const newCount = Math.max(0, currentCount + delta);
    elements.platingCount.textContent = newCount;
    console.log('Plating count adjusted to:', newCount);
}

function calculateReferencePrice() {
    console.log('Calculating reference price...');
    const selectedProduct = ringProducts.find(p => p.name === elements.ringProduct.value);
    
    if (!selectedProduct) {
        showError('반지 제품을 먼저 선택해주세요.');
        return;
    }
    
    const platingCount = parseInt(elements.platingCount.textContent);
    console.log('Selected product:', selectedProduct, 'Plating count:', platingCount);
    
    // 남자 반지 1개 + 여자 반지 1개 + 도금 비용 (천원 단위)
    const basePrice = selectedProduct.male_price + selectedProduct.female_price;
    const platingCost = platingCount * platingPrice;
    const subtotal = basePrice + platingCost;
    
    // VAT 계산
    const vatAmount = Math.round(subtotal * vatRate);
    const total = subtotal + vatAmount;
    
    console.log('Price calculation:', { basePrice, platingCost, subtotal, vatAmount, total });
    
    elements.priceResult.innerHTML = `
        <div class="price-breakdown">
            <div>기본 가격 (남+여): ${basePrice}천원</div>
            <div>도금 비용 (${platingCount}개): ${platingCost}천원</div>
            <div>공급가: ${subtotal}천원</div>
            <div>부가세: ${vatAmount}천원</div>
            <div style="border-top: 1px solid var(--color-border); padding-top: 8px; margin-top: 8px; font-weight: var(--font-weight-bold);">
                합계: ${total}천원
            </div>
        </div>
    `;
    elements.priceResult.classList.add('show');
}

function togglePaymentInput(type) {
    const checkbox = elements[type + 'Payment'];
    const input = elements[type + 'Amount'];
    
    console.log('Toggling payment input for:', type, 'Checked:', checkbox.checked);
    
    if (checkbox.checked) {
        input.disabled = false;
        input.focus();
    } else {
        input.disabled = true;
        input.value = '';
    }
}

function handleSubmitSales() {
    console.log('Submitting sales...');
    
    if (!validateForm()) {
        return;
    }
    
    const salesData = collectFormData();
    console.log('Sales data collected:', salesData);
    
    saveSalesData(salesData);
    showSuccessModal();
    resetForm();
    updateDailySummary();
}

function validateForm() {
    console.log('Validating form...');
    
    // 반지 제품 선택 확인
    if (!elements.ringProduct.value) {
        showError('반지 제품을 선택해주세요.');
        return false;
    }
    
    // 결제수단 하나 이상 선택 확인
    const hasPayment = elements.cashPayment.checked || 
                      elements.transferPayment.checked || 
                      elements.cardPayment.checked;
    
    if (!hasPayment) {
        showError('결제수단을 하나 이상 선택해주세요.');
        return false;
    }
    
    // 선택된 결제수단에 금액 입력 확인
    if (elements.cashPayment.checked && (!elements.cashAmount.value || elements.cashAmount.value <= 0)) {
        showError('현금 결제 금액을 입력해주세요.');
        return false;
    }
    
    if (elements.transferPayment.checked && (!elements.transferAmount.value || elements.transferAmount.value <= 0)) {
        showError('계좌이체 금액을 입력해주세요.');
        return false;
    }
    
    if (elements.cardPayment.checked && (!elements.cardAmount.value || elements.cardAmount.value <= 0)) {
        showError('카드 결제 금액을 입력해주세요.');
        return false;
    }
    
    console.log('Form validation passed');
    return true;
}

function collectFormData() {
    const customerType = document.querySelector('input[name="customerType"]:checked').value;
    
    const cashAmount = elements.cashPayment.checked ? parseInt(elements.cashAmount.value || 0) : 0;
    const transferAmount = elements.transferPayment.checked ? parseInt(elements.transferAmount.value || 0) : 0;
    const cardAmount = elements.cardPayment.checked ? parseInt(elements.cardAmount.value || 0) : 0;
    
    return {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        product: elements.ringProduct.value,
        platingCount: parseInt(elements.platingCount.textContent),
        payments: {
            cash: cashAmount * 1000, // 천원 단위를 원 단위로 변환
            transfer: transferAmount * 1000,
            card: cardAmount * 1000
        },
        customerType: customerType,
        notes: elements.notes.value,
        totalAmount: (cashAmount + transferAmount + cardAmount) * 1000 // 원 단위로 저장
    };
}

function saveSalesData(salesData) {
    try {
        const existingData = JSON.parse(localStorage.getItem('salesData') || '[]');
        existingData.push(salesData);
        localStorage.setItem('salesData', JSON.stringify(existingData));
        console.log('Sales data saved successfully');
    } catch (error) {
        console.error('Error saving sales data:', error);
        showError('데이터 저장 중 오류가 발생했습니다.');
    }
}

function resetForm() {
    console.log('Resetting form...');
    
    elements.ringProduct.value = '';
    elements.selectedProductPrice.classList.remove('show');
    elements.platingCount.textContent = '0';
    elements.priceResult.classList.remove('show');
    
    elements.cashPayment.checked = false;
    elements.transferPayment.checked = false;
    elements.cardPayment.checked = false;
    
    elements.cashAmount.value = '';
    elements.transferAmount.value = '';
    elements.cardAmount.value = '';
    elements.cashAmount.disabled = true;
    elements.transferAmount.disabled = true;
    elements.cardAmount.disabled = true;
    
    const generalRadio = document.querySelector('input[name="customerType"][value="일반"]');
    if (generalRadio) {
        generalRadio.checked = true;
    }
    elements.notes.value = '';
}

function updateDailySummary() {
    console.log('Updating daily summary...');
    
    const today = new Date().toISOString().split('T')[0];
    const allData = JSON.parse(localStorage.getItem('salesData') || '[]');
    const todayData = allData.filter(item => item.date === today);
    
    console.log('Today data:', todayData.length, 'items');
    
    // 총 주문 건수
    elements.totalOrders.textContent = `${todayData.length}건`;
    
    // 총 매출액 (천원 단위로 표시)
    const totalSales = todayData.reduce((sum, item) => sum + item.totalAmount, 0);
    elements.totalSales.textContent = `${Math.round(totalSales / 1000)}천원`;
    
    // 결제수단별 매출
    const cashTotal = todayData.reduce((sum, item) => sum + item.payments.cash, 0);
    const transferTotal = todayData.reduce((sum, item) => sum + item.payments.transfer, 0);
    const cardTotal = todayData.reduce((sum, item) => sum + item.payments.card, 0);
    
    elements.cashTotal.textContent = `${Math.round(cashTotal / 1000)}천원`;
    elements.transferTotal.textContent = `${Math.round(transferTotal / 1000)}천원`;
    elements.cardTotal.textContent = `${Math.round(cardTotal / 1000)}천원`;
    
    // 인기 제품 TOP 3
    updatePopularProducts(todayData);
    
    // 고객 유형별 비율
    updateCustomerRatio(todayData);
}

function updatePopularProducts(todayData) {
    if (todayData.length === 0) {
        elements.popularProducts.innerHTML = '<div class="product-rank">데이터 없음</div>';
        return;
    }
    
    const productCounts = {};
    todayData.forEach(item => {
        productCounts[item.product] = (productCounts[item.product] || 0) + 1;
    });
    
    const sortedProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    elements.popularProducts.innerHTML = sortedProducts
        .map((product, index) => 
            `<div class="product-rank">${index + 1}. ${product[0]} (${product[1]}건)</div>`
        ).join('');
}

function updateCustomerRatio(todayData) {
    if (todayData.length === 0) {
        elements.generalRatio.textContent = '0%';
        elements.experienceRatio.textContent = '0%';
        elements.otherRatio.textContent = '0%';
        return;
    }
    
    const typeCounts = {
        '일반': 0,
        '체험': 0,
        '기타': 0
    };
    
    todayData.forEach(item => {
        typeCounts[item.customerType]++;
    });
    
    const total = todayData.length;
    elements.generalRatio.textContent = `${Math.round((typeCounts['일반'] / total) * 100)}%`;
    elements.experienceRatio.textContent = `${Math.round((typeCounts['체험'] / total) * 100)}%`;
    elements.otherRatio.textContent = `${Math.round((typeCounts['기타'] / total) * 100)}%`;
}

function showSuccessModal() {
    console.log('Showing success modal...');
    if (elements.successModal) {
        elements.successModal.classList.remove('hidden');
    }
}

function closeSuccessModal() {
    console.log('Closing success modal...');
    if (elements.successModal) {
        elements.successModal.classList.add('hidden');
    }
}

function showError(message) {
    console.log('Showing error:', message);
    if (elements.errorAlert) {
        elements.errorAlert.textContent = message;
        elements.errorAlert.classList.remove('hidden');
        
        setTimeout(() => {
            elements.errorAlert.classList.add('hidden');
        }, 3000);
    }
}

// 키보드 이벤트 처리
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSuccessModal();
    }
});