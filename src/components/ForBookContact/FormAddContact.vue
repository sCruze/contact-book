<template>
  <form @submit.prevent="onSubmit">
    <h1>Новый контакт</h1>
    <div class="inputs">
      <div>
        <label @click="onLabel">Имя контакта:</label>
        <input @focus="onInput" @blur="notFocus" v-model="newContact.name" type="text">
      </div>
      <div>
        <label @click="onLabel">Номер телефона:</label>
        <input @focus="onInput" @blur="notFocus" v-model="newContact.phone" type="text">
      </div>
      <div>
        <label @click="onLabel">Email:</label>
        <input @focus="onInput" @blur="notFocus" v-model="newContact.email" type="text">
      </div>
      <div>
        <label @click="onLabel">Дата рождения:</label>
        <input @focus="onInput" @blur="notFocus" v-model="newContact.birthday" type="text">
      </div>
    </div>
    <button type="submit">Создать</button>
  </form>
</template>

<script>
// Импортируем правила валидации и нужные методы из vuex
import {email, required} from "vuelidate/lib/validators";
// Импортируем нужные методы из store
import {mapMutations} from "vuex";

export default {
  name: "FormAddContact",
  data: () => ({
    newContact: {
      id: Date.now(),
      name: '',
      phone: '',
      email: '',
      birthday: ''
    }
  }),
  // Прописываем правила для валидации формы
  validations: {
    newContact: {
      name: { required },
      phone: { required },
      email: { required, email },
      birthday: { required }
    }
  },
  methods: {
    // Вызов мутации
    ...mapMutations(['createContact']),
    // Метод onSubmit создает новый объект и отправляет данные в стор
    onSubmit() {
      // Проверяем, нет ли в объекте vuelidate ошибок по форме
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      // Создали новую переменную с полученными данными из формы
      const formData = this.newContact

      // Переменная с формой этого компонента
      const form = document.querySelector('form')
      // Отчищаем форму после того как произошел событие submit
      form.reset()

      // Передаем в мутацию переменную с данными
      this.createContact(formData)

    },
    // Метод срабатывает когда пользователь кликает по label для добовления ему нового класса и делает активным Input
    onLabel(e) {
      // Переменная с label по которому кликнул пользователь
      const label = e.target

      if (!label.classList.contains('active-label')) {
        label.classList.add('active-label')

        e.target.parentElement.children[1].focus()
      }
    },
    // Метод делает тоже самое что и предыдущий, но только при клике на input
    onInput(e) {
      // Создаем переменную с путем кликнутого инпута
      const input = e.target

      // Проверям есть ли класс active-label у label
      if (!e.target.parentElement.children[0].classList.contains('active-label')) {
        // Если нет такого класса добовляем
        e.target.parentElement.children[0].classList.add('active-label')

        // Ставим фокус на инпут
        input.focus()
      }
    },
    // Метод удаляет добавленные классы у label, если в input ничего нет и input не в фокусе
    notFocus(e) {
      const input = e.target

      if (input.value === '') {
        e.target.parentElement.children[0].classList.remove('active-label')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  position: fixed;
  left: 2rem;
  top: 4rem;
  display: flex;
  flex-direction: column;
  border: 1px solid #84848470;
  padding: 2rem;
  -webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);

  h1 {
    margin: 0;
    margin-bottom: 2rem;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    label {
      display: flex;
      transform: translateY(25px);
      margin-left: 10px;
      cursor: text;
      transition: 0.3s;
    }
    input {
      padding: 0.4rem 0.6rem;
      border-radius: 20px;
      border: 2px solid #0070ff;
      outline: none;
      width: 91%;
      margin-bottom: 1rem;
    }
  }
  button {
    cursor: pointer;
    border: 0;
    background: #0070ff;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    -webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
    transition: 0.3s;
  }

  button:hover {
    color: #0070ff;
    background: #fff;
  }
}

.active-label {
  transform: translateY(0) !important;
  font-size: 16px !important;
}
</style>
