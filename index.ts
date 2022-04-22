/*Best Time to Buy and Sell Stock with Transaction Fee

You are given an array prices where prices[i] is the price of a given stock on the ith day, and an integer fee representing a transaction fee.
Find the maximum profit you can achieve. You may complete as many transactions as you like, but you need to pay the transaction fee for each transaction.
Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).
 
Example 1:15 + 23 [4, 1, 3,2,18,19,29]
Input: prices = [1,3,2,18,19,29], fee = 2
Output: 8
Explanation: The maximum profit can be achieved by:
- Buying at prices[0] = 1
- Selling at prices[3] = 8
- Buying at prices[4] = 4
- Selling at prices[5] = 9
The total profit is ((8 - 1) - 2) + ((9 - 4) - 2) = 8.*/

type Transaction = {
    buyDate: number;
    saleDate: number;
    buyPrice: number;
    salePrice: number;
    profit: number;
}

function findBestTxs(prices: number[], fee: number): number {
    let buyPrice = null;
    let buyDate = null;
    let txs: Transaction[] = [];
    for (let currentDate = 0; currentDate < prices.length; currentDate++) {
        const currentPrice = prices[currentDate];
        // if no buyerPrice or current price lower than buy price
        if (buyPrice === null || currentPrice < buyPrice) {
            buyPrice = currentPrice;
            buyDate = currentDate;
            continue; // continue as we have just bought
        }

        const nextDatePrice = prices[currentDate + 1];
        const profit = currentPrice - buyPrice - fee;
        const isLastDay = currentDate === (prices.length - 1);
        const willPriceDrop = nextDatePrice < currentPrice;
        const shouldSell = profit > 0 && (isLastDay || willPriceDrop);
        if (shouldSell) {
            const currentTx: Transaction = {
                buyDate,
                saleDate: currentDate,
                buyPrice,
                salePrice: currentPrice,
                profit,
            };

            // optimization for ineffective TXs
            const previousTx = txs[txs.length - 1];
            if (previousTx) {
                const differentInCost = currentTx.buyPrice - previousTx.buyPrice;
                // if profit of previous tx is less than the difference in cost of re-buy
                // then abort the previous transaction
                if (previousTx.profit <= differentInCost) {
                    txs.pop();
                    currentTx.buyPrice = previousTx.buyPrice;
                    currentTx.buyDate = previousTx.buyDate;
                    currentTx.profit += differentInCost;
                }
            }
            
            txs.push(currentTx);
            buyPrice = null;
        }
    }

    const totalProfit = txs.reduce((agg, tx) => agg + tx.profit, 0);
    console.log('-------------------------------------');
    console.log({ prices, fee, txs, totalProfit })
    console.log('-------------------------------------');
    return totalProfit;
}


function assert(result: number, expected: number) {
    if (result !== expected) {
        throw new Error(`expected ${expected} but received ${result}`)
    }
}

function testCases() {
    assert(findBestTxs([1, 3, 2, 10, 6, 18, 19, 29], 2), 28);
    assert(findBestTxs([1, 3, 2, 10, 6, 18, 19, 29], 9), 19);
    assert(findBestTxs([1, 3, 2, 10, 6, 5, 18, 29], 8), 20);
    assert(findBestTxs([1, 3, 2, 10, 6, 5, 18, 29], 7), 21);
    assert(findBestTxs([1, 3, 2, 10, 6, 5, 18, 29], 6), 22);
    assert(findBestTxs([1, 3, 2, 10, 6, 5, 18, 29], 5), 23);
    assert(findBestTxs([1, 3, 2, 10, 6, 5, 18, 29], 4), 25);
    assert(findBestTxs([1, 3, 2, 4, 3, 18, 19, 29], 2), 26);
    assert(findBestTxs([1, 3, 2, 10, 6, 18, 19, 29], 2), 28);
    assert(findBestTxs([1, 3, 2, 10, 6, 18, 19, 29, 3, 10], 2), 33);
    assert(findBestTxs([3, 1, 2, 10, 6, 18, 19, 29, 3, 10], 2), 33);
    assert(findBestTxs([3, 1, 2, 10, 6, 18, 19, 29, 3, 10], 4), 27);
    assert(findBestTxs([3, 1, 2, 10, 6, 18, 19, 29, 3, 35], 2), 58);
    assert(findBestTxs([3, 1, 2, 10, 6, 18, 19, 29, 3, 35, 6], 2), 58);
    assert(findBestTxs([3, 1, 2, 10, 6, 18, 19, 29, 3, 35, 40], 2), 63);
    assert(findBestTxs([4, 1, 3, 2, 18, 19, 29], 2), 26);
    assert(findBestTxs([1, 3, 2, 8, 4, 9], 2), 8);
}


testCases();
