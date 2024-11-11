document.addEventListener('DOMContentLoaded', function () {
   reset();
});

let randomNumber: number[];
const inputNumber = document.getElementById('guess') as HTMLInputElement;
const modal = document.getElementById('modal') as HTMLElement;
const modalMessage = document.getElementById('modal-message') as HTMLElement;
const closeModalButton = document.getElementById('close-modal') as HTMLElement;

// 초기화 버튼 클릭 이벤트
const reset = (): void => {
   inputNumber.value = '';

   // 랜덤 숫자 생성(1~9)
   const availableNumbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
   const firstRandomNum: number[] = availableNumbers.splice(Math.floor(Math.random() * 9), 1);
   const secondRandomNum: number[] = availableNumbers.splice(Math.floor(Math.random() * 8), 1);
   const thirdRandomNum: number[] = availableNumbers.splice(Math.floor(Math.random() * 7), 1);

   randomNumber = [...firstRandomNum, ...secondRandomNum, ...thirdRandomNum];
};

// 추측 숫자 검증
const validationNumber = (inputNumberValue: string) => {
   if (inputNumberValue.length !== 3) {
      showModal('세 자리 숫자를 입력해주세요.');
      return false;
   }
};

// 스트라이크 개수 계산
const countStrikes = (guessNumber: number[]): number =>
   randomNumber.reduce((count, num, i) => {
      if (num === guessNumber[i]) {
         count += 1;
      }
      return count;
   }, 0);

// 볼 개수 계산
const countBalls = (guessNumber: number[]): number =>
   randomNumber.reduce((count, num, i) => {
      const guessIdx = guessNumber.indexOf(num);
      if (guessIdx !== -1 && guessIdx !== i) {
         count += 1;
      }
      return count;
   }, 0);

// 추측 버튼 클릭 이벤트
const guess = (): void => {
   const inputNumberValue: string = inputNumber.value;

   if (!validationNumber(inputNumberValue)) return;

   let guessNumber: number[] = inputNumberValue.split('').map((n: string) => parseInt(n));

   // 스트라이크 개수 계산
   const strikeCnt = countStrikes(guessNumber);
   // 볼 개수 계산
   const ballCnt = countBalls(guessNumber);

   //결과 메세지
   resultMessage(strikeCnt, ballCnt);
};

const resultMessage = (strikeCnt: number, ballCnt: number) => {
   let result: string = '';

   if (strikeCnt > 0 && ballCnt > 0) result = `${ballCnt}볼!! ${strikeCnt}스트라이크!! `;
   else if (strikeCnt > 0 && ballCnt === 0) result = `${strikeCnt}스트라이크!!`;
   else if (strikeCnt === 0 && ballCnt > 0) result = `${ballCnt}볼!!`;
   else result = `😛😛하나도 😛😛😛 안 맞지롱😛😛`;

   //결과 창 모달
   showModal(result);
};

// 결과 모달 표시 함수
const showModal = (message: string): void => {
   modalMessage.innerText = message;
   modal.style.display = 'flex'; // 모달을 화면에 표시
};

// 모달 닫기 이벤트
closeModalButton.onclick = () => {
   modal.style.display = 'none';
};

// 모달 외부 영역 클릭 시, 모달 닫기
window.onclick = (event) => {
   if (event.target === modal) {
      modal.style.display = 'none';
   }
};
