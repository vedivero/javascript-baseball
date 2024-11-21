document.addEventListener('DOMContentLoaded', function () {
   initializeGame();
});

window.onclick = function (event: MouseEvent): void {
   if (event.target === modal) {
      closeModal();
   }
};

let gameIdCounter = 0; // 게임 ID 카운터

let randomNumber: number[];
let gameHistory: GameRecord[] = [];
let currentGame: GameState = initializeGameState();

interface GameRecord {
   id: number;
   startTime: string;
   endTime: string;
   attempts: number;
   winner: string;
}

interface GameState {
   id: number;
   startTime: string;
   endTime: string;
   attempts: number;
   maxAttempts: number;
   winner: string;
}

const inputNumber = document.getElementById('guess') as HTMLInputElement;
const modal = document.getElementById('modal') as HTMLElement;
const modalMessage = document.getElementById('modal-message') as HTMLElement;
const closeModalButton = document.getElementById('close-modal') as HTMLElement;
const startButton = document.getElementById('start') as HTMLElement;
const submitButton = document.getElementById('submit') as HTMLButtonElement;

function initializeGameState(): GameState {
   return {
      id: 0,
      startTime: '',
      endTime: '',
      attempts: 0,
      maxAttempts: 0,
      winner: '',
   };
}

function initializeGame(): void {
   resetGame();
   submitButton.style.display = 'none'; // "맞추기" 버튼 숨기기
   inputNumber.style.display = 'none'; // 입력 필드 숨기기

   // 엔터키로 "맞추기" 실행
   inputNumber.addEventListener('keydown', function (event: KeyboardEvent) {
      if (event.key === 'Enter') {
         guess();
      }
   });

   // ESC 키로 모달 닫기
   window.addEventListener('keydown', function (event: KeyboardEvent) {
      if (event.key === 'Escape') {
         closeModal();
      }
   });
}

function resetGame(): void {
   inputNumber.value = '';
   randomNumber = generateRandomNumbers();
   // currentGame을 초기화하지 않습니다.
}

function generateRandomNumbers(): number[] {
   const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
   return Array.from(
      { length: 3 },
      () => availableNumbers.splice(Math.floor(Math.random() * availableNumbers.length), 1)[0],
   );
}

function startGame(): void {
   displayModal(`
      <p>게임에서 몇 번만에 성공해야 하나요?</p>
      <input type="number" id="max-attempts" placeholder="숫자를 입력해주세요 (ex. 5)" />
      <button onclick="setMaxAttempts()">확인</button>
      <button onclick="closeModal()">닫기</button>
   `);
}

function setMaxAttempts(): void {
   const maxAttemptsInput = document.getElementById('max-attempts') as HTMLInputElement;
   const maxAttempts = parseInt(maxAttemptsInput.value, 10);

   if (!maxAttempts || maxAttempts <= 0) {
      alert('유효한 숫자를 입력해주세요.');
      return;
   }

   gameIdCounter++; // 게임 ID 증가
   currentGame.id = gameIdCounter; // 현재 게임 ID 설정
   currentGame.startTime = new Date().toLocaleString();
   currentGame.maxAttempts = maxAttempts;

   closeModal();
   submitButton.style.display = 'inline-block';
   inputNumber.style.display = 'inline-block';
   startButton.style.display = 'none';
   resetGame();
}

function guess(): void {
   if (!currentGame.maxAttempts) {
      alert('게임을 시작해주세요!');
      return;
   }

   const inputNumberValue = inputNumber.value;
   if (!validateGuess(inputNumberValue)) return;

   const guessNumber = parseGuess(inputNumberValue);

   processGuess(guessNumber);
}

function validateGuess(inputNumberValue: string): boolean {
   if (inputNumberValue.length !== 3) {
      displayModal('세 자리 숫자를 입력해주세요.');
      return false;
   }
   return true;
}

function parseGuess(inputNumberValue: string): number[] {
   return inputNumberValue.split('').map((num) => parseInt(num, 10));
}

function processGuess(guessNumber: number[]): void {
   const strikes = countStrikes(guessNumber);
   const balls = countBalls(guessNumber);

   currentGame.attempts += 1;

   displayResult(strikes, balls);

   if (strikes === 3) {
      endGame('사용자');
   } else if (currentGame.attempts >= currentGame.maxAttempts) {
      endGame('컴퓨터');
   }
}

function countStrikes(guessNumber: number[]): number {
   return randomNumber.reduce((count, num, i) => (num === guessNumber[i] ? count + 1 : count), 0);
}

function countBalls(guessNumber: number[]): number {
   return randomNumber.reduce(
      (count, num, i) =>
         guessNumber.indexOf(num) !== -1 && guessNumber.indexOf(num) !== i ? count + 1 : count,
      0,
   );
}

function displayResult(strikes: number, balls: number): void {
   let resultMessage = '';

   if (strikes > 0 && balls > 0) resultMessage = `${balls}볼!! ${strikes}스트라이크!!`;
   else if (strikes > 0) resultMessage = `${strikes}스트라이크!!`;
   else if (balls > 0) resultMessage = `${balls}볼!!`;
   else resultMessage = `😛😛하나도 😛😛😛 안 맞지롱😛😛`;

   displayModal(`
      <p>${resultMessage}</p>
      <button onclick="closeModal()">닫기</button>
   `);
}

function endGame(winner: string): void {
   currentGame.endTime = new Date().toLocaleString();
   currentGame.winner = winner;
   gameHistory.push({ ...currentGame });

   // 승리 메시지를 모달 창에 표시
   displayModal(`
      <h3>${winner}가 승리했습니다! 🎉</h3>
      <p>게임을 다시 시작하려면 확인 버튼을 누르세요.</p>
      <button onclick="showResetConfirmation()">확인</button>
   `);
}

function showResetConfirmation(): void {
   displayModal(`
      <p>게임을 초기화하시겠습니까?</p>
      <button onclick="resetAndCloseModal()">예</button>
      <button onclick="closeModal()">아니요</button>
   `);
}

function resetAndCloseModal(): void {
   resetGame(); // 게임 초기화
   closeModal(); // 모달 닫기
}

function showHistory(): void {
   if (gameHistory.length === 0) {
      alert('기록이 없습니다.');
      return;
   }

   const historyHtml = gameHistory
      .map(
         (game) =>
            `<li>
               <div>게임 ID: [${game.id}]</div>
               <div>시작 시간: ${game.startTime}</div>
               <div>종료 시간: ${game.endTime}</div>
               <div>시도 횟수: ${game.attempts}</div>
               <div>승리자: ${game.winner}</div>
            </li>`,
      )
      .join('');

   displayModal(`<h3>게임 기록</h3><ul>${historyHtml}</ul>`);
}

function displayModal(content: string): void {
   modalMessage.innerHTML = content;
   modal.style.display = 'flex';
}

function closeModal(): void {
   modal.style.display = 'none';
}

closeModalButton.onclick = closeModal;
