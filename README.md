# Codular 2.0

På denna hemsida så har jag integrerat en hemsida mot en server.
De verktyg jag har använt mig ut av är;
Node.JS
Express.JS
EJS (Embedded JavaScript templates) - Ett verktyg för att integrera JavaScript i HTML-kod.
Gulp

Utöver detta finns;
HTML,
CSS,
JavaScript
JSON

Detta projekt är gjort för att skapa sig en större förståelse om hur logiken fungerar. (Dvs ändra priser, räkna ut nytt totalpris i varukorgen, ta bort vara från varukorgen och därefter uppdatera totalpriset osv)

För att skapa hemsidan så fick jag börja med att gå igenom en Node.JS guide på Udemy. Där var det ganska basic och jag använde mig av ren HTTP dvs jag använde mig inte utav Express.JS.

Jag gick igenom detta för att lära mig grunderna, hur man routrar om, hur jag kan ändra text i ett med hjälp av JSON i ett HTML-dokument. Där fick jag lära mig filsystemsmodulen ('fs') som är väldigt bra när man skall läsa av filer. Detta använde jag till att läsa av JSON-filen för att kunna hämta data därifrån och impementera i HTML-filen med hjälp av EJS. EJS-filen med HTML-koden renderas sedan av servern för att visas för client-sidan och där renderas även JSON-datan då jag kopplat JSON-datan mot vissa punkter i HTML-koden t.ex. produktnamn, produktbild och pris.

När priset är uträknat och visas i varukorgen så kommer servern in och tar all JSON-information för att göra en egen uträkning på det hela, detta eftersom Stripe är kopplat till systemet så behöver servern ge information till Stripe för den rätta summan. Detta finns kommenterat i server.js-filen.

Vill slutligen säga att det var rätt tufft att få ihop allt detta men jag har kikat på massor av guider och läst mycket på node.js/express.js-dokumentationen för att veta att jag kopplar allt och inte bara skriver av någon för jag vill lära mig det jag gör och det vore dåligt om jag kopierade något från nätet och lämnade in.

Angående inkluderingen av Stripe så fick jag ta rätt stor hjälp av guider, men även där så kollade jag upp mycket av delarna för att faktiskt förstå vad som sker och inte kopierar rakt av.

//Team Codular / Tomas Jensell

