// 제품 데이터 및 설정
const ringProducts = [
  {"name": "베이직", "price_male": 80, "price_female": 70},
  {"name": "플랫", "price_male": 90, "price_female": 90},
  {"name": "클래식", "price_male": 90, "price_female": 80},
  {"name": "젬스톤", "price_male": 90, "price_female": 100},
  {"name": "엥게이지", "price_male": 120, "price_female": 120},
  {"name": "파시넷", "price_male": 130, "price_female": 130},
  {"name": "쥬빌레", "price_male": 130, "price_female": 120},
  {"name": "루미에", "price_male": 120, "price_female": 110},
  {"name": "프로미스", "price_male": 110, "price_female": 100},
  {"name": "스텔라", "price_male": 120, "price_female": 130},
  {"name": "써밋", "price_male": 140, "price_female": 130},
  {"name": "키스톤", "price_male": 130, "price_female": 120},
  {"name": "포커스", "price_male": 110, "price_female": 120},
  {"name": "오르빗", "price_male": 120, "price_female": 110},
  {"name": "젬브릿지", "price_male": 130, "price_female": 140},
  {"name": "웨이브", "price_male": 120, "price_female": 130},
  {"name": "러브넛", "price_male": 140, "price_female": 130},
  {"name": "로미오와줄리엣", "price_male": 150, "price_female": 140},
  {"name": "새턴", "price_male": 140, "price_female": 150}
];

const stockSizes = [4, 7, 10, 13, 16, 20];
const platingCost = 20;
const vatRate = 0.1;

// DOM 요소들 참조
const salesForm = document.getElementById('salesForm');
const partySizeSelect = document.getElementById('partySize');
const productTableBody = document.getElementById('productTableBody');
const basePriceElement = document.getElementById('basePrice');
const taxPriceElement = document.getElementById('taxPrice');
const totalPriceElement = document.getElementById('totalPrice');

// 결제 관련 요소
const cashCheckbox = document.getElementById('cashPayment');
const transferCheckbox = document.getElementById('transferPayment');
const cardCheckbox = document.getElementById('cardPayment');
const cashAmountInput = document.getElementById('cashAmount');
const transferAmountInput = document.getElementById('transferAmount');
const cardAmountInput = document.getElementById('cardAmount');

// 모달 요소
const confirmationModal = document.getElementById('confirmationModal');
const successModal = document.getElementById('successModal');
const confirmYesButton = document.getElementById('confirmYes');
const confirmNoButton = document.getElementById('confirmNo');
const successOkButton = document.getElementById('successOk');

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
  // 파티 사이즈 변경 시 테이블 생성
  partySizeSelect.addEventListener('change', generateProductTable);
  
  // 결제 체크박스 이벤트 리스너
  cashCheckbox.addEventListener('change', () => {
    cashAmountInput.disabled = !cashCheckbox.checked;
    if (cashCheckbox.checked) {
      cashAmountInput.focus();
    } else {
      cashAmountInput.value = '';
    }
  });
  
  transferCheckbox.addEventListener('change', () => {
    transferAmountInput.disabled = !transferCheckbox.checked;
    if (transferCheckbox.checked) {
      transferAmountInput.focus();
    } else {
      transferAmountInput.value = '';
    }
  });
  
  cardCheckbox.addEventListener('change', () => {
    cardAmountInput.disabled = !cardCheckbox.checked;
    if (cardCheckbox.checked) {
      cardAmountInput.focus();
    } else {
      cardAmountInput.value = '';
    }
  });
  
  // 폼 제출 이벤트
  salesForm.addEventListener('submit', handleFormSubmit);
  
  // 모달 버튼 이벤트
  confirmYesButton.addEventListener('click', submitForm);
  confirmNoButton.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
  });
  
  successOkButton.addEventListener('click', () => {
    successModal.style.display = 'none';
  });
});

// 제품 테이블 생성 함수
function generateProductTable() {
  const partySize = parseInt(partySizeSelect.value);
  
  // 테이블 초기화
  productTableBody.innerHTML = '';
  
  if (isNaN(partySize) || partySize <= 0) {
    return;
  }
  
  // 지정된 인원수만큼 행 생성
  for (let i = 0; i < partySize; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>
        <select class="form-control product-select" data-row="${i}">
          <option value="">선택하세요</option>
          ${ringProducts.map(product => `
            <option value="${product.name}">${product.name}</option>
          `).join('')}
        </select>
      </td>
      <td>
        <select class="form-control gender-select" data-row="${i}">
          <option value="">선택하세요</option>
          <option value="M">M</option>
          <option value="F">F</option>
        </select>
      </td>
      <td>
        <input type="text" class="form-control actual-size" data-row="${i}">
      </td>
      <td>
        <select class="form-control stock-size" data-row="${i}">
          <option value="">선택하세요</option>
          ${stockSizes.map(size => `
            <option value="${size}">${size}</option>
          `).join('')}
        </select>
      </td>
      <td>
        <input type="checkbox" class="plating-checkbox" data-row="${i}">
      </td>
    `;
    
    productTableBody.appendChild(row);
  }
  
  // 제품 선택 및 체크박스 변경 시 가격 업데이트를 위한 이벤트 리스너 추가
  document.querySelectorAll('.product-select, .gender-select, .plating-checkbox')
    .forEach(element => {
      element.addEventListener('change', calculateTotalPrice);
    });
    
  // 초기 가격 계산
  calculateTotalPrice();
}

// 총 가격 계산 함수
function calculateTotalPrice() {
  let basePrice = 0;
  
  // 모든 제품 행을 순회하며 가격 계산
  document.querySelectorAll('tr').forEach((row, index) => {
    if (index === 0) return; // 헤더 행 스킵
    
    const productSelect = row.querySelector('.product-select');
    const genderSelect = row.querySelector('.gender-select');
    const platingCheckbox = row.querySelector('.plating-checkbox');
    
    if (!productSelect || !genderSelect) return;
    
    const productName = productSelect.value;
    const gender = genderSelect.value;
    
    if (productName && gender) {
      const product = ringProducts.find(p => p.name === productName);
      
      if (product) {
        // 성별에 따른 기본 가격 추가
        if (gender === 'M') {
          basePrice += product.price_male;
        } else if (gender === 'F') {
          basePrice += product.price_female;
        }
        
        // 도금 여부에 따른 추가 비용
        if (platingCheckbox && platingCheckbox.checked) {
          basePrice += platingCost;
        }
      }
    }
  });
  
  // 부가세 계산
  const taxAmount = Math.round(basePrice * vatRate);
  const totalAmount = basePrice + taxAmount;
  
  // UI 업데이트
  basePriceElement.textContent = `${basePrice}천원`;
  taxPriceElement.textContent = `${taxAmount}천원`;
  totalPriceElement.textContent = `${totalAmount}천원`;
  
  return totalAmount; // 총액 반환
}

// 결제 금액 합계 계산
function calculatePaymentTotal() {
  let total = 0;
  
  if (cashCheckbox.checked && cashAmountInput.value) {
    total += parseInt(cashAmountInput.value) || 0;
  }
  
  if (transferCheckbox.checked && transferAmountInput.value) {
    total += parseInt(transferAmountInput.value) || 0;
  }
  
  if (cardCheckbox.checked && cardAmountInput.value) {
    total += parseInt(cardAmountInput.value) || 0;
  }
  
  return total;
}

// 폼 제출 처리
function handleFormSubmit(event) {
  event.preventDefault();
  
  // 결제 금액과 상품 가격 합계 비교
  const totalPrice = calculateTotalPrice();
  const paymentTotal = calculatePaymentTotal();
  
  // 결제 금액과 상품 가격 합계가 일치하지 않으면 확인 모달 표시
  if (totalPrice !== paymentTotal) {
    confirmationModal.style.display = 'flex';
  } else {
    submitForm();
  }
}

// 폼 데이터 제출 및 저장
function submitForm() {
  // 모달 닫기
  confirmationModal.style.display = 'none';
  
  // 폼 데이터 수집
  const formData = {
    customerName: document.getElementById('customerName').value,
    partySize: parseInt(partySizeSelect.value),
    products: [],
    totalPrice: calculateTotalPrice(),
    payments: {
      cash: cashCheckbox.checked ? parseInt(cashAmountInput.value) * 1000 || 0 : 0,
      transfer: transferCheckbox.checked ? parseInt(transferAmountInput.value) * 1000 || 0 : 0,
      card: cardCheckbox.checked ? parseInt(cardAmountInput.value) * 1000 || 0 : 0
    },
    customerType: document.querySelector('input[name="customerType"]:checked').value,
    notes: document.getElementById('notes').value,
    timestamp: new Date().toISOString()
  };
  
  // 제품 정보 수집
  document.querySelectorAll('tr').forEach((row, index) => {
    if (index === 0) return; // 헤더 행 스킵
    
    const productSelect = row.querySelector('.product-select');
    const genderSelect = row.querySelector('.gender-select');
    const actualSizeInput = row.querySelector('.actual-size');
    const stockSizeSelect = row.querySelector('.stock-size');
    const platingCheckbox = row.querySelector('.plating-checkbox');
    
    if (productSelect && productSelect.value) {
      formData.products.push({
        productName: productSelect.value,
        gender: genderSelect.value,
        actualSize: actualSizeInput.value,
        stockSize: stockSizeSelect.value,
        plating: platingCheckbox.checked
      });
    }
  });
  
  // 로컬 스토리지에 데이터 저장
  try {
    // 기존 데이터 불러오기
    const existingData = JSON.parse(localStorage.getItem('salesData')) || [];
    
    // 새 데이터 추가
    existingData.push(formData);
    
    // 저장
    localStorage.setItem('salesData', JSON.stringify(existingData));
    
    // 성공 모달 표시
    successModal.style.display = 'flex';
    
    // 폼 초기화
    resetForm();
  } catch (error) {
    console.error('데이터 저장 중 오류 발생:', error);
    alert('데이터 저장 중 오류가 발생했습니다.');
  }
}

// 폼 초기화
function resetForm() {
  salesForm.reset();
  productTableBody.innerHTML = '';
  basePriceElement.textContent = '0천원';
  taxPriceElement.textContent = '0천원';
  totalPriceElement.textContent = '0천원';
  
  // 결제 입력 필드 비활성화
  cashAmountInput.disabled = true;
  transferAmountInput.disabled = true;
  cardAmountInput.disabled = true;
}