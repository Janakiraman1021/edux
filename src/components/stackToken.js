import { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

const stakingTokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

const stakeDappABI = [
  "function stake(uint256 amount)",
  "function claimReward()",
];

const STAKING_TOKEN_ADDRESS = "0x2b135a08c50e8871C6a8932B74d8cD0325e44D9b";
const STAKE_DAPP_ADDRESS = "0x8755B5bFfC86dFabB8B15148074d05C411Aad1b6";

const StakeToken = ({ onBalanceUpdate }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [stakingToken, setStakingToken] = useState(null);
  const [stakeDapp, setStakeDapp] = useState(null);
  const [amountToApprove, setAmountToApprove] = useState("");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      setError(null);
      const ethProvider = await detectEthereumProvider({ mustBeMetaMask: true });
      if (!ethProvider) {
        setError("MetaMask not detected. Please install MetaMask.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethProvider);
      let accounts;
      try {
        accounts = await provider.send("eth_requestAccounts", []);
      } catch (err) {
        setError("Failed to connect to MetaMask. Please unlock your wallet.");
        return;
      }

      const signer = provider.getSigner();
      const userAddress = accounts[0];

      setProvider(provider);
      setSigner(signer);
      setAccount(userAddress);

      const stakingTokenContract = new ethers.Contract(
        STAKING_TOKEN_ADDRESS,
        stakingTokenABI,
        signer
      );
      setStakingToken(stakingTokenContract);

      const stakeDappContract = new ethers.Contract(
        STAKE_DAPP_ADDRESS,
        stakeDappABI,
        signer
      );
      setStakeDapp(stakeDappContract);

      fetchBalance(userAddress, stakingTokenContract);
      fetchAllowance(userAddress, stakingTokenContract);
    } catch (err) {
      setError("Unexpected error during wallet connection.");
    }
  };

  const fetchBalance = async (userAccount, stakingTokenContract) => {
    try {
      if (stakingTokenContract && userAccount) {
        const balance = await stakingTokenContract.balanceOf(userAccount);
        setTokenBalance(ethers.utils.formatEther(balance));
        if (onBalanceUpdate) {
          onBalanceUpdate(ethers.utils.formatEther(balance));
        }
      }
    } catch (err) {
      setError("Failed to fetch balance.");
    }
  };

  const fetchAllowance = async (userAccount, stakingTokenContract) => {
    try {
      if (stakingTokenContract && userAccount) {
        const allowance = await stakingTokenContract.allowance(
          userAccount,
          STAKE_DAPP_ADDRESS
        );
        setAllowance(ethers.utils.formatEther(allowance));
      }
    } catch (err) {
      setError("Failed to fetch allowance.");
    }
  };

  const handleApprove = async () => {
    if (!stakingToken || !account || !amountToApprove) {
      setError("Enter an amount to approve and connect wallet first!");
      return;
    }
    try {
      setError(null);
      const tx = await stakingToken.approve(
        STAKE_DAPP_ADDRESS,
        ethers.utils.parseEther(amountToApprove)
      );
      await tx.wait();
      fetchBalance(account, stakingToken);
      fetchAllowance(account, stakingToken);
    } catch (err) {
      setError("Approval failed.");
    }
  };

  const handleStake = async () => {
    if (!stakeDapp || !account || !amountToApprove) {
      setError("Enter an amount to stake and connect wallet first!");
      return;
    }
    try {
      setError(null);
      const tx = await stakeDapp.stake(ethers.utils.parseEther(amountToApprove));
      await tx.wait();
      fetchBalance(account, stakingToken);
      fetchAllowance(account, stakingToken);
    } catch (err) {
      setError("Staking failed.");
    }
  };

  const handleClaimReward = async () => {
    if (!stakeDapp || !account) {
      setError("Connect wallet first!");
      return;
    }
    try {
      setError(null);
      const tx = await stakeDapp.claimReward();
      await tx.wait();
      fetchBalance(account, stakingToken);
    } catch (err) {
      setError("Claiming rewards failed.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Stake Token</h2>
      {error && <p className="text-red-500">{error}</p>}
      {!account ? (
        <button
          className="bg-blue-600 px-6 py-2 rounded-lg text-white hover:bg-blue-500 transition"
          onClick={connectWallet}
        >
          Connect MetaMask
        </button>
      ) : (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
          <p className="mb-2">Account: {account}</p>
          <p className="mb-2">Balance: {tokenBalance} STK</p>
          <p className="mb-4">Allowance: {allowance} STK</p>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-gray-700 text-white outline-none mb-2"
            placeholder="Amount to approve/stake"
            value={amountToApprove}
            onChange={(e) => setAmountToApprove(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500 transition w-full"
              onClick={handleApprove}
            >
              Approve
            </button>
            <button
              className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-500 transition w-full"
              onClick={handleStake}
            >
              Stake
            </button>
          </div>
          <button
            className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 transition w-full mt-3"
            onClick={handleClaimReward}
          >
            Claim Rewards
          </button>
        </div>
      )}
    </div>
  );
};

export default StakeToken;
