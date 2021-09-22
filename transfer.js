Moralis.initialize("zUAslaQCPxdWxFtnIAPVbkc9LUNAjOoN8eMCKgTw");
Moralis.serverURL = "https://suwkhta9idij.usemoralis.com:2053/server";
const CONTRACT_ADDRESS = "0x57bb84aB1624c444Fc835540b6fF7414400E4ef9";

async function init() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
}

async function transfer() {
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value
    let amount = parseInt(document.getElementById("amount_input").value)
    
    const options = {
        type: "erc1155",  
        receiver: address,
        contract_address: CONTRACT_ADDRESS,
        token_id: tokenId,
        amount: amount
    }

    let result = await Moralis.transfer(options)
    console.log(result)
}

document.getElementById("submit_transfer").onclick = transfer;

init();