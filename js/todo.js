(function() {
  "use strict";

  //trim polyfill for older browsers
  if (!String.prototype.trim) {
    (function() {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function() {
        return this.replace(rtrim, '');
      };
    })();
  }

  //initialize variables
  var todoApp = {};
      todoApp.utils = {},
      todoApp.elems = {},
      todoApp.todoFunctions = {},
      todoApp.todoList = [];

  //setup event listeners in utils
  if(typeof window.addEventListener === 'function') {
    todoApp.utils.addListener = function(el, type, fn) {
      el.addEventListener(type, fn, false);
    };
    todoApp.utils.removeListener = function(el, type, fn) {
      el.removeEventListener(type, fn, false);
    };
  } else if(typeof document.attachEvent === 'function'){
    todoApp.utils.addListener = function(el, type, fn) {
      el.attachEvent('on' + type, fn);
    };
    todoApp.utils.removeListener = function(el, type, fn) {
      el.detachEvent('on' + type, fn);
    };
  } else {
    todoApp.utils.addListener = function(el, type, fn) {
      el['on' + type] = fn;
    };
    todoApp.utils.removeListener = function(el, type, fn) {
      el['on' + type] = null;
    };
  }

  //////ELEMENTS//////

  //set elements that will be used
  todoApp.elems.inputTodo = document.getElementById('inputTodo');
  todoApp.elems.todoList = document.getElementById('todoList');
  todoApp.elems.updateAll = document.getElementById('updateAll');

  //////FUNCTIONS//////

  //add a todo item
  todoApp.todoFunctions.addTodo = function (evt) {

    //function variables
    var keycode,
        listItem,
        listItemSpan,
        statusBtn,
        deleteBtn;

    //does browser use evt.key or keyCode?
    evt.key ? keycode = evt.key : keycode = evt.keyCode;

    //was the key pressed the enter key?
    if ((keycode === 'Enter' || keycode === 13) && todoApp.elems.inputTodo.value !== '') {

        //push todo details to todoApp.todoList array
        todoApp.todoList.push({
          _id: todoApp.todoList.length,
          itemName: todoApp.elems.inputTodo.value,
          completed: false
        });

        console.log(todoApp.todoList);
        //create list item
        listItem = todoApp.todoFunctions.buildList();

        //create span to hold list item value
        listItemSpan = todoApp.todoFunctions.buildListSpan();

        //create status button
        statusBtn = todoApp.todoFunctions.buildStatusBtn();

        //create delete button
        deleteBtn = todoApp.todoFunctions.buildDeleteBtn();

        //append children of listItem
        listItem.appendChild(statusBtn);
        listItem.appendChild(listItemSpan);
        listItem.appendChild(deleteBtn);

        //append listItem to ul#todoList on index page
        todoApp.elems.todoList.appendChild(listItem);

        //reset inputTodo
        todoApp.elems.inputTodo.value = '';

        //add event listener for button to update status of listItem
        todoApp.utils.addListener(statusBtn, 'click', todoApp.todoFunctions.updateStatus);

        //add event listener for button to delete listItem
        todoApp.utils.addListener(deleteBtn, 'click', todoApp.todoFunctions.deleteItem);

      }

  };

  //build a list item
  todoApp.todoFunctions.buildList = function () {
    var listItem;

    listItem = document.createElement('li');
    listItem.className = 'todo-list-item';
    listItem.classList.add('incomplete');

    return listItem;
  };

  //build a span for text in a list item
  todoApp.todoFunctions.buildListSpan = function () {
    var listItemSpan;

    listItemSpan = document.createElement('span');
    listItemSpan.className = 'list-item-text';
    listItemSpan.innerHTML = todoApp.elems.inputTodo.value.trim();

    return listItemSpan;
  };

  //build a status button
  todoApp.todoFunctions.buildStatusBtn = function () {
    var statusBtn;

    statusBtn = document.createElement('button');
    statusBtn.className = 'status';
    statusBtn.innerHTML = 'completed';

    return statusBtn;
  };

  //build a delete button
  todoApp.todoFunctions.buildDeleteBtn = function () {
    var deleteBtn;

    deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.innerHTML = 'X';

    return deleteBtn;
  };

  //update state of one item to complete or incomplete
  todoApp.todoFunctions.updateStatus = function (evt) {
    var target,
        parent,
        listItemText,
        todoList = todoApp.todoList;

    evt.target ? target = evt.target : evt.currentTarget;

    target.parentElement ? parent = target.parentElement : target.parentNode;

    listItemText = target.nextElementSibling.innerHTML || target.nextSibling.innerHTML;

    for (var i = 0, l = todoList.length; i < l; i++) {
      if(todoList[i].itemName === listItemText){

        todoList[i].completed = !todoList[i].completed;

        todoList[i].completed ? target.innerHTML = 'not done' : target.innerHTML = 'completed';

        if(todoList[i].completed) {
          parent.classList.add('complete');
          parent.classList.remove('incomplete');
        } else {
          parent.classList.add('incomplete');
          parent.classList.remove('complete');
        }

      }
    }
  };

  //update all items to incomplete or complete
  todoApp.todoFunctions.updateAll = function () {
    var statusBtn;

    if(todoApp.todoList.length > 0){

      statusBtn = document.querySelectorAll('.status');


      for (var i = 0, ll = statusBtn.length; i < ll; i++) {
        statusBtn[i].click();
      }

    }
  };

  //delete an item from the list
  todoApp.todoFunctions.deleteItem = function (evt) {

    var target,
        parent,
        listItemText,
        todoList = todoApp.todoList;

    evt.target ? target = evt.target : target = evt.currentTarget;

    target.parentElement ? parent = target.parentElement : target.parentNode;

    listItemText = target.previousElementSibling.innerHTML || target.previousSibling.innerHTML;

    //remove delete event listener
    todoApp.utils.removeListener(target, 'click', todoApp.todoFunctions.deleteItem);

    if(todoList.length > 0){
      //remove from todoApp.todoList array
      for (var i = 0, l = todoList.length; i < l; i++) {

        if(todoList[i].itemName.indexOf(listItemText) !== -1) {
          todoList.splice(i, 1);
          parent.remove();
        }
      }
    }

  };

  //////EVENTS//////

  //listen for enter key and add todo to todo list
  todoApp.utils.addListener(todoApp.elems.inputTodo, 'keyup', todoApp.todoFunctions.addTodo);
  todoApp.utils.addListener(todoApp.elems.updateAll, 'click', todoApp.todoFunctions.updateAll);
}());
