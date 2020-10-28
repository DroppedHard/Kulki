export class Box {
    x:number
    y:number
    color:string
    boxElement:HTMLDivElement
    rozmiarBox: number
    kulka : HTMLDivElement
    g:number
    h:number
    parentNode:Box
    constructor(x:number,y:number,rozmiar:number, color?:string) {
        this.x=x
        this.y=y
        this.rozmiarBox = rozmiar
        if (color){
            this.color = color
        }
        this.boxElement = document.createElement("div")
        this.boxElement.className="box"
        this.boxElement.style.top = (this.rozmiarBox+2) * y + "px"
        this.boxElement.style.left = (this.rozmiarBox+2) * x + "px"
        this.boxElement.style.width = this.rozmiarBox + "px"
        this.boxElement.style.height = this.rozmiarBox + "px"

        this.kulka = document.createElement("div")
        this.kulka.className = "kulka"
        this.kulka.style.width = this.rozmiarBox + "px"
        this.kulka.style.height = this.rozmiarBox + "px"
        this.kulka.style.borderRadius = this.rozmiarBox + "px"
        this.boxElement.appendChild(this.kulka)
    }
    dodajKulke(kolor:string):void {
        this.color=kolor
        this.kulka.style.backgroundColor=kolor
    }
}