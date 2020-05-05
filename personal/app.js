function hasTouch() {
  return (
    "ontouchstart" in document.documentElement ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

if (hasTouch()) {
  // remove all the :hover stylesheets
  try {
    // prevent exception on browsers not supporting DOM styleSheets properly
    for (var si in document.styleSheets) {
      var styleSheet = document.styleSheets[si];
      if (!styleSheet.rules) continue;

      for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
        if (!styleSheet.rules[ri].selectorText) continue;

        if (styleSheet.rules[ri].selectorText.match(":hover")) {
          styleSheet.deleteRule(ri);
        }
      }
    }
  } catch (ex) {}
}

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
};

var mql = window.matchMedia("(min-width: 786px)");

function screenTest(e) {
  if (e.matches) {
    removeNav();
  }
}

mql.addListener(screenTest);

//UI CONTROLLER
var UIcontroller = (function () {
  var DOMstrings = {
    bar1: ".bar--1",
    bar2: ".bar--2",
    bar3: ".bar--3",
  };

  return {
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
          '<div class="textbox__wrapper"><input type="text" id="todo__textbox" name="todo__textbox"/><i class="far fa-check-circle"></i></div>';
        document
          .querySelector(".todo__wrapper")
          .insertBefore(textBoxHTMLDiv, newTask);
        document.getElementById("todo__textbox").focus();
      } else {
        document.getElementById("todo__textbox").focus();
      }
    },
    hideNewTaskBtn: function () {
      document.querySelector(".btn-newtask").style.opacity = "0";
    },
    showNewTaskBtn: function () {
      document.querySelector(".btn-newtask").style.opacity = "1";
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
        '</p></div><i class="fas fa-pencil-alt"></i></i></i>';
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
          '</p></div><i class="fas fa-trash-alt"></i></i></i>';
      } else if (html.classList.contains("checked")) {
        html.innerHTML =
          '<div class="wrapcheck"><div class="checks"><i class= "far fa-circle"></i></div><p>' +
          taskHtml +
          '</p></div><i class="fas fa-pencil-alt"></i></i></i>';
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
        '</p></div><i class="fas fa-pencil-alt"></i></i></i>';
    },
    saveInput: function (newTask, id) {
      document.getElementById(id).className = "tasktext__wrapper unchecked";
      document.getElementById(id).innerHTML =
        '<div class="wrapcheck"><div class="checks"><i class= "far fa-circle"></i></div><p>' +
        newTask +
        '</p></div><i class="fas fa-pencil-alt"></i></i></i>';
    },
  };
})();

//DATA CONTROLLER
var DATAcontroller = (function () {
  var Task = function (id, task) {
    (this.id = id), (this.task = task);
  };

  var taskList = [];

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
      return newItem;
    },
    testing: function () {
      console.log(taskList);
    },
    readTask: function () {
      return taskList;
    },
    deleteTaskData: function (taskID) {
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == taskID) {
          taskList.splice(i, 1);
        }
      }
    },
    editInputArray: function (newTask, ID) {
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == ID) {
          taskList[i].task = newTask;
        }
      }
    },
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
        }
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
  var submitEditEnterKey = function () {
    // stuff
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
    } else if (check.classList.contains("fa-times-circle")) {
      if (document.getElementById("inputEdit")) {
        var inputID =
          event.target.parentNode.parentNode.parentNode.parentNode.id;
        uiCtrl.restoreTaskState(inputID);
      }
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
          .insertAdjacentHTML("beforeend", '<i class="fas fa-trash-alt"></i>');
        editBtn.previousSibling.innerHTML =
          '<div class="wrapcheck"><div class="checks"><i class= "far fa-times-circle"></i></div><div class= "edit__textbox"><input type="text" id="inputEdit" autocomplete="off" placeholder="Press ESC to cancel..."></div>';
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
      dataCtrl.deleteTaskData(trashBtnID);
      uiCtrl.deleteTaskUI(trashBtnID);
    }
  };
  return {
    init: function () {
      console.log("Application has started.");
      setupEventListeners();
      showTodoApp();
    },
  };
})(UIcontroller, DATAcontroller);

controller.init();
