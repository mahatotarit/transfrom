const ethers = require('ethers');
const abi = require('./abi.json');

let useraddress;
let amount_sending_value;

const ethereum = window.ethereum;
let contract;
let provider;
let signer;

// ===================================
function check_contract(){
  if(contract == "" || contract == undefined || contract == null){
    alert('please set contract');
    return;
  }
}
function check_provider(){
  if(provider == "" || provider == undefined || provider == null){
    alert('please set privider');
    return;
  }
}

// wallet connect code
async function getAccount() {
  if (typeof window.ethereum !== 'undefined') {

    await ethereum.request({ method: 'eth_requestAccounts' });

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log('Connected account:', accounts[0]);
    useraddress = accounts[0];
    document.querySelector('.address').innerHTML = accounts[0];
  }
}

getAccount();

document.getElementById('connectButton').addEventListener('click', getAccount);


// provider set function
let set_provider_btn = document.querySelector('.set_provider_btn');
async function setProvider(){
    let token_contract_input = document.querySelector('.set_provider_to_c_a');
    let token_contract = (token_contract_input.value).trim();
 
    provider = new ethers.providers.Web3Provider(ethereum);

    try {
        contract = new ethers.Contract(token_contract, abi, provider);
        token_contract_input.classList.add('success_input');
        document.querySelector('.token_address_span').innerHTML = token_contract;
    } catch (error) {
        token_contract_input.classList.add('error_input');
    }

}

set_provider_btn.addEventListener('click',function(){
  setProvider();
});


// approve functions code

let spender_addresss_input = document.querySelector('.spender_address');
let amount_value_input = document.querySelector('.amount_value');
let approve_token_btn = document.querySelector('.approve_token_btn');

let approve_loading = document.querySelector('.approve_loading');

async function approve_token(){
  approve_loading.classList.remove('d-none');
  let amount = ethers.utils.parseUnits(((amount_value_input.value).trim()).toString(), 18);

  signer = provider.getSigner();

  try {

      const tx = await contract.connect(signer).approve((spender_addresss_input.value).trim(), amount);
      await tx.wait();
      approve_loading.classList.add('d-none');
      console.log('Approval successful. Transaction hash:', tx.hash);

  } catch (error) {
    approve_loading.classList.add('d-none');
      console.error('Approval failed:', error);
  }
    
}

approve_token_btn.addEventListener('click', function () {
  approve_token();
});

// allwance check 
document.querySelectorAll('.set_user_address_btn').forEach((element) => {
  element.addEventListener('click',function(){
    let input = (element.parentElement).firstElementChild;
    input.value = useraddress;
  })
});
let allwance_check_btn = document.querySelector('.allwance_check_btn');

let allwance_loading = document.querySelector('.allwance_loading')
async function check_all(){
  check_contract();
  check_provider();
  allwance_loading.classList.remove('d-none');
  
  let owner_add = document.querySelector('.owner_add');
  let spender_add = document.querySelector('.spender_add');
  let allwaonce_value = document.querySelector('.allwaonce_value');

  try {
      const allowanceAmount = await contract.allowance((owner_add.value).trim(),(spender_add.value).trim());
      allwaonce_value.innerHTML =  (allowanceAmount.toString()).slice(0, -18);
      amount_sending_value = allowanceAmount.toString().slice(0, -18);
      allwance_loading.classList.add('d-none');
    } catch (error) {
      allwance_loading.classList.add('d-none');
      console.error('Allowance check failed:', error);
    }
}

allwance_check_btn.addEventListener('click',function(){
  check_all();
})

// sending amount code

let send_amount_add = document.querySelector('.send_amount_add');
let send_amount_btn = document.querySelector('.send_amount_btn');
let sending_loading = document.querySelector('.sending_loading');
let send_amount_from_add = document.querySelector('.send_amount_from_add');

async function transferFrom(){
  sending_loading.classList.remove('d-none');
  try {

    let gasPrice = provider.getGasPrice();
    let gasLimit = 30000;
    console.log(gasPrice);

    sending_loading.classList.add('d-none');
  } catch (error) {
      sending_loading.classList.add('d-none');
      console.error('Transfer failed:', error);
  }
}

send_amount_btn.addEventListener('click',function(){
  transferFrom();
})