//UI CONTROLLER
var UIcontroller = (function () {
  var DOMstrings = {
    bar1: ".bar--1",
    bar2: ".bar--2",
    bar3: ".bar--3",
  };
  
  var formatNumber = function (num, type) {
    return (type === "inc" ? "+ " : "") + num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  var formatNumber2 = function (num, type) {
    return (type === "inc" ? "+ " : "- ") + num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };
  
  var checkedIDs = [];
  
  var persistCheckedIDs = function() {
    localStorage.setItem('checks', JSON.stringify(checkedIDs));
  };
  
  
  return {
    restoreCheckedTasks: function() {
       const storage = JSON.parse(localStorage.getItem('checks'));
       if (storage) checkedIDs = storage;
       checkedIDs.forEach(taskID => {
               let taskString = DATAcontroller.readTask().find(task => task.id == taskID).task;
               document.getElementById(taskID).classList.toggle("crossOut");
               document.getElementById(taskID).classList.add("checked");
               document.getElementById(taskID).classList.remove("unchecked");
               document.getElementById(taskID).innerHTML = '<div class="wrapcheck"><div class="checks"><i class= "far fa-circle"></i></div><p>' + taskString + '</p></div><i class="fas fa-trash-alt"></i>';
               });
    },
    updateCheckedListAdd: function(taskId) {
        checkedIDs.push(taskId);
        persistCheckedIDs();
    },
    updateCheckedListRemove: function(taskId) {
        checkedIDs.splice(checkedIDs.findIndex(id => id == taskId), 1);
        persistCheckedIDs();        
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
    closeNavToDo: function () {
      toggleNav();
      showTodoApp();
    },
    closeNavBudget: function () {
      toggleNav();
      showBudgetApp();
    },
    addTextBox: function () {
      var textBoxHTMLDiv, newTask;
      newTask = document.querySelector(".btn-newtask");
      if (!document.getElementById("textboxID")) {
        textBoxHTMLDiv = document.createElement("div");
        textBoxHTMLDiv.className = "textbox__wrapper";
        textBoxHTMLDiv.id = "textboxID";
        textBoxHTMLDiv.innerHTML =
          '<div class="textbox__wrapper"><input type="text" id="todo__textbox" name="todo__textbox" autocomplete="off"/><i class="far fa-check-circle"></i></div>';
        document
          .querySelector(".todo__wrapper")
          .insertBefore(textBoxHTMLDiv, newTask);
        document.getElementById("todo__textbox").focus();
      } else {
        document.getElementById("todo__textbox").focus();
      }
    },
    hideNewTaskBtn: function () {
      document.querySelector(".btn-newtask").style.display = "none";
      document.querySelector(".delete__completed").style.display = "none";
    },
    showNewTaskBtn: function () {
      document.querySelector(".btn-newtask").style.display = "flex";
      document.querySelector(".delete__completed").style.display = "block";
    },
    getInput: function () {
      return {
        task: document.getElementById("todo__textbox").value,
      };
    },
    addTaskItem: function (obj) {
      var taskHtml;
      taskHtml = document.createElement("div");
      taskHtml.classList = "tasktext__wrapper unchecked";
      taskHtml.id = obj.id;
      taskHtml.innerHTML =
        '<div class="wrapcheck"><div class="checks"><i class= "far fa-circle"></i></div><p>' +
        obj.task +
        '</p></div><i class="fas fa-pencil-alt"></i><i class="fas fa-trash-alt"></i>';
      document
        .querySelector(".todo__wrapper")
        .insertBefore(taskHtml, document.querySelector(".btn-newtask"));
    },
    deleteTextBox: function () {
      var elem = document.querySelector(".textbox__wrapper");
      document.querySelector(".todo__wrapper").removeChild(elem);
    },
    swapEditButton: function (html, taskList) {
      var taskHtml;
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == html.id) {
          taskHtml = taskList[i].task;
        }
      }

      if (!html.classList.contains("checked")) {
        html.innerHTML =
          '<div class="wrapcheck"><div class="checks"><i class= "far fa-circle"></i></div><p>' +
          taskHtml +
          '</p></div><i class="fas fa-trash-alt"></i>';
      } else if (html.classList.contains("checked")) {
        html.innerHTML =
          '<div class="wrapcheck"><div class="checks"><i class= "far fa-circle"></i></div><p>' +
          taskHtml +
          '</p></div><i class="fas fa-pencil-alt"></i>';
      }
    },
    deleteTaskUI: function (selectorID) {
      var node = document.getElementById(selectorID);
      node.parentNode.removeChild(node);
    },
    restoreTaskState: function (selectorID) {
      var task = DATAcontroller.readTask();
      for (let i = 0; i < task.length; i++) {
        if (task[i].id == selectorID) {
          task = task[i].task;
        }
      }
      document.getElementById(selectorID).className =
        "tasktext__wrapper unchecked";
      document.getElementById(selectorID).innerHTML =
        '<div class="wrapcheck"><div class="checks"><i class= "far fa-circle"></i></div><p>' +
        task +
        '</p></div><i class="fas fa-pencil-alt"></i><i class="fas fa-trash-alt"></i>';
    },
    saveInput: function (newTask, id) {
      document.getElementById(id).className = "tasktext__wrapper unchecked";
      document.getElementById(id).innerHTML =
        '<div class="wrapcheck"><div class="checks"><i class= "far fa-circle"></i></div><p>' +
        newTask +
        '</p></div><i class="fas fa-pencil-alt"></i><i class="fas fa-trash-alt"></i>';
    },
    deleteCompleted: function () {
      var fields = document.querySelectorAll(".tasktext__wrapper");

      [].forEach.call(fields, function (current) {
        if (current.classList.contains("checked")) {
          current.classList.add("slideout");
          document
            .querySelector(".slideout")
            .addEventListener("transitionend", function (event) {
              if (event.propertyName == "opacity") {
                DATAcontroller.deleteTaskData(current.id);
                current.remove();
                UIcontroller.updateCheckedListRemove(current.id);
              }
            });
        }
      });
    },
    clearFields: function () {
      document.getElementById("moneyinput").value = "";
      document.getElementById("descriptioninput").value = "";
      document.getElementById("moneyinput").focus();
    },
    displayBudget: function () { },
    updateBudgetUI: function (obj) {
      if (obj.budget > 0) {
        document.querySelector(".totalBudget").textContent = formatNumber(
          obj.budget,
          "inc"
        );
      } else if (obj.budget == 0) {
        document.querySelector(".totalBudget").textContent = "$ 0.00";
      } else {
        document.querySelector(".totalBudget").textContent = formatNumber(
          obj.budget,
          "dec"
        );
      }
      document.querySelector(".totalInc").textContent = formatNumber(
        obj.totals.inc,
        "inc"
      );
      document.querySelector(".totalDec").textContent = formatNumber(
        obj.totals.dec,
        "dec"
      );
    },
    addNewItem: function (obj) {
      var e = document.querySelector("." + obj.type + "__list");
      var n =
        '<div class="bordershadow" id="' +
        obj.type +
        "-" +
        obj.id +
        '"><h2>' +
        obj.descrition +
        "</h2><p>" +
        formatNumber2(obj.amount, obj.type) +
        '</p><i class="far fa-times-circle"></i></div>';
      e.insertAdjacentHTML("beforeend", n);
    },
    deleteItem: function (selectorID, field) {
      list = document.querySelector(field);
      node = document.getElementById(selectorID);
      list.removeChild(node);
    },

    completeCheck: function () {
      let list = document.querySelectorAll('.checked');

      if (list.length == 0) {
        document.querySelector('.delete__completed').innerHTML = "";
      } else if (list.length > 0) {
        document.querySelector('.delete__completed').innerHTML = `<h4>Delete all completed (${list.length})<h4>`;
      }
    }
  };
})();

//DATA CONTROLLER
var DATAcontroller = (function () {
  var Task = function (id, task) {
    (this.id = id), (this.task = task);
  };

  var Income = function (id, type, descrition, amount) {
    (this.id = id),
      (this.type = type),
      (this.descrition = descrition),
      (this.amount = amount);
  };

  var Expense = function (id, type, descrition, amount) {
    (this.id = id),
      (this.type = type),
      (this.descrition = descrition),
      (this.amount = amount);
  };
  

  var taskList = [];
  var budgetList = {
    inc: [],
    dec: [],
    totals: {
      inc: 0,
      dec: 0,
    },
    budget: 0,
  };

  var persistTaskData = function () {
    localStorage.setItem('tasks', JSON.stringify(taskList));
  };

  var persistBudgetData = function (type) {
    localStorage.setItem(`${type}`, JSON.stringify(budgetList[type]));
  };
  
  return {
    pushInput: function (input) {
      var newItem, ID;

      if (taskList.length > 0) {
        ID = taskList[taskList.length - 1].id + 1;
      } else {
        ID = 0;
      }

      newItem = new Task(ID, input);
      taskList.push(newItem);
      persistTaskData();
      return newItem;
    },
    inputGetBudget: function () {
      var newItem, ID;
      var type = incrementValue;
      var desc = document.getElementById("descriptioninput").value;
      var amount = parseFloat(document.getElementById("moneyinput").value);
      if (budgetList[type].length > 0) {
        ID = budgetList[type][budgetList[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === "inc") {
        newItem = new Income(ID, type, desc, amount);
      } else if (type === "dec") {
        newItem = new Expense(ID, type, desc, amount);
      }
      budgetList[type].push(newItem);
      persistBudgetData(type);
      return newItem;
    },
    testing: function () {
      console.log(taskList);
    },
    testing2: function () {
      console.log(budgetList);
    },
    readTask: function () {
      return taskList;
    },
    readBudgetInc: function () {
      return budgetList.inc;
    },
    readBudgetDec: function () {
      return budgetList.dec;
    },
    deleteTaskData: function (taskID) {
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == taskID) {
          taskList.splice(i, 1);
          persistTaskData();
        }
      }
    },
    editInputArray: function (newTask, ID) {
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == ID) {
          taskList[i].task = newTask;
          persistTaskData();
        }
      }
    },
    updateData: function (type) {
      var sum = 0;
      budgetList[type].forEach(function (cur) {
        sum += cur.amount;
      });
      budgetList.totals[type] = sum;
      budgetList.budget = budgetList.totals.inc - budgetList.totals.dec;
      //console.log(budgetList);
    },
    getBudgetData: function () {
      return budgetList;
    },
    deleteBudgetItem: function (selectorID, type) {
      var numID = selectorID.split("-");
      for (let i = 0; i < budgetList[type].length; i++) {
        if (budgetList[type][i].id == numID[1]) {
          budgetList[type].splice(i, 1);
          persistBudgetData(type);
        }
      }
    },
    readTaskStorage: function () {
      const storage = JSON.parse(localStorage.getItem('tasks'));
      if (storage) taskList = storage;
    },

    readBudgetStorage: function () {
      const inc = JSON.parse(localStorage.getItem('inc'));
      const dec = JSON.parse(localStorage.getItem('dec'));
      if (inc) budgetList.inc = inc;
      if (dec) budgetList.dec = dec;
    }
  };



})();

//GLOBAL CONTROLLER
var controller = (function (uiCtrl, dataCtrl) {
  var DOMs = uiCtrl.getDOMstrings();
  var setupEventListeners = function () {
    document
      .querySelector(".bar__wrapper")
      .addEventListener("click", function () {
        toggleNav();
      });
    document
      .querySelector(".todo__button")
      .addEventListener("click", showTodoApp);
    document
      .querySelector(".budget__button")
      .addEventListener("click", showBudgetApp);

    document
      .querySelector(".btn-newtask")
      .addEventListener("click", function () {
        //1. Create a text box
        uiCtrl.addTextBox();
        uiCtrl.hideNewTaskBtn();
      });
    document
      .querySelector(".todo__wrapper")
      .addEventListener("click", submitTodo);
    document.addEventListener("keypress", function (e) {
      if (e.keycode === 13 || e.which === 13) {
        if (document.getElementById("textboxID")) {
          SubmitTodoEnterKey();
        } else if (document.getElementById("inputEdit")) {
          var el = document.getElementById("inputEdit");
          var elID = el.parentNode.parentNode.parentNode.parentNode.id;
          var editedTask = document.getElementById("inputEdit").value;
          if (editedTask !== "") {
            uiCtrl.saveInput(editedTask, elID);
            dataCtrl.editInputArray(editedTask, elID);
          }
        } else if (
          document.getElementById("moneyinput") &&
          document.getElementById("moneyinput").value !== "" &&
          !isNaN(document.getElementById("moneyinput").value) &&
          document.getElementById("moneyinput").value > 0
        ) {
          document.querySelector(".input__area").style.display = "none";
          document.querySelector(".input__area-2").style.display = "flex";
          submitBudget();
          document.getElementById("descriptioninput").focus();
        } else if (
          document.getElementById("descriptioninput") &&
          document.getElementById("descriptioninput").value !== ""
        ) {
          document.querySelector(".input__area").style.display = "flex";
          document.querySelector(".input__area-2").style.display = "none";
          document.getElementById("moneyinput").focus();
        }
        /*var key = e.keyCode;
      switch (key) {
        case 13:
          if (document.getElementById("textboxID")) {
            SubmitTodoEnterKey();
          } else if (document.getElementById("inputEdit")) {
            submitEditEnterKey();
          }
          break;
      }*/
      }
    });
    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.keyCode == 27) {
        if (document.getElementById("inputEdit")) {
          var id = document.getElementById("inputEdit").parentNode.parentNode
            .parentNode.parentNode.id;
          uiCtrl.restoreTaskState(id);
        }
      }
    };
    document
      .querySelector(".todo__wrapper")
      .addEventListener("click", checkedClick);
    document
      .querySelector(".todo__wrapper")
      .addEventListener("click", trashClick);
    document
      .querySelector(".todo__wrapper")
      .addEventListener("click", editClick);

    document
      .querySelector(".todo__wrapper")
      .addEventListener("focusout", function () {
        var element = document.getElementById("inputEdit");
        var element2 = document.getElementById("todo__textbox");
        if (element && element.value == "") {
          var textboxID =
            element.parentNode.parentNode.parentNode.parentNode.id;
          uiCtrl.restoreTaskState(textboxID);
        } else if (element2 && element2.value == "") {
          uiCtrl.deleteTextBox();
          uiCtrl.showNewTaskBtn();
        }
      });
    document
      .querySelector(".budget__MOBILE")
      .addEventListener("click", mobileClick);
    document
      .querySelector(".inc__btn")
      .addEventListener("click", function (event) {
        if (!event.target.parentNode.classList.contains("inc__btn--active")) {
          document
            .querySelector(".inc__btn")
            .classList.toggle("inc__btn--active");
          document
            .querySelector(".dec__btn")
            .classList.toggle("dec__btn--active");
          document.querySelector(".inc__wrapper").style.display = "block";
          document.querySelector(".dec__wrapper").style.display = "none";
        }
      });
    document
      .querySelector(".dec__btn")
      .addEventListener("click", function (event) {
        if (!event.target.parentNode.classList.contains("dec__btn--active")) {
          document
            .querySelector(".inc__btn")
            .classList.toggle("inc__btn--active");
          document
            .querySelector(".dec__btn")
            .classList.toggle("dec__btn--active");
          document.querySelector(".inc__wrapper").style.display = "none";
          document.querySelector(".dec__wrapper").style.display = "block";
        }
      });
    document
      .querySelector(".inc__wrapper")
      .addEventListener("click", deleteClickInc);
    document
      .querySelector(".dec__wrapper")
      .addEventListener("click", deleteClickDec);

    mql.addListener(screenTest);
  };

  var deleteClickInc = function (event) {
    if (event.target.classList.contains("fa-times-circle")) {
      dataCtrl.deleteBudgetItem(event.target.parentNode.id, "inc");
      uiCtrl.deleteItem(event.target.parentNode.id, ".inc__list");
      dataCtrl.updateData("inc");
      uiCtrl.updateBudgetUI(dataCtrl.getBudgetData());
    }
  };
  var deleteClickDec = function (event) {
    if (event.target.classList.contains("fa-times-circle")) {
      dataCtrl.deleteBudgetItem(event.target.parentNode.id, "dec");
      uiCtrl.deleteItem(event.target.parentNode.id, ".dec__list");
      dataCtrl.updateData("dec");
      uiCtrl.updateBudgetUI(dataCtrl.getBudgetData());
    }
  };
  var SubmitTodoEnterKey = function () {
    var input;
    // 1. read and store input
    input = uiCtrl.getInput();
    if (input.task !== "") {
      newItem = dataCtrl.pushInput(input.task);
      // 2. add item to UI
      uiCtrl.addTaskItem(newItem);

      // 3. delete inputbox
      uiCtrl.deleteTextBox();
      uiCtrl.showNewTaskBtn();
    }
  };
  var submitTodo = function (event) {
    var submit = event.target;
    if (submit.classList.contains("fa-check-circle")) {
      var input;
      // 1. read and store input
      input = uiCtrl.getInput();
      if (input.task !== "") {
        newItem = dataCtrl.pushInput(input.task);
        // 2. add item to UI
        uiCtrl.addTaskItem(newItem);

        // 3. delete inputbox
        uiCtrl.deleteTextBox();
        uiCtrl.showNewTaskBtn();
      }
    }
  };
  var checkedClick = function (event) {
    var check = event.target;

    var checkParent = event.target.parentNode.parentNode.parentNode;
    var taskList = dataCtrl.readTask();
    if (
      check.classList.contains("fa-circle") &&
      !checkParent.classList.contains("checked")
    ) {
      //////console.log(check.parentNode.parentNode.parentNode);
      document
        .getElementById(check.parentNode.parentNode.parentNode.id)
        .classList.toggle("crossOut");
      uiCtrl.swapEditButton(checkParent, taskList);
      document.getElementById(checkParent.id).classList.add("checked");
      document.getElementById(checkParent.id).classList.remove("unchecked");
      uiCtrl.updateCheckedListAdd(checkParent.id);
      uiCtrl.completeCheck();
    } else if (
      check.classList.contains("fa-circle") &&
      checkParent.classList.contains("checked")
    ) {
      document
        .getElementById(check.parentNode.parentNode.parentNode.id)
        .classList.toggle("crossOut");
      uiCtrl.swapEditButton(checkParent, taskList);
      document.getElementById(checkParent.id).classList.add("unchecked");
      document.getElementById(checkParent.id).classList.remove("checked");
      uiCtrl.restoreTaskState(checkParent.id);
      uiCtrl.updateCheckedListRemove(checkParent.id);
      uiCtrl.completeCheck();
    } else if (check.classList.contains("fa-times-circle")) {
      if (document.getElementById("inputEdit")) {
        var inputID =
          event.target.parentNode.parentNode.parentNode.parentNode.id;
        uiCtrl.restoreTaskState(inputID);
      }
    } else if (check.parentNode.classList.contains("delete__completed")) {
      uiCtrl.deleteCompleted();
      document
        .querySelector(".slideout")
        .addEventListener("transitionend", function (event) {
          if (event.propertyName == "opacity") {
            document.querySelector('.delete__completed').innerHTML = "";
          }
        });
    }
  };
  var editClick = function (event) {
    var editBtn = event.target;
    var editBtnID = event.target.parentNode.id;
    if (editBtn.classList.contains("fa-pencil-alt")) {
      if (!document.getElementById("inputEdit")) {
        editBtn.className = "far fa-save";
        document
          .getElementById(editBtnID)
          .querySelector(".fa-trash-alt").style.display = "none";
        editBtn.previousSibling.innerHTML =
          '<div class="wrapcheck"><div class="checks"><i class= "far fa-times-circle"></i></div><div class= "edit__textbox"><input type="text" id="inputEdit" autocomplete="off" placeholder="Esc to cancel..."></div>';
        document.getElementById("inputEdit").focus();
      } else {
        document.getElementById("inputEdit").focus();
      }
    } else if (editBtn.classList.contains("fa-save")) {
      var editedTask = document.getElementById("inputEdit").value;
      if (editedTask !== "") {
        uiCtrl.saveInput(editedTask, editBtnID);
        dataCtrl.editInputArray(editedTask, editBtnID);
      } else {
        document.getElementById("inputEdit").focus();
      }
    }
  };
  var trashClick = function (event) {
    var trashBtn = event.target;
    var trashBtnID = event.target.parentNode.id;
    if (trashBtn.classList.contains("fa-trash-alt")) {
      event.target.parentNode.classList.add("slideout");
      document
        .querySelector(".slideout")
        .addEventListener("transitionend", function (event) {
          if (event.propertyName == "opacity") {
            dataCtrl.deleteTaskData(trashBtnID);
            uiCtrl.deleteTaskUI(trashBtnID);
            uiCtrl.completeCheck();
          }
        });
    }
  };
  var mobileClick = function (event) {
    var clickTarget = event.target;
    if (clickTarget.classList.contains("fa-plus-square")) {
      incrementValue = "inc";
      document.querySelector(".fa-plus-square").classList.add("inc--active");
      document
        .querySelector(".fa-minus-square")
        .classList.remove("dec--active");
      document.querySelector(".fa-check-square").classList.add("green");
      document.querySelector(".fa-check-square").classList.remove("red");
      document.querySelector(".inc__btn").classList.add("inc__btn--active");
      document.querySelector(".dec__btn").classList.remove("dec__btn--active");
      document.querySelector(".inc__wrapper").style.display = "block";
      document.querySelector(".dec__wrapper").style.display = "none";
      document.getElementById("moneyinput").focus();
    } else if (clickTarget.classList.contains("fa-minus-square")) {
      incrementValue = "dec";
      document.querySelector(".fa-plus-square").classList.remove("inc--active");
      document.querySelector(".fa-minus-square").classList.add("dec--active");
      document.querySelector(".fa-check-square").classList.remove("green");
      document.querySelector(".fa-check-square").classList.add("red");
      document.querySelector(".inc__btn").classList.remove("inc__btn--active");
      document.querySelector(".dec__btn").classList.add("dec__btn--active");
      document.querySelector(".inc__wrapper").style.display = "none";
      document.querySelector(".dec__wrapper").style.display = "block";
      document.getElementById("moneyinput").focus();
    } else if (
      clickTarget.classList.contains("fa-check-square") &&
      document.getElementById("moneyinput").value !== "" &&
      !isNaN(document.getElementById("moneyinput").value) &&
      document.getElementById("moneyinput").value > 0
    ) {
      document.querySelector(".input__area").style.display = "none";
      document.querySelector(".input__area-2").style.display = "flex";
      submitBudget();
      document.getElementById("descriptioninput").focus();
    } else if (
      clickTarget.classList.contains("fa-check-circle") &&
      document.getElementById("descriptioninput").value !== ""
    ) {
      document.querySelector(".input__area").style.display = "flex";
      document.querySelector(".input__area-2").style.display = "none";
      document.getElementById("moneyinput").focus();
    }

  };
  var submitBudget = function () {
    var item = dataCtrl.inputGetBudget();
    uiCtrl.clearFields();
    dataCtrl.updateData(item.type);
    uiCtrl.updateBudgetUI(dataCtrl.getBudgetData());
    uiCtrl.addNewItem(item);
  };

  return {
    init: function () {
      setupEventListeners();
      showTodoApp();
      document.querySelector(".inc__btn").classList.toggle("inc__btn--active");
      document.querySelector(".inc__wrapper").style.display = "block";
      document.querySelector(".dec__wrapper").style.display = "none";
      dataCtrl.readTaskStorage();
      dataCtrl.readTask().forEach(task => uiCtrl.addTaskItem(task));
      uiCtrl.restoreCheckedTasks();
      uiCtrl.completeCheck();
      dataCtrl.readBudgetStorage();
      dataCtrl.readBudgetInc().forEach(inc => uiCtrl.addNewItem(inc));
      dataCtrl.readBudgetDec().forEach(dec => uiCtrl.addNewItem(dec));
      dataCtrl.updateData('inc');
      dataCtrl.updateData('dec');
      uiCtrl.updateBudgetUI(dataCtrl.getBudgetData());
    },
  };
})(UIcontroller, DATAcontroller);

var toggleNav = function () {
  document.querySelector(".bar--1").classList.toggle("bar1Active");
  document.querySelector(".bar--2").classList.toggle("bar2Active");
  document.querySelector(".bar--3").classList.toggle("bar3Active");
  document.querySelector(".hamLinks").classList.toggle("displayBlock");
  document.querySelector(".hamLinksBg").classList.toggle("hamLinksBgActive");
  document.querySelector(".bgShade").classList.toggle("bgShadeActive");
};

var removeNav = function () {
  document.querySelector(".bar--1").classList.remove("bar1Active");
  document.querySelector(".bar--2").classList.remove("bar2Active");
  document.querySelector(".bar--3").classList.remove("bar3Active");
  document.querySelector(".hamLinks").classList.remove("displayBlock");
  document.querySelector(".hamLinksBg").classList.remove("hamLinksBgActive");
  document.querySelector(".bgShade").classList.remove("bgShadeActive");
};

var showTodoApp = function () {
  document.querySelector(".todo__wrapper").style.display = "block";
  document.querySelector(".budget__wrapper").style.display = "none";
  document.querySelector(".todo__button").classList.add("todo__button--active");
  document
    .querySelector(".budget__button")
    .classList.remove("budget__button--active");
};

var showBudgetApp = function () {
  document.querySelector(".todo__wrapper").style.display = "none";
  document.querySelector(".budget__wrapper").style.display = "block";
  document
    .querySelector(".todo__button")
    .classList.remove("todo__button--active");
  document
    .querySelector(".budget__button")
    .classList.add("budget__button--active");
  document.querySelector(".fa-plus-square").classList.add("inc--active");
  document.querySelector(".fa-minus-square").classList.remove("dec--active");
  document.querySelector(".fa-check-square").classList.add("green");
  document.querySelector(".fa-check-square").classList.remove("red");
  document.querySelector(".inc__btn").classList.add("inc__btn--active");
  document.querySelector(".dec__btn").classList.remove("dec__btn--active");
  document.querySelector(".inc__wrapper").style.display = "block";
  document.querySelector(".dec__wrapper").style.display = "none";
  incrementValue = "inc";
};

var mql = window.matchMedia("(min-width: 786px)");

function screenTest(e) {
  if (e.matches) {
    removeNav();
  }
}

mql.addListener(screenTest);

var temp = "";
var incrementValue = "inc";
controller.init();
