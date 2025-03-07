
const container = document.getElementById("form-container")
const expenseForm = document.getElementById("expense-form-container")
const expenseButton = document.getElementById("expense-button");
const expensesList = document.getElementById("liste");
const premiumbtn = document.getElementById("premium-btn")
const premiumSection = document.getElementById("premium-section")
const dashBoardbtn = document.getElementById("dashboard-btn")
const cashfree = Cashfree({
    mode: "sandbox",
});
expenseButton.addEventListener('click', async(event)=>{
    event.preventDefault();
    const amount = document.getElementById("expense-amount").value.trim();
    const description = document.getElementById("expense-description").value.trim();
    const category = document.getElementById("expense-category").value.trim();
    if(!amount || !description || !category){
        alert("⚠️ All fields are required!");
        return
    }
    const token = localStorage.getItem('token')
   const expense ={amount, description, category};
   try{
    const response = await axios.post("http://localhost:3003/expense/add-expense", {expense}, { headers: { "Authorization": token}  });
    console.log("Here is response", response)
    alert("Expense added successfully💴");
    renderExpense(response.data)
    return;
   }
   catch(err){
    console.log(err);
   }
})
function renderExpense(element){
    const newLi = document.createElement("li");
    newLi.innerHTML=`${element.amount} - ${element.description} - ${element.category}`
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML="Delete";
    deleteBtn.classList.add('btn', 'btn-danger', 'delete');
    newLi.appendChild(deleteBtn)
    newLi.classList.add('newLi')
    const token = localStorage.getItem('token')
    deleteBtn.addEventListener('click', async()=>{
        try{
        const response = await axios.delete(`http://localhost:3003/expense/delete-expense/${element.id}`, 
            {
                headers: { "Authorization": token }
            }  
        )
        newLi.remove();
        console.log("Deleted!!")
    }
    catch(err){
console.log(err);
    }
    })
    expensesList.appendChild(newLi);

    document.getElementById("expense-amount").value="";
    document.getElementById("expense-description").value ="";
    document.getElementById("expense-category").value ="";
}
async function getExpense(){
    const page=1;
    const token = localStorage.getItem('token')
    const isPremium = await axios.get(`http://localhost:3003/premium/isPremium`, {headers:{"Authorization": token}} )
       console.log(isPremium.data.isPremium)
       if(isPremium.data.isPremium === true){
        premiumSection.style.display="block"
       }
    const response = await axios.get(`http://localhost:3003/expense/get-expense/${page}`, {headers:{"Authorization": token}});
    const expenses = response.data.expenses;
    console.log(response.data)
    expenses.forEach(element => {
        const newLi = document.createElement("li");
        newLi.innerHTML=`${element.amount} - ${element.description} - ${element.category}`
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML="Delete";
        deleteBtn.classList.add('btn', 'btn-danger', 'delete');
        newLi.appendChild(deleteBtn);
        newLi.classList.add('newLi')
        deleteBtn.addEventListener('click', async()=>{
            try{
            const response = await axios.delete(`http://localhost:3003/expense/delete-expense/${element.id}`, 
                {
                    headers: { "Authorization": token }
                }  
            )
            newLi.remove();
            console.log("Deleted!!")
        }
        catch(err){
console.log(err);
        }
        })
        expensesList.appendChild(newLi);
    });
}
premiumbtn.addEventListener('click', async()=>{
    try{
       const token= localStorage.getItem('token')
       
       const data =await axios.get(`http://localhost:3003/pay/getSessionId`, {headers:{"Authorization": token}} )
        console.log(data.data.paymentSessionId)
        const paymentSessionId=data.data.paymentSessionId;
        let checkOutOptions = {
            paymentSessionId: paymentSessionId,
            redirectTarget: "_self",
        };
        await cashfree.checkout(checkOutOptions)
    }
    catch(err){
        console.log(err);
    }
})
dashBoardbtn.addEventListener('click', ()=>{
        window.location.href="/dashboard"
})
window.addEventListener('DOMContentLoaded', getExpense);