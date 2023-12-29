const imageInput = document.getElementById('image');
const authorInput = document.getElementById('author');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const publishDateInput = document.getElementById('publish_date');
const categoriesContainer = document.querySelector('.categories-container');
const chooseCategoriesText = document.getElementById('choose-categories-text');
const chooseCategoriesContainer = document.getElementById('choose-categories-container');
const chooseCategoriesDiv = document.getElementById('choose-categories');
const emailInputForm = document.getElementById('form-email');
const submitButton =document.getElementById("publication");

const simbolValidation = document.getElementById('simbol-validation');
const wordValidation = document.getElementById('word-validation');
const georgianValidation = document.getElementById('georgian-validation');
const titleSimbolValidation = document.getElementById('title-simbol-validation');
const descriptionSimbolValidation = document.getElementById('textarea-simbol-validation');




const backToIndexButton = document.getElementById('back-to-index');
if (backToIndexButton) {
    backToIndexButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}



const removeImageBtn = document.getElementById("remove-image");
const dropArea = document.getElementById("drop-area");
const imageContainer = document.getElementById("image-container");
const imageText = document.getElementById("image-text");
const defaultText = document.querySelector(".default-text");
const folderIcon = document.getElementById("folder-icon");

if(imageInput){
imageInput.addEventListener("change", updateImageName);
}
if(removeImageBtn){
    removeImageBtn.addEventListener("click", removeImage);
}


function updateImageName() {
    const files = imageInput.files
    if (files.length > 0) {
        const fileName = files[0].name;
        imageText.textContent = fileName;
        dropArea.classList.add("uploaded");
        imageContainer.classList.remove("hidden");
        defaultText.classList.add("hidden");
        folderIcon.classList.add("hidden");
        removeImageBtn.classList.remove("hidden");
    }
}

function removeImage() {
    imageInput.value = ""; 
    imageText.textContent = ""; 
    dropArea.classList.remove("uploaded");
    imageContainer.classList.add("hidden");
    defaultText.classList.remove("hidden");
    folderIcon.classList.remove("hidden");
    removeImageBtn.classList.add("hidden");
}



const validations = [
  {
    element: authorInput,
    validations: [
      {
        condition: value => value.length >= 4,
        validationElement: simbolValidation
      },
      {
        condition: value => value.trim().split(/\s+/).length >= 2,
        validationElement: wordValidation
      },
      {
        condition: value => /^[\u10A0-\u10FF\s]+$/.test(value),
        validationElement: georgianValidation
      }
    ]
  },
  {
    element: titleInput,
    validations: [
      {
        condition: value => value.length >= 4,
        validationElement: titleSimbolValidation
      }
   
    ]
  },
  {
    element: descriptionInput,
    validations: [
      {
        condition: value => value.length >= 4,
        validationElement: descriptionSimbolValidation
      }

    ]
  },

];

validations.forEach(({ element, validations }) => {
    if(element)
  element.addEventListener('input', () => validateInput(element, validations));
});

function validateInput(input, validations) {
  const inputValue = input.value;
  let isValid = true;

  validations.forEach(({ condition, validationElement }) => {
    const result = condition(inputValue);
    validationElement.style.color = result ? "#14D81C" : "#EA1919";
    isValid = isValid && result;
  });

  input.style.border = isValid ? "1px solid #14D81C" : "1px solid #EA1919";
  input.style.backgroundColor = isValid ? "#F8FFF8" : "#FAF2F3";
}

function validateCategories() {
    const selectedCategories = chooseCategoriesDiv.querySelectorAll('.selected-category');
    if (selectedCategories.length === 0) {
        chooseCategoriesDiv.style.backgroundColor = "#FAF2F3";
        chooseCategoriesDiv.style.border = "1px solid #EA1919";
    }
}
function validateDate(event) {
    const dateInput = event.target;
    const isValidData = dateInput.value !== ''; 
    dateInput.style.backgroundColor = isValidData ? "#F8FFF8" : "#FAF2F3";
    dateInput.style.border = isValidData ? "1px solid #14D81C" : "1px solid #EA1919";
}
if (publishDateInput){
    publishDateInput.addEventListener('input', validateDate);
}


function validateEmail(event) {
    const emailInputValue = event.target.value;
    const isValid = emailInputValue.includes('@redberry.ge');
    emailInputForm.style.backgroundColor = isValid ? "#F8FFF8" : "#FAF2F3";
    emailInputForm.style.border = isValid ? "1px solid #14D81C" : "1px solid #EA1919";
}
if(emailInputForm){
    emailInputForm.addEventListener('input', validateEmail);
}



if(chooseCategoriesDiv){
    chooseCategoriesDiv.addEventListener('click', (event) => {
        event.preventDefault();
        if (categoriesContainer.style.display === 'none' || categoriesContainer.style.display === '') {
            categoriesContainer.style.display = 'flex';
            chooseCategoriesText.style.display = 'none'; 
        } else {
            categoriesContainer.style.display = 'none';
            chooseCategoriesText.style.display = hasSelectedCategories() ? 'none' : 'inline';
        }
    });
}


fetch('https://api.blog.redberryinternship.ge/api/categories', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer 5006c8b3f173e7235a5ea0bc3fc286de8a41ec89f597e42e0c50a156bd62ed71',
    },
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(responseData => {
        const formCategories = responseData?.data ?? [];
        displayCategories(formCategories);
    })
    .catch(error => {
        console.error('Error:', error);
    });

function displayCategories(formCategories) { 
    formCategories.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.classList.add('category-button');
        categoryButton.style.backgroundColor = category.background_color || '#ffffff'; 
        categoryButton.style.color = category.text_color || '#000000'; 
        categoryButton.textContent = category.title || '';
        categoryButton.addEventListener('click', () => handleCategoryClick(category));
        if(categoriesContainer){
            categoriesContainer.appendChild(categoryButton);
        }
    });
}
    if(chooseCategoriesDiv){
        function handleCategoryClick(category) {
            if (!chooseCategoriesDiv.querySelector(`.selected-category[data-id="${category.id}"]`)) {
                categoriesContainer.style.display = 'none';
                const selectedCategory = document.createElement('div');
                selectedCategory.classList.add('selected-category');
                selectedCategory.style.backgroundColor = category.background_color || '#ffffff'; 
                selectedCategory.style.color = category.text_color || '#000000';
                selectedCategory.textContent = category.title || '';
                selectedCategory.setAttribute('data-id', category.id);
        
                const removeButton = document.createElement('span');
                removeButton.innerHTML = '&times;';
                removeButton.classList.add('remove-category');
        
                removeButton.addEventListener('click', () => {
                    selectedCategory.remove();
                });
                selectedCategory.appendChild(removeButton);
                chooseCategoriesDiv.appendChild(selectedCategory);
                chooseCategoriesDiv.style.backgroundColor = "#F8FFF8";
                chooseCategoriesDiv.style.border = "1px solid #14D81C";
            }
        }
        
    }

function hasSelectedCategories() {
    return chooseCategoriesDiv.querySelector('.selected-category') !== null;
}


function submitForm(event) {
    event.preventDefault();
    const imageInput = document.getElementById('image');
    const selectedCategoriesContainer = document.getElementById("choose-categories");
    const selectedCategoryElements = selectedCategoriesContainer.querySelectorAll('.selected-category');
    const selectedCategoryIds = Array.from(selectedCategoryElements).map(categoryElement => categoryElement.getAttribute('data-id'));
    const formData = new FormData();
    formData.append("title", document.getElementById('title').value);
    formData.append("description", document.getElementById('description').value);
    formData.append("author", document.getElementById('author').value);
    formData.append("publish_date", document.getElementById('publish_date').value);
    formData.append("categories", JSON.stringify(selectedCategoryIds));
    formData.append("email", document.getElementById('form-email').value);
    formData.append("image", imageInput.files[0]);

    fetch('https://api.blog.redberryinternship.ge/api/blogs', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Authorization': 'Bearer 5006c8b3f173e7235a5ea0bc3fc286de8a41ec89f597e42e0c50a156bd62ed71',
        },
        body: formData,
    })
    .then(response => {
        if (response.status === 204) {
            console.log('Blog created successfully.');
            showSuccessModal();
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${response.statusText}`);
        }
    })
    .then(data => {
        if (data) {
            showSuccessModal();
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
    });
}


function showSuccessModal() {
    document.getElementById('id02').style.display = 'flex';
}

const returnMainPage = document.getElementById('return-main-page');
if(returnMainPage){
    returnMainPage.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'index.html';
    });
}


