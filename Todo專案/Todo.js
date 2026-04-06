
const Input = document.getElementById('input');
const AddBtn = document.getElementById('addBtn');
const TodoList = document.getElementById('todoList');

let todos=[];//建立空陣列來儲存待辦事項
let currentFilter = "all";//目前的篩選條件，預設為 "all"
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
    // 1. 先清空目前的畫面，不然會重複渲染
    TodoList.innerHTML ='';// 
    //顯示剩下幾個待辦事項
    let count=todos.filter(todo=>!todo.completed).length;//計算未完成的待辦事項數量
    const countElement=document.getElementById('todo-count');
    if(count===0){
        countElement.textContent='恭喜你，沒有待辦事項了！';
    }else{
        countElement.textContent=`剩下 ${count} 個待辦事項`;
    }
    // 2. 跑迴圈把陣列裡的每個東西變成 <li>
    filterTodos().forEach((todo,index)=>{
        const li = document.createElement('li');
        //checkbox框
        const checkbox=document.createElement('input');
        checkbox.type='checkbox';
        checkbox.checked=todo.completed;// 每次重新渲染時，都要根據「資料」來決定這個框框「要不要打勾」
        //監聽checkbox功能
        checkbox.addEventListener('change',()=>{
            todo.completed = checkbox.checked;//同步資料
            renderTodos();//重新渲染畫面，讓文字變成刪除線或恢復正常
        });
        //文字
        const span = document.createElement('span');
        span.textContent = todo.text;
        if(todo.completed){
            span.style.textDecoration='line-through';//打勾就加刪除線
            span.style.color='gray';
        }
        //編輯用的 input 框
        const editInput = document.createElement('input');
        editInput.type='text';
        //編輯用的「儲存」按鈕
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '儲存';
        //修改按鈕
        const editBtn = document.createElement('button');
        editBtn.textContent = '修改';
        //監聽修改功能
        editBtn.addEventListener('click',()=>{
            li.classList.add('editing');
            editInput.value = todo.text;
            editInput.focus();
        })
        //監聽儲存功能  
        saveBtn.addEventListener('click',()=>{
            const newText = editInput.value.trim();//取得輸入框的文字
            if(newText=== ''){
                return;}
            todo.text = newText;//更新資料
            renderTodos();//重新渲染畫面
        })
        //刪除按鈕
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '刪除';
        //監聽刪除功能
        deleteBtn.addEventListener('click',()=>{
            let Index=todos.indexOf(todo);
            todos.splice(Index,1);//從陣列中刪除該項目
            renderTodos();//重新渲染畫面
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
}
//按鈕事件監聽
AddBtn.addEventListener('click',()=>{
    addTodo();
})
//監聽鍵盤事件，按下 Enter 增加待辦事項
Input.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
        addTodo();
    }
})
//篩選按鈕事件監聽
const allFilterBtn = document.getElementById('filter-all');
const activeFilterBtn = document.getElementById('filter-active');
const completedFilterBtn = document.getElementById('filter-completed');
allFilterBtn.addEventListener('click',()=>{
    currentFilter='all';
    renderTodos();
})
activeFilterBtn.addEventListener('click',()=>{
    currentFilter='active';
    renderTodos();
})
completedFilterBtn.addEventListener('click',()=>{
    currentFilter='completed';
    renderTodos();
})
