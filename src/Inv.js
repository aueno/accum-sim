import { useAtom } from 'jotai';
import { isInvChartAtom as InvchartVisibilityAtom } from './components/InvCalc.js';
import { InvCalc } from './components/InvCalc.js';
import { InvChart } from './components/InvChart.js';
import { InvGraph } from './components/InvGraph.tsx';
import { useState } from 'react';

function Inv() {
    const [InvchartVisible] = useAtom(InvchartVisibilityAtom);
    
    return (
        <div className="flex-grow">
            
            <InvCalc />
            <p className="space30">　</p>
            {InvchartVisible && <InvChart />}
            {InvchartVisible && <InvGraph />}
        </div>
    );
}

export default Inv;
