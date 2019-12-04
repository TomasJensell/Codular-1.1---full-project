//Använder .env för Stripe-nycklarna
require('dotenv').config()

//STRIPE-nycklar för testköp utan att det dras pengar
//Läser in Stripe-nycklarna från .env
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

//Loggar dem i console
console.log(stripeSecretKey, stripePublicKey);

//Sätta upp en server
const express = require('express');
const app = express();
//Läsa av JSON - items.json
//Filsystemsmodul.
const fs = require('fs');
const stripe = require('stripe')(stripeSecretKey)

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.static('public')); //Använder public som FRONT-END


//Routa /store så man kan läsa av information från JSON-dokumentet
app.get('/store', function(req, res) {
    //Läser av JSON-koden med hjälp av filsystemsmodulen.
    fs.readFile('items.json', function(error, data) {
        //Ger en svarskod med 500 (Internal Server Error) om något fel uppstår
        if (error) {
            res.status(500).end()
        //Läser in JSON-datan till /store och renderar hemsidan samt stripe-nyckeln till logiken till varukorg.
        } else {
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
})

//Eftersom jag inte har några andra sidor så la jag till en redirect till /store om man skriver bara
//localhost:3000
app.get('/', function(req, res){
    res.redirect('/store');
})


//STRIPE -- Behövde hjälp med hur man integrerade det till köpet.
app.post('/purchase', function(req, res) {
    
    fs.readFile('items.json', function(error, data) {
        //Ger en svarskod med 500 (Internal Server Error) om något fel uppstår
        if (error) {
            res.status(500).end()
        } else {
            /*
            Servern tar del av varukorgens information gällande pris och kvantitet.
            Servern gör sedan en uträkning på priset * kvantiteten för att räkna ut totalsumman
            som sedan skickas till Stripe för en korrekt läsning av totalpriset som sedan visas
            när man skall betala.
            */
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.courses.concat(itemsJson.topcourses)
            let total = 0
            req.body.items.forEach(function(item){
                const itemJson = itemsArray.find(function(i) {
                    return i.id == item.id
                })
                total = total + itemJson.price * item.quantity
            })
            //Skapar en överblick över totalpriset, kopplar det till min Stripe-nyckel
            //Och sedan använder Dollar som valuta.
            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'usd'
            //Meddelanden när ett köp godkänts eller inte.
            }).then(function() {
                //Loggar till console om köpet lyckades
                console.log('Lyckat köp!')
                //"Alert" om köpet lyckades
                res.json({message: 'Köpet lyckades!'})
            }).catch(function(){
                //Loggar till console om köpet skulle misslyckas
                console.log('Köpet misslyckades!')
                res.status(500).end()
            })
        }
    })
})

//Serverporten som används
app.listen(3000); 
