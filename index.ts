document.addEventListener('DOMContentLoaded', function () {
   reset();
});

let randomNumber: number[];
const inputNumber = document.getElementById('guess') as HTMLInputElement;
const modal = document.getElementById('modal') as HTMLElement;
const modalMessage = document.getElementById('modal-message') as HTMLElement;
const closeModalButton = document.getElementById('close-modal') as HTMLElement;

const reset = (): void => {
   inputNumber.value = '';

   // 랜덤 숫자 생성(1~9)
   const availableNumbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
   const firstRandomNum: number[] = availableNumbers.splice(Math.floor(Math.random() * 9), 1);
   const secondRandomNum: number[] = availableNumbers.splice(Math.floor(Math.random() * 8), 1);
   const thirdRandomNum: number[] = availableNumbers.splice(Math.floor(Math.random() * 7), 1);

   randomNumber = [...firstRandomNum, ...secondRandomNum, ...thirdRandomNum];
};

const guess = (): void => {
   const inputNumberValue: string = inputNumber.value;

   // Validation
   if (inputNumberValue.length !== 3) {
      showModal('세 자리 숫자를 입력해주세요.');
      return;
   }

   let guessNumber: number[] = inputNumberValue.split('').map((n: string) => parseInt(n));

   // 스트라이크 개수
   let strikeCnt: number = 0;
   randomNumber.forEach((r: number, i: number) => {
      if (r === guessNumber[i]) {
         strikeCnt++;
      }
   });

   // 볼 개수
   let ballCnt: number = 0;
   randomNumber.forEach((r: number, i: number) => {
      const guessIdx: number = guessNumber.indexOf(r);
      if (guessIdx !== -1 && guessIdx !== i) {
         ballCnt++;
      }
   });

   // 결과 메세지
   let result: string = '';
   if (strikeCnt > 0 && ballCnt > 0) result = `${strikeCnt}스트라이크!! ${ballCnt}볼!!`;
   else if (strikeCnt > 0 && ballCnt === 0) result = `${strikeCnt}스트라이크!!`;
   else if (strikeCnt === 0 && ballCnt > 0) result = `${ballCnt}볼!!`;
   else result = `😛😛하나도😛😛😛 안 맞았지롱😛😛`;

   showModal(result);
};

// 모달 표시 함수
const showModal = (message: string): void => {
   modalMessage.innerText = message;
   modal.style.display = 'flex'; // 모달을 화면에 표시
};

// 모달 닫기 이벤트
closeModalButton.onclick = () => {
   modal.style.display = 'none';
};

// 모달 외부 클릭 시 모달 닫기
window.onclick = (event) => {
   if (event.target === modal) {
      modal.style.display = 'none';
   }
};
