Moralis.initialize("zUAslaQCPxdWxFtnIAPVbkc9LUNAjOoN8eMCKgTw");
Moralis.serverURL = "https://suwkhta9idij.usemoralis.com:2053/server";
// const CONTRACT_ADDRESS = "0xfa59f3270bf5e9c6863f778bde7680e55915ffe7";
const CONTRACT_ADDRESS = "0x57bb84aB1624c444Fc835540b6fF7414400E4ef9";

function fetchNFTMetadata(NFTs) {
    console.log(NFTs)
    let promises = [];
    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;
        //Call moralis cloud function -> static json file
        promises.push(fetch("https://suwkhta9idij.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=zUAslaQCPxdWxFtnIAPVbkc9LUNAjOoN8eMCKgTw&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = { address: CONTRACT_ADDRESS, token_id : id, chain: "rinkeby" };
            return Moralis.Web3API.token.getTokenIdOwners(options)
        })
        .then( (res) => {
            nft.owners = [];
            res.result.forEach(element => {
                nft.owners.push(element.ownerOf);
            });

            return nft;
        }))
    }
    return Promise.all(promises);
}

function renderInventory (NFTs) {
    const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
        console.log(nft)
        let htmlString = `
        
        <div class="card">
            <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${nft.metadata.name}</h5>
                <p class="card-text">${nft.metadata.description}</p>
                <p class="card-text">Tokens in circulation: ${nft.amount}</p>
                <p class="card-text">Number of Owners: ${nft.owners.length}</p>
                <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
            </div>
        </div>
        `
        let col = document.createElement("div");
        col.className = "col col-md-3"
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }
}

async function initializeApp() {
    let currentUser = Moralis.User.current();
    
    if (!currentUser) {
        currentUser = await Moralis.Web3.authenticate();
    }

    const options = { address: CONTRACT_ADDRESS, chain: "rinkeby" }
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    renderInventory(NFTWithMetadata);
}

initializeApp();