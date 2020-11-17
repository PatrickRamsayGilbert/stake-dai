import React, { Component } from "react";
import DaiToken from "./contracts/DaiToken.json";
import DappToken from "./contracts/DappToken.json";
import TokenFarm from "./contracts/TokenFarm.json";
import getWeb3 from "./getWeb3";


class App extends Component {


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
     const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      this.setState({web3,accounts, account:accounts[0]})
      // Get the contract daiToken.

      const networkId = await web3.eth.net.getId();

      const deployedNetwork = DaiToken.networks[networkId];
      const daiToken = new web3.eth.Contract(
        DaiToken.abi, deployedNetwork.address
      );
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({daiToken,daiTokenBalance:daiTokenBalance.toString()})
      //Get the contract DappToken

      const deployedNetworkII = DappToken.networks[networkId];
      const dappToken = new web3.eth.Contract(
        DappToken.abi, deployedNetworkII.address
      );
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
      this.setState({dappToken,dappTokenBalance: dappTokenBalance.toString() })
      
      //get the contract TokenFarm
        const deployedNetworkIII = TokenFarm.networks[networkId];
        const tokenFarm = new web3.eth.Contract(
          TokenFarm.abi, deployedNetworkIII.address,
        );
        this.setState({tokenFarm})
        let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({stakingBalance:stakingBalance.toString() });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  stakeTokens = async (amount) => {
    await this.state.daiToken.methods.approve(this.state.tokenFarm._address,amount)
    .send({from: this.state.account})
    await this.state.tokenFarm.methods.stakeTokens(amount)
    .send({from:this.state.account})

    

  }

  unstakeTokens = async (amount) => {
    await this.state.tokenFarm.methods.unstakeTokens()
    .send({from:this.state.account});
  }

  issueTokens = async (amount) => {
    await this.state.tokenFarm.methods.issueTokens()
    .send({from:this.state.account});
    
    console.log("Tokens Issued!")
  }
  constructor(props) {
    super(props)
  this.state = {
    web3: null,
    accounts: null,
    account: null,
    daiToken: null,
    dappToken: null,
    tokenFarm: null,
    daiTokenBalance: '0',
    dappTokenBalance: '0',
    stakingBalance: '0',
  }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App text-center mt-5">
                <h1>Welcome! to my Stake-Dai demo</h1>
        <p>You Are: {this.state.accounts}</p>
        <p className="lead col-md-8 mx-auto">This is built using truffle, react, and 3 different smart contracts in solidity. Placed on the Ropsten network.
        Only owner can stake and unstake fake Dai with MetaMask. Currently this is for my learning.<br></br> The rewards button only works if you are the owner of this app. It will fail if you try. In a "real" app it would only be seen by the owner. Just for Demonstration purposes.</p>
        <table className="table text-muted table-borderless">
          <thead>
            <tr>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.web3.utils.fromWei(this.state.stakingBalance,'Ether')} mDai</td>
              <td>{this.state.web3.utils.fromWei(this.state.dappTokenBalance, 'Ether')} DAPP</td>
            </tr>
          </tbody>
        </table>


        <div className="card mb-4 col-md-8 mx-auto">
          <div className="card-body">
          <form className="mb-3" onSubmit={(event) => {
            event.preventDefault()
            let amount
            amount = this.input.value.toString()
            amount = this.state.web3.utils.toWei(amount, 'Ether')
            this.stakeTokens(amount)
          }

          }>
              <div>
                <label className="float-left"><b>Stake Tokens</b></label>
                <span className="float-right text-muted">
                  Balance: {this.state.web3.utils.fromWei(this.state.daiTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => {this.input = input}}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src="" height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; mDAI
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
            </form>
            <button
              type="submit"
              onClick={(event) => {
                event.preventDefault()
                this.unstakeTokens()
              }}
              className="btn btn-link btn-block btn-sm">
                UN-STAKE...
              </button>
         Click the Issue Tokens to see rewards for staking
              <button
              type="submit"
              onClick={(event) => {
                event.preventDefault()
                this.issueTokens()
              }} className="btn btn-link"
              >Issue Tokens</button> 
          </div>
        </div>
      </div>
    );
  }
}

export default App;
