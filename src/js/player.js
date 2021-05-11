// Right click on the script name and hit "Run" to execute
(async () => {
    try {
        console.log('Running deployWithWeb3 script...')

        await window.ethereum.enable();

        const account = await ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(accounts => accounts[0]);
    

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner(account);


        // // const daiAddress = "0x06e9981C406a58C4E9Ab5173612F372c04b857B5";
        // const daiAddress = "0x24Ae7B0500Bc7d54Acc28bF37e26a4B4795d312e";

        const metadata = await fetch('contracts/artifacts/FFContract.json')
            .then(response => response.json());

        let contractAddr = null;
        let daiContract = null;
        let daiWithSigner = null;
        let entryFee = null;

        window.payFoo = () => {
            daiWithSigner.payDues({value: entryFee});
        };

        window.getEntryFee = () => {
            contractAddr = $('#contract-addr').val();
            $('#content').html('<span>Loading..</span>');

            console.log(contractAddr);

            daiContract = new ethers.Contract(contractAddr, metadata.abi, provider);
            window.contract = daiContract;
            daiWithSigner = daiContract.connect(signer);

            daiContract.getEntryFee().then((fee) => {
                entryFee = fee;
                $('#content').html( `
                            <form class="bg-white rounded p-3">
                                <button type="button" class="btn btn-primary" onclick="payFoo();" id="pay">Pay ${fee} wei</button>
                            </form>
                `);
            });

        };

        


        $('#content').html( `
        
                    <form class="bg-white rounded p-3">
                        <div class="mb-3">
                        <label for="fee" class="form-label">Contract</label>
                        <input type="fee" class="form-control" id="contract-addr">
                        <div id="" class="form-text">Address of the contract</div>
                        </div>
                        <button type="button" class="btn btn-primary" onclick="getEntryFee();" id="pay">Continue</button>
                    </form>
        `);


    } catch (e) {
        console.log(e.message)
    }
  })()
