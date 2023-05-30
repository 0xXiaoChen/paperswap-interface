import React, { useState } from "react";
import TokenListModal from "./TokenlistModal";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  tPaper_address,
  oPaper_address,
  amm_address,
} from "../../../contracts/addresses";
import { amm_abi, tPaper_abi } from "../../../contracts/abis";
import { ethers } from "ethers";

export default function SwapCard_Content() {
  const [hash, setHash] = useState("");
  const [inputValue, setInputValue] = useState(1781.84);
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const [selectedTokenlist, setSelectedTokenlist] = useState(0); // 0 input of tokenlist,1 out of tokenlist
  const [selectedCoin_input, setSelectedCoin_input] = useState("ETH");
  const [selectedCoin_out, setSelectedCoin_out] = useState("USDC");

  const tokenList = [{ tokenName: "ETH", contract: "0x", iconUrl: "" }];

  // 获取已授权的tPaper数量
  const getTokenApproved = useContractRead({
    address: tPaper_address,
    abi: tPaper_abi,
    functionName: "allowance",
    args: [address, amm_address],
    watch: true,
    onSuccess(data: any) {
      const amount = ethers.utils.formatUnits(data, "ether");
      console.log(amount);
    },
  });

  // pool swap config
  const { config: poolSwapConfig } = usePrepareContractWrite({
    address: amm_address,
    abi: amm_abi,
    functionName: "swap",
    args: [tPaper_address, oPaper_address, ethers.utils.parseEther("1")],
  });
  // pool swap
  const { data: swapData, writeAsync: swapWrite } = useContractWrite({
    ...poolSwapConfig,
    onError(error: any) {
      console.log("Error", error);
    },
  });

  function openModal_input() {
    setSelectedTokenlist(0);
    setIsOpen(true);
  }

  function openModal_out() {
    setSelectedTokenlist(1);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const changeSelectedTokenlist = (tokenListType: number) => {
    setSelectedTokenlist(tokenListType);
  };

  const swapClick = () => {
    swapWrite?.()
      .then((res) => {
        setHash(res.hash);
      })
      .catch((err) => {
        // setIsLoading(false);
      });
  };
  return (
    <div className="flex-col mt-8">
      {/* inputcoin */}
      <div className=" bg-white  bg-opacity-50 rounded-xl p-4 relative">
        <div className="flex-col">
          <div className="flex justify-between">
            <div className="text-2xl">
              <input
                type="text"
                placeholder="0.0"
                className="bg-transparent border-none text-3xl outline-none "
              />
            </div>
            {/* coinlist */}
            <div
              className="flex bg-white rounded-full shadow-lg items-center px-3 hover:cursor-pointer hover:bg-opacity-0"
              onClick={openModal_input}
            >
              <div className="w-[24px] h-[24px]">
                <img
                  alt=""
                  src="data:image/png;base64,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"
                />
              </div>
              <div className="ml-2">{selectedCoin_input}</div>
              <div className="ml-2">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 8 8"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rotate-0"
                >
                  <path
                    fill="#5155a6"
                    fill-rule="nonzero"
                    d="M4.036 6.571.5 3.036l.786-.786L4.037 5l2.748-2.75.786.786z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          {/* Balance */}
          <div className="flex justify-between mt-3 text-gray-600 text-sm">
            <div>
              {"$" +
                inputValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })}
            </div>
            <div className="">Balance: 0.0</div>
          </div>
          {/* 百分比选择 */}
          <div className="flex justify-start gap-7 mt-2 text-sm">
            <div className="w-1/5 border-slate-200 border  rounded-xl text-center py-1 hover:cursor-pointer hover:border-slate-400 ripple-btn active:border-slate-600">
              25%
            </div>
            <div className="w-1/5 border-slate-200 border  rounded-xl text-center py-1 hover:cursor-pointer hover:border-slate-400 ripple-btn active:border-slate-600">
              50%
            </div>
            <div className="w-1/5 border-slate-200 border  rounded-xl text-center py-1 hover:cursor-pointer hover:border-slate-400 ripple-btn active:border-slate-600">
              75%
            </div>
            <div className="w-1/5 border-slate-200 border  rounded-xl text-center py-1 hover:cursor-pointer hover:border-slate-400 ripple-btn active:border-slate-600">
              100%
            </div>
          </div>
        </div>
      </div>
      {/* icon */}
      <div className="absolute inset-x-0 mx-auto top-1/2 -mt-5 w-8 h-8 bg-white flex justify-center items-center rounded-full">
        <div className="p-0 bg-gray-500 bg-opacity-0 rounded-full">
          <svg
            className="swap_icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6224"
            width="24"
            height="24"
          >
            <path
              d="M554.666667 712.533333V106.666667h-85.333334v601.6l-132.266666-132.266667L277.333333 640l234.666667 234.666667 234.666667-234.666667-59.733334-59.733333-132.266666 132.266666z"
              fill="#bfbfbf"
              p-id="6225"
            ></path>
          </svg>
        </div>
      </div>
      {/* inputcoin */}
      <div className=" bg-white  bg-opacity-50 rounded-xl p-4 relative mt-4">
        <div className="flex-col">
          <div className="flex justify-between">
            <div className="text-2xl">
              <input
                type="text"
                placeholder="0.0"
                className="bg-transparent border-none text-3xl outline-none "
              />
            </div>
            {/* coinlist */}
            <div
              className="flex bg-white rounded-full shadow-lg items-center px-3 hover:cursor-pointer hover:bg-opacity-0"
              onClick={openModal_out}
            >
              <div className="w-[24px] h-[24px]">
                <img
                  alt=""
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAABCFBMVEUAAAAndcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcr////8/f74+/5rodsvesxcmNcqd8s8g9AseMtWk9bz9/zP4fRChtHs8/pGidIzfc3n7/mGsuK81O+wzexknNlPj9RLjNM3gM6kxelxpNzb6Pfv9fvG2/Gfwujh7PjT4/Snx+pgmdiMtuPX5vV+rOC10O2Br+CXvOaSuuW61O7D2fBon9qryeubwOd4qd50p93K3vNRkNXA1/CWLHQbAAAAJHRSTlMA+/Gm5ttTLBoKQiMS7M25squXlX59azz0zsfEnouJcF43Mg1CVQHMAAAM7UlEQVR42tTaeVvaQBAG8E24vW97X75LQMINVgRExQPP1gu//zepj+3TNls2MwsJ0N//om92Z2eyKMKR3Py0vhpZXIjZtoVnlm3HFhYjq+ufNpPi/zAbX1uOWfBhxZbX4rNiiqVm1hdtMNmL6zMpMYU+r72xYMh6s/ZZTJNUPDKPIc1H4lOyMM8pXmEkr6Yhy5cVGwGwV76ICdraWEBgFja2xGQk39sIlP1+Ej0mEbEQOCuSEOOVWEJIlsYZJRFBiMa2KnMrFkJlrcyJMfhoI3T2RxG2mRjGIjYjwjT3DmPzLsT9FY9ijKJxEY65ZYzZciiLMhPF2EVDqJQPmIgPIljJt5iQt0kRoM0oJia6KQKzYWGCrA0RkFVM2KoIQmoJE7eUCqDMX2MKvB655GdjmAqx2RFzRDEloiMlScxjaswnxpYjd3rTOamBJX/9eLKdgyKkJLNGOQrtinx2CJYj+ax+1YSB+dnw66N22ZG/lMHgFuVPxw95KIKuk2QMXNVbR/7WAMO2/K1y7YIrlhTGUuz+UbiRf8swg/zhHLGjvDbvjEvg6T9JOXQQ8yhLIc1X5Qup4AZROGdZhDF3bYAje+XIoYOo6vtgMZqFNy0wfK9LOUoQ1WEZDNamYEtGQWtdyIFO+UFUzmUOtGhScL3lLEdFDlYFQ18O9lgG7W2A9wz5ttTogqUjBytmgruRmAGp2pMaTgEs22mp0c6D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"
                />
              </div>
              <div className="ml-2">{selectedCoin_out}</div>
              <div className="ml-2">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 8 8"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rotate-0"
                >
                  <path
                    fill="#5155a6"
                    fill-rule="nonzero"
                    d="M4.036 6.571.5 3.036l.786-.786L4.037 5l2.748-2.75.786.786z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          {/* Balance */}
          <div className="flex justify-between mt-3 text-gray-600 text-sm">
            <div>
              {"$" +
                inputValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })}
            </div>
            <div className="">Balance: 0.0</div>
          </div>
        </div>
      </div>
      {/* 汇率 */}
      <div className="flex bg-white  bg-opacity-50 rounded-xl px-4 py-2 relative mt-5 text-sm items-center">
        {/* inputcoin_icon */}
        <div className="w-[17px] h-[17px]">
          <img
            alt=""
            src="data:image/png;base64,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"
          />
        </div>
        <div className="ml-1">1 ETH = </div>
        {/* outcoin_icon */}
        <div className="w-[17px] h-[17px] ml-2">
          <img
            alt=""
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAABCFBMVEUAAAAndcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcondcr////8/f74+/5rodsvesxcmNcqd8s8g9AseMtWk9bz9/zP4fRChtHs8/pGidIzfc3n7/mGsuK81O+wzexknNlPj9RLjNM3gM6kxelxpNzb6Pfv9fvG2/Gfwujh7PjT4/Snx+pgmdiMtuPX5vV+rOC10O2Br+CXvOaSuuW61O7D2fBon9qryeubwOd4qd50p93K3vNRkNXA1/CWLHQbAAAAJHRSTlMA+/Gm5ttTLBoKQiMS7M25squXlX59azz0zsfEnouJcF43Mg1CVQHMAAAM7UlEQVR42tTaeVvaQBAG8E24vW97X75LQMINVgRExQPP1gu//zepj+3TNls2MwsJ0N//om92Z2eyKMKR3Py0vhpZXIjZtoVnlm3HFhYjq+ufNpPi/zAbX1uOWfBhxZbX4rNiiqVm1hdtMNmL6zMpMYU+r72xYMh6s/ZZTJNUPDKPIc1H4lOyMM8pXmEkr6Yhy5cVGwGwV76ICdraWEBgFja2xGQk39sIlP1+Ej0mEbEQOCuSEOOVWEJIlsYZJRFBiMa2KnMrFkJlrcyJMfhoI3T2RxG2mRjGIjYjwjT3DmPzLsT9FY9ijKJxEY65ZYzZciiLMhPF2EVDqJQPmIgPIljJt5iQt0kRoM0oJia6KQKzYWGCrA0RkFVM2KoIQmoJE7eUCqDMX2MKvB655GdjmAqx2RFzRDEloiMlScxjaswnxpYjd3rTOamBJX/9eLKdgyKkJLNGOQrtinx2CJYj+ax+1YSB+dnw66N22ZG/lMHgFuVPxw95KIKuk2QMXNVbR/7WAMO2/K1y7YIrlhTGUuz+UbiRf8swg/zhHLGjvDbvjEvg6T9JOXQQ8yhLIc1X5Qup4AZROGdZhDF3bYAje+XIoYOo6vtgMZqFNy0wfK9LOUoQ1WEZDNamYEtGQWtdyIFO+UFUzmUOtGhScL3lLEdFDlYFQ18O9lgG7W2A9wz5ttTogqUjBytmgruRmAGp2pMaTgEs22mp0c6D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"
          />
        </div>
        <div className="ml-1">
          {inputValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          }) + " USDC"}{" "}
        </div>
      </div>
      {/* button */}
      <button
        className=" text-center w-full mt-5 bg-[#FEF08A] py-2 rounded-xl ripple-btn"
        onClick={swapClick}
      >
        Swap
      </button>
      {/* 代币列表modal */}
      <TokenListModal
        isOpen={isOpen}
        closeModal={closeModal}
        selectedTokenlist={selectedTokenlist}
        selectedCoin_input={selectedCoin_input}
        setSelectedCoin_input={setSelectedCoin_input}
        selectedCoin_out={selectedCoin_out}
        setSelectedCoin_out={setSelectedCoin_out}
      />
    </div>
  );
}
