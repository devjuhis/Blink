![Blink Logo](assets/blink_logo_ss.png)
📽️ [Katso promovideo](https://haagahelia-my.sharepoint.com/:v:/r/personal/bhi254_myy_haaga-helia_fi/Documents/promo_video.mp4?csf=1&web=1&e=JgNbbj&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)

# 📱 Blink - Lyhytvideo Päiväkirja

**Blink** on React Native ja Expo -alustalla rakennettu sovellus, joka toimii **lyhytvideo päiväkirjana**. Tallenna omia videoitasi, jaa päiväsi muille ja seuraa muiden käyttäjien inspiroivia päiväkirjoja! 🌟

## 🚀 Ominaisuudet

- 🎥 **Videoiden tallentaminen ja jakaminen**: Tallenna lyhytvideoita pävän aika, jotka toimivat digitaalisen päiväkirjasi osina.
- 👀 **Seuraa muiden päiväkirjoja**: Voit katsella ja seurata muiden käyttäjien jakamia videoita ja saada inspiraatiota heidän sisällöistään.
- ☁️ **Firebase Storage**: Videoiden tallentaminen ja hallinta tapahtuu luotettavasti Firebase Storage -palvelussa.
- 🔐 **Firebase Authentikointi**: Käyttäjät voivat kirjautua sisään ja luoda tilejä turvallisesti Firebase Authenticationin avulla.

## 🛠️ Teknologiat

- **React Native**: Sovelluksen käyttöliittymä on rakennettu React Nativella. 📱
- **Expo**: Expo sovelluksen kehittämistä ja pakkaamista varten. 🎉
- **Firebase**: Firebase tarjoaa autentikoinnin ja tallennustilan videoille. 🔥
- **Node**: Videoiden yhdistäminen toimii FFMPEG kirjastolla node palvelimella rahdissa. 🔥

## 📥 Asennus

1. **Varmista, että sinulla on asennettuna seuraavat**:
   - [Node.js](https://nodejs.org/)
   - [Firebase-tili](https://firebase.google.com/)

2. **Kloonaa tämä projekti**:
   ```bash
   git clone https://github.com/yourusername/blink.git

# 🎓 Oppimispäiväkirja

### 🔧 Ongelmat ja ratkaisut

| Ongelma | Ratkaisu | Työkalut / Kirjastot | Mitä opin |
|---------|----------|-----------------------|-----------|
| Videoiden yhdistäminen | Käytin Node.js-backendiä ja `fluent-ffmpeg`-kirjastoa | Node.js, FFMPEG | Opin, miten palvelin voi käsitellä ja yhdistää videoita |
| Android development build ei mene läpi | Käytin `expo doctor`, `eas build`, `lint`, joilla sain korjattua viat jotka esti buildin menemisen läpi | Expo CLI, EAS Build, Expo Doctor, Lint  | Opin, miten debugataan projektia ja luetaan logeja |
| Kamera- ja mikrofoni-oikeudet eivät toimineet | Käytin `useCameraPermissions` ja `useMicrophonePermissions` lisäsin `CAMERA` ja `RECORD_AUDIO` -oikeudet app.json tiedostoon | Expo Camera | Opin, miten käyttöoikeuksia hallitaan Expossa |
| Video jäi pyörimään taustalle screeniltä poistuttaessa | Käytin `useFocusEffect` palauttamaan tilan oletukseksi | React Hookit | Opin hallitsemaan komponentin elinkaarta |
| Videoiden tallennus ja käyttäjien hallinta | Käytin Firebase Storagea ja Authenticationia | Firebase | Opin, miten videot tallennetaan pilveen ja käyttäjät tunnistetaan |
| Käyttäjien esittäminen toisille käyttäjille | Tallensin rekisteröityessä tiedot Firebase Databaseen | Firebase Database | Opin tallentamaan ja hakemaan tietoa firebase databasesta |
| Rahdissa ongelmia kansion kirjoitusoikeuksien kanssa | Lisäsin persistentVolumeClaimin ja yhdistin sen projektiin | persistentVolumeClaim | Tämä on paikka jossa pitää dataa kontin elinkaaren ulkopuolella, ja opin miten se tehdään |
| FFMPEG installer ei toimi ohjelmakoodista | FFMPEG ympäristö tulee asentaa kontin rakennus vaiheessa | Docker | Dockerfilessä tehdään kaikki ympäristöön tehtävät asennukset, kontin rakennuksen jälkeen voi olla vaikeuksia muuttaa ympäristöä |
| Firebase antoi yhtäkkiä ongelmia ettei käyttäjällä ole oikeuksia hakea omia videoita | Muutin aika scopea, toinen vaihtoehto olisi ollut poistaa sääntö kokonaan | Firebase rules | Firebasessa on rules ikkuna jossa voidaan määritellä aika ikkuna jossa käyttäjällä on oikeuksia, kun aikaikkuna on sulkeutunut käyttäjällä ei ole oikeksia | 
| Käyttäjän tietojen siirto sivulta sivulle | `React Context` on hyvä tapa siirtää tietoa komponenttipuussa contextin lapsien välillä ilman propseja | React createContext | React contextin käyttöä ja sen hyödyntämistä autentikoimisessa eri komponenteissa ja pyynnöissä |
| Halusin lisätä sivun navigaattoriin mutta en tabseihin | Lisäsin sen `StackNavigatoriin`, eli minulla on projektissani kaksi eri navigaattoria (stack ja tab) | React-navigation stack ja bottom-tabs | On hyödyllistä olla kaksi navigaattoria, jos et halua että kaikki sivut näkyvät kaikille alapalkissa |
| Halusin testata expo sovellustani ulkona | Expo start --tunnel mahdollistaa development buildin käytön toisessa verkossa kuin isäntäkone | Expo tunnel | Expo tunnel on mmahdollistaa expo sovelluksen käytön toisessa verkossa ngrokin avulla |
| Firebase storage:n käyttö ei ole ilmaista | Kun tallennetaan ja siirrellään videoita tietoliikenteen määrä kasvaa helposti suureksi ja alkaa maksamaan kun ylittää 100GB halvemmilla bucketeilla jotka sijaitsee Yhdysvalloissa | Firestore | Referessiksi yhtenä päivänä kun testailin ohjelmaa ja latasin paljon eri käyttäjien videoita tietoliikenteen latausmäärä oli 8,8GB eli noin 9% ilmaismäärästä. Eli jos käyttäjiä olisi useampi ja käyttäisi päivittäin, ilmaisraja tulisi aika nopeasti täyteen |


---

### 🧠 Mitä opin tässä projektissa?
- Expo toimii hyvin nopeaan prototypointiin, mutta buildien ja natiivikirjastojen kanssa tulee helposti ongelmia.
- Firebase tarjoaa monipuoliset ratkaisut tallennukseen ja käyttäjien hallintaan, pienellä koodimäärällä.
- Lupien hallinta oli uutta ja hieman hankalaa, mutta opin tässä projektissa ainakin perusteet.
- Eas cli on todella hyödyllinen työkalu buildien rakentamiseen ja seuraamiseen.
- Videoiden käsittely ohjelmissa tietoliikenteen määrä kasvaa nopeasti isoksi ja latausajat saattavat olla ongelmallisia.


