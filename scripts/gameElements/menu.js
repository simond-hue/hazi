class Menu{
    constructor(){
        this.plain = document.createElement('div')
        this.plain.classList.add('menu_plain');
        this.plain.id = 'menu_plain'
        this.new_game = new MenuButtonWrapper('Új játék', 'new_game_button');
        this.player_count = new InputFieldWrapper("Játékosok száma");
        this.plain.appendChild(this.player_count.subscript);
        this.plain.appendChild(this.player_count.input_field);
        this.kincskartya_count = new InputFieldWrapper('Kincskártyák száma játékosonként');
        this.plain.appendChild(this.kincskartya_count.subscript);
        this.plain.appendChild(this.kincskartya_count.input_field);
        this.new_game.button.addEventListener('click', this.start_new_game);
        this.description_button = new MenuButtonWrapper('A játék leírása', 'show_description_button');
        this.description_button.button.addEventListener('click', (event) => { this.show_description(this.plain)});
        this.plain.appendChild(this.new_game.button);
        this.plain.appendChild(this.description_button.button);
        document.body.appendChild(this.plain);
    }

    start_new_game(){
        let player_count = document.getElementById('input_player_number');
        if(player_count.value < 1 || player_count.value > 4){
            alert('Nem megfelelő játékos szám! (1-4)');
            return;
        }
        let kincskartya_count = document.getElementById('input_kincskartya_number');
        if(kincskartya_count.value < 1 || kincskartya_count.value > (24/player_count.value)){
            alert(`Nem megfelelő kincskártya szám! (1-${Math.floor(24/player_count.value)})`)
            return;
        }
        this.game = new Game(player_count.value, kincskartya_count.value);
    }

    show_description(plain){
        let desc = document.createElement('div');
        desc.classList.add('description')
        let p = document.createElement('p');
        p.innerHTML = "A katakomba szobáit egy 7x7-es négyzetrács cellái jelképezik. Minden szoba esetén adott, hogy mely falain van ajtó. Ha két szomszédos szoba érintkező falán egy-egy ajtó van, akkor át lehet menni egyik szobából a másikba. A négyzetrács páros sorait és oszlopait el lehet tolni, a többi szoba végig rögzített a játék során. Az eltolásokkal az ajtókon keresztül utak nyílnak a szobák között, így lehet eljutni a kincsekhez. Mindegyik kérő arra törekszik, hogy a katakomba szobáinak ötletes eltolásával eljusson a kincsekhez. Aki elsőként találja meg mindahányat és kiindulópontjára sikeresen visszaérkezik az a nyertes.<br>A játék elején a szobákat véletlen sorrendben és véletlen irányban kirakjuk a játéktábla szabad mezőire. A szobák közül az egyik mindenképpen fölösleges marad. A játék folyamán majd mindig az éppen kimaradó szobát használjuk a többi szoba elcsúsztatására. A játékban legfeljebb 24 kincset kell megtalálni. Ezeket véletlen sorrendben felrakjuk a táblára úgy, hogy egy mezőn csak egy kincs lehet, és a sarokba nem rakhatunk, majd az ezeket jelző kártyákat összekeverjük, és egyenlő számban szétosztjuk a játékosok között, felfedve mindig a legfelső kártyát. A játékosokat jelző figurákat a tábla külön sarkaiba helyezzük.<br>A játék során minden játékosnak a kincsei közül azt kell megszereznie, amit az aktuálisan legfelső, mindenki által látható kincskártya mutat. Arra a mezőre kell eljutni. Ahhoz, hogy a célt elérje, a játékosnak<br>&nbsp&nbsp&nbsp1. először a katakombát kell átalakítania a kimaradt szoba becsúsztatásával, és<br>&nbsp&nbsp&nbsp2.	lépnie mindig csak ez után szabad a figurájával.<br>A katakomba átalakítása a következőképpen történik: A játékos a kimaradt szobát (tetszőlegesen elforgatva) valamelyik oldalról becsúsztathatja a játéktábla területére egy szabadon mozgó sor vagy oszlop szélén, aminek következtében az átellenes oldalon kiesik egy másik szoba. A tábla szélén nyilak jelzik azokat a helyeket, ahol a szobát be lehet csúsztatni. A szoba bárhol betolható, kivétel ott, ahol az imént kilökődött. Nem szabad tehát az előző játékos lépését rögtön visszacsinálni. Ha a szobák eltolása során a szobával együtt egy figura is kitolódnék – akár másé, akár a miénk -, akkor ezt a figurát az ellenkező oldalról imént becsúsztatott szobába kell helyezni.<br>A szobák eltolását követi a játékos lépése a figurával. A katakomba minden olyan pontjáig el lehet jutni, amelyet a kiindulóponttal folyamatos járatvonal köt össze. Az ilyen járatokban tehát olyan messzire mehetünk el, amilyen messzire csak akarunk, vagyis nem számít, hogy hány szobán lépkedünk végig. Nem kötelező lépni. Figuránkat akár ott is hagyhatjuk, ahol éppen van. Egy mezőn több figura is állhat: a figurák nem ütik ki egymást. Ha valaki nem tud rögtön céljáig eljutni, akkor figurájával addig a pontig célszerű elmennie, ahol feltehetőleg jó helyzetben várhatja következő lépést. Ha valaki elérte a felfedett kincskártya által megjelölt célt, akkor felfedi a következőt, és most ehhez a célhoz igyekszik eljutni, stb.<br>            A játék akkor ér véget, ha egy játékos az összes kincskártyájához tartozó kincset megszerezte, és visszavezette a figuráját arra mezőre, ahonnan elindult. Az a győztes, aki valamennyi kincsét megtalálta és figuráját elsőként juttatta vissza a kiindulópontra."
        desc.appendChild(p);
        console.log(plain);
        plain.appendChild(desc);
    }
}

class MenuButtonWrapper{
    constructor(string, value){
        this.button = document.createElement('button');
        this.button.classList.add('menu_button');
        this.button.value = value;
        this.button.id = value;
        this.button.innerText = string;
    }
}

class InputFieldWrapper{
    constructor(placeholder){
        if(placeholder == "Játékosok száma"){
            this.input_field = document.createElement("input");
            this.input_field.type = "number";
            this.input_field.name = "input_player_number";
            this.input_field.id = "input_player_number";
            this.input_field.min = 1;
            this.input_field.max = 4;
            this.input_field.defaultValue = 2;
            this.input_field.placeholder = placeholder;
            this.input_field.maxLength = 1;
            this.input_field.classList.add('menu_button');
            this.input_field.classList.add('input_player_number');
            
            this.subscript = document.createElement('h2');
            this.subscript.innerText = placeholder;
            this.subscript.name = "input_player_number_subscript";
            this.subscript.classList.add('input_player_number_subscript')
            this.subscript.id = "input_player_number_subscript";
        }
        if(placeholder == "Kincskártyák száma játékosonként"){
            this.input_field = document.createElement("input");
            this.input_field.type = "number";
            this.input_field.name = "input_kincskartya_number";
            this.input_field.id = "input_kincskartya_number";
            this.input_field.min = 1;
            this.input_field.max = 24
            this.input_field.defaultValue = 2;
            this.input_field.placeholder = placeholder;
            this.input_field.maxLength = 1;
            this.input_field.classList.add('menu_button');
            this.input_field.classList.add('input_kincskartya_number');

            this.subscript = document.createElement('h2');
            this.subscript.innerText = placeholder;
            this.subscript.name = "input_kincskartya_number_subscript";
            this.subscript.classList.add('input_kincskartya_number_subscript')
            this.subscript.id = "input_kincskartya_number_subscript";
        }
    }
}