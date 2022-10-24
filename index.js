import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const fundBtn = document.getElementById("fundBtn");
const getBalanceBtn = document.getElementById("balanceBtn");
const inputEth = document.getElementById("ethAmount");
const withdrawBtn = document.getElementById("withdrawBtn");

connectBtn.onclick = connect;
fundBtn.onclick = fund;
getBalanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;

async function connect() {
	if (typeof window.ethereum !== "undefined") {
		await window.ethereum.request({ method: "eth_requestAccounts" });
		connectBtn.innerHTML = "Connected";
	} else connectBtn.innerHTML = "Please Install Metamask";
}
async function withdraw() {
	if (typeof window.ethereum !== "undefined") {
		console.log("Withdrawing...");
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, abi, signer);

		try {
			const transactionResponse = await contract.withdraw();
			await listenForTransactionMine(transactionResponse, provider);
			console.log("Withdrawn!");
		} catch (err) {
			console.log(err);
		}
	}
}

async function getBalance() {
	if (typeof window.ethereum != "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const balance = await provider.getBalance(contractAddress);
		console.log(ethers.utils.formatEther(balance));
	}
}
async function fund() {
	const ethAmount = inputEth.value;
	console.log(`Funding with ${ethAmount}... `);
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, abi, signer);

		try {
			const transactionResponse = await contract.fund({
				value: ethers.utils.parseEther(ethAmount),
			});
			await listenForTransactionMine(transactionResponse, provider);
			console.log("Done!");
		} catch (err) {
			console.log(err);
		}
	}
}

function listenForTransactionMine(transactionResponse, provider) {
	console.log(`Mining ${transactionResponse.hash}`);
	return new Promise((resolve, reject) => {
		provider.once(transactionResponse.hash, (transactionReceipt) => {
			console.log(
				`Completed with ${transactionReceipt.confirmations} confirmations`
			);
			resolve();
		});
	});
}

// fund function

// withdraw
