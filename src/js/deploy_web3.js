// Right click on the script name and hit "Run" to execute
(async () => {
    try {
        console.log('Running deployWithWeb3 script...')

        await window.ethereum.enable();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const daiAddress = "0xef4873403430b2d1fab44a4561930a829cf55022";

        const metadata = await fetch('contracts/artifacts/FFContract.json')
            .then(response => response.json());

        const daiContract = new ethers.Contract(daiAddress, metadata.abi, provider);


        const commish = await (daiContract.commissioner())
        console.log(commish)

        // const account = await ethereum
        //     .request({ method: 'eth_requestAccounts' })
        //     .then(accounts => accounts[0]);
    
        window.commissioner = null;
        window.players = [];

        window.deployContract = () => {
            console.log("working");
        };

        window.addPlayer = (player) => {
            players.push({
                name: $('#playerName').val(),
                addr: $('#playerWallet').val()
            });
            updatePlayerView();
        };

        removePlayer = (index) => {
            players = players.filter((_, i) => i != index);
            updatePlayerView();
        };

        updatePlayerView = () => {
            $('#player-list').empty();

            players.forEach((player, index) => {
                $('#player-list').append(`
                            <li class="list-group-item">
                                ${player.name}
                                <div id="" class="form-text">${player.addr}</div>
                                <svg onClick="removePlayer(${index});" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </li>
                `);
            });
        };



        // let contract = ethereum.contract(metadata.abi)
    
        // contract = contract.deploy({
        //     data: metadata.data.bytecode.object,
        //     arguments: constructorArgs
        // })
    
        // const newContractInstance = await contract.send({
        //     from: accounts[0],
        //     gas: 1500000,
        //     gasPrice: '30000000000'
        // })
        // console.log('Contract deployed at address: ', newContractInstance.options.address)
    } catch (e) {
        console.log(e.message)
    }
  })()
