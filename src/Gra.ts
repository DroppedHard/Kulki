import {Plansza} from "./Plansza"
import {Info} from "./Info"
import {Box} from "./Box"

export class Gra {
    wysPlan :number = 10
    szerPlan :number = 10
    gramy : boolean = false
    plansza : Plansza 
    info : Info
    kolory : string []= ["red", "blue", "green", "cyan", "magenta", "yellow", "black"]
    punkty:number=0
    tytuł:HTMLDivElement
    constructor() {
        this.dodajTytuł()
        let plansza = new Plansza(this.wysPlan, this.szerPlan)
        this.plansza = plansza
        let info = new Info()
        this.info = info
        let start = document.createElement("button")
        start.id = "start-bt"
        start.innerHTML = "START"
        start.onclick = () => {
            this.startGame()
        }
        document.body.appendChild(start)
    }
    dodajTytuł():void {
        let tytuł = document.createElement("h1")
        tytuł.innerHTML = "Gramy w kulki!"
        tytuł.className = "tytuł"
        document.body.appendChild(tytuł)
        this.tytuł=tytuł
    }
    startGame():void {
        document.getElementById("start-bt").remove()
        this.gramy=true
        this.plansza.tabPlanszy.forEach(row=> {
            row.forEach(e=> {
                e.color=undefined
                e.box.color=undefined
                e.box.boxElement.style.backgroundColor="transparent"
                e.box.kulka.style.backgroundColor="transparent"
            })
        })
        let i = 0
        while (i<5) {
            this.losujKulke(true)
            i++
        }
        i=0
        while (i<3) {
            this.losujKulke(false)
            i++
        }
        this.czyPrzeniesionoKulke()
    }
    dodajKulke(x:number, y:number, kolor:string):void {
        let zaPola:number = 0
        let box:Box
        this.plansza.tabPlanszy.forEach(tab => {
            tab.forEach(e=> {
                if (x==e.x && y== e.y && e.color == undefined) {
                    box=e.box
                    e.color=kolor
                    e.box.dodajKulke(kolor)
                }else if (e.color!= undefined) {
                    zaPola++
                }
            })
        })
        this.plansza.czyZbito(box,false)
    }
    losujKulke(start?:boolean,kolor?:string):void {
        let dodano:boolean=false
        let x,y:number
        let licznik:number=0
        while (!dodano) {
            x = Math.floor(Math.random() * this.szerPlan)
            y = Math.floor(Math.random() * this.wysPlan)
            if (this.plansza.tabPlanszy[y][x].color==undefined){
                dodano=true
            }else{
                if (licznik<20){
                    licznik++
                }else{
                    let pozostałePola:Box[]=[]
                    this.plansza.tabPlanszy.forEach(row=> {
                        row.forEach(e=> {
                            if (e.color==undefined || e.color=="transparent") {
                                pozostałePola.push(e.box)
                            }
                        })
                    })
                    if (pozostałePola.length==0){
                        this.koniecGry()
                        break
                    }else{
                        let randomBox=Math.floor(Math.random() * (pozostałePola.length-1))
                        x=pozostałePola[randomBox].x
                        y=pozostałePola[randomBox].y
                    }
                }
            }
        }
        let kolorNr = Math.floor(Math.random() * this.kolory.length)
        if (start) {
            if (kolor){
                this.dodajKulke(x,y,kolor)
            }else {
                this.dodajKulke(x,y,this.kolory[kolorNr])
            }
        }else {
            this.info.dodajKolor(this.kolory[kolorNr])
        }
    }
    czyPrzeniesionoKulke():void {
        setInterval(()=>{
            if (this.plansza.punkty==0) {
                this.punkty+=this.plansza.punkty
                this.tytuł.innerHTML="Punkty: "+this.punkty
                this.plansza.punkty=-1
                this.info.nastKulki.forEach(e=> {
                    this.losujKulke(true,e.style.backgroundColor)
                    e.style.backgroundColor="transparent"
                })
                let i=0
                while (i<3) {
                    this.losujKulke(false)
                    i++
                }
            }else if (this.plansza.punkty>1) {
                this.punkty+=this.plansza.punkty
                this.tytuł.innerHTML="Punkty: "+this.punkty
                this.plansza.punkty=-1
            }
        },100)
    }
    koniecGry(){
        this.tytuł.innerHTML = "Dostałeś "+this.punkty+" punktów!"
        if (this.gramy){
            this.gramy=false
            let start = document.createElement("button")
            start.id = "start-bt"
            start.innerHTML = "START"
            start.onclick = () => {
                this.startGame()
            }
            document.body.appendChild(start)
        }
    }
}