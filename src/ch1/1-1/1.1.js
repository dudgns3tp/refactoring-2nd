/**
 * Q. 다양한 연극을 외주로 받아서 공연하는 극단이 있다. 공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용을 책정한다. 현재 이 극단은 두 가지 장르, 비극과 희극만 공연한다.
 * 그리고 공연료와 별개로 포인트(volume credit)를 지급해서 다음번 의뢰 시 공연료를 할인 받을 수 있다. 일종의 충성도 프로그램인 셈이다.
 * 극단은 공연할 연극 정보를 JSON파일에 저장한다.
 */

const invoice = require('./invoices.json');
const plays = require('./plays.json');
const createStatementData = require('./createStatementData');

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = `청구 내역 (고객명: ${data.customer}) \n`;
    for (let perf of data.performances) {
        result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
    }
    result += `총액: ${usd(data.totalAmount)}\n`;
    result += `적립 포인트: ${data.totalVolumeCredits}점 \n`;
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimunFractionDigits: 2,
        }).format(aNumber / 100);
    }
}

function htmlStatement(invoce, plays) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
    let result = `<h1> 청구 내역 (고객명: ${data.customer}) </h1> \n`;
    result += '<table>\n';
    result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>';
    for (let perf of data.performances) {
        result += `<tr><td>${perf.play.name}</tr><td>(${perf.audience})석</td>`;
        result += `<td> ${usd(perf.amount)}</td></tr>\n`;
    }
    result += '</table>\n';
    result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>적립 포인트: <em> ${data.totalVolumeCredits}점</em></p> \n`;
    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimunFractionDigits: 2,
        }).format(aNumber / 100);
    }
}

console.log(htmlStatement(invoice, plays));
