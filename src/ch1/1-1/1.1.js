/**
 * Q. 다양한 연극을 외주로 받아서 공연하는 극단이 있다. 공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용을 책정한다. 현재 이 극단은 두 가지 장르, 비극과 희극만 공연한다.
 * 그리고 공연료와 별개로 포인트(volume credit)를 지급해서 다음번 의뢰 시 공연료를 할인 받을 수 있다. 일종의 충성도 프로그램인 셈이다.
 * 극단은 공연할 연극 정보를 JSON파일에 저장한다.
 */

const invoice = require('./invoices.json');
const plays = require('./plays.json');

function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays);

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
}

function renderPlainText(data, plays) {
    let result = `청구 내역 (고객명: ${data.customer}) \n`;
    for (let perf of data.performances) {
        result += `${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    }
    result += `총액: ${usd(totalAmount())}\n`;
    result += `적립 포인트: ${totalVolumeCredits()}점 \n`;
    return result;

    function totalAmount() {
        let result = 0;
        for (let perf of data.performances) {
            result += amountFor(perf);
        }
        return result;
    }

    function totalVolumeCredits() {
        let result = 0;
        for (let perf of data.performances) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }

    function usd(aNumber) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimunFractionDigits: 2,
        }).format(aNumber / 100);
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ('comedy' === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function amountFor(aPerformance) {
        let result = 0;
        switch (aPerformance.play.type) {
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
                throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
        }
        return result;
    }
}

console.log(statement(invoice, plays));
