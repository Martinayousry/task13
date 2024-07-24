document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('productList');
    const cart = document.getElementById('cart');
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const sortPrice = document.getElementById('sortPrice');

    let products = [];
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    async function fetchProducts() {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('col-md-3', 'product');
            productDiv.innerHTML = `
                <h3>${product.title}</h3>
                <img src="${product.image}" alt="${product.title}" class="img-fluid">
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Type: ${product.category}</p>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to cart</button>
            `;
            productList.appendChild(productDiv);
        });
    }

    function displayCart() {
        cart.innerHTML = '';
        cartItems.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('col-md-4', 'cart-item');
            cartItemDiv.innerHTML = `
                <h3>${item.title}</h3>
                <p>Price: $${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <button class="btn btn-secondary" onclick="increaseQuantity(${item.id})">+</button>
                <button class="btn btn-secondary" onclick="decreaseQuantity(${item.id})">-</button>
                <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cart.appendChild(cartItemDiv);
        });
    }

    window.addToCart = function(id) {
        const product = products.find(p => p.id === id);
        const cartItem = cartItems.find(item => item.id === id);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }
        saveCart();
        displayCart();
    };

    window.increaseQuantity = function(id) {
        const cartItem = cartItems.find(item => item.id === id);
        cartItem.quantity++;
        saveCart();
        displayCart();
    };

    window.decreaseQuantity = function(id) {
        const cartItem = cartItems.find(item => item.id === id);
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
        } else {
            cartItems = cartItems.filter(item => item.id !== id);
        }
        saveCart();
        displayCart();
    };

    window.removeFromCart = function(id) {
        cartItems = cartItems.filter(item => item.id !== id);
        saveCart();
        displayCart();
    };

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });

    filterType.addEventListener('change', () => {
        const type = filterType.value;
        const filteredProducts = type
            ? products.filter(product => product.category === type)
            : products;
        displayProducts(filteredProducts);
    });

    sortPrice.addEventListener('click', () => {
        const sortedProducts = [...products].sort((a, b) => a.price - b.price);
        displayProducts(sortedProducts);
    });

    fetchProducts();
    displayCart();
});
;
//         displayProducts(sortedProducts);
//     });

//     fetchProducts();
//     displayCart();
// });
