import '../App.css';
import { useAtom } from 'jotai';
import { principalAtom, totalAtom } from './Calc.js';

const Chart = () => {
    const [principal] = useAtom(principalAtom);
    const [total] = useAtom(totalAtom);

    return (
        <div>
            <form className="max-w-xs mx-auto">
                <div className="mb-5">
                    <label htmlFor="disabled-input" className="block text-sm font-medium text-gray-700">投資元本</label>
                    <input 
                        type="text" 
                        id="disabled-input" 
                        aria-label="disabled input"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed"
                        value={principal.toLocaleString() + ' 万円'}
                        disabled 
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="disabled-input-2" className="block text-sm font-medium text-gray-700">運用資産総額</label>
                    <input 
                        type="text" 
                        id="disabled-input-2" 
                        aria-label="disabled input 2"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed"
                        value={total.toLocaleString() + ' 万円'}
                        disabled 
                        readOnly 
                    />
                </div>
            </form>
        </div>
    );
}

export { Chart };
