/**
 * Q. 다양한 연극을 외주로 받아서 공연하는 극단이 있다. 공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용을 책정한다. 현재 이 극단은 두 가지 장르, 비극과 희극만 공연한다.
 * 그리고 공연료와 별개로 포인트(volume credit)를 지급해서 다음번 의뢰 시 공연료를 할인 받을 수 있다. 일종의 충성도 프로그램인 셈이다.
 * 극단은 공연할 연극 정보를 JSON파일에 저장한다.
 */

const invoice = require('./invoices.json');
const plays = require('./plays.json');

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명: ${invoice.customer}) \n`;
    const format = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimunFractionDigits: 2,
    }).format;
    for (let perf of invoice.performances) {
        //포인트를 적립한다.
        volumeCredits += Math.max(perf.audience - 30, 0);
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if ('comedy' === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

        //청구 내역을 출력한다.
        result += `${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n`;
        totalAmount += amountFor(perf);
    }
    result += `총액: ${format(totalAmount / 100)}\n`;
    result += `적립 포인트: ${volumeCredits}점 \n`;
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
        case 'tragedy': //비극
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case 'comedy':
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`알 수 없는 장르: ${playFor(aPerformance)}`);
    }
    return result;
}

console.log(statement(invoice, plays));
