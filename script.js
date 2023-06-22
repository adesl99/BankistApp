"use strict";

const account1 = {
  owner: "Adel Sbaih",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300], //3840
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30], //11720
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  // userName: "st",
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460], //10
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  // userName: "sa",
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90], //2270
  interestRate: 1,
  pin: 4444,
};
let x = 0;
for (let value of account4.movements) {
  x += value;
}

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//DISPLAY Movments
const displayMovements = function (movments, sort = false) {
  containerMovements.innerHTML = "";
  let movs;
  sort ? (movs = movments.slice().sort((a, b) => a - b)) : (movs = movments);
  movs.forEach(function (movment, i) {
    const type = movment > 0 ? `deposit` : `withdrawal`;
    const html = `
  <div class="movements">
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${movment}</div>
  </div>
`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// displayMovements(account1.movements);

//add USERNAMES
const addUserNames = function (arr) {
  return arr.map((obj) => {
    let userName = obj.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
    return (obj.userName = userName);
  });
};
addUserNames(accounts);

//Make a diffrence between Wthdrawls and Depoists
const targetMovments = function (account) {
  const deoisitsWithdrawl = [];
  const deopist = account.movements.filter((mov) => mov > 0);
  const withdrawals = account.movements.filter((mov) => mov < 0);
  deoisitsWithdrawl.push(deopist);
  deoisitsWithdrawl.push(withdrawals);
  return (account.deoisitsWithdrawl = deoisitsWithdrawl);
};
targetMovments(account1);

//calculate the balance to each account

const calcBala = function (accounts) {
  accounts.forEach(function (account) {
    return (account.balance = account.movements.reduce(
      (Acc, mov) => Acc + mov,
      0
    ));
  });
};
calcBala(accounts);

//changeFromEuroToDollars
const changeCurr = account1.movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * 1.1)
  .reduce((Acc, mov) => Acc + mov, 0);

//****************************+DOM

//displace BALANCE
const displayBalance = function (acc) {
  labelBalance.textContent = `${acc.balance} EUR`;
};

//display IN
const displayIn = function (account) {
  labelSumIn.textContent = `${account.movements
    .filter((mov) => mov > 0)
    .reduce((ACc, mov) => ACc + mov, 0)} EUR`;
};
// displayIn(account1);

//display OUT
const displayOut = function (account) {
  labelSumOut.textContent = `${Math.abs(
    account.movements
      .filter((mov) => mov < 0)
      .reduce((ACc, mov) => ACc + mov, 0)
  )} EUR`;
};

// displayOut(account1);

//displayIntrest
const displayIntrest = function (acc) {
  labelSumInterest.textContent = `${acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((mov) => mov > 1)
    .reduce((ACc, mov) => ACc + mov, 0)} EUR`;
};

// displayIntrest(account1);

//TRANSFER MONEY
const trasnfer = function (from, to, value) {
  if (value < from.movements.reduce((sum, mov) => sum + mov, 0)) {
    from.movements.push(-value);
    to.movements.push(value);
    calcBala(accounts);
    displayOut(from);
    displayIntrest(from);
    inputTransferTo.value = "";
    inputTransferAmount.value = "";
    displayBalance(from);
    displayMovements(from.movements);
  }
};
// trasnfer(account1, account2, 1000);
//LoanMoney
const loanMoney = function (to, amount) {
  if (to.movements.some((mov) => mov > amount * 0.1)) {
    to.movements.push(amount);
    calcBala(accounts);
    displayIntrest(to);
    inputLoanAmount.value = "";
    displayBalance(to);
    displayMovements(to.movements);
  }
};

//CLOSE ACCOUNT
const closeAcc = function (acc) {
  accounts.splice(accounts.indexOf(acc), 1);
};
//LOGOUT
const logout = function () {
  containerApp.style.opacity = 0;
};

//*******************EVENT LISTNER (LOGIN***********
let currentAccount;
const login = function () {
  currentAccount = accounts.find(
    (acc) =>
      acc.userName === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );
  //AFTER LOGIN
  if (currentAccount) {
    //TIMER

    function countdown(elementName, minutes, seconds) {
      let element, endTime, hours, mins, msLeft, time;

      function twoDigits(n) {
        return n <= 9 ? "0" + n : n;
      }

      function updateTimer() {
        msLeft = endTime - +new Date();
        if (msLeft < 1000) {
          labelTimer.innerHTML = "Time is up!";
          containerApp.style.opacity = 1;
        } else {
          time = new Date(msLeft);
          hours = time.getUTCHours();
          mins = time.getUTCMinutes();
          labelTimer.innerHTML =
            (hours ? hours + ":" + twoDigits(mins) : mins) +
            ":" +
            twoDigits(time.getUTCSeconds());
          setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
        }
      }

      endTime = +new Date() + 1000 * (60 * minutes + seconds) + 500;
      updateTimer();
    }

    countdown("ten-countdown", 10, 0);
    containerApp.style.opacity = 100;
    //DISPLAYUSER NAME WITH HELLO
    labelWelcome.textContent = `Hello ${currentAccount.owner
      .slice(0, currentAccount.owner.indexOf(" "))
      .toLowerCase()}!`;
    //DISPLAY THE DATE OF LOGIN
    // labelDate.textContent = new Date(year);

    //UPDATE UI WITH ""
    inputClosePin.value =
      inputLoginUsername.value =
      inputTransferAmount.value =
      inputTransferTo.value =
      inputCloseUsername.value =
      inputLoanAmount.value =
      inputLoginPin.value =
        "";

    //DISPLAY THE BALANCE
    displayBalance(currentAccount);
    //DISPLAY THE MOVMENTS
    displayMovements(currentAccount.movements);
    //DISPLAY IN
    displayIn(currentAccount);
    //DISPLAY OUT
    displayOut(currentAccount);
    //DISPLAY INTREST
    displayIntrest(currentAccount);
    //TRANSFER MONEY
    inputLoginPin.value = "";
    inputLoginUsername.value = "";
  }
  //TRANSFER MONEY
  btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();
    const to = accounts.find((acc) => acc.userName === inputTransferTo.value);
    const amount = Number(inputTransferAmount.value);
    if (to && amount > 0 && to.userName !== currentAccount.userName) {
      trasnfer(currentAccount, to, amount);
    }
  });
  //LOANMONEY
  btnLoan.addEventListener("click", function (e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if (amount > 0) loanMoney(currentAccount, amount);
  });
  //CLOSE ACCOUNT
  btnClose.addEventListener("click", function (e) {
    e.preventDefault();
    if (
      currentAccount.userName === inputCloseUsername.value &&
      currentAccount.pin === Number(inputClosePin.value)
    ) {
      closeAcc(currentAccount);
      logout();
      inputCloseUsername.value = inputClosePin.value = "";
      labelWelcome.textContent = "Log in to get started";
    }
  });
  let sorted = true;
  btnSort.addEventListener("click", function (e) {
    e.preventDefault();
    if (sorted) {
      displayMovements(currentAccount.movements, true);
      sorted = false;
    } else {
      displayMovements(currentAccount.movements, false);
      sorted = true;
    }
  });
};

//*******************EVENT LISTNER***********
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  login();
});

const overallBalance = function (accs) {
  return accs
    .map((acc) => acc.movements)
    .flat()
    .reduce((sum, mov) => sum + mov, 0);
};
