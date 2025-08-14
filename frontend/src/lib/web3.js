import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const chainHex = import.meta.env.VITE_CHAIN_ID_HEX || "0xaa36a7";
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: chainHex }]
  }).catch(async (e) => {
    if (e.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: chainHex,
          chainName: "Sepolia",
          nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://sepolia.infura.io/v3/"],
// users should put their own in MM if needed; this is just to add chain
          blockExplorerUrls: ["https://sepolia.etherscan.io"]
        }]
      });
    } else {
      throw e;
    }
  });
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return accounts[0];
}

export async function sendPlatformFee(toAddress, amountEth) {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const tx = await signer.sendTransaction({
    to: toAddress,
    value: ethers.parseEther(String(amountEth))
  });
  const receipt = await tx.wait();
  return { txHash: tx.hash, from: await signer.getAddress(), receipt };
}
