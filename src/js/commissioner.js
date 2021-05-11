// Right click on the script name and hit "Run" to execute
(async () => {
    try {


    
        window.onload = () => {
            console.log($('#content').html(`
                <div class="container">
                    <div class="row">
                        <div class="col">
                        </div>
                        <div class="col">
                            <div class="row mt-5">
                                <form>
                                    <div class="mb-3">
                                    <label for="fee" class="form-label">Entry Fee</label>
                                    <input type="fee" class="form-control" id="fee">
                                    <div id="" class="form-text">Fee to enter the league</div>
                                    </div>
                                    <button type="button" class="btn btn-primary" onclick="deployContract();">Deploy Contract</button>
                                </form>
                            </div>
                        </div>
                        <div class="col">
                        </div>
                    </div>
                </div>
            `));
        };

        await window.ethereum.enable();

        const metadata = await fetch('contracts/artifacts/FFContract.json')
            .then(response => response.json());

        const account = await ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(accounts => accounts[0]);
    

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(account);

        window.deployContract = () => {
            console.log("working");
            var ABI = metadata.abi;
            var BYT = metadata.data.bytecode.object;
            
            const simpleContractFactory = new ethers.ContractFactory(ABI, BYT, signer)
            const simpleContract = simpleContractFactory
            .deploy()
            .then(() => simpleContract.deployTransaction.wait())
            .then(console.log)
        };

        console.log('Running deployWithWeb3 script...')



        

        console.log(provider)
        console.log(signer)

        // const daiAddress = "0x06e9981C406a58C4E9Ab5173612F372c04b857B5";
        const daiAddress = "0x5A8a896A095e4d579E30c952E97EC3A2CD63F111";


        const daiContract = new ethers.Contract(daiAddress, metadata.abi, provider);
        window.contract = daiContract;
        const daiWithSigner = daiContract.connect(signer);

        window.signedContract = daiWithSigner;

        console.log(daiWithSigner)
        
        const commish = await (daiContract.commissioner())

        // const entryFee = await daiContract.getEntryFee().then((fee) => {
        //     $('#pay').text('Pay ' + fee + ' wei');
        // });

        console.log(entryFee);
        console.log(commish)

        window.commissioner = null;
        window.players = [];


        window.addPlayer = (player) => {
            players.push({
                name: $('#playerName').val(),
                addr: $('#playerWallet').val()
            });
            updatePlayerView();
        };


        window.startLeague = () => {
            const args = players.map((player) => {
                return [player.name, player.addr];
            });
            
            daiWithSigner
                .addPlayers(args)
                .then(() => daiWithSigner.startLeague());
        };



        removePlayer = (index) => {
            players = players.filter((_, i) => i != index);
            updatePlayerView();
        };

        payDues = (amount) => {
            daiWithSigner.payDues({value: 10});
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
