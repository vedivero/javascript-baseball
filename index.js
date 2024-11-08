var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
document.addEventListener('DOMContentLoaded', function () {
    reset();
});
var randomNumber;
var inputNumber = document.getElementById('guess');
var modal = document.getElementById('modal');
var modalMessage = document.getElementById('modal-message');
var closeModalButton = document.getElementById('close-modal');
var reset = function () {
    inputNumber.value = '';
    // 랜덤 숫자 생성(1~9)
    var availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var firstRandomNum = availableNumbers.splice(Math.floor(Math.random() * 9), 1);
    var secondRandomNum = availableNumbers.splice(Math.floor(Math.random() * 8), 1);
    var thirdRandomNum = availableNumbers.splice(Math.floor(Math.random() * 7), 1);
    randomNumber = __spreadArray(__spreadArray(__spreadArray([], firstRandomNum, true), secondRandomNum, true), thirdRandomNum, true);
};
var guess = function () {
    var inputNumberValue = inputNumber.value;
    // Validation
    if (inputNumberValue.length !== 3) {
        showModal('세 자리 숫자를 입력해주세요.');
        return;
    }
    var guessNumber = inputNumberValue.split('').map(function (n) { return parseInt(n); });
    // 스트라이크 개수
    var strikeCnt = 0;
    randomNumber.forEach(function (r, i) {
        if (r === guessNumber[i]) {
            strikeCnt++;
        }
    });
    // 볼 개수
    var ballCnt = 0;
    randomNumber.forEach(function (r, i) {
        var guessIdx = guessNumber.indexOf(r);
        if (guessIdx !== -1 && guessIdx !== i) {
            ballCnt++;
        }
    });
    // 결과 메세지
    var result = '';
    if (strikeCnt > 0 && ballCnt > 0)
        result = "".concat(strikeCnt, "\uC2A4\uD2B8\uB77C\uC774\uD06C!! ").concat(ballCnt, "\uBCFC!!");
    else if (strikeCnt > 0 && ballCnt === 0)
        result = "".concat(strikeCnt, "\uC2A4\uD2B8\uB77C\uC774\uD06C!!");
    else if (strikeCnt === 0 && ballCnt > 0)
        result = "".concat(ballCnt, "\uBCFC!!");
    else
        result = "\uD83D\uDE1B\uD83D\uDE1B\uD558\uB098\uB3C4\uD83D\uDE1B\uD83D\uDE1B\uD83D\uDE1B \uC548 \uB9DE\uC558\uC9C0\uB871\uD83D\uDE1B\uD83D\uDE1B";
    showModal(result);
};
// 모달 표시 함수
var showModal = function (message) {
    modalMessage.innerText = message;
    modal.style.display = 'flex'; // 모달을 화면에 표시
};
// 모달 닫기 이벤트
closeModalButton.onclick = function () {
    modal.style.display = 'none';
};
// 모달 외부 클릭 시 모달 닫기
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
