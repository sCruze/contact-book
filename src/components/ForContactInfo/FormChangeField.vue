<template>
  <!--  Форма изменения поля  -->
  <form
    class="form-to-change"
    :class="{ active__form: selectField.onChange }"
    @submit.prevent="onChange"
  >
    <h1>
      Изменение поля: <span>{{ selectField.nameField }}</span>
    </h1>
    <div class="inputs">
      <div>
        <label @click="onLabel">Имя поля:</label>
        <input
          @focus="onInput"
          @blur="notFocus"
          v-model="dataChangeField.nameField"
          type="text"
        />
      </div>
      <div>
        <label @click="onLabel">Значение поля:</label>
        <input
          @focus="onInput"
          @blur="notFocus"
          v-model="dataChangeField.valueField"
          type="text"
        />
      </div>
    </div>
    <button type="submit">Изменить</button>
  </form>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["selectField"],
  name: "FormChangeField",
  data: () => ({
    // Объект с данными поля, которые нужно изменить
    dataChangeField: {
      nameField: "",
      valueField: ""
    }
  }),
  methods: {
    // Вызов мутации
    ...mapActions(["workingWithFields"]),
    // Результат выполнения обработки формы
    onChange() {
      // Переменная с формой которая изменяет поле
      const formChange = document.querySelector("form");

      // Условие для удаление активного класса у формы
      if (
        this.dataChangeField.name !== null &&
        this.dataChangeField.valueField !== null
      ) {
        formChange.classList.remove("active-form");

        // Массив в который мы передаем значение страго поляи новые значения и передаем в store
        const formData = {
          id: this.selectField.contactId,
          nameEvent: "changeField",
          newDataField: this.dataChangeField,
          selectField: {
            nameField: this.selectField.nameField,
            valueField: this.selectField.valueField
          }
        };

        // Передаем данные в store
        this.workingWithFields(formData);

        // Отчизаем все поля формы
        formChange.reset();

        // Передаем в локальную переменную false, чтобы форма скрылась
        this.selectField.onChange = false;

        // Передаем событие в родительский компонент, чтобы перезагрузить компонент
        this.$emit("updateField");
      }
    },
    // Метод по клику по label
    onLabel(e) {
      // Переменная с label по которому кликнули
      const label = e.target;

      // Проверяем есть ли класс active-label у label по которому кликнули
      if (!label.classList.contains("active-label")) {
        // Добовляем активные классы для input and label
        label.classList.add("active-label");
        e.target.parentElement.children[1].classList.add("active-input");
        // Делаем фокус на input
        e.target.parentElement.children[1].focus();
      }
    },
    // Метод клика по input, выполняет все тоже что и предыдущий метод
    onInput(e) {
      // Переменная с label по которому кликнули
      const input = e.target;

      // Проверяем есть ли класс active-label у label по которому кликнули
      if (
        !e.target.parentElement.children[0].classList.contains("active-label")
      ) {
        // Добовляем активные классы для input and label
        e.target.parentElement.children[0].classList.add("active-label");
        input.classList.add("active-input");
        input.focus();
      }
    },
    notFocus(e) {
      // Переменная с label по которому кликнули
      const input = e.target;

      // Проверяем пустой или нет input
      if (input.value === "") {
        // Если пустой, то удаляем активные классы у label и input
        input.classList.remove("active-input");
        e.target.parentElement.children[0].classList.remove("active-label");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-to-change {
  position: fixed;
  left: 73%;
  top: 8rem;
  -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2),
    0 2px 10px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition: 0.5s;
  opacity: 0;
  transform: translateX(30rem);

  h1 {
    margin: 0 3rem;
    span {
      background: #26f900;
      color: #fff;
    }
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
    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2),
      0 2px 10px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: #fff;
  }

  .active-label {
    transform: translateY(0) !important;
  }

  .active-input {
    border: 2px solid #26f900 !important;
  }
}

.active__form {
  opacity: 1 !important;
  transform: translateX(0) !important;
}
</style>
