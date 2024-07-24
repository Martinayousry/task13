document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList") as HTMLElement;
  const cart = document.getElementById("cart") as HTMLElement;
  const searchInput = document.getElementById(
    "searchInput"
  ) as HTMLInputElement;
  const filterType = document.getElementById("filterType") as HTMLSelectElement;
  const sortPrice = document.getElementById("sortPrice") as HTMLButtonElement;

  interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }

  interface CartItem extends Product {
    quantity: number;
  }

  let products: Product[] = [];
  let cartItems: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

  async function fetchProducts(): Promise<void> {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  function displayProducts(products: Product[]): void {
    productList.innerHTML = "";
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("col-md-3", "product");
      productDiv.innerHTML = `
                <h3>${product.title}</h3>
                <img src="${product.image}" alt="${product.title}" class="img-fluid">
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Type: ${product.category}</p>
                <button class="btn btn-primary" data-id="${product.id}">Add to cart</button>
            `;
      productList.appendChild(productDiv);
    });
    addEventListenersToButtons();
  }

  function addEventListenersToButtons(): void {
    const addToCartButtons = document.querySelectorAll(".btn-primary");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number((button as HTMLElement).dataset.id);
        addToCart(id);
      });
    });

    const increaseQuantityButtons = document.querySelectorAll(".btn-secondary");
    increaseQuantityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number((button as HTMLElement).dataset.id);
        if (button.textContent === "+") {
          increaseQuantity(id);
        } else {
          decreaseQuantity(id);
        }
      });
    });

    const removeFromCartButtons = document.querySelectorAll(".btn-danger");
    removeFromCartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number((button as HTMLElement).dataset.id);
        removeFromCart(id);
      });
    });
  }

  function displayCart(): void {
    cart.innerHTML = "";
    cartItems.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.classList.add("col-md-4", "cart-item");
      cartItemDiv.innerHTML = `
                <h3>${item.title}</h3>
                <p>Price: $${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <button class="btn btn-secondary" data-id="${item.id}">+</button>
                <button class="btn btn-secondary" data-id="${item.id}">-</button>
                <button class="btn btn-danger" data-id="${item.id}">Remove</button>
            `;
      cart.appendChild(cartItemDiv);
    });
    addEventListenersToButtons();
  }

  function addToCart(id: number): void {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const cartItem = cartItems.find((item) => item.id === id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    saveCart();
    displayCart();
  }

  function increaseQuantity(id: number): void {
    const cartItem = cartItems.find((item) => item.id === id);
    if (cartItem) {
      cartItem.quantity++;
      saveCart();
      displayCart();
    }
  }

  function decreaseQuantity(id: number): void {
    const cartItem = cartItems.find((item) => item.id === id);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      } else {
        cartItems = cartItems.filter((item) => item.id !== id);
      }
      saveCart();
      displayCart();
    }
  }

  function removeFromCart(id: number): void {
    cartItems = cartItems.filter((item) => item.id !== id);
    saveCart();
    displayCart();
  }

  function saveCart(): void {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
  });

  filterType.addEventListener("change", () => {
    const type = filterType.value;
    const filteredProducts = type
      ? products.filter((product) => product.category === type)
      : products;
    displayProducts(filteredProducts);
  });

  sortPrice.addEventListener("click", () => {
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
    displayProducts(sortedProducts);
  });

  fetchProducts();
  displayCart();
});
