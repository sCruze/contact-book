import db_contacts from "../../db/temporary_databases.json";

export default {
  actions: {
    // Метода для запуска функции и завписи данных в localStorage
    fetchContact() {
      // В новую переменную передаем данные из импортированного файла
      const res = db_contacts.Contact_information;

      // Добовляем новые данные в localStorage под ключом contacts
      localStorage.setItem("contacts", JSON.stringify(res));
      // ctx.commit('updateContact', res)
    },
    workingWithFields({ commit }, data) {
      commit("createPreviousStates", data.id);
      commit(data.nameEvent, data);
    }
  },
  mutations: {
    // Метод для добовления предыдущих состояний в state
    createPreviousStates(state, id) {
      const searchContact = Object.assign(
        {},
        state.contacts.find(item => item.id === id)
      );

      // Проверяем, если нету в state.contactStatusChanges нужного объекта с нужным id, то создаем новый объект
      // И добовляем его в state
      if (
        state.contactStatusChanges.find(
          item => item.id === searchContact.id
        ) === undefined
      ) {
        // Добовляем в конец массива state.contactStatusChanges новый объект с id и массивом объектов
        // предыдущих состояний
        const newPreviousStates = [];

        newPreviousStates.push({ id: searchContact.id, previousStates: [] });

        // Переменная в которую мы передаем объект найденный по id
        const findContact = Object.assign(
          {},
          newPreviousStates.find(item => item.id === searchContact.id)
        );

        // Добовляем в конец массива предыдущее состояние
        findContact.previousStates.push(searchContact);

        state.contactStatusChanges.push(findContact);

        // Иначе если мы нашли нужный нам объект
      } else if (
        state.contactStatusChanges.find(item => item.id === searchContact.id)
      ) {
        // Создаем переменную с найденным по id объектом
        const findContact = state.contactStatusChanges.find(
          item => item.id === searchContact.id
        );

        // Добовляем в массив с предыдущими состояниями новый объект состояния
        findContact.previousStates.push(searchContact);
      }
    },
    // Мутации у книги контактов
    // Мутация которая добовляет новый контакт в state
    createContact(state, data) {
      // Удаляем старый массив данных из локального хранилища
      localStorage.removeItem("contacts");
      // Добовляем в конец массива состояния полученные данные
      state.contacts.push(data);
      // Добовляем в локальное хранилище новые данные
      localStorage.setItem("contacts", JSON.stringify(state.contacts));
      // Передаем в состояние новый объект из локального хранилища
      state.contacts = JSON.parse(localStorage.getItem("contacts"));
    },
    // Мутация которая удаляет из state объект с которым совпал id
    removeContact(state, id) {
      // Метод фильтр, перебирает массив и записывает новый с теми элементами у которых при проверке
      // на true and false выпало true
      localStorage.removeItem("contacts");
      localStorage.setItem(
        "contacts",
        JSON.stringify(state.contacts.filter(item => item.id !== id))
      );
      state.contacts = JSON.parse(localStorage.getItem("contacts"));

      // Передаем в конец массива с contactStatusChanges, измененный state.contacts
      state.contactStatusChanges.push(state.contacts);
    },
    // Мутации у компонента информация контакта
    createNewField(state, data) {
      // Находим контакт с совподающим id переданным при передаче данных из формы изменения полей
      const searchContact = state.contacts.find(item => item.id === data.id);

      // В отдельные переменные вывели ключ и значение нового поля полученного из формы
      const nameField = data.body.name;
      const valueField = data.body.value;

      // Добовляем в объект новый ключ и значение
      searchContact[nameField] = valueField;
    },
    // Мутация для удаления поля у каонтакта
    removeToField(state, data) {
      // Ищем контакт по id
      const searchContact = state.contacts.find(item => item.id === data.id);

      // Создаем переменную со значением, по которому далее будем удалять элемент из объекта
      const fieldToDelete = data.nameField;

      // Удаляем элемент из объекта
      delete searchContact[fieldToDelete];
    },
    // Изменяем выбранное поле у контакта
    changeField(state, data) {
      // Ищем по id соответсвующий контакт
      const contact = state.contacts.find(item => item.id === data.id);

      // Пустой массив для перебора и поиска нужных имен полей и значений
      const arrField = [];

      // Перебираем объект и записываем все элементы в отдельный элемент массива
      for (let key in contact) {
        arrField.push(key);
        arrField.push(contact[key]);
      }

      // Перебираем массив и ищем подходящий жлемент по тому, который в data.selectField.nameField
      // И меняем этот элемент на новый и следующий по порядку
      arrField.forEach((item, i) => {
        if (item === data.selectField.nameField) {
          arrField[i] = data.newDataField.nameField;
          arrField[i + 1] = data.newDataField.valueField;
        }
      });

      // Новый объект в который запишем новые поля с значениями
      const newObjectField = {};

      // Создаем новый объект
      arrField.forEach((item, i) => {
        if (i === 0 || i % 2 === 0) {
          newObjectField[item] = arrField[i + 1];
        }
      });

      // Передаем в state.contacts по соответсвующему id новый объект с новыми данными
      state.contacts.forEach((item, i) => {
        if (item.id === data.id) {
          state.contacts[i] = newObjectField;
        }
      });
    },
    // Мутация для возврата на шаг назад по state
    stepBack(state, id) {
      // Проверяем, пустой массив или нет
      if (state.contactStatusChanges.length > 0) {
        // Клонируем объект состояния state.contacts
        let contactStatusChanges = Object.assign(
          [],
          state.contactStatusChanges
        );
        // Находим нужный объект по id
        const allPreviousStatesOfThisContact = contactStatusChanges.find(
          item => item.id === id
        );

        // Делаем проверку на то, чтобы объект с предыдущими состояниями неыб пустой
        if (allPreviousStatesOfThisContact.previousStates.length !== 0) {
          // Переменная в которую склонированно основное состояние state.contacts
          const stateContacts = Object.assign([], state.contacts);

          // Перебираем массив объектов, находим нужный по id и перезаписываем его самым последним состоянием
          // которое лежит в массиве объектов
          for (let key in stateContacts) {
            // Проверка на совпадение id
            if (stateContacts[key].id === id) {
              // Переменная с ссылкой на объект с нужным id в состоянии state.contacts
              const allPreviousStatesThisContact = state.contactStatusChanges.find(
                item => item.id === id
              );
              // Перезаписываем объект по совпадающему ключу, перезаписываем последним объектом из
              // массива предыдущих состояний
              stateContacts[key] =
                allPreviousStatesThisContact.previousStates[
                  allPreviousStatesThisContact.previousStates.length - 1
                ];

              // Перезаписывем состояние
              state.contacts = stateContacts;

              // Удаляем последний элемент в массиве предыдущих состояний по id
              allPreviousStatesOfThisContact.previousStates.splice(-1, 1);
            }
          }
        }
      }
    }
  },

  state: {
    // Состояние данного модуля
    contacts: JSON.parse(localStorage.getItem("contacts")) || [],
    contactStatusChanges: []
  },

  getters: {
    // Getters все контакты
    allContacts(state) {
      return state.contacts;
    },

    // Getters для подсчета количества контактов в БД
    countContact(state) {
      return state.contacts.length;
    }
  }
};
