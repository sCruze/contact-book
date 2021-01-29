<template>
  <!--  Форма добовления нового поля  -->
  <form @submit.prevent="newField">
    <h1>Новое поле</h1>
    <div class="inputs">
      <div>
        <label @click="onLabel">Название поля:</label>
        <input @focus="onInput" @blur="notFocus" v-model="field.name" type="text">
      </div>
      <div>
        <label @click="onLabel">Значение поля:</label>
        <input @focus="onInput" @blur="notFocus" v-model="field.value" type="text">
      </div>
    </div>
    <button type="submit">Добавить</button>
  </form>
</template>

<script>
import {mapActions} from "vuex";
import {required} from "vuelidate/lib/validators";

export default {
  props: ['contactInfo'],
  name: "FormAddField",
  data: () => ({
    // Объект с данными из формы для добовления нового поля
    field: {
      name: '',
      value: ''
    }
  }),
  // Прописываем правила для валидации формы
  validations: {
    field: {
      name: { required },
      value: { required }
    }
  },
  methods: {
    // Вызов мутации
    ...mapActions(['workingWithFields']),
    // Метод добовления нового поля контакту
    newField () {
      // Проверяем, нет ли в объекте vuelidate ошибок по форме
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      // Создали новую переменную с полученными данными из формы
      const formData = {
        id: this.contactInfo.id,
        nameEvent: 'createNewField',
        body: this.field
      }

      // Передаем в мутацию переменную с данными
      this.workingWithFields(formData)

      // Передаем в родительский компонент число на которое нужно увеличить счетчик в родительском компоненте
      this.$emit('updateCount')

      const form = document.querySelector('form')

      form.reset()
    },
    // Метод по клику по label
    onLabel(e) {
      // Переменная с label по которому кликнули
      const label = e.target

      // Проверяем есть ли класс active-label у label по которому кликнули
      if (!label.classList.contains('active-label')) {
        // Добовляем активные классы для input and label
        label.classList.add('active-label')
        e.target.parentElement.children[1].classList.add('active-input')
        // Делаем фокус на input
        e.target.parentElement.children[1].focus()
      }
    },
    // Метод клика по input, выполняет все тоже что и предыдущий метод
    onInput(e) {
      // Переменная с label по которому кликнули
      const input = e.target

      // Проверяем есть ли класс active-label у label по которому кликнули
      if (!e.target.parentElement.children[0].classList.contains('active-label')) {
        // Добовляем активные классы для input and label
        e.target.parentElement.children[0].classList.add('active-label')
        input.classList.add('active-input')
        input.focus()
      }
    },
    notFocus(e) {
      // Переменная с label по которому кликнули
      const input = e.target

      // Проверяем пустой или нет input
      if (input.value === '') {
        // Если пустой, то удаляем активные классы у label и input
        input.classList.remove('active-input')
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
  top: 8rem;
  -webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
  padding: 2rem;

  h1 {
    margin: 0 3rem;
  }

  .inputs {
    margin-top: 2rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;

    div {
      display: flex;
      flex-direction: column;

      label {
        font-size: 20px;
        display: flex;
        transform: translateY(28px);
        transition: 0.3s;
        margin-left: 0.8rem;
        cursor: text;
      }

      input {
        outline: none;
        border: 2px solid #4c4c4c;
        border-radius: 10px;
        background: #fbfbfb;
        padding: 0.3rem 0.7rem;
        font-size: 20px;
      }
    }
  }

  button {
    border: 0;
    background: #26f900;
    padding: 0.7rem 2rem;
    border-radius: 20px;
    -webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.2), 0 2px 10px 0 rgba(0,0,0,.1);
    cursor: pointer;
    color: #fff;
  }
}

.active-label {
  transform: translateY(0) !important;
}

.active-input {
  border: 2px solid #26f900 !important;
}
</style>
