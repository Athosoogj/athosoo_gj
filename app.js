// 반지공방 매출 입력 시스템 JavaScript

// 제품 데이터 (정확한 19개 제품)
const ringsData = [
    {name: "베이직", male_price: 80000, female_price: 70000},
    {name: "플랫", male_price: 90000, female_price: 90000},
    {name: "클래식", male_price: 90000, female_price: 80000},
    {name: "젬스톤", male_price: 90000, female_price: 100000},
    {name: "엥게이지", male_price: 90000, female_price: 90000},
    {name: "파시넷", male_price: 90000, female_price: 100000},
    {name: "쥬빌레", male_price: 110000, female_price: 110000},
    {name: "루미에", male_price: 120000, female_price: 120000},
    {name: "프로미스", male_price: 110000, female_price: 110000},
    {name: "스텔라", male_price: 130000, female_price: 130000},
    {name: "써밋", male_price: 120000, female_price: 120000},
    {name: "키스톤", male_price: 120000, female_price: 120000},
    {name: "포커스", male_price: 110000, female_price: 120000},
    {name: "오르빗", male_price: 110000, female_price: 140000},
    {name: "젬브릿지", male_price: 100000, female_price: 130000},
    {name: "웨이브", male_price: 110000, female_price: 140000},
    {name: "러브넛", male_price: 110000, female_price: 130000},
    {name: "로미오와줄리엣", male_price: 120000, female_price: 140000},
    {name: "새턴", male_price: 110000, female_price: 130000}
];

const platingPrice = 20000;
const vatRate = 0.1;

// DOM 요소들
let ringSelect, platingCount, platingMinus, platingPlus, calculateBtn, priceResult;
let cashPayment, transferPayment, cardPayment;
let cashAmount, transferAmount, cardAmount;
let salesForm, successModal, modalOverlay, closeModal;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    populateRingSelect();
    attachEventListeners();
});

function initializeElements() {
    ringSelect = document.getElementById('ringSelect');
    platingCount = document.getElementById('platingCount');
    platingMinus = document.getElementById('platingMinus');
    platingPlus = document.getElementById('platingPlus');
    calculateBtn = document.getElementById('calculatePrice');
    priceResult = document.getElementById('priceResult');
    
    cashPayment = document.getElementById('cashPayment');
    transferPayment = document.getElementById('transferPayment');
    cardPayment = document.getElementById('cardPayment');
    
    cashAmount = document.getElementById('cashAmount');
    transferAmount = document.getElementById('transferAmount');
    cardAmount = document.getElementById('cardAmount');
    
    salesForm = document.getElementById('salesForm');
    successModal = document.getElementById('successModal');
    modalOverlay = document.getElementById('modalOverlay');
    closeModal = document.getElementById('closeModal');
}

function populateRingSelect() {
    ringsData.forEach(ring => {
        const option = document.createElement('option');
        option.value = JSON.stringify(ring);
        option.textContent = `${ring.name} (남: ${formatPriceThousands(ring.male_price)}, 여: ${formatPriceThousands(ring.female_price)})`;
        ringSelect.appendChild(option);
    });
}

function attachEventListeners() {
    // 도금 개수 조절
    platingMinus.addEventListener('click', () => {
        const current = parseInt(platingCount.value);
        if (current > 0) {
            platingCount.value = current - 1;
        }
    });
    
    platingPlus.addEventListener('click', () => {
        const current = parseInt(platingCount.value);
        platingCount.value = current + 1;
    });
    
    // 참고가격 계산
    calculateBtn.addEventListener('click', calculatePrice);
    
    // 결제수단 체크박스 - 수정된 부분
    cashPayment.addEventListener('change', function(e) {
        togglePaymentAmount(cashAmount, e.target.checked);
    });
    
    transferPayment.addEventListener('change', function(e) {
        togglePaymentAmount(transferAmount, e.target.checked);
    });
    
    cardPayment.addEventListener('change', function(e) {
        togglePaymentAmount(cardAmount, e.target.checked);
    });
    
    // 폼 제출
    salesForm.addEventListener('submit', handleFormSubmit);
    
    // 모달 닫기
    closeModal.addEventListener('click', closeSuccessModal);
    modalOverlay.addEventListener('click', closeSuccessModal);
}

function togglePaymentAmount(amountInput, isChecked) {
    if (isChecked) {
        amountInput.disabled = false;
        amountInput.removeAttribute('disabled');
        amountInput.focus();
    } else {
        amountInput.disabled = true;
        amountInput.value = '';
        amountInput.classList.remove('error');
    }
}

function calculatePrice() {
    if (!ringSelect.value) {
        showError('반지를 선택해주세요.');
        return;
    }
    
    const selectedRing = JSON.parse(ringSelect.value);
    const platingCnt = parseInt(platingCount.value) || 0;
    
    // 공급가액 계산 (남녀 각 1개 + 도금)
    const ringTotal = selectedRing.male_price + selectedRing.female_price;
    const platingTotal = platingCnt * platingPrice;
    const supplyPrice = ringTotal + platingTotal;
    
    // 부가세 계산
    const vat = Math.round(supplyPrice * vatRate);
    const totalPrice = supplyPrice + vat;
    
    // 결과 표시
    displayPriceResult(supplyPrice, vat, totalPrice, selectedRing, platingCnt);
}

function displayPriceResult(supplyPrice, vat, totalPrice, ring, platingCnt) {
    priceResult.innerHTML = `
        <div class="price-breakdown">
            <div class="price-line">
                <span>${ring.name} (남녀 각 1개)</span>
                <span>${formatPriceThousands(ring.male_price + ring.female_price)}</span>
            </div>
            ${platingCnt > 0 ? `
            <div class="price-line">
                <span>도금 ${platingCnt}개</span>
                <span>${formatPriceThousands(platingCnt * platingPrice)}</span>
            </div>
            ` : ''}
            <div class="price-line price-total">
                <span>공급가 ${formatPriceThousands(supplyPrice)} + 부가세 ${formatPriceThousands(vat)}</span>
                <span><strong>합계 ${formatPriceThousands(totalPrice)}</strong></span>
            </div>
        </div>
    `;
    
    priceResult.classList.remove('hidden');
    priceResult.classList.add('highlight');
    
    // 하이라이트 효과 제거
    setTimeout(() => {
        priceResult.classList.remove('highlight');
    }, 2000);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // 로딩 상태 표시
    const submitBtn = salesForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // 실제로는 서버에 데이터 전송
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showSuccessModal();
        resetForm();
    }, 500);
}

function validateForm() {
    let isValid = true;
    
    // 반지 선택 확인
    if (!ringSelect.value) {
        showFieldError(ringSelect, '반지를 선택해주세요.');
        isValid = false;
    } else {
        clearFieldError(ringSelect);
    }
    
    // 결제수단 및 금액 확인
    const paymentMethods = [
        {checkbox: cashPayment, amount: cashAmount, name: '현금'},
        {checkbox: transferPayment, amount: transferAmount, name: '계좌이체'},
        {checkbox: cardPayment, amount: cardAmount, name: '카드'}
    ];
    
    let hasPayment = false;
    paymentMethods.forEach(method => {
        if (method.checkbox.checked) {
            hasPayment = true;
            const amount = parseFloat(method.amount.value);
            if (!amount || amount <= 0) {
                showFieldError(method.amount, `${method.name} 금액을 입력해주세요.`);
                isValid = false;
            } else {
                clearFieldError(method.amount);
            }
        }
    });
    
    if (!hasPayment) {
        showError('최소 하나의 결제수단을 선택해주세요.');
        isValid = false;
    }
    
    // 손님 형태 확인
    const customerType = document.querySelector('input[name="customerType"]:checked');
    if (!customerType) {
        showError('손님 형태를 선택해주세요.');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // 기존 에러 메시지 제거
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // 새 에러 메시지 추가
    const errorMsg = document.createElement('span');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    field.parentNode.appendChild(errorMsg);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showError(message) {
    alert(message);
}

function showSuccessModal() {
    successModal.classList.remove('hidden');
    modalOverlay.classList.remove('hidden');
}

function closeSuccessModal() {
    successModal.classList.add('hidden');
    modalOverlay.classList.add('hidden');
}

function resetForm() {
    // 폼 초기화
    salesForm.reset();
    
    // 도금 개수 초기화
    platingCount.value = 0;
    
    // 가격 결과 숨기기
    priceResult.classList.add('hidden');
    
    // 결제 금액 입력창 비활성화
    [cashAmount, transferAmount, cardAmount].forEach(input => {
        input.disabled = true;
        input.value = '';
        clearFieldError(input);
    });
    
    // 에러 상태 제거
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

// 가격을 천원단위로 표시하는 함수
function formatPriceThousands(price) {
    return (price / 1000).toLocaleString('ko-KR') + '천원';
}