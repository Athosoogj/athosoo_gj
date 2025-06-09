// 제품 데이터
const PRODUCTS = [
    {"name": "베이직", "price_male": 80000, "price_female": 70000},
    {"name": "플랫", "price_male": 90000, "price_female": 90000},
    {"name": "클래식", "price_male": 90000, "price_female": 80000},
    {"name": "젬스톤", "price_male": 90000, "price_female": 100000},
    {"name": "엥게이지", "price_male": 90000, "price_female": 90000},
    {"name": "파시넷", "price_male": 90000, "price_female": 100000},
    {"name": "쥬빌레", "price_male": 110000, "price_female": 110000},
    {"name": "루미에", "price_male": 120000, "price_female": 120000},
    {"name": "프로미스", "price_male": 110000, "price_female": 110000},
    {"name": "스텔라", "price_male": 130000, "price_female": 130000},
    {"name": "써밋", "price_male": 120000, "price_female": 120000},
    {"name": "키스톤", "price_male": 120000, "price_female": 120000},
    {"name": "포커스", "price_male": 110000, "price_female": 120000},
    {"name": "오르빗", "price_male": 110000, "price_female": 140000},
    {"name": "젬브릿지", "price_male": 100000, "price_female": 130000},
    {"name": "웨이브", "price_male": 110000, "price_female": 140000},
    {"name": "러브넛", "price_male": 110000, "price_female": 130000},
    {"name": "로미오와줄리엣", "price_male": 150000, "price_female": 140000},
    {"name": "새턴", "price_male": 110000, "price_female": 130000}
];

const PLATING_COST = 20000;
const SIZES = [4, 7, 10, 13, 16, 20];
const VAT_RATE = 0.1;

// 통계 데이터
let todayStats = {
    visitCount: 0,
    cashCount: 0,
    transferCount: 0,
    cardCount: 0
};

// 방문자 데이터
let todayVisitors = [];

// DOM 요소들
let elements = {};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    updateStatsDisplay();
    updateVisitorsTable();
    setupEventListeners();
});

// DOM 요소 초기화
function initializeElements() {
    elements = {
        reservationName: document.getElementById('reservationName'),
        partySize: document.getElementById('partySize'),
        productTableCard: document.getElementById('productTableCard'),
        productTableBody: document.getElementById('productTableBody'),
        productTableFooter: document.getElementById('productTableFooter'),
        paymentCard: document.getElementById('paymentCard'),
        cashPayment: document.getElementById('cashPayment'),
        transferPayment: document.getElementById('transferPayment'),
        cardPayment: document.getElementById('cardPayment'),
        cashAmount: document.getElementById('cashAmount'),
        transferAmount: document.getElementById('transferAmount'),
        cardAmount: document.getElementById('cardAmount'),
        paymentTotal: document.getElementById('paymentTotal'),
        orderTotal: document.getElementById('orderTotal'),
        submitOrder: document.getElementById('submitOrder'),
        confirmModal: document.getElementById('confirmModal'),
        confirmMessage: document.getElementById('confirmMessage'),
        confirmName: document.getElementById('confirmName'),
        confirmPartySize: document.getElementById('confirmPartySize'),
        confirmOrderAmount: document.getElementById('confirmOrderAmount'),
        confirmPaymentAmount: document.getElementById('confirmPaymentAmount'),
        cancelConfirm: document.getElementById('cancelConfirm'),
        confirmSubmit: document.getElementById('confirmSubmit'),
        visitCount: document.getElementById('visitCount'),
        cashCount: document.getElementById('cashCount'),
        transferCount: document.getElementById('transferCount'),
        cardCount: document.getElementById('cardCount'),
        visitorsTableBody: document.getElementById('visitorsTableBody')
    };
}

// 이벤트 리스너 설정
function setupEventListeners() {
    if (!elements.partySize) return;
    
    // 일행수 변경 시 테이블 생성
    elements.partySize.addEventListener('change', function() {
        createProductTable();
    });
    
    // 결제 방식 체크박스
    if (elements.cashPayment) {
        elements.cashPayment.addEventListener('change', togglePaymentMethod);
    }
    if (elements.transferPayment) {
        elements.transferPayment.addEventListener('change', togglePaymentMethod);
    }
    if (elements.cardPayment) {
        elements.cardPayment.addEventListener('change', togglePaymentMethod);
    }
    
    // 결제 금액 입력
    if (elements.cashAmount) {
        elements.cashAmount.addEventListener('input', updatePaymentTotal);
    }
    if (elements.transferAmount) {
        elements.transferAmount.addEventListener('input', updatePaymentTotal);
    }
    if (elements.cardAmount) {
        elements.cardAmount.addEventListener('input', updatePaymentTotal);
    }
    
    // 매출 입력 버튼
    if (elements.submitOrder) {
        elements.submitOrder.addEventListener('click', handleSubmitOrder);
    }
    
    // 모달 이벤트
    if (elements.cancelConfirm) {
        elements.cancelConfirm.addEventListener('click', closeConfirmModal);
    }
    if (elements.confirmSubmit) {
        elements.confirmSubmit.addEventListener('click', confirmOrder);
    }
    
    // 모달 오버레이 클릭시 닫기
    if (elements.confirmModal) {
        elements.confirmModal.addEventListener('click', function(e) {
            if (e.target === elements.confirmModal) {
                closeConfirmModal();
            }
        });
    }
}

// 제품 테이블 생성
function createProductTable() {
    const partySize = parseInt(elements.partySize.value);
    
    if (!partySize || partySize === 0) {
        if (elements.productTableCard) {
            elements.productTableCard.style.display = 'none';
        }
        if (elements.paymentCard) {
            elements.paymentCard.style.display = 'none';
        }
        return;
    }
    
    if (elements.productTableCard) {
        elements.productTableCard.style.display = 'block';
    }
    if (elements.paymentCard) {
        elements.paymentCard.style.display = 'block';
    }
    
    // 테이블 바디 생성
    if (elements.productTableBody) {
        elements.productTableBody.innerHTML = '';
        
        for (let i = 1; i <= partySize; i++) {
            const row = createProductRow(i);
            elements.productTableBody.appendChild(row);
        }
    }
    
    // 푸터 생성
    createTableFooter();
    
    // 총합 계산
    updateOrderTotal();
}

// 제품 행 생성
function createProductRow(index) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="row-number">${index}</td>
        <td>
            <select class="table-select product-select" data-row="${index}">
                <option value="">제품 선택</option>
                ${PRODUCTS.map(product => `<option value="${product.name}">${product.name}</option>`).join('')}
            </select>
        </td>
        <td>
            <select class="table-select gender-select" data-row="${index}">
                <option value="">성별</option>
                <option value="M">남성</option>
                <option value="F">여성</option>
            </select>
        </td>
        <td>
            <input type="number" class="table-input measured-size" data-row="${index}" placeholder="실측" step="0.1" min="1" max="30">
        </td>
        <td>
            <select class="table-select stock-size" data-row="${index}">
                <option value="">재고 사이즈</option>
                ${SIZES.map(size => `<option value="${size}">${size}</option>`).join('')}
            </select>
        </td>
        <td>
            <input type="checkbox" class="table-checkbox plating-checkbox" data-row="${index}">
        </td>
        <td class="price-display" data-row="${index}">0원</td>
    `;
    
    // 이벤트 리스너 추가
    setTimeout(() => {
        const productSelect = row.querySelector('.product-select');
        const genderSelect = row.querySelector('.gender-select');
        const platingCheckbox = row.querySelector('.plating-checkbox');
        
        if (productSelect) {
            productSelect.addEventListener('change', () => updateRowPrice(index));
        }
        if (genderSelect) {
            genderSelect.addEventListener('change', () => updateRowPrice(index));
        }
        if (platingCheckbox) {
            platingCheckbox.addEventListener('change', () => updateRowPrice(index));
        }
    }, 100);
    
    return row;
}

// 테이블 푸터 생성
function createTableFooter() {
    if (!elements.productTableFooter) return;
    
    elements.productTableFooter.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: right; font-weight: bold;">합계 (공급가)</td>
            <td class="price-display" id="subtotalPrice">0원</td>
        </tr>
        <tr>
            <td colspan="6" style="text-align: right; font-weight: bold;">합계 (VAT 포함)</td>
            <td class="price-display" id="totalPrice">0원</td>
        </tr>
    `;
}

// 행별 가격 업데이트
function updateRowPrice(rowIndex) {
    const productSelect = document.querySelector(`.product-select[data-row="${rowIndex}"]`);
    const genderSelect = document.querySelector(`.gender-select[data-row="${rowIndex}"]`);
    const platingCheckbox = document.querySelector(`.plating-checkbox[data-row="${rowIndex}"]`);
    const priceCell = document.querySelector(`.price-display[data-row="${rowIndex}"]`);
    
    if (!productSelect || !genderSelect || !platingCheckbox || !priceCell) return;
    
    const productName = productSelect.value;
    const gender = genderSelect.value;
    const isPlated = platingCheckbox.checked;
    
    let price = 0;
    
    if (productName && gender) {
        const product = PRODUCTS.find(p => p.name === productName);
        if (product) {
            price = gender === 'M' ? product.price_male : product.price_female;
            if (isPlated) {
                price += PLATING_COST;
            }
        }
    }
    
    priceCell.textContent = formatPrice(price);
    updateOrderTotal();
}

// 주문 총액 업데이트
function updateOrderTotal() {
    const partySize = parseInt(elements.partySize?.value) || 0;
    let subtotal = 0;
    
    for (let i = 1; i <= partySize; i++) {
        const priceCell = document.querySelector(`.price-display[data-row="${i}"]`);
        if (priceCell) {
            const priceText = priceCell.textContent.replace(/[^0-9]/g, '');
            subtotal += parseInt(priceText) || 0;
        }
    }
    
    const total = Math.round(subtotal * (1 + VAT_RATE));
    
    const subtotalElement = document.getElementById('subtotalPrice');
    const totalElement = document.getElementById('totalPrice');
    
    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (totalElement) totalElement.textContent = formatPrice(total);
    
    if (elements.orderTotal) {
        elements.orderTotal.textContent = formatPrice(total);
    }
}

// 결제 방식 토글
function togglePaymentMethod(e) {
    const checkbox = e.target;
    const methodName = checkbox.id.replace('Payment', '');
    const amountInput = document.getElementById(methodName + 'Amount');
    const paymentMethod = checkbox.closest('.payment-method');
    
    if (checkbox.checked) {
        if (amountInput) {
            amountInput.disabled = false;
            amountInput.focus();
        }
        if (paymentMethod) {
            paymentMethod.classList.add('active');
        }
    } else {
        if (amountInput) {
            amountInput.disabled = true;
            amountInput.value = '';
        }
        if (paymentMethod) {
            paymentMethod.classList.remove('active');
        }
    }
    
    updatePaymentTotal();
}

// 결제 총액 업데이트
function updatePaymentTotal() {
    const cashAmount = (elements.cashPayment?.checked && elements.cashAmount) ? 
        (parseInt(elements.cashAmount.value) || 0) * 1000 : 0;
    const transferAmount = (elements.transferPayment?.checked && elements.transferAmount) ? 
        (parseInt(elements.transferAmount.value) || 0) * 1000 : 0;
    const cardAmount = (elements.cardPayment?.checked && elements.cardAmount) ? 
        (parseInt(elements.cardAmount.value) || 0) * 1000 : 0;
    
    const total = cashAmount + transferAmount + cardAmount;
    
    if (elements.paymentTotal) {
        elements.paymentTotal.textContent = formatPrice(total);
    }
}

// 매출 입력 처리
function handleSubmitOrder() {
    const validation = validateOrder();
    if (!validation.isValid) {
        alert(validation.message);
        return;
    }
    
    showConfirmModal();
}

// 주문 유효성 검사
function validateOrder() {
    const name = elements.reservationName?.value?.trim() || '';
    const partySize = parseInt(elements.partySize?.value) || 0;
    
    if (!name) {
        return { isValid: false, message: '예약자 이름을 입력해주세요.' };
    }
    
    if (!partySize) {
        return { isValid: false, message: '일행 수를 선택해주세요.' };
    }
    
    // 제품 정보 확인
    for (let i = 1; i <= partySize; i++) {
        const productSelect = document.querySelector(`.product-select[data-row="${i}"]`);
        const genderSelect = document.querySelector(`.gender-select[data-row="${i}"]`);
        
        if (!productSelect?.value) {
            return { isValid: false, message: `${i}번째 제품을 선택해주세요.` };
        }
        
        if (!genderSelect?.value) {
            return { isValid: false, message: `${i}번째 성별을 선택해주세요.` };
        }
    }
    
    // 결제 정보 확인
    const hasPaymentMethod = elements.cashPayment?.checked || 
                           elements.transferPayment?.checked || 
                           elements.cardPayment?.checked;
    if (!hasPaymentMethod) {
        return { isValid: false, message: '결제 방식을 선택해주세요.' };
    }
    
    const orderTotal = parseInt(elements.orderTotal?.textContent?.replace(/[^0-9]/g, '') || '0');
    const paymentTotal = parseInt(elements.paymentTotal?.textContent?.replace(/[^0-9]/g, '') || '0');
    
    if (paymentTotal === 0) {
        return { isValid: false, message: '결제 금액을 입력해주세요.' };
    }
    
    return { isValid: true, orderTotal, paymentTotal };
}

// 확인 모달 표시
function showConfirmModal() {
    const validation = validateOrder();
    const name = elements.reservationName?.value?.trim() || '';
    const partySize = elements.partySize?.value || '';
    
    if (elements.confirmName) elements.confirmName.textContent = name;
    if (elements.confirmPartySize) elements.confirmPartySize.textContent = partySize + '명';
    if (elements.confirmOrderAmount) elements.confirmOrderAmount.textContent = elements.orderTotal?.textContent || '0원';
    if (elements.confirmPaymentAmount) elements.confirmPaymentAmount.textContent = elements.paymentTotal?.textContent || '0원';
    
    if (elements.confirmMessage) {
        if (validation.orderTotal === validation.paymentTotal) {
            elements.confirmMessage.textContent = '주문 금액과 결제 금액이 일치합니다. 매출을 입력하시겠습니까?';
            elements.confirmMessage.className = 'status--success';
        } else {
            const diff = Math.abs(validation.orderTotal - validation.paymentTotal);
            elements.confirmMessage.textContent = `주문 금액과 결제 금액이 일치하지 않습니다. (차이: ${formatPrice(diff)}) 그래도 진행하시겠습니까?`;
            elements.confirmMessage.className = 'status--warning';
        }
    }
    
    if (elements.confirmModal) {
        elements.confirmModal.style.display = 'flex';
    }
}

// 확인 모달 닫기
function closeConfirmModal() {
    if (elements.confirmModal) {
        elements.confirmModal.style.display = 'none';
    }
}

// 주문 확정
function confirmOrder() {
    const orderData = collectOrderData();
    
    // 통계 업데이트
    todayStats.visitCount++;
    
    if (elements.cashPayment?.checked) todayStats.cashCount++;
    if (elements.transferPayment?.checked) todayStats.transferCount++;
    if (elements.cardPayment?.checked) todayStats.cardCount++;
    
    // 방문자 데이터 추가
    addVisitorData(orderData);
    
    updateStatsDisplay();
    updateVisitorsTable();
    
    // 폼 리셋
    resetForm();
    
    // 모달 닫기
    closeConfirmModal();
    
    alert('매출이 성공적으로 입력되었습니다.');
}

// 주문 데이터 수집
function collectOrderData() {
    const name = elements.reservationName?.value?.trim() || '';
    const partySize = parseInt(elements.partySize?.value) || 0;
    const orderItems = [];
    
    for (let i = 1; i <= partySize; i++) {
        const productSelect = document.querySelector(`.product-select[data-row="${i}"]`);
        const genderSelect = document.querySelector(`.gender-select[data-row="${i}"]`);
        const measuredSize = document.querySelector(`.measured-size[data-row="${i}"]`);
        const stockSize = document.querySelector(`.stock-size[data-row="${i}"]`);
        const platingCheckbox = document.querySelector(`.plating-checkbox[data-row="${i}"]`);
        const priceCell = document.querySelector(`.price-display[data-row="${i}"]`);
        
        orderItems.push({
            sequence: i,
            product: productSelect?.value || '',
            gender: genderSelect?.value || '',
            measuredSize: measuredSize?.value || '',
            stockSize: stockSize?.value || '',
            plating: platingCheckbox?.checked || false,
            price: parseInt(priceCell?.textContent?.replace(/[^0-9]/g, '') || '0')
        });
    }
    
    const paymentInfo = {
        cash: (elements.cashPayment?.checked && elements.cashAmount) ? 
            (parseInt(elements.cashAmount.value) || 0) * 1000 : 0,
        transfer: (elements.transferPayment?.checked && elements.transferAmount) ? 
            (parseInt(elements.transferAmount.value) || 0) * 1000 : 0,
        card: (elements.cardPayment?.checked && elements.cardAmount) ? 
            (parseInt(elements.cardAmount.value) || 0) * 1000 : 0
    };
    
    return {
        timestamp: new Date().toISOString(),
        reservationName: name,
        partySize: partySize,
        items: orderItems,
        payment: paymentInfo,
        orderTotal: parseInt(elements.orderTotal?.textContent?.replace(/[^0-9]/g, '') || '0'),
        paymentTotal: parseInt(elements.paymentTotal?.textContent?.replace(/[^0-9]/g, '') || '0')
    };
}

// 방문자 데이터 추가
function addVisitorData(orderData) {
    const productNames = orderData.items.map(item => item.product).filter(p => p).join(', ');
    
    const paymentMethods = [];
    if (orderData.payment.cash > 0) paymentMethods.push('현금');
    if (orderData.payment.transfer > 0) paymentMethods.push('계좌이체');
    if (orderData.payment.card > 0) paymentMethods.push('카드');
    
    const visitorData = {
        name: orderData.reservationName,
        partySize: orderData.partySize,
        products: productNames || '선택된 제품 없음',
        paymentMethods: paymentMethods.join(', ') || '결제방식 없음',
        timestamp: orderData.timestamp
    };
    
    todayVisitors.push(visitorData);
}

// 방문자 테이블 업데이트
function updateVisitorsTable() {
    if (!elements.visitorsTableBody) return;
    
    const tbody = elements.visitorsTableBody;
    
    if (todayVisitors.length === 0) {
        tbody.innerHTML = `
            <tr class="no-data">
                <td colspan="4">아직 방문한 고객이 없습니다.</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    const recentVisitors = [...todayVisitors].reverse();
    
    recentVisitors.forEach(visitor => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = visitor.name;
        row.insertCell(1).textContent = visitor.partySize + '명';
        row.insertCell(2).textContent = visitor.products;
        row.insertCell(3).textContent = visitor.paymentMethods;
    });
}

// 폼 리셋
function resetForm() {
    if (elements.reservationName) elements.reservationName.value = '';
    if (elements.partySize) elements.partySize.value = '';
    if (elements.productTableCard) elements.productTableCard.style.display = 'none';
    if (elements.paymentCard) elements.paymentCard.style.display = 'none';
    
    // 결제 정보 리셋
    if (elements.cashPayment) elements.cashPayment.checked = false;
    if (elements.transferPayment) elements.transferPayment.checked = false;
    if (elements.cardPayment) elements.cardPayment.checked = false;
    if (elements.cashAmount) {
        elements.cashAmount.value = '';
        elements.cashAmount.disabled = true;
    }
    if (elements.transferAmount) {
        elements.transferAmount.value = '';
        elements.transferAmount.disabled = true;
    }
    if (elements.cardAmount) {
        elements.cardAmount.value = '';
        elements.cardAmount.disabled = true;
    }
    
    // 결제 방식 스타일 리셋
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    
    if (elements.paymentTotal) elements.paymentTotal.textContent = '0원';
    if (elements.orderTotal) elements.orderTotal.textContent = '0원';
}

// 통계 표시 업데이트
function updateStatsDisplay() {
    if (elements.visitCount) elements.visitCount.textContent = todayStats.visitCount;
    if (elements.cashCount) elements.cashCount.textContent = todayStats.cashCount;
    if (elements.transferCount) elements.transferCount.textContent = todayStats.transferCount;
    if (elements.cardCount) elements.cardCount.textContent = todayStats.cardCount;
}

// 가격 포맷팅
function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
}