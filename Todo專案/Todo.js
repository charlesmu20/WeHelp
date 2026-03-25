const Input = document.getElementById('input');
const AddBtn = document.getElementById('addBtn');
const TodoList = document.getElementById('todoList');

let todos=[];//建立空陣列來儲存待辦事項

//渲染待辦事項到畫面上
function renderTodos(){
    // 1. 先清空目前的畫面，不然會重複渲染
    TodoList.innerHTML ='';// 
    // 2. 跑迴圈把陣列裡的每個東西變成 <li>
    todos.forEach((todo,index)=>{
        const li = document.createElement('li');
        //checkbox框
        const checkbox=document.createElement('input');
        checkbox.type='checkbox';
        checkbox.checked=todo.completed;// 每次重新渲染時，都要根據「資料」來決定這個框框「要不要打勾」
        //監聽勾選功能(點擊時切換資料型態)
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
        //刪除按鈕
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '刪除';
        //監聽刪除功能
        deleteBtn.addEventListener('click',()=>{
            todos.splice(index,1);//從陣列中刪除該項目
            renderTodos();//重新渲染畫面
        })
        //把checkbox、文字、按鈕放到 li 裡
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        //把 li 放到 ul 裡
        TodoList.appendChild(li);
    });
    }
//新增待辦事項
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
Input.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
        addTodo();
    }
})