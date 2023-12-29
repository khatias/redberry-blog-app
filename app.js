

let errorDisplayed = false;
let createBlogButtonCreated = false;

function login(event) {
    event.preventDefault();

    const loginEmailInput = document.getElementById('index-email');
    const email = loginEmailInput.value;
    let formContainer = document.querySelector(".container");
    let loginSubmitButton = formContainer.querySelector("button[type='submit']");
    let header = document.querySelector(".header");
    let successContainer =document.querySelector(".success-container");
    let loginButton = document.querySelector(".login-button");


    fetch('https://api.blog.redberryinternship.ge/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            email: email,
        }),
    })
        .then(response => {
            if (response.status === 204) {
                formContainer.style.display = "none";
                successContainer.style.display = "flex";
                loginButton.style.display = "none";

    
                if (!createBlogButtonCreated) {
                    let createBlogButton = document.createElement("button");
                    createBlogButton.textContent = "დაამატე ბლოგი";
                    createBlogButton.classList.add("create-blog-button");
                    header.appendChild(createBlogButton);
    
                    createBlogButtonCreated = true;
                    createBlogButton.addEventListener('click', () => {
                        window.location.href = 'filling-page.html';
                    });
                }
            } else if (response.status === 422) {
                if (!errorDisplayed) {
                    loginEmailInput.style.border = '1px solid #EA1919';
                    loginEmailInput.style.backgroundColor = "#FAF2F3";
                    loginEmailInput.style.marginBottom = "8px";
    
                    let errorContainer = document.createElement("div");
                    errorContainer.classList.add("error-container");
    
                    let svgElement = document.createElement("div");
                    svgElement.classList.add("error-svg");
                    svgElement.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <g id="vuesax/linear/info-circle">
                                <g id="info-circle">
                                    <path id="Vector" d="M10.0002 1.66666C5.41683 1.66666 1.66683 5.41666 1.66683 10C1.66683 14.5833 5.41683 18.3333 10.0002 18.3333C14.5835 18.3333 18.3335 14.5833 18.3335 10C18.3335 5.41666 14.5835 1.66666 10.0002 1.66666Z" fill="#EA1919"/>
                                    <path id="Vector_2" d="M10 13.3333L10 9.16666" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path id="Vector_3" d="M10.0044 6.66667L9.99691 6.66667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                            </g>
                        </svg>
                    `;
    
                    let errorMessage = document.createElement("p");
                    errorMessage.textContent = "ელ-ფოსტა არ მოიძებნა";
                    errorContainer.appendChild(svgElement);
                    errorContainer.appendChild(errorMessage);
                    formContainer.insertBefore(errorContainer, loginSubmitButton);
                    errorDisplayed = true;
                }
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(data => {
            if (data) {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`An error occurred during login. ${error.message}`);
        });

}

fetch('https://api.blog.redberryinternship.ge/api/categories', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer 4dc6d437af30047acb5bef31554944c6d6d203a0e6185b6bd96b3ea20ba214be',
    },
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(responseData => {
    const categories = responseData?.data ?? [];
    renderCategories(categories);
})
.catch(error => {
    console.error('Error:', error);
});

function renderCategories(categories) {
    const indexCategoriesContainer = document.querySelector('.index-categories-container');
    categories.forEach(category => {
        const indexCategoryButton = document.createElement('button');
        indexCategoryButton.classList.add('index-category-button');
        indexCategoryButton.style.backgroundColor = category.background_color; 
        indexCategoryButton.style.color = category.text_color;
        indexCategoryButton.textContent = category.title;
        
        if(indexCategoriesContainer){
            indexCategoriesContainer.appendChild(indexCategoryButton);
        }
    });
}



function getAllBlogs() {
    fetch('https://api.blog.redberryinternship.ge/api/blogs', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer 4dc6d437af30047acb5bef31554944c6d6d203a0e6185b6bd96b3ea20ba214be',
            'Accept': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Error: Unauthorized. Please provide a valid token.');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}, Response: ${response.statusText}`);
            }
        }

        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Error: Unexpected response format. Expected JSON.');
        }

        return response.json();
    })
    .then(blogData => {
        console.log(blogData);
        const blogsContainer = document.querySelector(".blogs-container");
        if(blogsContainer){
            blogsContainer.innerHTML = '';
        }
        

        const blogs = blogData.data;

        if (blogs.length > 0) {
     
            blogs.forEach(blog => {
            const blogElement = createBlogElement(blog);
            if(blogsContainer){
            blogsContainer.appendChild(blogElement);
            }
            });
        } else {
            console.log('No blogs found.');
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error.message);
    });
}

getAllBlogs();

function createBlogElement(blog) {
    
    const blogElement = document.createElement('div');
    blogElement.classList.add('blog');

    const imageElement = document.createElement('img');
    imageElement.src = blog.image;
    imageElement.alt = blog.title;
    blogElement.appendChild(imageElement);

    const blogTextContent =document.createElement("div")
    blogElement.appendChild(blogTextContent)
    blogTextContent.classList.add('blog-text-content');

     const authorAndPublishDate =document.createElement("div")
     blogTextContent.appendChild(authorAndPublishDate)
     authorAndPublishDate.classList.add("author-publishDate")

    const authorElement = document.createElement('p');
    authorElement.textContent = blog.author;
    authorElement.classList.add('author-in-grid');
    authorAndPublishDate.appendChild(authorElement);

    const publishDate = new Date(blog.publish_date.replace(/-/g, '.'));
    const formattedPublishDate = publishDate.toLocaleDateString( { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '.');
    const publishDateElement = document.createElement('p');
    publishDateElement.classList.add('date-in-grid');
    publishDateElement.textContent = formattedPublishDate;
    authorAndPublishDate.appendChild(publishDateElement);
    

    const titleElement = document.createElement('h2');
    titleElement.textContent = blog.title;
    blogTextContent.appendChild(titleElement);


    const categoriesElement = document.createElement('div');
    categoriesElement.classList.add('categories-container-grid');
    
    blog.categories.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.textContent = category.title;
        categoryButton.classList.add('category-button');
    
        if (category.id) {
            categoryButton.id = `category-${category.id}`;
        }
        if (category.background_color) {
            categoryButton.style.backgroundColor = category.background_color;
        }
        if (category.text_color) {
            categoryButton.style.color = category.text_color;
        }
        categoriesElement.appendChild(categoryButton);
    });
    
    blogTextContent.appendChild(categoriesElement);
    
    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('description-in-grid');
    if (blog.description.length > 100) {

      const truncatedDescription = blog.description.substring(0, 100) + '...';
      descriptionElement.textContent = truncatedDescription;
    } else {
      descriptionElement.textContent = blog.description;
    }
    

    blogTextContent.appendChild(descriptionElement);
    


    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ka">
    <head>
    <base href="/redberry-blog-app/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${blog.title}</title>
    <style>
    body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .full-blog{ 
        width: 720px;
        padding-top:40px;
        padding-bottom:40px;
    }
    img{
        padding-bottom:40px;
        width:100%;
    
    }

    span{
        display:flex;
        color: #85858D;
        font-family: FiraGO;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px; 
    }

    h1{
        color: #1A1A1F;
        font-family: FiraGO;
        font-size: 32px;
        font-style: normal;
        font-weight: 700;
        line-height: 40px; 
    }

    .full-description{
        color: #404049;
        font-family: FiraGO;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px;
    }

    button{
        border:none;
        padding: 6px 10px;
        border-radius:30px;
    }
    </style>

    </head>
    <body>
    <div class="full-blog"> 
        <img src="${blog.image}" alt="${blog.title}">
    <span>
        <p> ${blog.author}</p>
        <p>${formattedPublishDate}</p>
    </span>
        <h1>${blog.title}</h1>
        <p class="full-description">${blog.description}</p>
        ${categoriesElement.innerHTML}
        </div>
        <div/>
    </body>

    </html>
`;

const blob = new Blob([htmlContent], { type: 'text/html' });
const linkElement = document.createElement('a');
linkElement.classList.add("read-more");
linkElement.textContent = 'სრულად ნახვა';
linkElement.href = window.URL.createObjectURL(blob);
linkElement.setAttribute("data-source", "redberry-blog-app.");
blogTextContent.appendChild(linkElement);

return blogElement;

    }
    
    