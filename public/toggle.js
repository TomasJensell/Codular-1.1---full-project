//Endast för att toggla shopping-cart.
const x = document.querySelector('#cart-toggle');

document.querySelector('#toggle').addEventListener('click', function () {
  if (x.style.display !== 'block') {
    x.style.display = 'block';
  } else {
    x.style.display = 'none';
  }
});