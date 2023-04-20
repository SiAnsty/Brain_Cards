import { createCategory } from "./components/createCategory.js";
import { createEditCategory } from "./components/createEditCategory.js";
import { createHeader } from "./components/createHeader.js";
import { createElement } from "./helper/createElement.js";
import { fetchCategories } from "./service/api.service.js";
import { fetchCards } from "./service/api.service.js";


const initApp = async () => {
  const headerParent = document.querySelector('.header');
  const app = document.querySelector('#app');

  const headerObj = createHeader(headerParent);
  const categoryObj = createCategory(app);
  const editCategoryObj = createEditCategory(app);

  const allSectioUnmount = () => {
    [categoryObj, editCategoryObj].forEach(obj => obj.unmount());
  }

  const renderIndex = async e => {
    e?.preventDefault();
    allSectioUnmount();
    const categories = await fetchCategories();

  if (categories.error) {
    app.append(createElement('p', {
      className: 'server-error',
      textContent: 'Ошибка сервера, попробуйте зайти позже'
    }));
    return;
  }

  categoryObj.mount(categories);
  };

  renderIndex();

  headerObj.headerLogoLink.addEventListener('click', renderIndex)

  headerObj.headerBtn.addEventListener('click', () => {
    allSectioUnmount();
    headerObj.updateHeaderTitle('Новая категория');
    editCategoryObj.mount();
  });

  categoryObj.categoryList.addEventListener('click', async ( { target } ) => {
    const categoryItem = target.closest('.category__item');

    if (target.closest('.category__edit')) {
      const dataCards = await fetchCards(categoryItem.dataset.id);
      allSectioUnmount();
      headerObj.updateHeaderTitle('Редоктирование');
      editCategoryObj.mount(dataCards);
      return;
    }

  });
};

initApp();
