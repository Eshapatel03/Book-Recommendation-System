// Mock data for demonstration. Replace this with your API call!
const mockCategories = {
  "Trending on #BookTok": [
    {
      title: "It Ends With Us",
      author: "Colleen Hoover",
      coverUrl: "https://covers.openlibrary.org/b/id/10523338-L.jpg",
      price: "$29.00"
    },
    {
      title: "Bloodmarked",
      author: "Tracy Deonn",
      coverUrl: "https://covers.openlibrary.org/b/id/10523339-L.jpg",
      price: "$11.99"
    },
    {
      title: "Babel",
      author: "R. F. Kuang",
      coverUrl: "https://covers.openlibrary.org/b/id/10523341-L.jpg",
      price: "$24.35"
    },
    {
      title: "Happenstance",
      author: "Tessa Bailey",
      coverUrl: "https://covers.openlibrary.org/b/id/10523342-L.jpg",
      price: "$13.99"
    },
    {
      title: "King of Wrath",
      author: "Ana Huang",
      coverUrl: "https://covers.openlibrary.org/b/id/10523343-L.jpg",
      price: "$16.99"
    },
    {
      title: "Cain's Jawbone",
      author: "Edward Powys Mathers",
      coverUrl: "https://covers.openlibrary.org/b/id/10523344-L.jpg",
      price: "$11.65"
    },
    {
      title: "The Night and Its Moon",
      author: "Piper CJ",
      coverUrl: "https://covers.openlibrary.org/b/id/10523345-L.jpg",
      price: "$16.65"
    }
  ],
  "Up Next on #BookTok": [
    {
      title: "Merry Little Meet Cute",
      author: "Julie Murphy",
      coverUrl: "https://covers.openlibrary.org/b/id/10523346-L.jpg",
      price: "$13.99"
    },
    {
      title: "The Witches' Blade",
      author: "A.K. Mulford",
      coverUrl: "https://covers.openlibrary.org/b/id/10523347-L.jpg",
      price: "$14.99"
    },
    {
      title: "Drunk on Love",
      author: "Jasmine Guillory",
      coverUrl: "https://covers.openlibrary.org/b/id/10523348-L.jpg",
      price: "$12.99"
    },
    {
      title: "The Kiss Curse",
      author: "Erin Sterling",
      coverUrl: "https://covers.openlibrary.org/b/id/10523349-L.jpg",
      price: "$10.99"
    },
    {
      title: "One for My Enemy",
      author: "Olivie Blake",
      coverUrl: "https://covers.openlibrary.org/b/id/10523350-L.jpg",
      price: "$15.99"
    },
    {
      title: "Queen of Myth and Monsters",
      author: "Scarlett St. Clair",
      coverUrl: "https://covers.openlibrary.org/b/id/10523351-L.jpg",
      price: "$13.99"
    },
    {
      title: "A Very Merry Bromance",
      author: "Lyssa Kay Adams",
      coverUrl: "https://covers.openlibrary.org/b/id/10523352-L.jpg",
      price: "$14.99"
    }
  ]
  // Add more categories as needed
};

document.addEventListener('DOMContentLoaded', () => {
  renderCategories(mockCategories);

  document.getElementById('search-bar').addEventListener('input', function() {
    renderCategories(mockCategories, this.value);
  });
});

function renderCategories(categories, search = '') {
  const container = document.getElementById('categories-container');
  container.innerHTML = '';
  Object.keys(categories).forEach(category => {
    // Filter books by search
    const filteredBooks = categories[category].filter(book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    );
    if (filteredBooks.length === 0) return;

    const section = document.createElement('div');
    section.className = 'category-section';
    section.innerHTML = `<div class="category-title">${category}</div>`;

    const row = document.createElement('div');
    row.className = 'book-row';

    filteredBooks.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.innerHTML = `
        <img class="book-cover-img" src="${book.coverUrl}" alt="${book.title}">
        <div class="book-title">${book.title}</div>
        <div class="book-author">by ${book.author}</div>
        <div class="book-price">${book.price || ''}</div>
      `;
      row.appendChild(card);
    });

    section.appendChild(row);
    container.appendChild(section);
  });
}
