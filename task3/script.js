// 1. Инициализация состояния (массив объектов)
let tasks = [];
let currentFilter = 'all'; // Текущий фильтр: 'all', 'active', 'completed'
let taskIdCounter = 1; // Для уникальных ID

// 2. Получаем элементы DOM
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const counter = document.getElementById('counter');
const filterBtns = document.querySelectorAll('.filter-btn');
const errorMsg = document.getElementById('error-msg');

// 3. Функция добавления задачи
function addTask() {
    const text = taskInput.value.trim(); // Убираем пробелы по краям

    // Проверка на пустую строку
    if (text === '') {
        errorMsg.textContent = 'Пожалуйста, введите текст задачи!';
        return; // Прерываем функцию, задача не добавляется
    }

    // Очищаем сообщение об ошибке, если всё ок
    errorMsg.textContent = '';

    // Создаем объект новой задачи
    const newTask = {
        id: taskIdCounter++,
        text: text,
        completed: false
    };

    // Добавляем в массив
    tasks.push(newTask);

    // Очищаем поле ввода
    taskInput.value = '';

    // Перерисовываем интерфейс
    render();
}

// 4. Функция обновления счетчика
function updateCounter() {
    // Используем filter для подсчета выполненных и активных
    const completedCount = tasks.filter(task => task.completed).length;
    const activeCount = tasks.length - completedCount;
    counter.textContent = `Осталось: ${activeCount}, Выполнено: ${completedCount}`;
}

// 5. Главная функция отрисовки (Render)
function render() {
    // Очищаем список перед перерисовкой
    taskList.innerHTML = '';

    // Фильтруем массив в зависимости от текущего фильтра
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // для 'all'
    });

    // Используем map для создания HTML-элементов на основе отфильтрованного массива
    // (По сути, мы создаем элементы и сразу добавляем их в DOM)
    filteredTasks.map(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Внутренняя структура задачи (собираем через innerHTML для удобства)
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
            </div>
            <button class="delete-btn">Удалить</button>
        `;

        // Находим элементы внутри созданной строки для навешивания событий
        const checkbox = li.querySelector('input[type="checkbox"]');
        const deleteBtn = li.querySelector('.delete-btn');

        // Обработчик чекбокса (выполнено/не выполнено)
        checkbox.addEventListener('change', () => {
            // Находим задачу в массиве по ID и меняем статус
            const taskToToggle = tasks.find(t => t.id === task.id);
            if (taskToToggle) {
                taskToToggle.completed = !taskToToggle.completed;
                render(); // Перерисовываем
            }
        });

        // Обработчик кнопки удаления
        deleteBtn.addEventListener('click', () => {
            // Оставляем в массиве только те задачи, чей ID не совпадает с удаляемым
            tasks = tasks.filter(t => t.id !== task.id);
            render(); // Перерисовываем
        });

        // Возвращаем созданный элемент и добавляем в DOM
        taskList.appendChild(li);
        return li; // map требует возврата значения
    });

    // Обновляем счетчик после каждой перерисовки
    updateCounter();
}

// 6. Обработчики событий для добавления
// Клик по кнопке
addBtn.addEventListener('click', addTask);

// Нажатие клавиши Enter в поле ввода
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// 7. Обработчики событий для фильтров
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем класс active у всех кнопок
        filterBtns.forEach(b => b.classList.remove('active'));
        // Добавляем класс active нажатой
        btn.classList.add('active');
        
        // Меняем текущий фильтр
        currentFilter = btn.dataset.filter;
        
        // Перерисовываем список
        render();
    });
});

// Первичный запуск отрисовки (чтобы интерфейс был готов)
render();