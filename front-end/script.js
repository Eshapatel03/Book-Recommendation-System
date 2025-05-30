const API_URL = 'http://localhost:5001/api';

// Tab switching logic for login/register
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.style.display = 'flex';
    loginForm.style.display = 'none';
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            // Optionally switch to login tab after successful registration
            loginTab.click();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        alert('Error during registration: ' + error.message);
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('book-container').style.display = 'block';
        document.getElementById('reading-progress-container').style.display = 'block';
        loadBooks();
        loadRecommendations();
        loadProgressBooks();
        window.location.href = 'dashboard.html';
    } else {
        alert(data.message);
    }
});

// rest of the script.js unchanged
async function loadBooks() {
    const response = await fetch(`${API_URL}/books`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const books = await response.json();
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Clear the list before adding new items

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${book.coverUrl || 'default-cover.jpg'}" alt="${book.title}">
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="author">by ${book.author}</p>
            </div>
        `;
        
        bookCard.addEventListener('click', () => showBookDetails(book));
        bookList.appendChild(bookCard);
    });

    populateProgressBookSelect(books);
}

function showBookDetails(book) {
    const detailPanel = document.getElementById('book-detail');
    const bookList = document.getElementById('book-list');
    
    // Update book details
    document.getElementById('book-cover-img').src = book.coverUrl || 'default-cover.jpg';
    document.getElementById('detail-title').textContent = book.title;
    document.getElementById('detail-author').textContent = `by ${book.author}`;
    document.getElementById('detail-category').textContent = book.category || 'Uncategorized';
    document.getElementById('detail-summary').textContent = book.summary || 'No summary available';
    
    // Update links
    const readLink = document.getElementById('read-link');
    const buyLink = document.getElementById('buy-link');
    
    if (book.readUrl) {
        readLink.href = book.readUrl;
        readLink.style.display = 'inline-block';
    } else {
        readLink.style.display = 'none';
    }
    
    if (book.buyUrl) {
        buyLink.href = book.buyUrl;
        buyLink.style.display = 'inline-block';
    } else {
        buyLink.style.display = 'none';
    }
    
    // Show detail panel and hide book grid
    bookList.style.display = 'none';
    detailPanel.style.display = 'flex';
}

// Add event listeners for category buttons
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // TODO: Filter books by category
    });
});

// Update add book form submission
document.getElementById('add-book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const category = document.getElementById('book-category').value;
    const coverUrl = document.getElementById('book-cover').value;
    const readUrl = document.getElementById('read-url').value;
    const buyUrl = document.getElementById('buy-url').value;
    const summary = document.getElementById('book-summary').value;

    const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
            title, 
            author, 
            category,
            coverUrl,
            readUrl,
            buyUrl,
            summary 
        }),
    });

    const data = await response.json();
    alert(data.message);
    loadBooks(); // Refresh the book list
});

async function loadRecommendations() {
    const response = await fetch(`${API_URL}/books/recommendations`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const recommendations = await response.json();
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = '';

    recommendations.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} by ${book.author} - ${book.summary || 'No summary available'}`;
        recommendationsList.appendChild(li);
    });
}

function populateProgressBookSelect(books) {
    const select = document.getElementById('progress-book-select');
    select.innerHTML = '<option value="">Select a book</option>';
    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book._id;
        option.textContent = book.title;
        select.appendChild(option);
    });
}

async function loadProgressBooks() {
    // Optionally, load user's current reading progress if needed
    // This can be implemented if an API to get user reading progress is added
}

// Add event listener for updating reading progress
document.getElementById('reading-progress-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bookId = document.getElementById('progress-book-select').value;
    const progress = parseInt(document.getElementById('progress-input').value, 10);

    if (!bookId) {
        alert('Please select a book');
        return;
    }

    if (isNaN(progress) || progress < 0 || progress > 100) {
        alert('Please enter a valid progress percentage between 0 and 100');
        return;
    }

    const response = await fetch(`${API_URL}/books/progress`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ bookId, progress }),
    });

    const data = await response.json();
    alert(data.message);
});

// Optional: Add a function to log out the user
function logout() {
    localStorage.removeItem('token');
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('book-container').style.display = 'none';
    document.getElementById('reading-progress-container').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) window.location.href = 'index.html';

  const res = await fetch(`${API_URL}/books/by-category`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const categories = await res.json();
  renderCategories(categories);

  document.getElementById('search-bar').addEventListener('input', function() {
    renderCategories(categories, this.value);
  });
});

function renderCategories(categories, search = '') {
  const container = document.getElementById('categories-container');
  container.innerHTML = '';
  Object.keys(categories).forEach(category => {
    const filteredBooks = categories[category].filter(book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    );
    if (filteredBooks.length === 0) return;

    const section = document.createElement('section');
    section.innerHTML = `<h2>${category}</h2>`;
    const row = document.createElement('div');
    row.className = 'book-row';
    filteredBooks.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.innerHTML = `
        <img src="${book.coverUrl || 'default-cover.jpg'}" alt="${book.title}">
        <div>${book.title}</div>
        <div>by ${book.author}</div>
      `;
      row.appendChild(card);
    });
    section.appendChild(row);
    container.appendChild(section);
  });
}
