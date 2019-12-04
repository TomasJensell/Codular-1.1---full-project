//Varukorgens logik - lite nytt fast med inspiration från vår gamla. (Codular 1.0)
//Dock inte localstorage denna gång.

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

//Ta bort från varukorg.
function ready() {
    let removeButton = document.getElementsByClassName('btn-danger')
    for (let i = 0; i < removeButton.length; i++) {
        let button = removeButton[i]
        button.addEventListener('click', removeItem)
    }
//Ändra hur många kurser man ska köpa.
    let quantityInput = document.getElementsByClassName('cart-quantity-input')
    for (let i = 0; i < quantityInput.length; i++) {
        let input = quantityInput[i]
        input.addEventListener('change', quantityChange)
    }
//Lägga till produkt till varukorg.
    let addButton = document.getElementsByClassName('shop-item-button')
    for (let i = 0; i < addButton.length; i++) {
        let button = addButton[i]
        button.addEventListener('click', addClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', buyClicked)
}
//Integrera STRIPE -- Behövde lite guide här så inte 100% mitt
let stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'auto',
    token: function(token){
        let items = []
        let cartItemContainer = document.getElementsByClassName('cart-items')[0]
        cartRows = cartItemContainer.getElementsByClassName('cart-row')
        for (let i = 0; i < cartRows.length; i++){
            let cartRow = cartRows[i]
            let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            let quantity = quantityElement.value
            let id = cartRow.dataset.itemId
            items.push({
                id: id,
                quantity: quantity,
            })
        }
        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        }).then(function(res) {
            //Konverterar till JSON
            return res.json()
        }).then(function(data) {
            //Ger alert efter godkänt köp och tar bort från varukorg.
            alert(data.message)
            let cartItems = document.getElementsByClassName('cart-items')[0]
            while (cartItems.hasChildNodes()){
                cartItems.removeChild(cartItems.firstChild)
            }
            updateTotal()
        }).catch(function(error) {
            console.log(error)
        })
    }
})

//Ändrar priset så att det blir korrekt formaterat
function buyClicked() {
    let priceElement = document.getElementsByClassName('cart-total-price')[0]
    // Gångrar priset med 100 eftersom Stripe endast räknar cent...
    let price = parseFloat(priceElement.innerText.replace('$', '')) * 100
    stripeHandler.open({
        amount: price
    })
}

//Funktionen till ta bort produkt från varukorg
function removeItem(event) {
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateTotal()
}

//Funktionen till hur mycket man ska köpa
function quantityChange(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateTotal()
}

//Funktionen till knappen att lägga till en produkt
function addClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('item-title')[0].innerText
    let price = shopItem.getElementsByClassName('item-price')[0].innerText
    let imageSource = shopItem.getElementsByClassName('item-image')[0].src
    let id = shopItem.dataset.itemId
    addItem(title, price, imageSource, id)
    updateTotal()
}

//Funktionen till att faktiskt lägga till en produkt
function addItem(title, price, imageSource, id) {
    let cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id
    let cartItems = document.getElementsByClassName('cart-items')[0]
    let cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('Denna produkt har redan lagts till i varukorgen!')
            return
        }
    }

    //Varukorgens innehåll. Ändrar innehållet till rätta bilden, titlen och priset.
    let cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSource}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChange)
}


//Uppdatera totalpris med bilder och hur många produkter.
function updateTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
    for (let i = 0; i < cartRows.length; i++) {
         
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
    document.getElementsByClassName('cart-update-text')[0].innerText = '$' + total;
}

