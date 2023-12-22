
let errorDisplayed = false;
let createBlogButtonCreated = false;
function login(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    let formContainer = document.querySelector(".container");
    let submitButton = formContainer.querySelector("button[type='submit']");
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
            }

        
            } else if (response.status === 422) {
                if (!errorDisplayed) { 
                    emailInput.style.border = '1px solid #EA1919';
                    emailInput.style.backgroundColor = "#FAF2F3";
                    emailInput.style.marginBottom = "8px";

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

                    formContainer.insertBefore(errorContainer, submitButton);

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
