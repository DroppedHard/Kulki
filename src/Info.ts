import { Plansza } from "./Plansza"

export class Info {
    elem : HTMLDivElement
    nastKulki: HTMLDivElement[] = []
    rozmiarKulkiInfo:number = 50
    constructor() {
        this.elem = document.createElement("div")
        this.elem.className = "info"
        for (let i=0;i<3;i++) {
            let kulka = document.createElement("div")
            kulka.className="kulka-info"
            kulka.style.width=this.rozmiarKulkiInfo+"px"
            kulka.style.height=this.rozmiarKulkiInfo+"px"
            kulka.style.borderRadius=this.rozmiarKulkiInfo+"px"
            kulka.style.backgroundColor="transparent"
            this.nastKulki.push(kulka)
            this.elem.appendChild(kulka)
        }
        document.body.appendChild(this.elem)
    }
    dodajKolor(kolor:string):void {
        for (let el of this.nastKulki) {
            if (el.style.backgroundColor=="transparent") {
                el.style.backgroundColor=kolor
                break
            }
        }
    }
}