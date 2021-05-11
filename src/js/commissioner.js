// Right click on the script name and hit "Run" to execute
(async () => {
    try {


    
        window.onload = () => {
            console.log($('#content').html(`
                <div class="container" id="content">
                    <div class="row">
                        <div class="col">
                        </div>
                        <div class="col">
                            <div class="row mt-5">
                                <form>
                                    <div class="mb-3">
                                    <label for="fee" class="form-label">Entry Fee</label>
                                    <input type="fee" class="form-control" id="fee" value="10">
                                    <div id="" class="form-text">Fee to enter the league</div>
                                    </div>
                                    <div id="deploy-button">
                                        <button type="button" class="btn btn-primary" onclick="deployContract();">Deploy Contract</button>
                                    </div>
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

        window.metadata = await fetch('contracts/artifacts/FFContract.json')
            .then(response => response.json());

        const account = await ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(accounts => accounts[0]);
    

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(account);

        let daiAddress = null;
        let daiContract = null;
        let daiWithSigner = null;
        let commish = null;


        const addPlayersPage = () => {
            $('#content').html(`
                <div class="container" id="content">
                    <div class="row mt-5"></div>
                    <div class="row">
                        <div class="col">
                            <div class="row">
                                <form>
                                    <div class="mb-3">
                                    <label for="commishAddr" class="form-label">Commissioner Address</label>
                                    <input type="commishAddr" class="form-control" id="commishAddr">
                                    <div id="" class="form-text">This is the wallet address of the commissioner</div>
                                    </div>
                                    <button type="button" class="btn btn-primary" onclick="addPlayer();">Change Commissioner</button>
                                </form>
                            </div>
                        </div>
                        <div class="col">
                            <div class="row">
                                <form>
                                    <div class="mb-3">
                                    <label for="playerName" class="form-label">Name</label>
                                    <input type="playerName" class="form-control" id="playerName">
                                    </div>
                                    <div class="mb-3">
                                    <label for="playerWallet" class="form-label">Address</label>
                                    <input type="playerWallet" class="form-control" id="playerWallet">
                                    <div id="" class="form-text">This is the wallet address of the player</div>
                                    </div>
                                    <button type="button" class="btn btn-primary" onclick="addPlayer();">Add Player</button>
                                </form>
                            </div>
                            <div class="row mt-5">
                                <ul class="list-group">
                                    <span id="player-list">
                                    </span>
                                    <li class="list-group-item">
                                        <div id="start-league-btn">
                                            <button type="submit" class="btn btn-primary" onclick="nextPage()">Continue</button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col">
                        </div>
                    </div>
                </div>
            `);
        };

        const declareWinnersPage = () => {
            $('#content').html(`
                <div class="container" id="content">
                    <div class="row mt-5"></div>
                    <div class="row">
                        <div class="col">
                        </div>
                        <div class="col">
                            <div class="row">
                                <form>
                                    <div class="mb-3">
                                    <label for="first-place" class="form-label">First Place</label>
                                    <input type="first-place" class="form-control" id="first-place">
                                    </div>
                                    <div class="mb-3">
                                    <label for="second-place" class="form-label">Second Place</label>
                                    <input type="second-place" class="form-control" id="second-place">
                                    </div>
                                    <div class="mb-3">
                                    <label for="third-place" class="form-label">Third Place</label>
                                    <input type="third-place" class="form-control" id="third-place">
                                    </div>
                                    <div id="declare-winners-btn" >
                                        <button type="button" class="btn btn-primary" onclick="declareWinners();">Declare Winners</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="col">
                        </div>
                    </div>
                </div>
            `);
        };

        const continuePage = () => {
            $('#content').html(`
                <div class="container" id="content">
                    <div class="row mt-5"></div>
                    <div class="row">
                        <div class="col">
                            <div class="row">
                                <div class="input-group mb-3">
                                <input type="text" class="form-control" value="${daiAddress}">
                                </div>
                                <form>
                                    <div id="start-leauge-btn" >
                                        <button type="button" class="btn btn-primary" onclick="startLeague();">Start League</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="col">
                        </div>
                    </div>
                </div>
            `);
        };
        const populateGlobals = async (contractAddr) => {
            daiAddress = contractAddr;
            var ABI = await fetch('contracts/artifacts/FFContractABI.txt').then(response => response.text());
            daiContract = new ethers.Contract(contractAddr, ABI, provider);
            daiWithSigner = await daiContract.connect(signer);
            console.log(daiWithSigner)

            window.signedContract = daiWithSigner;
            console.log('###########')
            console.log(daiWithSigner)
            commish = await (daiContract.commissioner())
            console.log(commish)
        };

        window.deployContract2 = async () => {
            daiAddress = '0x5A8a896A095e4d579E30c952E97EC3A2CD63F111';
            $('#deploy-button').html(`
                <button type="button" class="btn btn-primary">Deploying 
                    <div class="spinner-border spinner-border-sm text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
              </button>
            `);
            const x = await new Promise(function(resolve) { 
                setTimeout(resolve.bind(null), 1000)
            });
            populateGlobals(daiAddress);

            addPlayersPage();
        };

        window.deployContract = async () => {
            const entryFee = $('#fee').val();

            console.log("working" + entryFee);
            var ABI = await fetch('contracts/artifacts/FFContractABI.txt').then(response => response.text());
            var BYT = await fetch('contracts/artifacts/FFContractBYT.txt').then(response => response.text());

            const simpleContractFactory = new ethers.ContractFactory(ABI, BYT, signer)


            $('#deploy-button').html(`
                <button type="button" class="btn btn-primary"> 
                    Deploying
                    <div class="spinner-border spinner-border-sm text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
              </button>
            `);

            const simpleContract = await simpleContractFactory.deploy(parseInt(entryFee))

            const result = await simpleContract.deployTransaction.wait()
            addPlayersPage();
            daiAddress = result.contractAddress;
            populateGlobals(daiAddress);
            console.log('done');
            console.log(result);

        };

        console.log('Running deployWithWeb3 script...')



        

        console.log(provider)
        console.log(signer)


        window.players = [];


        window.addPlayer = (player) => {
            players.push({
                name: $('#playerName').val(),
                addr: $('#playerWallet').val()
            });
            updatePlayerView();
        };

        window.declareWinners = async () => {
            const firstPlace = $('#first-place').val();
            const secondPlace = $('#second-place').val();
            const thirdPlace = $('#third-place').val();

            $('#declare-winners-btn').html(`
                <div id="declare-winners-btn">
                    <button type="submit" class="btn btn-primary">
                        <div class="spinner-border spinner-border-sm text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
                </div>
            `);

            await daiWithSigner.declareWinners(firstPlace, secondPlace, thirdPlace)

            $('#declare-winners-btn').html(`
                <div>
                    <button type="submit" class="btn btn-success">Done</button>
                </div>
            `);
        }

        window.nextPage = async () => {
            const args = players.map((player) => {
                return [player.name, player.addr];
            });
            


            $('#start-league-btn').html(`
                <div id="start-league-btn">
                    <button type="submit" class="btn btn-primary">
                        Loading
                        <div class="spinner-border spinner-border-sm text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
                </div>
            `);

            await daiWithSigner.addPlayers(args)
            continuePage();
        };

        window.startLeague = async () => {
            const args = players.map((player) => {
                return [player.name, player.addr];
            });
            


            $('#start-league-btn').html(`
                <div id="start-league-btn">
                    <button type="submit" class="btn btn-primary">
                        Starting League
                        <div class="spinner-border spinner-border-sm text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
                </div>
            `);

            const wait = ms => new Promise(r => setTimeout(r, ms));
            const start = () => daiWithSigner.startLeague().catch(() => wait(10000).then(start()))

            await start();

            declareWinnersPage();
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



    } catch (e) {
        console.log(e.message)
    }
  })()
