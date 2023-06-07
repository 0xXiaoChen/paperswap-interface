import React from "react";
import PoolList from "./PoolList";
import ethicon from "../../assets/images/pools/eth.png";
import scrollIcon from "../../assets/images/scroll.png";
import PoolList_Header from "./PoolList_Header";

const mockData = [
  {
    tokenAIcon: ethicon,
    tokenBIcon: ethicon,
    statusIcon: scrollIcon,
    tokenAName: "tPaper",
    tokenBName: "oPaper",
    status: "Status",
    liquidity: "123,123,123",
    apr: "22.9%",
  },
  // {
  //   tokenAIcon: ethicon,
  //   tokenBIcon: ethicon,
  //   statusIcon: scrollIcon,
  //   tokenAName: "BTC",
  //   tokenBName: "USDT",
  //   status: "Status",
  //   liquidity: "234,234,234",
  //   apr: "33.3%",
  // },
  // {
  //   tokenAIcon: ethicon,
  //   tokenBIcon: ethicon,
  //   statusIcon: scrollIcon,
  //   tokenAName: "BTC",
  //   tokenBName: "USDT",
  //   status: "Status",
  //   liquidity: "234,234,234",
  //   apr: "33.3%",
  // },
  // {
  //   tokenAIcon: ethicon,
  //   tokenBIcon: ethicon,
  //   statusIcon: scrollIcon,
  //   tokenAName: "BTC",
  //   tokenBName: "USDT",
  //   status: "Status",
  //   liquidity: "234,234,234",
  //   apr: "33.3%",
  // },
];

const PoolLists = () => {
  return (
    <div id="Switch-body" className="h-full justify-center items-center flex">
      <div className="flex flex-col">
        <div className=" text-3xl px-4">All Pools</div>
        <PoolList_Header />
        {mockData.map((data, index) => (
          <PoolList
            key={index}
            tokenAIcon={data.tokenAIcon}
            tokenBIcon={data.tokenBIcon}
            statusIcon={data.statusIcon}
            tokenAName={data.tokenAName}
            tokenBName={data.tokenBName}
            status={data.status}
            liquidity={data.liquidity}
            apr={data.apr}
          />
        ))}
      </div>
    </div>
  );
};

export default PoolLists;
