'use strict';
const prevNextBox = document.querySelector("#prev-next-box");
const topForm = document.querySelector("#form-top");
const pageTitle = document.querySelector("#formhead");
const pagePara = document.querySelector("#formpara");
// text input space elements in first form page 
const nameText = document.querySelector("#name");
const emailText = document.querySelector("#email");
const phoneText = document.querySelector("#phone");
//form page elements
const plan = document.querySelector("#plan");
const personalInfo = document.querySelector("#personal-info");
const addOns = document.querySelector("#add-ons");
const finishUp = document.querySelector("#finish-up");
const successPage = document.querySelector("#success-page");

//
const finishUpBox = document.querySelector("#finish-up-box");

//buttons element
const mybutton = document.querySelector("#due-switch-box");
const mybuttoncircle = document.querySelector("#due-switch-button");
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");

// form object to stay current to page movement
const formObject = {
    recentPage:0,
    currentPage:0,
    pageTitles:['Personal info', 'Select your plan', 'Pick add-ons', 'finishing up'],
    pageDescp:['Please provide your name, email address and phone number', 'You have the option of monthly or yearly billing',
    'Add-ons help enhance your gaming experience', 'Double check everything looks OK before confirming' ],
    pages:[personalInfo, plan, addOns, finishUp, successPage],
    textInputSpace:[{space:nameText, id:'#name-error'}, {space:emailText, id:'#email-error'}, {space:phoneText, id:'#phone-error'}],
    addOns:[0,0,0],
};
// checks if user is on first page if true, shows prev button, if false, hides prev button
function prevButtonChecker() {
  if (formObject.currentPage!==0) {
    prevButton.style.visibility = "visible";
  } else if (formObject.currentPage ===0) {
    prevButton.style.visibility = "hidden";
  }
};
// functions to change pages in form
function nextPage() {
   if (formObject.currentPage === 0) {
      let pfCondition = checkFirstForm();
      if (pfCondition ==="filled") {
        pageMove("+");
      }
      indicatePresentPage();
   } else if (formObject.currentPage>0) {
        if (formObject.currentPage<4) {
            pageMove("+");
            if (formObject.currentPage === 2) {
                if (buttonVars.currentPlan==='monthly') {
                    changePlanDue(1,"planPrices2",false);
                } 
                else if (buttonVars.currentPlan==='yearly') {
                    changePlanDue(2,"planPrices2",false); 
                }
            };
            if (formObject.currentPage === 3) {
                let total = 0;
                const divElement = document.querySelector("#finish-up-box");
                document.querySelector("#pb-head").innerHTML =`${userData.plan[0][0].toUpperCase()+userData.plan[0].slice(1)}(${userData.plan[1]})`;
                document.querySelector(".sum-price").innerHTML = userData.plan[2];
                for (let [title, vals] of Object.entries(userData.addOns)) {
                    if (vals) {
                        divElement.insertAdjacentHTML("beforeend", `
                        <div class="ado-summary-box">
                            <div class="sum-box">
                                <span class="summary-text">${vals[0]}</span>
                            </div>
                            <div class="sum-price-box">
                                <span class="sum-price">${vals[2]}</span>
                            </div>
                        </div>`)
                        total = total + Number.parseInt(vals[2].slice(1), 10);
                    }
                }
                total = total + Number.parseInt(userData.plan[2].slice(1));
                document.querySelector("#total-summary").innerHTML = `$${total}${userData.plan[2].slice(-3)}`;
                document.querySelector("#tt").innerHTML = `Total (per ${userData.plan[1].replace('ly','')})`;
                nextButton.innerHTML = 'Confirm'
            }
            indicatePresentPage();
        }
    }
    if (formObject.currentPage===4) {
        displaySuccess();
    }
   console.log(userData);
}

function pageHead() {
   if (formObject.currentPage<4) {
    pageTitle.innerHTML = formObject.pageTitles[formObject.currentPage];
    pagePara.innerHTML = formObject.pageDescp[formObject.currentPage];
   }
}
function pageMove(direction) {
    if (direction==="+") {
        if (formObject.currentPage<=3) {
            formObject.pages[formObject.currentPage].style.display = "none";
            formObject.pages[formObject.currentPage+1].style.display = "block";
            formObject.recentPage=formObject.currentPage;
            formObject.currentPage++;
        }
    } else if (direction==="-") {
        if (formObject.currentPage!==0)  {
            formObject.pages[formObject.currentPage].style.display = "none";
            if (formObject.currentPage ===1) {
                formObject.pages[formObject.currentPage-1].style.display = "flex";
            } else {
                if (formObject.currentPage ===3) {
                    clearAddOnAtSummary();
                }
                formObject.pages[formObject.currentPage-1].style.display = "block";
            }
            formObject.recentPage=formObject.currentPage;
            formObject.currentPage--;
            indicatePresentPage();
        }
    };
    pageHead();
    prevButtonChecker();
};

// function to check if first form personal info form is filled correctly
function checkFirstForm() {
    let fillErrors = 0;
    formObject.textInputSpace.map((tis)=> {
        if (tis.space.value === "") {
            let err = document.querySelector(tis.id);
            err.style.visibility = "visible";
            fillErrors++;
        };
    })
    if (fillErrors===0) {
        formObject.textInputSpace.map((spaceOb)=>{
            if (spaceOb.space === nameText)  userData.fullname = spaceOb.space.value;
            if (spaceOb.space === emailText)  userData.email = spaceOb.space.value;
            if (spaceOb.space === phoneText) userData.phoneNumber = spaceOb.space.value;
        })
        return "filled";
    } else {
        return "not-filled";
    }
};
const buttonVars = {
    currentPlan:'monthly',
    planPrices1:[["#ar", "$9/mo", "$90/yr"], ["#ad", "$12/mo", "$120/yr"],["#pr", "$15/mo", "$150/yr"]],
    planPrices2:[["#ol", "$1/mo", "$10/yr"],["#ls", "$2/mo", "$20/yr"], ["#cp", "$2/mo", "$20/yr"]],
}

// current the monthly-yearly plan switch button condition and also changes the plan between monthly and yearly
mybutton.addEventListener('click', ()=> {
    if (buttonVars.currentPlan === "monthly") {
        mybuttoncircle.style.marginRight = '-29px';
        buttonVars.currentPlan = 'yearly';
        changePlanDue(2, "planPrices1", true);
    } else if (buttonVars.currentPlan==='yearly') {
        mybuttoncircle.style.marginRight = '29px';  
        buttonVars.currentPlan = 'monthly';
        changePlanDue(1, "planPrices1", true);
    }
});

//changes plan prices
function changePlanDue(month, sect, inplanpage) {
    buttonVars[sect].map((plan)=>{
    let priceElement = document.querySelector(plan[0])
    priceElement.textContent = plan[month]}
    );

    // only runs if user is within plan page and shows if bonus is or not available
    if (inplanpage) {
        const bonusText = document.getElementsByClassName("plan-bonus-text");
        if (month===2) {
            bonusText[0].style.visibility = "visible";
            bonusText[1].style.visibility = "visible";
            bonusText[2].style.visibility = "visible";
        } else if (month===1) {
            bonusText[0].style.visibility = "hidden"; 
            bonusText[1].style.visibility = "hidden";
            bonusText[2].style.visibility = "hidden";
        }
    }

}
function indicatePresentPage() {
    console.log("indicatepresentpage() is now called");
    if (formObject.currentPage <4) {
        let presentPage = document.querySelector(`#stepdesk${formObject.currentPage + 1}`);
        let recentPage = document.querySelector(`#stepdesk${formObject.recentPage + 1}`);
        presentPage.style.backgroundColor = "hsl(217, 100%, 97%)";
        presentPage.style.color = "hsl(213, 96%, 18%)";
        recentPage.style.backgroundColor = "transparent";
        recentPage.style.color = "white";
    }
    console.log("indicatepresentpage() has finished running");
}
const userData = {
    fullname:'',
    email:'',
    phoneNumber:'',
    plan:[],
    addOns:{
        onlineService:null,
        largerStorage:null,
        customProfits:null,
    }
}
function addPlan(valId, planName) {
    let valElement = document.querySelector(valId).innerHTML;
    let due = valElement.slice(-2) === 'mo'?'monthly':'yearly';
    userData.plan = [planName, due, valElement];
}

function addOnAdder(addOn, valId, number, checkboxId, choice, title) {
    let valElement = document.querySelector(valId).innerHTML;
    let checkbox = document.querySelector(checkboxId);
    let box = document.querySelector(choice);
    if (formObject.addOns[number]===0) {
        let due = valElement.slice(-2) === 'mo'?'monthly':'yearly';
        userData.addOns[addOn] = [title, due, valElement];
        formObject.addOns[number]=1;
        box.style.borderColor =  "hsl(213, 96%, 18%)";
        checkbox.checked = true;
    } else if (formObject.addOns[number]===1) {
        userData.addOns[addOn] = null; 
        formObject.addOns[number]=0; 
        box.style.borderColor =  "hsl(231, 11%, 63%)";
        checkbox.checked = false; 
    }
}

//deletes the add-ons on the finishup page
function clearAddOnAtSummary() {
    let counter = finishUpBox.childNodes.length;
    finishUpBox.childNodes.forEach(()=>{
       if (counter>=2) {
        finishUpBox.removeChild(finishUpBox.lastChild);
        counter--;
       }
    })
}
//returns the user to the choose plan page
document.querySelector("#pb-button").addEventListener("click", ()=>{
    formObject.pages[formObject.currentPage].style.display = "none";
    formObject.pages[1].style.display = "block";
    clearAddOnAtSummary();
    formObject.currentPage = 1;
    formObject.recentPage = 0;
})
function displaySuccess() {
    finishUp.style.display = "none";
    nextButton.style.display = 'none';
    prevButton.style.display = 'none';
    pageTitle.innerHTML = '';
    pagePara.innerHTML = '';
    console.log(userData)
}