function getUsers() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status === 200) {
            const users = JSON.parse(xhr.responseText);
            const userList = document.querySelector('.user-list');
            userList.innerHTML = '';
            Object.keys(users).forEach((userId) => {
                const userDiv = document.createElement('div');
                const span = document.createElement('span');
                span.textContent = users[userId];
                const edit = document.createElement('button');
                edit.textContent = '수정';
                edit.addEventListener('click', () => {
                    const username = prompt('enter username to edit');
                    if (!username) return alert('enter username!!!!');
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            console.log('수정 성공');
                            getUsers();
                        } else {
                            console.log(xhr.responseText);
                        }
                    };
                    xhr.open('PUT', `/users/${userId}`);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({ username }));
                });
                const remove = document.createElement('button');
                remove.textContent = '삭제';
                remove.addEventListener('click', () => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            console.log('삭제 성공!!');
                            getUsers();
                        } else {
                            console.error(xhr.responseText);
                        }
                    };
                    xhr.open('DELETE', `/users/${userId}`);
                    xhr.send();
                });
                userDiv.appendChild(span);
                userDiv.appendChild(edit);
                userDiv.appendChild(remove);
                userList.appendChild(userDiv);
            });
        } else {
            console.error(xhr.responseText);
        }
    };
    xhr.open('GET', '/users');
    xhr.send();
}

window.onload = getUsers;

const formArea = document.getElementsByClassName('form-area')[0];

formArea.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    if (!username) return alert('enter username!!');
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status === 201) {
            console.log(xhr.responseText);
            getUsers();
        } else {
            console.error(xhr.responseText);
        }
    };
    xhr.open('POST', '/users');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ username }));
    e.target.username.value = '';
});
