/**
 * Product Data
 */
const products = [
    {
        id: 1,
        name: "Pan de Masa Madre",
        description: "Corteza crujiente y miga suave con el toque ácido perfecto.",
        price: 16.50,
        category: "panes",
        image: "https://images.unsplash.com/photo-1589367920969-ab8e05030bc2?w=800&q=80",
        available: true
    },
    {
        id: 2,
        name: "Croissants Franceses",
        description: "Laminados a mano con mantequilla premium.",
        price: 10.50,
        category: "pasteleria",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
        available: true
    },
    {
        id: 3,
        name: "Eclairs de Chocolate",
        description: "Cubiertos con ganache de chocolate belga.",
        price: 13.00,
        category: "pasteleria",
        image: "https://images.unsplash.com/photo-1510252554792-74d6434316ae?w=800&q=80",
        available: true
    },
    {
        id: 4,
        name: "Tarta de Frustas",
        description: "Frutas frescas de la mejor calidad.",
        price: 19.50,
        category: "pasteleria",
        image: "https://images.unsplash.com/photo-1464305795204-6f5bdf7f8740?w=800&q=80",
        available: false
    },
    {
        id: 5,
        name: "Rollos de Canela",
        description: "Suaves con glaseado de queso crema.",
        price: 11.00,
        category: "pasteleria",
        image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80",
        available: true
    },
    {
        id: 6,
        name: "Muffins de Arándanos",
        description: "Cargados de arándanos frescos.",
        price: 9.50,
        category: "pasteleria",
        image: "https://images.unsplash.com/photo-1607958674115-05b148067426?w=800&q=80",
        available: true
    },
    {
        id: 7,
        name: "Selva Negra",
        description: "Chocolate, crema y cerezas.",
        price: 45.00,
        category: "tortas",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
        available: true
    },
    {
        id: 8,
        name: "Cheesecake",
        description: "Suave crema con reducción de maracuyá.",
        price: 18.00,
        category: "postres",
        image: "https://images.unsplash.com/photo-1524351114678-838bc863388a?w=800&q=80",
        available: true
    },
    {
        id: 9,
        name: "Jamón Artesanal",
        description: "Especial con toque de especias.",
        price: 12.50,
        category: "embutidos",
        image: "https://images.unsplash.com/photo-1601356616077-6957284f72f1?w=800&q=80",
        available: true
    },
    {
        id: 10,
        name: "Café Americano",
        description: "Granos selectos recién molidos.",
        price: 6.50,
        category: "bebidas",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
        available: true
    }
];

/**
 * App State
 */
let cart = JSON.parse(localStorage.getItem('bakery-cart')) || [];
let currentTheme = localStorage.getItem('bakery-theme') || 'light';

/**
 * Initialize App
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderProducts(products);
    updateStatus();
    initAnimations();
    initMaps();
    initTestimonials();
});

/**
 * Feature: Live Status
 */
function updateStatus() {
    const statusDot = document.getElementById('shop-status-dot');
    const statusText = document.getElementById('shop-status-text');
    if (!statusDot || !statusText) return;

    const now = new Date();
    const day = now.getDay(); // 0 for Sunday
    const hour = now.getHours();
    
    let isOpen = false;
    if (day >= 1 && day <= 6) { // Mon-Sat
        if (hour >= 7 && hour < 20) isOpen = true;
    } else { // Sun
        if (hour >= 7 && hour < 13) isOpen = true;
    }

    if (isOpen) {
        statusDot.className = 'status-dot open';
        statusText.innerText = 'Abierto ahora';
    } else {
        statusDot.className = 'status-dot closed';
        statusText.innerText = 'Cerrado - Abrimos 7:00 AM';
    }
}

/**
 * Feature: Product Rendering & Filtering
 */
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = items.map(product => `
        <div class="product-card" data-aos="fade-up">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <span class="status ${product.available ? 'available' : 'sold-out'}">
                    ${product.available ? 'Disponible' : 'Agotado'}
                </span>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-footer">
                    <span class="price">S/ ${product.price.toFixed(2)}</span>
                    <button 
                        onclick="addToCart(${product.id})" 
                        class="order-btn ${!product.available ? 'disabled' : ''}" 
                        ${!product.available ? 'disabled' : ''}>
                        ${product.available ? 'Agregar' : 'Agotado'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

window.filterCategory = (category) => {
    const filtered = category === 'todos' 
        ? products 
        : products.filter(p => p.category === category);
    renderProducts(filtered);
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
};

/**
 * Feature: Shopping Cart
 */
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} agregado`);
};

function saveCart() {
    localStorage.setItem('bakery-cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartItems = document.getElementById('cart-items-list');
    
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (cartCount) cartCount.innerText = count;
    if (cartTotal) cartTotal.innerText = `S/ ${total.toFixed(2)}`;
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>S/ ${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
                </div>
            `).join('');
        }
    }
}

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
};

window.checkoutWhatsApp = () => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const itemsText = cart.map(item => `- ${item.name} (x${item.quantity})`).join('%0A');
    const message = `Hola,%20quisiera%20hacer%20un%20pedido:%0A${itemsText}%0A%0ATotal:%20S/%20${total.toFixed(2)}`;
    
    window.open(`https://wa.me/51959007619?text=${message}`, '_blank');
};

/**
 * Feature: Dark Mode
 */
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

window.toggleTheme = () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('bakery-theme', currentTheme);
    updateThemeIcon();
};

function updateThemeIcon() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.innerHTML = currentTheme === 'light' 
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    
    btn.style.color = currentTheme === 'light' ? '#2c1e1a' : '#ffffff';
}

/**
 * Initializers for Libraries
 */
function initAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }
}

function initMaps() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') return;

    const lat = -8.11599;
    const lng = -79.02998;
    const map = L.map('map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap creators'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup('<b>El Trigo de Oro</b><br>Trujillo, Perú')
        .openPopup();
}

function initTestimonials() {
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
