// id: '1',
// name: "dan",
// phone: "+37529 222 22 22", 
// email: "dan@test.by",
// address: "Minsk"



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
        this.contactsData = [
                new  User ({
                id: '1',
                name: "dan",
                phone: "+37529 222 22 22", 
                email: "dan@test.by",
                address: "Minsk"
            }),

            new  User({
                id: '2',
                name: "Max",
                phone: "+37529 222 1112", 
                email: "max@test.by",
                address: "New York"
            })
        ];
    }

    add(userData){
       this.contactsData.push(new User(userData));
    }

    editContactUser(id, updatedUserData){
        this.contactsData = this.contactsData.map((user) => {
            if(user.data.id === id){
                user.edit(updatedUserData);
            }

            return user;
        });
    }

    remove(id){
        this.contactsData = this.contactsData.filter((user) => user.data.id !== id);
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
    }

    get(){
        const getContactsData = super.get();
        console.log('bla bla blas');
        console.log(getContactsData);
    }
}

const app = new ContactApp();