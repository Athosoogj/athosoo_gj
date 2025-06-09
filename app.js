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
    {"name": "로미오와줄리엣", "price_male": 120000, "price_female": 140000},
    {"name": "새턴", "price_male": 110000, "price_female": 130000}
];

const PLATING_COST = 20000;
const SIZES = [4, 7, 10, 13, 16, 20];
const VAT_RATE = 0.1;

// 통계 데이터 (메모리에만 저장)
let todayStats = {
    visitCount: 0,
    cashCount: 0,
    transferCount: 0,
    cardCount: 0
};

// DOM 요소들
const elements = {
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
    cardCount: document.getElementById('cardCount')
};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    updateStatsDisplay();
    setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 일행수 변경 시 테이블 생성
    elements.partySize.addEventListener('change', createProductTable);
    
    // 결제 방식 체크박스
    elements.cashPayment.addEventListener('change', togglePaymentMethod);
    elements.transferPayment.addEventListener('change', togglePaymentMethod);
    elements.cardPayment.addEventListener('change', togglePaymentMethod);
    
    // 결제 금액 입력
    elements.cashAmount.addEventListener('input', updatePaymentTotal);
    elements.transferAmount.addEventListener('input', updatePaymentTotal);
    elements.cardAmount.addEventListener('input', updatePaymentTotal);
    
    // 매출 입력 버튼
    elements.submitOrder.addEventListener('click', handleSubmitOrder);
    
    // 모달 이벤트
    elements.cancelConfirm.addEventListener('click', closeConfirmModal);
    elements.confirmSubmit.addEventListener('click', confirmOrder);
    
    // 모달 오버레이 클릭시 닫기
    elements.confirmModal.addEventListener('click', function(e) {
        if (e.target === elements.confirmModal) {
            closeConfirmModal();
        }
    });
}

// 제품 테이블 생성
function createProductTable() {
    const partySize = parseInt(elements.partySize.value);
    
    if (!partySize) {
        elements.productTableCard.style.display = 'none';
        elements.paymentCard.style.display = 'none';
        return;
    }
    
    elements.productTableCard.style.display = 'block';
    elements.paymentCard.style.display = 'block';
    
    // 테이블 바디 생성
    elements.productTableBody.innerHTML = '';
    
    for (let i = 1; i <= partySize; i++) {
        const row = createProductRow(i);
        elements.productTableBody.appendChild(row);
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
    const productSelect = row.querySelector('.product-select');
    const genderSelect = row.querySelector('.gender-select');
    const platingCheckbox = row.querySelector('.plating-checkbox');
    
    productSelect.addEventListener('change', () => updateRowPrice(index));
    genderSelect.addEventListener('change', () => updateRowPrice(index));
    platingCheckbox.addEventListener('change', () => updateRowPrice(index));
    
    return row;
}

// 테이블 푸터 생성
function createTableFooter() {
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
    const partySize = parseInt(elements.partySize.value) || 0;
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
    
    elements.orderTotal.textContent = formatPrice(total);
}

// 결제 방식 토글
function togglePaymentMethod(e) {
    const checkbox = e.target;
    const methodName = checkbox.id.replace('Payment', '');
    const amountInput = document.getElementById(methodName + 'Amount');
    const paymentMethod = checkbox.closest('.payment-method');
    
    if (checkbox.checked) {
        amountInput.disabled = false;
        paymentMethod.classList.add('active');
        amountInput.focus();
    } else {
        amountInput.disabled = true;
        amountInput.value = '';
        paymentMethod.classList.remove('active');
    }
    
    updatePaymentTotal();
}

// 결제 총액 업데이트
function updatePaymentTotal() {
    const cashAmount = elements.cashPayment.checked ? (parseInt(elements.cashAmount.value) || 0) * 1000 : 0;
    const transferAmount = elements.transferPayment.checked ? (parseInt(elements.transferAmount.value) || 0) * 1000 : 0;
    const cardAmount = elements.cardPayment.checked ? (parseInt(elements.cardAmount.value) || 0) * 1000 : 0;
    
    const total = cashAmount + transferAmount + cardAmount;
    elements.paymentTotal.textContent = formatPrice(total);
}

// 매출 입력 처리
function handleSubmitOrder() {
    // 유효성 검사
    const validation = validateOrder();
    if (!validation.isValid) {
        alert(validation.message);
        return;
    }
    
    // 확인 모달 표시
    showConfirmModal();
}

// 주문 유효성 검사
function validateOrder() {
    const name = elements.reservationName.value.trim();
    const partySize = parseInt(elements.partySize.value);
    
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
        
        if (!productSelect.value) {
            return { isValid: false, message: `${i}번째 제품을 선택해주세요.` };
        }
        
        if (!genderSelect.value) {
            return { isValid: false, message: `${i}번째 성별을 선택해주세요.` };
        }
    }
    
    // 결제 정보 확인
    const hasPaymentMethod = elements.cashPayment.checked || elements.transferPayment.checked || elements.cardPayment.checked;
    if (!hasPaymentMethod) {
        return { isValid: false, message: '결제 방식을 선택해주세요.' };
    }
    
    const orderTotal = parseInt(elements.orderTotal.textContent.replace(/[^0-9]/g, '')) || 0;
    const paymentTotal = parseInt(elements.paymentTotal.textContent.replace(/[^0-9]/g, '')) || 0;
    
    if (paymentTotal === 0) {
        return { isValid: false, message: '결제 금액을 입력해주세요.' };
    }
    
    return { isValid: true, orderTotal, paymentTotal };
}

// 확인 모달 표시
function showConfirmModal() {
    const validation = validateOrder();
    const name = elements.reservationName.value.trim();
    const partySize = elements.partySize.value;
    
    elements.confirmName.textContent = name;
    elements.confirmPartySize.textContent = partySize + '명';
    elements.confirmOrderAmount.textContent = elements.orderTotal.textContent;
    elements.confirmPaymentAmount.textContent = elements.paymentTotal.textContent;
    
    if (validation.orderTotal === validation.paymentTotal) {
        elements.confirmMessage.textContent = '주문 금액과 결제 금액이 일치합니다. 매출을 입력하시겠습니까?';
        elements.confirmMessage.className = 'status--success';
    } else {
        elements.confirmMessage.textContent = `주문 금액과 결제 금액이 일치하지 않습니다. (차이: ${formatPrice(Math.abs(validation.orderTotal - validation.paymentTotal))}) 그래도 진행하시겠습니까?`;
        elements.confirmMessage.className = 'status--warning';
    }
    
    elements.confirmModal.style.display = 'flex';
}

// 확인 모달 닫기
function closeConfirmModal() {
    elements.confirmModal.style.display = 'none';
}

// 주문 확정
function confirmOrder() {
    // 통계 업데이트
    todayStats.visitCount++;
    
    if (elements.cashPayment.checked) todayStats.cashCount++;
    if (elements.transferPayment.checked) todayStats.transferCount++;
    if (elements.cardPayment.checked) todayStats.cardCount++;
    
    updateStatsDisplay();
    
    // 구글 스프레드시트 연동 (준비된 코드)
    const orderData = collectOrderData();
    sendToGoogleSheets(orderData);
    
    // 폼 리셋
    resetForm();
    
    // 모달 닫기
    closeConfirmModal();
    
    alert('매출이 성공적으로 입력되었습니다.');
}

// 주문 데이터 수집
function collectOrderData() {
    const name = elements.reservationName.value.trim();
    const partySize = parseInt(elements.partySize.value);
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
            product: productSelect.value,
            gender: genderSelect.value,
            measuredSize: measuredSize.value,
            stockSize: stockSize.value,
            plating: platingCheckbox.checked,
            price: parseInt(priceCell.textContent.replace(/[^0-9]/g, '')) || 0
        });
    }
    
    const paymentInfo = {
        cash: elements.cashPayment.checked ? (parseInt(elements.cashAmount.value) || 0) * 1000 : 0,
        transfer: elements.transferPayment.checked ? (parseInt(elements.transferAmount.value) || 0) * 1000 : 0,
        card: elements.cardPayment.checked ? (parseInt(elements.cardAmount.value) || 0) * 1000 : 0
    };
    
    return {
        timestamp: new Date().toISOString(),
        reservationName: name,
        partySize: partySize,
        items: orderItems,
        payment: paymentInfo,
        orderTotal: parseInt(elements.orderTotal.textContent.replace(/[^0-9]/g, '')) || 0,
        paymentTotal: parseInt(elements.paymentTotal.textContent.replace(/[^0-9]/g, '')) || 0
    };
}

// 구글 스프레드시트 연동 (준비된 코드)
function sendToGoogleSheets(orderData) {
    // 실제 구현시 Google Apps Script 웹앱 URL로 교체
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
    
    // 구글 스프레드시트 연동 코드 (현재는 콘솔에만 출력)
    console.log('구글 스프레드시트로 전송할 데이터:', orderData);
    
    // 실제 연동시 아래 코드 사용
    /*
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('구글 스프레드시트 저장 성공:', data);
    })
    .catch(error => {
        console.error('구글 스프레드시트 저장 실패:', error);
        alert('데이터 저장 중 오류가 발생했습니다.');
    });
    */
}

// 폼 리셋
function resetForm() {
    elements.reservationName.value = '';
    elements.partySize.value = '';
    elements.productTableCard.style.display = 'none';
    elements.paymentCard.style.display = 'none';
    
    // 결제 정보 리셋
    elements.cashPayment.checked = false;
    elements.transferPayment.checked = false;
    elements.cardPayment.checked = false;
    elements.cashAmount.value = '';
    elements.transferAmount.value = '';
    elements.cardAmount.value = '';
    elements.cashAmount.disabled = true;
    elements.transferAmount.disabled = true;
    elements.cardAmount.disabled = true;
    
    // 결제 방식 스타일 리셋
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    
    elements.paymentTotal.textContent = '0원';
    elements.orderTotal.textContent = '0원';
}

// 통계 표시 업데이트
function updateStatsDisplay() {
    elements.visitCount.textContent = todayStats.visitCount;
    elements.cashCount.textContent = todayStats.cashCount;
    elements.transferCount.textContent = todayStats.transferCount;
    elements.cardCount.textContent = todayStats.cardCount;
}

// 가격 포맷팅
function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
}

// 키보드 단축키 (선택사항)
document.addEventListener('keydown', function(e) {
    // ESC 키로 모달 닫기
    if (e.key === 'Escape' && elements.confirmModal.style.display === 'flex') {
        closeConfirmModal();
    }
    
    // Ctrl+Enter로 매출 입력
    if (e.ctrlKey && e.key === 'Enter') {
        if (elements.paymentCard.style.display !== 'none') {
            handleSubmitOrder();
        }
    }
});