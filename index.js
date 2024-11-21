var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
document.addEventListener('DOMContentLoaded', function () {
    initializeGame();
});
window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
};
var gameIdCounter = 0; // 게임 ID 카운터
var randomNumber;
var gameHistory = [];
var currentGame = initializeGameState();
var inputNumber = document.getElementById('guess');
var modal = document.getElementById('modal');
var modalMessage = document.getElementById('modal-message');
var closeModalButton = document.getElementById('close-modal');
var startButton = document.getElementById('start');
var submitButton = document.getElementById('submit');
function initializeGameState() {
    return {
        id: 0,
        startTime: '',
        endTime: '',
        attempts: 0,
        maxAttempts: 0,
        winner: '',
    };
}
function initializeGame() {
    resetGame();
    submitButton.style.display = 'none'; // "맞추기" 버튼 숨기기
    inputNumber.style.display = 'none'; // 입력 필드 숨기기
    // 엔터키로 "맞추기" 실행
    inputNumber.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            guess();
        }
    });
    // ESC 키로 모달 닫기
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}
function resetGame() {
    inputNumber.value = '';
    randomNumber = generateRandomNumbers();
    // currentGame을 초기화하지 않습니다.
}
function generateRandomNumbers() {
    var availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return Array.from({ length: 3 }, function () { return availableNumbers.splice(Math.floor(Math.random() * availableNumbers.length), 1)[0]; });
}
function startGame() {
    displayModal("\n      <p>\uAC8C\uC784\uC5D0\uC11C \uBA87 \uBC88\uB9CC\uC5D0 \uC131\uACF5\uD574\uC57C \uD558\uB098\uC694?</p>\n      <input type=\"number\" id=\"max-attempts\" placeholder=\"\uC22B\uC790\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694 (ex. 5)\" />\n      <button onclick=\"setMaxAttempts()\">\uD655\uC778</button>\n      <button onclick=\"closeModal()\">\uB2EB\uAE30</button>\n   ");
}
function setMaxAttempts() {
    var maxAttemptsInput = document.getElementById('max-attempts');
    var maxAttempts = parseInt(maxAttemptsInput.value, 10);
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
function guess() {
    if (!currentGame.maxAttempts) {
        alert('게임을 시작해주세요!');
        return;
    }
    var inputNumberValue = inputNumber.value;
    if (!validateGuess(inputNumberValue))
        return;
    var guessNumber = parseGuess(inputNumberValue);
    processGuess(guessNumber);
}
function validateGuess(inputNumberValue) {
    if (inputNumberValue.length !== 3) {
        displayModal('세 자리 숫자를 입력해주세요.');
        return false;
    }
    return true;
}
function parseGuess(inputNumberValue) {
    return inputNumberValue.split('').map(function (num) { return parseInt(num, 10); });
}
function processGuess(guessNumber) {
    var strikes = countStrikes(guessNumber);
    var balls = countBalls(guessNumber);
    currentGame.attempts += 1;
    displayResult(strikes, balls);
    if (strikes === 3) {
        endGame('사용자');
    }
    else if (currentGame.attempts >= currentGame.maxAttempts) {
        endGame('컴퓨터');
    }
}
function countStrikes(guessNumber) {
    return randomNumber.reduce(function (count, num, i) { return (num === guessNumber[i] ? count + 1 : count); }, 0);
}
function countBalls(guessNumber) {
    return randomNumber.reduce(function (count, num, i) {
        return guessNumber.indexOf(num) !== -1 && guessNumber.indexOf(num) !== i ? count + 1 : count;
    }, 0);
}
function displayResult(strikes, balls) {
    var resultMessage = '';
    if (strikes > 0 && balls > 0)
        resultMessage = "".concat(balls, "\uBCFC!! ").concat(strikes, "\uC2A4\uD2B8\uB77C\uC774\uD06C!!");
    else if (strikes > 0)
        resultMessage = "".concat(strikes, "\uC2A4\uD2B8\uB77C\uC774\uD06C!!");
    else if (balls > 0)
        resultMessage = "".concat(balls, "\uBCFC!!");
    else
        resultMessage = "\uD83D\uDE1B\uD83D\uDE1B\uD558\uB098\uB3C4 \uD83D\uDE1B\uD83D\uDE1B\uD83D\uDE1B \uC548 \uB9DE\uC9C0\uB871\uD83D\uDE1B\uD83D\uDE1B";
    displayModal("\n      <p>".concat(resultMessage, "</p>\n      <button onclick=\"closeModal()\">\uB2EB\uAE30</button>\n   "));
}
function endGame(winner) {
    currentGame.endTime = new Date().toLocaleString();
    currentGame.winner = winner;
    gameHistory.push(__assign({}, currentGame));
    // 승리 메시지를 모달 창에 표시
    displayModal("\n      <h3>".concat(winner, "\uAC00 \uC2B9\uB9AC\uD588\uC2B5\uB2C8\uB2E4! \uD83C\uDF89</h3>\n      <p>\uAC8C\uC784\uC744 \uB2E4\uC2DC \uC2DC\uC791\uD558\uB824\uBA74 \uD655\uC778 \uBC84\uD2BC\uC744 \uB204\uB974\uC138\uC694.</p>\n      <button onclick=\"showResetConfirmation()\">\uD655\uC778</button>\n   "));
}
function showResetConfirmation() {
    displayModal("\n      <p>\uAC8C\uC784\uC744 \uCD08\uAE30\uD654\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?</p>\n      <button onclick=\"resetAndCloseModal()\">\uC608</button>\n      <button onclick=\"closeModal()\">\uC544\uB2C8\uC694</button>\n   ");
}
function resetAndCloseModal() {
    resetGame(); // 게임 초기화
    closeModal(); // 모달 닫기
}
function showHistory() {
    if (gameHistory.length === 0) {
        alert('기록이 없습니다.');
        return;
    }
    var historyHtml = gameHistory
        .map(function (game) {
        return "<li>\n               <div>\uAC8C\uC784 ID: [".concat(game.id, "]</div>\n               <div>\uC2DC\uC791 \uC2DC\uAC04: ").concat(game.startTime, "</div>\n               <div>\uC885\uB8CC \uC2DC\uAC04: ").concat(game.endTime, "</div>\n               <div>\uC2DC\uB3C4 \uD69F\uC218: ").concat(game.attempts, "</div>\n               <div>\uC2B9\uB9AC\uC790: ").concat(game.winner, "</div>\n            </li>");
    })
        .join('');
    displayModal("<h3>\uAC8C\uC784 \uAE30\uB85D</h3><ul>".concat(historyHtml, "</ul>"));
}
function displayModal(content) {
    modalMessage.innerHTML = content;
    modal.style.display = 'flex';
}
function closeModal() {
    modal.style.display = 'none';
}
closeModalButton.onclick = closeModal;
