import { defineStore } from 'pinia'
import { ref } from 'vue'
import TransactionContractBuild from '../artifacts/contracts/Transaction.sol/Transaction.json'
import InitialContractBuild from '../artifacts/contracts/InitializeContract.sol/InitializeContract.json'
import router from '@/router'
const Web3 = require('web3/dist/web3.min.js')
let txnHash;
let transactionHash;
const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2c79500c736344aaab707050d476516d'))
let loading = ref(false);

let returnedDob;
let returnedAffiliation;
let returnedAddress;

export const useConnectStore = defineStore('connect', () => {
  const returnedName = ref(null)
  const account = ref(null)
  async function connectWallet() {
    setLoader(true)
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Must connect to MetaMask!')
        return
      }
      const myAccounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected: ', myAccounts[0])
      account.value = myAccounts[0]
      setLoader(false)
      router.push("signup")
    }
    catch (error) {
      setLoader(false)
      console.log(error)
    }
  }

  async function deployTransactionContract() {
    try {
      const { ethereum } = window;
      // console.log("hi")
      const names = web3.utils.asciiToHex('Strathmore University');
      const encodedParameters = web3.eth.abi.encodeParameters(
        ['bytes32'],
        [names]
      ).slice(2);
      const bytecodeWithEncodedParameters = TransactionContractBuild.bytecode + encodedParameters
      window.contract = new web3.eth.Contract(TransactionContractBuild.abi)
      const parameters =
      {
        from: window.ethereum.selectedAddress,
        gas: 0, // 30400
        gasPrice: 0, // 10000000000000
        data: bytecodeWithEncodedParameters,
      };


      // contract = contract.deploy({data: bytecode})
      ethereum.request({
        method: 'eth_sendTransaction',
        params: [parameters],
      }).then((result) => {
        txnHash = result
        ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txnHash],
        }).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      }).catch((error) => {
        console.log(error)
      });
    } catch (error) {
      console.log(error)
    }
  }

  async function deployInitialContract(name, dob, affliation, subject, nationality) {
    const names = web3.utils.asciiToHex(name)
    const birth = web3.utils.asciiToHex(dob)
    const nation = web3.utils.asciiToHex(nationality)
    const address = subject
    const affiliate = affliation
    // let dataParam = web3.eth.abi.encodeFunctionSignature(`(${names}, ${dob}, ${nationality})`)
    const encodedParameters = web3.eth.abi.encodeParameters(
      ['bytes32', 'bytes32', 'bytes32', 'address', 'address'],
      [names, birth, nation, affiliate, address]
    ).slice(2);
    const bytecodeWithEncodedParameters = InitialContractBuild.bytecode + encodedParameters
    try {
      const { ethereum } = window;
      // console.log("hi")
      window.contract = new web3.eth.Contract(InitialContractBuild.abi)
      const parameters =
      {
        from: window.ethereum.selectedAddress,
        gas: 0, // 30400
        gasPrice: 0, // 10000000000000
        data: bytecodeWithEncodedParameters,
      };


      // contract = contract.deploy({data: bytecode})
      ethereum.request({
        method: 'eth_sendTransaction',
        params: [parameters],
      }).then((result) => {
        transactionHash = result
      //   ethereum.request({
      //     method: 'eth_getTransactionReceipt',
      //     params: [txnHash],
      //   }).then((res) => {
      //     console.log(res)
      //   }).catch((err) => {
      //     console.log(err)
      //   })
      // }).catch((error) => {
      //   console.log(error)
      });
    } catch (error) {
      console.log(error)
    }
  }

  async function getPersonalDetails(uContractAddress) {
    window.contract = new web3.eth.Contract(InitialContractBuild.abi, uContractAddress)
    // window.contract.options.address = '0x37d1f699b0eeffa760323e955534e9e0cc19f307';
    const senderAddress = window.ethereum.selectedAddress
    const functionBytecode = web3.eth.abi.encodeFunctionCall({
      name: 'getPersonalInfo',
      type: 'function',
      inputs: [{
        type: 'address',
        name: '_requester'
      }]
    }, [senderAddress]);

    const parameters = {
      from: window.ethereum.selectedAddress,
      to: uContractAddress,
      data: functionBytecode
    };
    try {
      window.ethereum.request({
        method: 'eth_call',
        params: [parameters]
      }).then((res) => {
        // console.log(res);
        let decoded = web3.eth.abi.decodeParameters(['bytes32', 'bytes32', 'bytes32', 'address'], res);
        returnedName.value = web3.utils.hexToUtf8(decoded[0]);
        returnedDob = web3.utils.hexToUtf8(decoded[1]);
        returnedAffiliation = web3.utils.hexToUtf8(decoded[2]);
        returnedAddress = decoded[3];
        console.log(returnedName.value)
        // console.log(returnedName, returnedDob, returnedAffiliation, decoded[3])
      }).catch((error) => {
        console.log(error)
      })
    } catch (error) {
      console.log(error)
    }
  }
  async function setPersonalInfo(name, dob, nationality, affiliation, userContractAdd) {
    
    window.contract = new web3.eth.Contract(InitialContractBuild.abi, userContractAdd);
    const fname = web3.utils.asciiToHex(name);
    const userDob = web3.utils.asciiToHex(dob);
    const userNationality = web3.utils.asciiToHex(nationality);
    const userAffiliation = web3.utils.asciiToHex(affiliation)
    const functionHash = web3.eth.abi.encodeFunctionCall({
      name: 'setPersonalInfo',
      type: 'function',
      inputs: [{
        type: 'bytes32',
        name: '_name'
      },
      {
        type: 'bytes32',
        name: '_dob'
      },
      {
        type: 'bytes32',
        name: '_nationality'
      },
      {
        type: 'address',
        name: '_affiliation'
      }]
    }, [fname, userDob, userNationality, userAffiliation]);
    const parameters = {
      from: window.ethereum.selectedAddress,
      to: userContractAdd,
      data: functionHash
    };
    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [parameters]
    }).then((res) => {
      console.log(res)
      loading = false
    }).catch((error) => {
      loading = false
      console.log(error)
    })
  }

  async function grant() {
    window.contract = new web3.eth.Contract(InitialContractBuild.abi, '0x9bba9b23f724003f1332c34ecebd9d685bfa76e3');
    const reqAddress = '0x0A5d73ca6E990A316b752FE7003B8b38caD2898d';
    const data = 1;
    const senderAddress = '0x0daE686FE64313195Ff15377DFfF10135B414455'
    const functionHash = web3.eth.abi.encodeFunctionCall({
      name: 'grant',
      type: 'function',
      inputs: [{
        type: 'address',
        name: '_requester'
      },
      {
        type: 'uint16',
        name: '_data'
      }
      ]
    }, [reqAddress, data]);
    const parameters = {
      from: senderAddress,
      to: '0x9bba9b23f724003f1332c34ecebd9d685bfa76e3',
      data: functionHash
    };
    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [parameters]
    }).then((res) => {
      console.log(res)
    }).catch((error) => {
      console.log(error)
    })
  }

  async function revoke() {
    window.contract = new web3.eth.Contract(InitialContractBuild.abi, '0x9bba9b23f724003f1332c34ecebd9d685bfa76e3');
    const reqAddress = '0x0A5d73ca6E990A316b752FE7003B8b38caD2898d';
    const data = 1;
    const senderAddress = '0x0daE686FE64313195Ff15377DFfF10135B414455'
    const functionHash = web3.eth.abi.encodeFunctionCall({
      name: 'grant',
      type: 'function',
      inputs: [{
        type: 'address',
        name: '_requester'
      },
      {
        type: 'uint16',
        name: '_data'
      }
      ]
    }, [reqAddress, data]);
    const parameters = {
      from: senderAddress,
      to: '0x9bba9b23f724003f1332c34ecebd9d685bfa76e3',
      data: functionHash
    };
    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [parameters]
    }).then((res) => {
      console.log(res)
    }).catch((error) => {
      console.log(error)
    })
  }
  function setLoader(value) {
    console.log('setLoader', value);
    // eslint-disable-next-line
    loading = value;
  }

  // async function deployInitialContract() { 
  //   const names = web3.utils.asciiToHex('Name')
  //   const dob = web3.utils.asciiToHex('dob')
  //   const nationality = Web3.utils.asciiToHex('nationality')
  //   let dataParam = web3.eth.abi.encodeFunctionSignature(`createContract(${names}, ${dob}, ${nationality})`)
  //   let parameters = {
  //     from: '0x0A5d73ca6E990A316b752FE7003B8b38caD2898d',
  //     data: dataParam
  //   }
  //   try {
  //     window.ethereum.request({
  //           method: 'eth_getTransactionReceipt',
  //           params: [txnHash]}).then((res) => {
  //             // console.log(res['contractAddress'])
  //             window.contract.options.address = res['contractAddress']
  //           }).catch((error) => {
  //             console.log(error)
  //           });
  //     window.ethereum.request({
  //       method: 'eth_sendTransaction',
  //       params: [parameters]
  //     }).then((result) => {
  //       console.log(result)
  //     }).catch((error) => {
  //       console.log(error)
  //     })
  // } catch(error){
  //   console.log(error)
  // }
  // }

  // async function getFunctionSignature(fname) {
  //   let result = web3.eth.abi.encodeFunctionSignature(fname);
  //   return result;
  // }

  return {
    account,
    connectWallet,
    deployTransactionContract,
    deployInitialContract,
    getPersonalDetails,
    setPersonalInfo,
    grant,
    revoke,
    setLoader,
    loading,
    transactionHash,
    returnedAddress,
    returnedAffiliation,
    returnedDob,
    returnedName
  }

})
