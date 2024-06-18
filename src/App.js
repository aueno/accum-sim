import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isChartAtom as chartVisibilityAtom } from './components/Calc.js';
import { Calc } from './components/Calc.js';
import { Chart } from './components/Chart.js';
import { Graph } from './components/Graph.tsx';
import Nav from './components/Nav.js';
import Inv from './Inv.js';

function App() {
  const [chartVisible] = useAtom(chartVisibilityAtom);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-grow p-4">
          <Routes>
            <Route path='/' element={<Calc />} />
            <Route path='/Inv' element={<Inv />} />
          </Routes>
          {chartVisible && <Chart />}
          {chartVisible && <Graph />}
        </div>
        <footer className="text-center w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6">
          <span className="text-sm text-gray-500 sm:text-center">© 2024 <a href="https://aueno.github.io" className="hover:underline">aueno</a>. All Rights Reserved.</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
