const userList = document.getElementById("userList");
const goToHomeBtn = document.getElementById("goToHomepage")
goToHomeBtn.addEventListener('click', ()=>{
    window.location.href="/homepage"
})
window.addEventListener('DOMContentLoaded',async()=>{
const dashData = await axios.get(`http://localhost:3003/premium/getPremiumData`);
//console.log(dashData)
console.log(dashData.data.data)
const data =dashData.data.data;
console.log(data)
data.forEach(element => {
const newLi = document.createElement("li");
if(element.totalExpense === null){
    element.totalExpense=0;
}
newLi.innerHTML = ` Name - ${element.name}  Total Expense- ${element.totalAmount}`;
newLi.classList.add('newLi')
userList.appendChild(newLi)
});
});