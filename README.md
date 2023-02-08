# Telekis Napok Szavazó Rendszer
### [Éles weboldal linkje](https://www.telekisnapok.hu)

## Tartalom
- [Motiváció](https://github.com/Elod-T/telekisnapok/edit/main/README.md#motiv%C3%A1ci%C3%B3)
- [Rugalmasság](https://github.com/Elod-T/telekisnapok/edit/main/README.md#rugalmass%C3%A1g)
- [Biztonság](https://github.com/Elod-T/telekisnapok/edit/main/README.md#biztons%C3%A1g)
- [Fair-play](https://github.com/Elod-T/telekisnapok/edit/main/README.md#fair-play)
- [Open-source](https://github.com/Elod-T/telekisnapok/edit/main/README.md#open-source)
- [Technikai dolgok](https://github.com/Elod-T/telekisnapok/edit/main/README.md#technikai-dolgok)

## Motiváció
Miért is készült el ez a weboldal? Itt vagyunk a 21. században, és még mindig kézzel kell számolni a tn-es szavazatokat. Ez elég sok ember munkákát igényli: szavazó teremben 3-4 diák plusz 1 tanár, óránkénti váltásban. Ez még annyira nem vészes, mert így mindenki csak 1 órányi programról marad le. Ekkor jön a számlálás, ami kb 1 óra alatt meg is van, csak a probléma az, hogy a számlálók bent ragadnak a terembe több órára, hogy nehogy lespoilerezzék az eredményt, ez a tavaly kb 2 óra volt. (Ez amúgy azért nem is nagyon működik, mert telefonon bármikor leadhatják az infót) Ezekre mind megoldást szolgál ez az oldal, amit alább részletezek is.

## Rugalmasság
Bárhonnan lehet szavazni - telefonról, pcről, wcről, tabletről.

## Biztonság
Az authentikáció a [Microsoft Azure Active Directory](https://azure.microsoft.com/en-us/products/active-directory) segítségével történik, mivel ugye mindenkinek van @sztbg.hu-s email címe. Értelem szerűen csak sulis fiókkal lehet szavazni, ezt az azure ad el is intézi, mert úgy van beállítva. A weboldal [titkosítást](https://en.wikipedia.org/wiki/HTTPS) használ, a certification a [let's encrypt](https://letsencrypt.org/)-től van. Az authentikációban használt másik technológia a [jwt](https://jwt.io/introduction), ezt használjuk, hogy későbbi bejelentkezést igénylő lekérdezéseknél ne kelljen újra belépni az oldalra. Ez tárolja pl a felhasználó nevét és email címét. A szavazások tárolására [postgres](https://www.postgresql.org/) adatbázist használjuk, ami egy relációs, SQL alapú adatbázis.
<br>
<br>
Kapcsolódó fileok:
- [[...nextauth.ts]](https://github.com/Elod-T/telekisnapok/blob/main/pages/api/auth/%5B...nextauth%5D.ts)

## Fair-play
Hogyan is tároljuk az adatokat, hogy a szavazás **anonim** lehessen? Ha bejön egy szavazás, akkor authentikáció után először ellenőrizzük, hogy az adott felhasználó szavazott-e, illetve a szavazás elkezdődött-e / véget ért-e már. Utána a szavazáshoz kapcsolva eltároljuk, hogy a felhasználó szavazott, fontos, hogy **itt nem tároljuk el, hogy kire szavazott** (voter tábla). Majd az osztályhoz kapcsolva eltároljuk, hogy **valaki szavazott rájuk, és, hogy mikor**. Az utóbbit csak azért, hogy gyönyörű diagramokat lehessen csinálni az admin dashboardra, valamint később nyilvánosan.
<br>
<br>
Az alábbi ábra mutatja az adatbázis szerkezetét:
<br>
![image](https://user-images.githubusercontent.com/33983644/217610980-1ef36145-dcaf-46b9-ad37-a3e28452d8d3.png)
<br>
<br>
Kapcsolódó fileok:
- [castVote.ts](https://github.com/Elod-T/telekisnapok/blob/main/pages/api/castVote.ts)

## Open-source
A weboldal teljes mértékben nyílt forráskódú. Változtatásokat szívesen fogadok, akár Pull Request, akár személyes megkeresés, akár [email](mailto:tobakelod@gmail.com) formájában.

## Technikai dolgok
A stack a weboldal mögött majdnem [t3 stack](https://create.t3.gg/), egyedül a tRPC hiányzik, de ide nincs is rá szükség. Miért jó a [next js](https://nextjs.org/)? A next js frontendre [reactot](https://reactjs.org/) használ, ami a komponens alapú megközelítésével nem véletlen széleskörben kedvelt. A [typescript](https://www.typescriptlang.org/) használata nem is kérdés. Nyilván javascriptre fordul, úgyhogy történhetnek vicces dolgok, de legalább compilekor van type-checking, illetve fejlesztés közben az autocorrect meg intellisense se jön rosszul. Orm-nek a [prismára](https://www.prisma.io/) esett a választás, mivel type-safe, ami megkönnyíti a fejlesztést. A backend [serverless](https://en.wikipedia.org/wiki/Serverless_computing) ez sok problémát vet fel, de az adatbázis tekintetében a legnagyobb a connection pooling. Ugye itt minden egyes requestnél új kapcsolatot nyitunk az adatbázis felé, így elég hamar betelítjük a limitet. Erre kínál megoldást a [prisma data proxy](https://www.prisma.io/docs/data-platform/data-proxy), aminek segítségével az előbbi probléma már nem fog fennállni. A next js-nek a másik nagy előnye, hogy lehet vele [ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)-t csinálni. Ennek lényege, hogy az oldal statikus (SSG), viszont emellett percenként legfejlebb 1 requestnél az adott pagere megnézi az adatbázisból, hogy van-e változás, ha igen akkor a háttérben újra generálja az oldalt, majd invalidálja a cachet, és már a friss oldal látszik (SSR).
