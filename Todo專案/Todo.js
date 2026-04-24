const Input = document.getElementById('input');
const AddBtn = document.getElementById('addBtn');
const TodoList = document.getElementById('todoList');
const clearAllBtn=document.getElementById('clearCompleted');
const allFilterBtn = document.getElementById('filter-all');
const activeFilterBtn = document.getElementById('filter-active');
const completedFilterBtn = document.getElementById('filter-completed');

let todos=[];
let currentFilter = "all";//目前的篩選條件，預設為 "all"
//LocalStorage 相關的函式
function saveData(data){
    localStorage.setItem('todos-list',JSON.stringify(data))
}
function loadData(){
    const savedData=localStorage.getItem('todos-list');
    if(savedData){
        todos=JSON.parse(savedData);
    }
    else{
        todos=[];
    }
    setFilterButtonState(allFilterBtn);
    renderTodos();
}
//新增待辦事項函式
function addTodo() {
    const todoText = Input.value.trim();
    if(todoText ==='')
        return;
    //改成存「物件」，記錄文字與完成狀態
    const newTodo={
        text:todoText,
        completed:false
    };
    todos.push(newTodo);
    Input.value='';//清空輸入框
    Input.focus();//讓輸入框重新獲得焦點
    renderTodos();//重新渲染待辦事項
    saveData(todos);
}
//顯示哪些代辦事項的函式
function filterTodos(){
    if(currentFilter === "completed"){
        return todos.filter(todo=>todo.completed===true);
    }
    if(currentFilter === "active"){
        return todos.filter(todo=>todo.completed===false);
    }
    return todos;
}
//渲染待辦事項到畫面上
function renderTodos(){
    //先清空目前的畫面，不然會重複渲染
    TodoList.innerHTML ='';
    //顯示剩下幾個待辦事項
    let count=todos.filter(todo=>!todo.completed).length;//計算未完成的待辦事項數量
    const countElement=document.getElementById('todo-count');
    if(count===0){
        countElement.textContent='恭喜你，沒有待辦事項了！';
    }else{
        countElement.textContent=`剩下 ${count} 個待辦事項`;
    }
    //跑迴圈把陣列裡的每個東西變成 <li>
    filterTodos().forEach((todo)=>{
        const li = document.createElement('li');
        //checkbox框
        const checkbox=document.createElement('input');
        checkbox.type='checkbox';
        checkbox.checked=todo.completed;
        //監聽checkbox功能
        checkbox.addEventListener('change',()=>{
            todo.completed = checkbox.checked;//同步資料
            renderTodos();
            saveData(todos);
        });
        //文字
        const span = document.createElement('span');
        span.textContent = todo.text;
        if(todo.completed){
            span.style.textDecoration='line-through';
            span.style.color='gray';
        }
        //編輯用的 input 框
        const editInput = document.createElement('input');
        editInput.type='text';
        //編輯用的「儲存」按鈕
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '儲存';
        saveBtn.classList.add('edit-btn');
        //修改按鈕
        const editBtn = document.createElement('button');
        editBtn.textContent = '修改';
        editBtn.classList.add('edit-btn');
        //監聽修改功能
        editBtn.addEventListener('click',()=>{
            li.classList.add('editing');
            editInput.value = todo.text;
            editInput.focus();
        })
        //儲存功能函式
        function saveEdit(){
            const newText = editInput.value.trim();
            if(newText=== ''){
                return;}
            todo.text = newText;//更新資料
            renderTodos();
            saveData(todos);
        }
        ///監聽儲存功能(鍵盤事件)
        editInput.addEventListener('keydown',(e)=>{
            if(e.key==='Enter'){
                saveEdit();
            }
            if(e.key==='Escape'){
                li.classList.remove('editing');
            }
        })
        //監聽儲存功能  
        saveBtn.addEventListener('click',saveEdit);
        //刪除按鈕
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '刪除';
        deleteBtn.classList.add('delete-btn');
        //監聽刪除功能
        deleteBtn.addEventListener('click',()=>{
            let Index=todos.indexOf(todo);
            todos.splice(Index,1);//從陣列中刪除該項目
            renderTodos();
            saveData(todos);
        })
        // 建立「顯示模式」的容器 
        const viewModeDiv = document.createElement('div');
        viewModeDiv.classList.add('view-mode');
        viewModeDiv.appendChild(checkbox);
        viewModeDiv.appendChild(span);
        viewModeDiv.appendChild(editBtn);
        viewModeDiv.appendChild(deleteBtn);
        //// 建立「編輯模式」的容器
        const editModeDiv = document.createElement('div');
        editModeDiv.classList.add('edit-mode');
        editModeDiv.appendChild(editInput);
        editModeDiv.appendChild(saveBtn);
        // 把兩個容器都放到 li 裡
        li.appendChild(viewModeDiv);
        li.appendChild(editModeDiv);
        //把 li 放到 ul 裡
        TodoList.appendChild(li);
    });
    }

//「新增」按鈕事件監聽
AddBtn.addEventListener('click',()=>{
    addTodo();
})
Input.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
        addTodo();
    }
})
//監聽一鍵刪除事件監聽
clearAllBtn.addEventListener('click',()=>{
    todos=todos.filter(todo=>!todo.completed);//過濾掉已完成的事項，留下未完成的
    renderTodos();
    saveData(todos);
})
//篩選按鈕事件函式
function setFilterButtonState(btn){
    //先把三個按鈕的 active 類別都移除，再把被點擊的按鈕加上 active 類別
    allFilterBtn.classList.remove('active');
    activeFilterBtn.classList.remove('active');
    completedFilterBtn.classList.remove('active');
    btn.classList.add('active');
    //顯示一鍵刪除按鈕(只有在已完成的篩選條件下才顯示)
        if(btn===completedFilterBtn){ 
            clearAllBtn.style.display='block';
        }
        else{
            clearAllBtn.style.display='none';
        }
}
//篩選按鈕事件監聽
allFilterBtn.addEventListener('click',()=>{
    currentFilter='all';
    setFilterButtonState(allFilterBtn);
    renderTodos();
})
activeFilterBtn.addEventListener('click',()=>{
    currentFilter='active';
    setFilterButtonState(activeFilterBtn);
    renderTodos();
})
completedFilterBtn.addEventListener('click',()=>{
    currentFilter='completed';
    setFilterButtonState(completedFilterBtn);
    renderTodos();
})
// 當瀏覽器把 HTML 跟 JS 都跑完後，立刻執行讀檔
document.addEventListener('DOMContentLoaded', loadData);