![Blink Logo](assets/blink_logo_ss.png)
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

---

### 🧠 Mitä opin tässä projektissa?
- Expo toimii hyvin nopeaan prototypointiin, mutta buildien ja natiivikirjastojen kanssa tulee helposti ongelmia.
- Firebase tarjoaa monipuoliset ratkaisut tallennukseen ja käyttäjien hallintaan, pienellä koodimäärällä.
- Lupien hallinta oli uutta ja hieman hankalaa, mutta opin tässä projektissa ainakin perusteet.
- Eas cli on todella hyödyllinen työkalu buildien rakentamiseen ja seuraamiseen.


