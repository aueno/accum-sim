import '../App.css';
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { isChartAtom } from "./Calc";

function Nav() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const location = useLocation();
    const currentPath = location.pathname;
    const [, setIsChart] = useAtom(isChartAtom);

    useEffect(() => {
        setIsChart(false);
    }, [currentPath]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
        <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
            <nav className="border-gray-200 bg-gray-50 shadow-md">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap">積立シミュレーション</span>
                    </Link>
                    <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-solid-bg" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                        <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                            <li>
                                <Link to="/accum-sim" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                                    トップ
                                </Link>
                            </li>
                            <li>
                                <Link to="/Inv" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                                    逆算シミュレーション
                                </Link>
                            </li>
                            <li>
                                <button onClick={toggleModal} className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700">
                                    利用規約
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* モーダル */}
            {isModalOpen && (
                <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">利用規約</h3>
                            <button onClick={toggleModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <p className="text-base leading-relaxed text-gray-500">
                                本サービスは，将来の資産成長を保証するものではありません．
                            </p>
                            <p className="text-base leading-relaxed text-gray-500">
                                本サービスを利用したことに起因するあらゆる損害について，当方では一切責任を負いかねます．
                                実際の運用及び投資判断は，ご自身の責任において行ってください．
                            </p>
                            <p className="text-base leading-relaxed text-gray-500">
                                本シミュレーション結果は，あくまで目安としてご利用ください．<br />
                                本シミュレーションは，税金を考慮していません．
                            </p>
                            <p className="text-base leading-relaxed text-gray-500">
                                「同意する」ボタン または「シミュレーション」ボタンをクリックすることで，
                                <br />上記の利用規約に同意いただいたものとみなします．
                            </p>
                        </div>
                        <div className="flex items-center p-4 border-t border-gray-200">
                            <button onClick={toggleModal} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                                同意する
                            </button>
                            <button onClick={toggleModal} type="button" className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                同意しない
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Nav;
