document.addEventListener('DOMContentLoaded', () => {
  // State
  let products = [];
  let cart = [];
  let posts = [];

  // Tab Navigation Elements
  const tabShop = document.getElementById('tab-shop');
  const tabBlog = document.getElementById('tab-blog');
  const shopView = document.getElementById('shop-view');
  const blogView = document.getElementById('blog-view');

  // E-Commerce Elements
  const productGrid = document.getElementById('product-grid');
  const productSearch = document.getElementById('product-search');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCountEl = document.getElementById('cart-count');
  const cartTotalPriceEl = document.getElementById('cart-total-price');
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckout = document.getElementById('close-checkout');
  const checkoutForm = document.getElementById('checkout-form');

  // Blog Elements
  const blogPostsGrid = document.getElementById('blog-posts-grid');
  const authorFilter = document.getElementById('author-filter');
  const openPostModal = document.getElementById('open-post-modal');
  const postModal = document.getElementById('post-modal');
  const closePostModal = document.getElementById('close-post-modal');
  const postForm = document.getElementById('post-form');

  // 1. Navigation Switching
  tabShop.addEventListener('click', () => {
    tabShop.classList.add('active');
    tabBlog.classList.remove('active');
    shopView.classList.add('active');
    blogView.classList.remove('active');
  });

  tabBlog.addEventListener('click', () => {
    tabBlog.classList.add('active');
    tabShop.classList.remove('active');
    blogView.classList.add('active');
    shopView.classList.remove('active');
    fetchPosts();
  });

  // 2. Fetch & Render Products (E-Commerce Task 1 & 2)
  const fetchProducts = async (query = '') => {
    try {
      // Auto-seed sample items on first run if needed
      await fetch('/api/products/seed', { method: 'POST' });
      const url = query ? `/api/products?search=${encodeURIComponent(query)}` : '/api/products';
      const res = await fetch(url);
      products = await res.json();
      renderProducts();
    } catch (err) {
      productGrid.innerHTML = '<p>Failed to load products from server.</p>';
    }
  };

  const renderProducts = () => {
    productGrid.innerHTML = '';
    if (products.length === 0) {
      productGrid.innerHTML = '<p class="subtitle">No products match your search query.</p>';
      return;
    }

    products.forEach((prod) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${prod.imageUrl}" alt="${prod.name}">
        <div class="card-body">
          <h4>${prod.name}</h4>
          <p>${prod.description}</p>
          <div class="card-footer">
            <span class="price">$${prod.price.toFixed(2)}</span>
            <button class="btn-primary add-cart-btn" data-id="${prod._id}">Add to Cart</button>
          </div>
        </div>
      `;
      card.querySelector('.add-cart-btn').addEventListener('click', () => addToCart(prod));
      productGrid.appendChild(card);
    });
  };

  // Live search filtering
  productSearch.addEventListener('input', (e) => {
    fetchProducts(e.target.value.trim());
  });

  // 3. Cart Management (E-Commerce Task 3 & 4)
  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    toggleCart(true);
  };

  const removeFromCart = (id) => {
    cart = cart.filter((item) => item._id !== id);
    updateCartUI();
  };

  const updateCartUI = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;

    const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalPriceEl.textContent = `$${totalCost.toFixed(2)}`;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-text">Your cart is currently empty.</p>';
      return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <p class="subtitle">$${item.price.toFixed(2)} × ${item.quantity}</p>
        </div>
        <button class="btn-remove" style="color:#ef4444; border:none; background:none; cursor:pointer;">
          <i class="fas fa-trash"></i>
        </button>
      `;
      el.querySelector('.btn-remove').addEventListener('click', () => removeFromCart(item._id));
      cartItemsContainer.appendChild(el);
    });
  };

  const toggleCart = (open) => {
    cartDrawer.classList.toggle('open', open);
    cartOverlay.classList.toggle('active', open);
  };

  cartToggleBtn.addEventListener('click', () => toggleCart(true));
  closeCartBtn.addEventListener('click', () => toggleCart(false));
  cartOverlay.addEventListener('click', () => toggleCart(false));

  // Checkout modal
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    toggleCart(false);
    checkoutModal.classList.add('active');
  });

  closeCheckout.addEventListener('click', () => checkoutModal.classList.remove('active'));

  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const customerName = document.getElementById('cust-name').value;
    const customerEmail = document.getElementById('cust-email').value;
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderPayload = {
      customerName,
      customerEmail,
      items: cart.map((i) => ({ productId: i._id, name: i.name, price: i.price, quantity: i.quantity })),
      totalAmount
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Order Placed Successfully! Order ID: ${data.orderId}`);
        cart = [];
        updateCartUI();
        checkoutModal.classList.remove('active');
        checkoutForm.reset();
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (err) {
      alert('Error submitting order.');
    }
  });

  // 4. Blog Tasks (Tasks 1, 2, 3 & 4)
  const fetchPosts = async (author = '') => {
    try {
      const url = author ? `/api/posts?author=${encodeURIComponent(author)}` : '/api/posts';
      const res = await fetch(url);
      posts = await res.json();
      renderPosts();
    } catch (err) {
      blogPostsGrid.innerHTML = '<p>Failed to load blog posts.</p>';
    }
  };

  const renderPosts = () => {
    blogPostsGrid.innerHTML = '';
    if (posts.length === 0) {
      blogPostsGrid.innerHTML = '<p class="subtitle">No blog posts found for this selection.</p>';
      return;
    }

    posts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      card.innerHTML = `
        <span class="blog-badge">${post.category}</span>
        <h3>${post.title}</h3>
        <p style="margin: 0.75rem 0;">${post.content}</p>
        <div class="blog-meta">
          <span>By <strong>${post.author}</strong></span> • 
          <span>${new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      `;
      blogPostsGrid.appendChild(card);
    });
  };

  authorFilter.addEventListener('input', (e) => {
    fetchPosts(e.target.value.trim());
  });

  openPostModal.addEventListener('click', () => postModal.classList.add('active'));
  closePostModal.addEventListener('click', () => postModal.classList.remove('active'));

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById('post-title').value,
      author: document.getElementById('post-author').value,
      category: document.getElementById('post-category').value,
      content: document.getElementById('post-content').value
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Blog post published!');
        postModal.classList.remove('active');
        postForm.reset();
        fetchPosts();
      } else {
        alert(data.error || 'Failed to publish post');
      }
    } catch (err) {
      alert('Network error publishing post.');
    }
  });

  // Initial Load
  fetchProducts();
});