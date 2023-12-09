 //     new  User ({
            //     id: '1',
            //     name: "dan",
            //     phone: "+37529 222 22 22", 
            //     email: "dan@test.by",
            //     addres: "Minsk"
            // }),

            // new  User({
            //     id: '2',
            //     name: "Max",
            //     phone: "+37529 222 1112", 
            //     email: "max@test.by",
            //     addres: "New York"
            // })

class User {
    constructor(data) {
        this.data = data;
    }

    edit(updatedData) {
        this.data = {
            ...this.data,
            ...updatedData,
        }
    }

    get() {
       return this.data;
    }
}


class Contacts {
    constructor(){
        this.contactsData = this.createUserFromLocalStorage() ?? [];
    }

    createUserFromLocalStorage(){
        const localStorageData = JSON.parse(localStorage.getItem('contactsItem'));

        if(!localStorageData){
            return undefined;
        }

        const userFromLocalStorage = localStorageData.map((item) => {
            return new User(item.data);
        });

        return userFromLocalStorage;
    }

    setLocaleStorage(){
        localStorage.setItem('contactsItem', JSON.stringify(this.contactsData));
    }

    add(userData){
       this.contactsData.push(new User(userData));
       this.setLocaleStorage();
    }

    editContactUser(id, updatedUserData){
        this.contactsData = this.contactsData.map((user) => {
            if(user.data.id === id){
                user.edit(updatedUserData);
            }

            return user;
        });

        this.setLocaleStorage();
    }

    remove(id){
        this.contactsData = this.contactsData.filter((user) => user.data.id !== id);
        localStorage.setItem('contactsItem', JSON.stringify(this.contactsData));
    }

    get(){
        return this.contactsData;
    }
}

const contacts = new Contacts();
console.log(contacts);

class ContactApp extends Contacts{
    constructor(){
        super();
        this.app = this.createRootElement();
        document.body.appendChild(this.app);
        this.addContactEvent();
        this.get();
        this.self = this;
    }

    createRootElement(){
        const rootElement = document.createElement('div');
        rootElement.classList.add('contacts');
        rootElement.innerHTML = `
            <div class="container">
                <div class="contacts__wrapper">
                    <div class="contacts__header">
                        <h2>Contacts</h2>
                        <div class="contacts__form">
                            <input tupe="text" class="contact__name" placeholder="Имя">
                            <input tupe="text" class="contact__phone" placeholder="Телефон">
                            <input tupe="email" class="contact__email" placeholder="Email">
                            <input tupe="text" class="contact__addres" placeholder="Адрес">
                            <button class="contact__btn">Добавить контакт</button>
                        </div>
                    </div>
                    <div class="contact__body"></div>
                </div>
            </div>
        `;
        return rootElement;
    }

    addContactEvent(){
        const addBtn = document.querySelector('.contact__btn')
        addBtn.addEventListener('click', () => {
            this.onAdd();
        });
    }

    onAdd(){
        const name = document.querySelector('.contact__name');
        const phone = document.querySelector('.contact__phone');
        const email = document.querySelector('.contact__email');
        const addres = document.querySelector('.contact__addres');
        console.log( addres.value )

        const userData = {
            id: new Date().getTime().toString(),
            name: name.value,
            phone: phone.value,
            email: email.value,
            addres: addres.value,
        }

        this.add(userData);
        name.value = '';
        phone.value = '';
        email.value = '';
        addres.value = '';
        this.get();
    }

    get(){
        const getContactsData = super.get();
        const contactBodyElement = document.querySelector('.contact__body');

        let ulContacts = document.querySelector('.contacts__items');

        if(!ulContacts){
            ulContacts = document.createElement('ul');
            ulContacts.classList.add('contacts__items');
        } else{
            ulContacts.innerHTML = '';
        }

        let contactList = '';

        getContactsData.forEach(({data}) => {
            const {name, phone, email, id, addres} = data;
            contactList += `
                <li class="item">
                    <div class="item__name">Имя: ${name}</div>
                    <div class="item__phone">Телефон: ${phone}</div>
                    <div class="item__email">Email: ${email}</div>
                    <div class="item__address">Адрес: ${addres}</div>
                    <div class="item__btn">
                        <button class="btn__delete" id="${id}">Удалить</button>
                        <button class="btn__edit" data-edit="${id}">Редактирование</button>
                    </div>
                </li>
                `
        });

        ulContacts.innerHTML = contactList;
        contactBodyElement.appendChild(ulContacts);
        this.addDeleteEventBtns();
        this.addEditEventBtns();
    }

    onRemove(id){
        this.remove(id);
        this.get();
    }

    onStartEdit(editId){
        const getContactsData = super.get();
        const editUserData = getContactsData.find(({data: {id}}) => id === editId).data;
        const modal = new Modal(editUserData, this.onEdit.bind(this));
    }

    onEdit({id, ...updateData}){
        this.self.editContactUser(id, updateData);
        this.self.get();
    }


    addEditEventBtns(){
        const editContactsBtns = document.querySelectorAll('.btn__edit');
        editContactsBtns.forEach((editBtn) => {
            editBtn.addEventListener('click', (event) => {
                this.onStartEdit(event.target.dataset.edit);
            });
        });
    }

    addDeleteEventBtns(){
        const deleteContactBtns = document.querySelectorAll('.btn__delete');
        deleteContactBtns.forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', (event) => {
                this.onRemove(event.target.id);
            });
        });
    }
}

class Modal{
    constructor(contactData, onEdit){
        this.contactData = contactData;
        this.heandleUserEdit = onEdit;
        this.modalHTMElement = this.createModalHTML(this.contactData);
        document.body.appendChild(this.modalHTMElement);
        this.addCancelEvent();
        this.addSaveEvent();
    }

    addCancelEvent(){
        const cancelBtn = document.querySelector('.modal__cancel__btn');
        cancelBtn.addEventListener('click', () => {
            this.modalHTMElement.remove();
        });
    }

    addSaveEvent(){
        const saveBtn = document.querySelector('.modal__save__btn');
        saveBtn.addEventListener('click', (event) => {
            const name = document.querySelector('.modal__edit__name').value;
            const phone = document.querySelector('.modal__edit__phone').value;
            const email = document.querySelector('.modal__edit__email').value;
            const address = document.querySelector('.modal__edit__address').value;

            this.heandleUserEdit({
                name,
                phone,
                email,
                address,
                id: event.target.id,
            });

            this.modalHTMElement.remove();
        });
    }

    createModalHTML({name, phone, email, id, address}){
        const modalHTML = document.createElement('div');
        modalHTML.classList.add('modal');
        modalHTML.innerHTML = `
            <div class="modal__wrapper">
                <div class="modal__header">
                    <h3>Редактирование пользователя</h3>
                </div>
                <div class"modal__content">
                    <input type="text" class="modal__edit__name" value="${name}">
                    <input type="phone" class="modal__edit__phone" value="${phone}">
                    <input type="email" class="modal__edit__email" value="${email}">
                    <input type="text" class="modal__edit__address" value="${address}">
                    <div class="modal__btns">
                        <button class="modal__cancel__btn">Отмена</button>
                        <button class="modal__save__btn" id="${id}">Сохранить</button>
                    </div>
                </div>
            </div>
        `
        return modalHTML;
    }
}

const app = new ContactApp();




// const array = [1, 2, 3, 4];

// const sum = array.reduce((acc, item) => {
//     return acc + item;
// }, '');

// console.log(sum);




// const users = [
//     {
//         id: "a1",
//         name: "Dan"
//     },

//     {
//         id: "a2",
//         name: "Bob"
//     },

//     {
//         id: "a3",
//         name: "Tom",
//     },
// ];

// const usersData = users.reduce((acc, user) => {
//     return {
//         ...acc,
//         [`${user.id}`]: {name: user.name}
//     }
// }, {});

// console.log(usersData);
// console.log(usersData.a2);
