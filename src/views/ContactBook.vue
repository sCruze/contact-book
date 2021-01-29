<!-- Основной компонент книги контактов -->
<template>
  <div class="contact-book">
    <div class="modal-window">
      <p>Вы точно хотите удалить контакт: {{ nameContact }}</p>
      <div>
        <p @click="confirmationRemoveField">&#10004;</p>
        <p @click="cancelRemoveField">&#10008;</p>
      </div>
    </div>
    <h1>Книга контактов</h1>
    <p>Количесто записей: {{countContact}}</p>
    <ul v-for="contacts in allContacts" :key="contacts.email">
      <li>
        <router-link :to="{ path: `info/${contacts.id}` }">{{ contacts.name }}</router-link>
        <div class="tools-btn">
          <router-link :to="{ path: `info/${contacts.id}` }">Открыть</router-link>
          <svg @click="removeContactOnId(contacts.id)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
          </svg>
        </div>
      </li>
    </ul>

<!--  Форма для добовления контактов  -->
    <FormAddContact />

  </div>
</template>

<script>
// Импортируем нужные методы из store
import { mapGetters, mapActions, mapMutations } from 'vuex'
// Импорт компонента формы для добовления контакта
import FormAddContact from "@/components/ForBookContact/FormAddContact";

export default {
  name: "ContactBook",
  data: () => ({
    // Локальная переменная в которую будем записывать имя контакта который хотим удалить
    nameContact: '',
    idContactForDelete: null,

  }),
  computed: {
    // Вычесляем геттерсы
    ...mapGetters(['allContacts', 'countContact'])
  },
  methods: {
    // Вызвали экшены из стора, чтобы стор начал свою работу
    ...mapActions(['fetchContact']),
    // Вызов мутации
    ...mapMutations(['removeContact', 'stepBack']),

    // Удаление контакта
    removeContactOnId(id) {
      // Передаем в переменную имя того контакта, который хотим удалить
      this.nameContact = this.allContacts[id].name

      // Передаем в локальную переменную id пользователя
      this.idContactForDelete = id

      // Переменная с путем к модальному окну
      const modalWindow = document.querySelector('.modal-window')

      // Добовляем новый класс active-modal к модальному окну
      modalWindow.classList.add('active-modal')

    },
    // Метод подтверждения удаления контакта
    confirmationRemoveField() {
      // Переменная с путем к модальному окну
      const modalWindow = document.querySelector('.modal-window')

      // Удаляем класс active-modal у модального окна
      modalWindow.classList.remove('active-modal')

      // Передаем в мутацию удаления пользователя id пользователя
      this.removeContact(this.idContactForDelete)

    },
    // Метод отмены удаления контакта
    cancelRemoveField() {
      // Переменная с путем к модальному окну
      const modalWindow = document.querySelector('.modal-window')

      // Удаляем класс active-modal у модального окна
      modalWindow.classList.remove('active-modal')
    }
  },
  mounted() {
    this.fetchContact()
  },
  components: {
    FormAddContact
  }
}
</script>

<style lang="scss" scoped>
.contact-book {
  width: 100%;
  height: 100%;
  text-align: center;

  .modal-window {
    background: #16b5ea;
    border: 1px solid #b5b5b5;
    border-radius: 10px;
    -webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
    width: 80%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    align-items: center;
    padding: 1rem;
    transition: 0.3s;
    transform: translateY(-8rem);
    opacity: 0;

    p {
      margin: 0;
      color: #fff;
    }

    div {
      display: flex;
      justify-content: space-around !important;
      width: 100%;
      p {
        margin-top: 1rem;
        cursor: pointer;
        padding: 0 4px;
        border-radius: 50%;
        border: 0;
      }

      p:nth-child(1) {
        background: #26f900;
      }
      p:nth-child(2) {
        background: #fb0000;
      }
    }
  }

  .active-modal {
    transform: translateY(0);
    opacity: 1;
  }

  h1 {
    margin-bottom: 4rem;
  }

  p {
    display: flex;
    margin-left: 2rem;
    color: #0070ff;
    font-size: 20px;
  }

  li {
    padding: 1rem 2rem;
    list-style-type: none;
    display: flex;
    font-size: 20px;
    border: 1px solid #bbbbbb;
    border-radius: 4px;
    transition: 0.3s;
    justify-content: space-between;

    a {
      text-decoration: none;
      color: #000;
    }

    .tools-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      a {
        display: block;
        border-radius: 20px;
        margin-right: 1rem;
        padding: 0.2rem 1rem;
        background: #26f900;
        color: #fff;
        -webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
        box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
      }
      svg {
        cursor: pointer;
        fill: #fb0000;
      }
    }

  }
  li:hover {
    -webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
  }
}
</style>
