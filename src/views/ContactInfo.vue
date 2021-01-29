<!-- Компонент информация котакта -->
<template>
  <div class="contact-info">
    <div class="modal-window">
      <p>Вы точно хотите удалить поле: {{ fieldToDelete }}</p>
      <div>
        <p @click="confirmationRemoveField">&#10004;</p>
        <p @click="cancelRemoveField">&#10008;</p>
      </div>
    </div>
    <h1>Информация о контакте</h1>
    <ul>
      <li
        v-for="(contact, key) in contactInfo"
        :key="contact.length + key + updateCount"
      >
        <div class="info">
          <p>{{ key }}</p>
          <p>{{ contact }}</p>
        </div>
        <div class="tools-btn">
          <svg
            @click="onChangeToField"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-pencil-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"
            />
          </svg>
          <svg
            @click="removeField"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
            />
          </svg>
        </div>
      </li>
    </ul>

    <!--  Кнопка для перехода назад в книгу контактов  -->
    <button class="btn-book">
      <router-link to="/">Книга контактов</router-link>
    </button>

    <!--  Кнопка для отмены последнего изменения  -->
    <button @click="stepCancel" class="step-back">
      <img src="../assets/icon/arrow-back.png" />
    </button>

    <!--  Форма добовления нового поля  -->
    <FormAddField
      :contactInfo="contactInfo"
      @updateCount="updateCountMethods"
    />

    <!--  Форма изменения поля  -->
    <FormChangeField :selectField="selectField" @updateField="searchInfo" />
  </div>
</template>

<script>
// Импортруем геттерсы
import { mapGetters, mapActions, mapMutations } from "vuex";
// Импортируем компоненты
import FormAddField from "@/components/ForContactInfo/FormAddField";
import FormChangeField from "@/components/ForContactInfo/FormChangeField";

export default {
  // Имя компонента
  name: "ContactInfo",
  data: () => ({
    // Переменная, которую мы будем передавать в дочерний компонент для формы изменения поля
    onChange: false,
    // Локальная переменная в которой хранится имя поля, которое нужно удалить
    fieldToDelete: "",
    // Локальная переменная, нужна для перерисовки компонента при добовлении или удалении какого
    // либо элемента из массива
    updateCount: 0,
    // Локальная переменная данного компонента для объекта соответсвующего индексу найденому в адресной строке
    contactInfo: "",
    // Локальная переменная с именем поля и значением
    selectField: ""
  }),
  computed: {
    // Выводим из vuex геттерсы для работы с ними в компоненте
    ...mapGetters(["allContacts"])
  },
  methods: {
    // Вызов мутации
    ...mapActions(["workingWithFields"]),
    ...mapMutations(["stepBack"]),
    updateCountMethods() {
      this.updateCount++;
    },
    // Метод для изменения поля
    onChangeToField(e) {
      if (e.target.tagName === "path") {
        // Нашли форму, которая изменяет поля и их значения
        const formChange = document.querySelector(".form-to-change");

        // Добовляем класс active-form для данной формы
        formChange.classList.add("active-form");

        // Передаем новое значение в переменную, которую будем передавать в компонент FormChangeField
        this.onChange = true;

        // Нашли 2 компонента в Значение и имя поля в tag li, по которому кликнули
        this.selectField = {
          contactId: this.contactInfo.id,
          onChange: this.onChange,
          nameField:
            e.target.parentElement.parentElement.parentElement.children[0]
              .children[0].textContent,
          valueField:
            e.target.parentElement.parentElement.parentElement.children[0]
              .children[1].textContent
        };
      }
    },
    // Метод который определяет данные котакта по id взятому из адресной строки
    searchInfo() {
      // Переменная в которую записываем id из адресной строки
      const idContact = Number(this.$route.params.id);

      // Находим в массиве объект с индексом который нашли в адресной строке
      this.contactInfo = this.allContacts.filter(
        item => item.id === idContact
      )[0];
    },
    // Удаление поля
    removeField(e) {
      // Проверяем на какой элемент было произведено событие клика
      if (e.target.tagName === "path") {
        // Переменная с тэгом по которому кликнули
        const nameField =
          e.target.parentElement.parentElement.parentElement.children[0]
            .children[0];

        // Передаем в переменную название поля для удаления
        this.fieldToDelete = nameField.textContent;

        // Переменная с путем к модальному окну
        const modalWindow = document.querySelector(".modal-window");

        // Добовляем новый класс active-modal к модальному окну
        modalWindow.classList.add("active-modal");
      }
    },
    // Подтверждение удаления поля, кнопка в модальном окне
    confirmationRemoveField() {
      // Переменная с путем к модальному окну
      const modalWindow = document.querySelector(".modal-window");

      // Удаляем класс active-modal у модального окна
      modalWindow.classList.remove("active-modal");

      // Переменная которую мы записываем id контакта и поле, которое хотим удалить и передаем в Store
      const data = {
        id: this.contactInfo.id,
        nameEvent: "removeToField",
        nameField: this.fieldToDelete
      };

      // Передаем в мутацию удаления пользователя id пользователя
      this.workingWithFields(data);

      // Заново рендерим компонент
      this.searchInfo();

      // Увеличиваем счетчик ключей
      this.updateCount++;
    },
    // Отмена удаления поля, кнопка в модальном окне
    cancelRemoveField() {
      // Переменная с путем к модальному окну
      const modalWindow = document.querySelector(".modal-window");

      // Удаляем класс active-modal у модального окна
      modalWindow.classList.remove("active-modal");
    },
    // Метод шаг назад
    stepCancel() {
      // id контакта
      const idContact = Number(this.$route.params.id);

      // Запускаем мутацию
      this.stepBack(idContact);

      // Перезапускаем компонент
      this.searchInfo();
    }
  },
  mounted() {
    // При запуске страницы запускаем метод, который будет искать соответствующий объект
    this.searchInfo();
  },
  components: {
    FormAddField,
    FormChangeField
  }
};
</script>

<style lang="scss" scoped>
.contact-info {
  text-align: center;

  .modal-window {
    background: #16b5ea;
    border: 1px solid #b5b5b5;
    border-radius: 10px;
    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2),
      0 2px 10px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.1);
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

  ul {
    li {
      list-style-type: none;
      padding: 1rem 2rem;
      border: 1px solid #bbbbbb;
      border-radius: 4px;
      margin-bottom: 1rem;
      display: flex;
      transition: 0.3s;
      justify-content: space-between;
    }

    li:nth-child(1) {
      display: none;
    }

    li:hover {
      -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2),
        0 2px 10px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2),
        0 2px 10px 0 rgba(0, 0, 0, 0.1);
    }

    .info {
      display: flex;
      justify-content: space-between;
      width: 70%;

      p {
        padding: 0;
        margin: 0;
      }

      p:nth-child(1) {
        text-transform: uppercase;
      }

      p:nth-child(2) {
        color: #000;
        background: #26f900;
        padding: 0 1rem;
      }
    }

    .tools-btn {
      display: flex;
      svg {
        cursor: pointer;
      }

      svg:nth-child(1) {
        fill: #ffb53a;
        margin-right: 2rem;
      }
      svg:nth-child(2) {
        fill: #fb0000;
      }
    }
  }
  .btn-book {
    position: fixed;
    left: 2rem;
    top: 2rem;
    background: #0070ff;
    border: 0;
    border-radius: 4px;
    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2),
      0 2px 10px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    a {
      display: block;
      padding: 1rem 1rem;
      text-decoration: none;
      color: #fff;
      font-size: 17px;
    }
  }
  .step-back {
    border: 0;
    width: 60px;
    height: 30px;
    cursor: pointer;
    background: #0070ff;
    padding: 6px 18px;
    position: fixed;
    left: 28rem;
    top: 11rem;
    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2),
      0 2px 10px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    outline: none;
    img {
      width: 100%;
      height: 100%;
      color: #fff;
    }
  }
}
</style>
