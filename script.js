let web3;
let contract;
const contractAddress = "0xdE0fCEC93745B513A692B912aF4E0c542928E828"; // Replace with your deployed contract address
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AddVote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "RemoveVote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "startedBy",
        type: "address",
      },
    ],
    name: "StartVoting",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "stoppedBy",
        type: "address",
      },
    ],
    name: "StopVoting",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "addVote",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "getTotalVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isVoting",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startVoting",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stopVoting",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "totalVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "votes",
    outputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const result = await contract.methods
  .getTotalVotes(candidateAddress)
  .call({ gas: 300000 }); // Adjust the gas limit if necessary

async function init() {
  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      contract = new web3.eth.Contract(contractABI, contractAddress);
      console.log("Connected to the contract");
    } catch (error) {
      console.error("User denied account access: ", error);
    }
  } else {
    alert("Please install MetaMask to use this DApp.");
  }
}

// Functions for starting/stopping voting, adding votes, and getting total votes
async function startVoting() {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .startVoting()
      .send({ from: accounts[0] });
    document.getElementById("votingStatus").textContent = "Voting started";
  } catch (error) {
    console.error("Error starting voting:", error.message); // Log the error message
    alert("Error starting voting: " + error.message); // Show error to user
  }
}

async function stopVoting() {
  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.stopVoting().send({ from: accounts[0] });
    document.getElementById("votingStatus").textContent = "Voting stopped";
  } catch (error) {
    console.error("Error stopping voting:", error.message);
    alert("Error stopping voting: " + error.message);
  }
}

async function addVote() {
  const receiverAddress = prompt("Enter the address you want to vote for:");
  const accounts = await web3.eth.getAccounts();
  try {
    const result = await contract.methods
      .addVote(receiverAddress)
      .send({ from: accounts[0] });
    document.getElementById("result").textContent = "Vote added successfully!";
  } catch (error) {
    console.error("Error adding vote:", error.message);
    alert("Error adding vote: " + error.message);
  }
}

async function getTotalVotes() {
  const candidateAddress = prompt("Enter the candidate address:");
  try {
    console.log("Fetching total votes for:", candidateAddress);
    const result = await contract.methods
      .getTotalVotes(candidateAddress)
      .call();
    console.log("Total Votes:", result);
    document.getElementById("result").textContent = "Total Votes: " + result;
  } catch (error) {
    console.error("Error getting total votes:", error.message);
    document.getElementById("result").textContent =
      "Error getting total votes: " + error.message;
  }
}

// Add event listeners and initialize the app
document.addEventListener("DOMContentLoaded", async () => {
  await init(); // Initialize Web3 and contract
  document
    .getElementById("startVotingButton")
    .addEventListener("click", startVoting);
  document
    .getElementById("stopVotingButton")
    .addEventListener("click", stopVoting);
  document.getElementById("addVoteButton").addEventListener("click", addVote);
  document
    .getElementById("totalVotesButton")
    .addEventListener("click", getTotalVotes);
});
