const monthly = document.getElementById('monthly');
const yearly = document.getElementById('yearly');
let pro_price = document.getElementById('pro_price');
let business = document.getElementById('business_price');

yearly.addEventListener('click',() =>{
    yearly.classList.add('bg-gray-200');
    monthly.classList.remove('bg-gray-200');
    pro_price.textContent = "$4";
    business.textContent = "$6";
});

monthly.addEventListener('click',() =>{
    monthly.classList.add('bg-gray-200');
    yearly.classList.remove('bg-gray-200');
    pro_price.textContent = "$5";
    business.textContent = "$8";
});