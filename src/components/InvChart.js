import '../App.css';
import { useAtom } from 'jotai';
import { 
    InvaccumulationAtom,
 } from './InvCalc.js';

const InvChart = () => {
    //const [principal] = useAtom(principalAtom);
    //const [total] = useAtom(totalAtom);
    const [Invaccumulation] = useAtom(InvaccumulationAtom);

    return (
        <div>
            <form className="max-w-xs mx-auto">
                <div className="mb-5">
                    <label htmlFor="disabled-input" className="block text-sm font-medium text-gray-700">必要月次積立額（概算）</label>
                    <input 
                        type="text" 
                        id="disabled-input" 
                        aria-label="disabled input"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed"
                        value={Invaccumulation.toLocaleString() + ' 万円'}
                        disabled 
                    />
                </div>
            </form>
        </div>
    );
}

export { InvChart };
