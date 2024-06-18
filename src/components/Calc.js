import '../App.css';
import { useEffect, useState } from 'react';
import { atom, useAtom } from 'jotai';

export const accumulationAtom = atom(0);
export const interestRateAtom = atom(0);
export const periodAtom = atom(0);
export const principalAtom = atom(0);
export const totalAtom = atom(0);
export const principalCalcAtom = atom([]);
export const totalCalcAtom = atom([]);
export const isChartAtom = atom(false);

const Calc = () => {
    const [accumulation, setAccumulation] = useAtom(accumulationAtom);
    const [interestRate, setInterestRate] = useAtom(interestRateAtom);
    const [period, setPeriod] = useAtom(periodAtom);
    const annualAccumulation = accumulation * 12;
    const [, setPrincipal] = useAtom(principalAtom);
    const [, setTotal] = useAtom(totalAtom);
    const [, setIsChart] = useAtom(isChartAtom);
    const [, setPrincipalCalc] = useAtom(principalCalcAtom);
    const [, setTotalCalc] = useAtom(totalCalcAtom);

    // 元利計算
    useEffect(() => {
        setIsChart(false);
        let principal = annualAccumulation * period;
        let totalCalc = new Array();
        let principalCalc = new Array();
        principalCalc.push(0);
        totalCalc.push(accumulation);
        for (let i = 1; i <= period * 12; i++) {
            principalCalc.push(principalCalc[i - 1] + accumulation);
            totalCalc.push(totalCalc[i - 1] + accumulation + ((totalCalc[i - 1] - accumulation * 2) * (interestRate / 100 / 12)));
            setPrincipalCalc(principalCalc);
            setTotalCalc(totalCalc);
        }
        if (period === 0) {
            totalCalc[totalCalc.length - 1] = 0;
        }
        if (interestRate === 0) {
            totalCalc[totalCalc.length - 1] = principalCalc;
        }
        setPrincipal(principal);
        setTotal(Math.floor(totalCalc[totalCalc.length - 1]));
    }, [annualAccumulation, interestRate, period, setPrincipal, setTotal]);

    return (
        <div>
            <p>積立シミュレーション -&gt; トップ</p>
            <p className="space30">　</p>
            <form className="max-w-xs mx-auto">
                <div className="mb-5">
                    <label htmlFor="Accumulation" className="block mb-2 text-sm font-medium text-gray-900">
                        月間積立額（万円）ー＞ 年間積立額：{annualAccumulation.toLocaleString()}万円
                    </label>
                    <input
                        type="number"
                        id="Accumulation"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder={accumulation}
                        onChange={(e) => setAccumulation(Number(e.target.value))}
                        min="0"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="InterestRate" className="block mb-2 text-sm font-medium text-gray-900">年間想定利回り（％）</label>
                    <input
                        type="number"
                        id="InterestRate"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        min="0" step="0.1"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900">積立運用期間：{period} 年</label>
                    <div className="relative mb-6">
                        <label htmlFor="labels-range-input" className="sr-only">Labels range</label>
                        <input
                            id="labels-range-input"
                            type="range"
                            value={period}
                            min="0" max="60"
                            onChange={(e) => setPeriod(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">0</span>
                            <span className="text-sm text-gray-500">20</span>
                            <span className="text-sm text-gray-500">40</span>
                            <span className="text-sm text-gray-500">60</span>
                        </div>
                    </div>
                </div>
                <p className="space30">　</p>
                <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    onClick={() => setIsChart(true)}
                >
                    シミュレーション
                </button>
            </form>
            <p className="space30"></p>
        </div>
    );
};

export { Calc };
