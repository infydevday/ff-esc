// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;
library Math {
    function ceil(uint a, uint m) public pure returns (uint) {
        return ((a + m - 1) / m) * m;
    }
    function max(uint a, uint b) public pure returns (uint) {
        uint maxValue;
        if (a > b) {
            maxValue = a;
        } else {
            maxValue = b;
        }
        return maxValue;
    }
    function calculatePayout(uint x) external pure returns (uint, uint, uint) {
        uint payoutThird = max(1, ceil(x * 10 / 100, 1));
        uint payoutSecond = max(1, ceil(x * 30 / 100, 1));
        uint payoutFirst = x - payoutThird - payoutSecond;
        return (payoutFirst, payoutSecond, payoutThird);
    }
}