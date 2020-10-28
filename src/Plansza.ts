import {Box} from "./Box"
import {log} from "./decorators"

interface Tablicaobiektow{
    x:number,
    y:number,
    color:string,
    box:Box
}
export class Plansza {
    rozmiarBox :number = 50
    tabPlanszy :Tablicaobiektow[][]=[]
    pathOd:Box
    pathDo:Box
    openList:Box[]=[]
    wysPlan:number
    szerPlan:number
    pathColor:string="lightgrey"
    pathLimit:number=50
    punkty:number
    kulkiByWeszlo:number=5
    tabKulekDoUsuniecia:Box[]=[]
    constructor(wysPlan : number, szerPlan : number) {
        this.wysPlan=wysPlan
        this.szerPlan=szerPlan
        let plansza:HTMLDivElement = document.createElement("div");
        plansza.className = "plansza"
        plansza.style.width = (this.rozmiarBox+2) * szerPlan + "px"
        plansza.style.height = (this.rozmiarBox+2) * wysPlan + "px"
        for (let y=0;y<wysPlan;y++){
            let tabRow:Tablicaobiektow[]=[]
            for (let x=0;x<szerPlan;x++){
                let box = new Box(x,y,this.rozmiarBox)
                let obj:Tablicaobiektow = {
                    x:x,
                    y:y,
                    color:undefined,
                    box:box
                }
                tabRow.push(obj)
                box.boxElement.onclick = ()=>{this.boxClick(box)}
                box.boxElement.onmouseover = ()=>{this.boxOver(box)}
                plansza.appendChild(box.boxElement)
            }
            this.tabPlanszy.push(tabRow)
        }
        document.body.appendChild(plansza)
        //console.log(this.dekorator("xdd"))
        //this.dekorator("?????")
    }
    @log
    public dekorator(tekst:string):void {
        console.log(tekst) //jeden bonusowy dekorator na uśmiech
    }
    boxClick(box:Box):void {
        if (box.color=="transparent" || box.color==undefined) {
            this.pathDo=box
            this.pathfinding(box)
        }
        else if (box.color) {
            this.pathOd=box
            this.tabPlanszy.forEach(row=> {
                row.forEach(e=> {
                    e.box.boxElement.style.backgroundColor="transparent"
                })
            })
            box.boxElement.style.backgroundColor=this.pathColor
        }
    }
    boxOver(box:Box):void {
        if (this.pathOd===box) {
            this.tabPlanszy.forEach(row=> {
                row.forEach(e=> {
                    e.box.boxElement.style.backgroundColor="transparent"
                })
            })
            box.boxElement.style.backgroundColor=this.pathColor
        }
        else if (box.color==undefined || box.color=="transparent") {
            this.pathDo=box
            this.pathfinding()
        }else if (box.color) {
           
        }
    }
    pathfinding(destination?:Box):void {
        if (this.pathOd && this.pathDo){
            this.openList=[]
            this.tabPlanszy.forEach(row => {
                row.forEach(e => {
                    if (e.color==undefined || e.color=="transparent") {
                        e.box.h=Math.abs(this.pathDo.x-e.x)+Math.abs(this.pathDo.y-e.y)
                        e.box.g=undefined
                        e.box.parentNode=undefined
                    }
                })
            })
            this.openList.push(this.pathOd)
            let flag=0
            this.pathOd.g=flag
            while (this.openList.length!=0 && this.openList.length<this.wysPlan*this.szerPlan && flag<this.pathLimit) {
                flag++
                let openToAdd:Box[]=[]
                this.openList.forEach(boxToCheck=> {
                    if(boxToCheck.y-1>=0 && this.tabPlanszy[boxToCheck.y-1][boxToCheck.x]!=undefined && this.tabPlanszy[boxToCheck.y-1][boxToCheck.x].color==undefined && this.tabPlanszy[boxToCheck.y-1][boxToCheck.x].box.g==undefined){
                        this.tabPlanszy[boxToCheck.y-1][boxToCheck.x].box.parentNode=boxToCheck
                        this.tabPlanszy[boxToCheck.y-1][boxToCheck.x].box.g=flag+1
                        openToAdd.push(this.tabPlanszy[boxToCheck.y-1][boxToCheck.x].box)
                    }
                    if(boxToCheck.y+1<this.wysPlan && this.tabPlanszy[boxToCheck.y+1][boxToCheck.x]!=undefined && this.tabPlanszy[boxToCheck.y+1][boxToCheck.x].color==undefined && this.tabPlanszy[boxToCheck.y+1][boxToCheck.x].box.g==undefined){
                        this.tabPlanszy[boxToCheck.y+1][boxToCheck.x].box.parentNode=boxToCheck
                        this.tabPlanszy[boxToCheck.y+1][boxToCheck.x].box.g=flag+1
                        openToAdd.push(this.tabPlanszy[boxToCheck.y+1][boxToCheck.x].box)
                    }
                    if(boxToCheck.x+1<this.szerPlan && this.tabPlanszy[boxToCheck.y][boxToCheck.x+1]!=undefined && this.tabPlanszy[boxToCheck.y][boxToCheck.x+1].color==undefined && this.tabPlanszy[boxToCheck.y][boxToCheck.x+1].box.g==undefined){
                        this.tabPlanszy[boxToCheck.y][boxToCheck.x+1].box.parentNode=boxToCheck
                        this.tabPlanszy[boxToCheck.y][boxToCheck.x+1].box.g=flag+1
                        openToAdd.push(this.tabPlanszy[boxToCheck.y][boxToCheck.x+1].box)
                    }
                    if(boxToCheck.x-1>=0 && this.tabPlanszy[boxToCheck.y][boxToCheck.x-1]!=undefined && this.tabPlanszy[boxToCheck.y][boxToCheck.x-1].color==undefined && this.tabPlanszy[boxToCheck.y][boxToCheck.x-1].box.g==undefined){
                        this.tabPlanszy[boxToCheck.y][boxToCheck.x-1].box.parentNode=boxToCheck
                        this.tabPlanszy[boxToCheck.y][boxToCheck.x-1].box.g=flag+1
                        openToAdd.push(this.tabPlanszy[boxToCheck.y][boxToCheck.x-1].box)
                    }
                })
                let chosen = openToAdd.filter(e=> {
                    if (this.pathDo.x==e.x && this.pathDo.y==e.y){
                        return e
                    }
                })
                if (destination && chosen[0]) {
                    this.przeniesKulke(this.pathOd,chosen[0])
                    this.pathOd=undefined
                    this.pathDo=undefined
                    this.tabPlanszy.forEach(row => {
                        row.forEach(e => {
                            e.box.boxElement.style.backgroundColor="transparent"
                        })
                    })
                    this.czyZbito(chosen[0],true)
                    break
                }else{
                    if (chosen[0]) {
                        this.tabPlanszy.forEach(row => {
                            row.forEach(e => {
                                e.box.boxElement.style.backgroundColor="transparent"
                            })
                        })
                        this.pathOd.parentNode=undefined
                        this.highlight(chosen[0])
                    }
                }
                this.openList=openToAdd
            }
        }
    }
    highlight(box:Box):void {
        if (box.parentNode){
            box.boxElement.style.backgroundColor=this.pathColor
            this.highlight(box.parentNode)
        }else {
            box.boxElement.style.backgroundColor=this.pathColor
        }
    }
    przeniesKulke(boxOd:Box,boxDo:Box):void {
        let colorOd=boxOd.color
        boxDo.dodajKulke(colorOd)
        boxOd.dodajKulke("transparent")
        this.tabPlanszy[boxOd.y][boxOd.x].color=undefined
        this.tabPlanszy[boxDo.y][boxDo.x].color=colorOd
    }
    czyZbito(box:Box,czyDodane?:boolean):void {
        let x=box.x
        let y=box.y
        let color=box.color
        let kierunek=""
        if (box.y-1>=0 && this.tabPlanszy[y-1][x].color==color){kierunek="N"}
        else if (box.y-1>=0 && box.x+1<this.szerPlan && this.tabPlanszy[y-1][x+1].color==color){kierunek="NE"}
        else if (box.x+1<this.szerPlan && this.tabPlanszy[y][x+1].color==color){kierunek="E"}
        else if (box.x+1<this.szerPlan && box.y+1<this.wysPlan && this.tabPlanszy[y+1][x+1].color==color){kierunek="SE"}
        else if (box.y+1<this.wysPlan && this.tabPlanszy[y+1][x].color==color){kierunek="S"}
        else if (box.y+1<this.wysPlan && box.x-1>=0 && this.tabPlanszy[y+1][x-1].color==color){kierunek="SW"}
        else if (box.x-1>=0 && this.tabPlanszy[y][x-1].color==color){kierunek="W"}
        else if (box.y-1>=0 && box.x-1>=0 && this.tabPlanszy[y-1][x-1].color==color){kierunek="NW"}
        else if (czyDodane==true){this.punkty=0}
        this.zbicieRek(box,kierunek,false,0,czyDodane)
    }
    zbicieRek(box:Box,kierunek:string,czyKoniec:boolean,punkty?:number,czyDodane?:boolean){
        let a:number = czyKoniec? 1 : 0;
        switch (kierunek+a){
            case "N0":
                if (box.y-1>=0 && this.tabPlanszy[box.y-1][box.x]!=undefined && this.tabPlanszy[box.y-1][box.x].color==box.color){
                    this.zbicieRek(this.tabPlanszy[box.y-1][box.x].box,kierunek,false,punkty,czyDodane)
                }else if ((box.y-1>=0 && this.tabPlanszy[box.y-1][box.x]!=undefined && this.tabPlanszy[box.y-1][box.x].color!=box.color)||box.y-1<0){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y+1][box.x].box,"S",true,1,czyDodane)
                }
                break;
            case "NE0":
                if (box.y-1>=0 && box.x+1<this.szerPlan && this.tabPlanszy[box.y-1][box.x+1]!=undefined && this.tabPlanszy[box.y-1][box.x+1].color==box.color){
                    this.zbicieRek(this.tabPlanszy[box.y-1][box.x+1].box,kierunek,false,punkty,czyDodane)
                }else if ((box.y-1>=0 && box.x+1<this.szerPlan && this.tabPlanszy[box.y-1][box.x+1]!=undefined && this.tabPlanszy[box.y-1][box.x+1].color!=box.color)||(box.y-1<0 || box.x+1>=this.szerPlan)){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y+1][box.x-1].box,"SW",true,1,czyDodane)
                }
                break;
            case "E0":
                if (box.x+1<this.szerPlan && this.tabPlanszy[box.y][box.x+1]!=undefined && this.tabPlanszy[box.y][box.x+1].color==box.color){
                    this.zbicieRek(this.tabPlanszy[box.y][box.x+1].box,kierunek,false,punkty,czyDodane)
                }else if ((box.x+1<this.szerPlan && this.tabPlanszy[box.y][box.x+1]!=undefined && this.tabPlanszy[box.y][box.x+1].color!=box.color)||box.x+1>=this.szerPlan){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y][box.x-1].box,"W",true,1,czyDodane)
                }
                break;
            case "SE0":
                if (box.x+1<this.szerPlan && box.y+1<this.wysPlan && this.tabPlanszy[box.y+1][box.x+1]!=undefined && this.tabPlanszy[box.y+1][box.x+1].color==box.color){
                    this.zbicieRek(this.tabPlanszy[box.y+1][box.x+1].box,kierunek,false,punkty,czyDodane)
                }else if ((box.x+1<this.szerPlan && box.y+1<this.wysPlan && this.tabPlanszy[box.y+1][box.x+1]!=undefined && this.tabPlanszy[box.y+1][box.x+1].color!=box.color)||(box.x+1>=this.szerPlan || box.y+1>=this.wysPlan)){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y-1][box.x-1].box,"NW",true,1,czyDodane)
                }
                break;
            case "S0":
                if (box.y+1<this.wysPlan && this.tabPlanszy[box.y+1][box.x]!=undefined && this.tabPlanszy[box.y+1][box.x].color==box.color){
                    this.zbicieRek(this.tabPlanszy[box.y+1][box.x].box,kierunek,false,punkty,czyDodane)
                }else if ((box.y+1<this.szerPlan && this.tabPlanszy[box.y+1][box.x]!=undefined && this.tabPlanszy[box.y+1][box.x].color!=box.color)||box.x+1>=this.szerPlan){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y-1][box.x].box,"N",true,1,czyDodane)
                }
                break;
            case "SW0":
                if (box.y+1<this.wysPlan && box.x-1>=0 && this.tabPlanszy[box.y+1][box.x-1]!=undefined && this.tabPlanszy[box.y+1][box.x-1].color==box.color){
                    this.zbicieRek(this.tabPlanszy[box.y+1][box.x-1].box,kierunek,false,punkty,czyDodane)
                }else if ((box.y+1<this.szerPlan && box.x-1>=0 && this.tabPlanszy[box.y+1][box.x-1]!=undefined && this.tabPlanszy[box.y+1][box.x-1].color!=box.color)||(box.x-1<0 || box.y+1>=this.wysPlan)){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y-1][box.x+1].box,"NE",true,1,czyDodane)
                }
                break;
            case "W0":
                if (box.x-1>=0 && this.tabPlanszy[box.y][box.x-1]!=undefined && this.tabPlanszy[box.y][box.x-1].color==box.color){
                    this.zbicieRek(this.tabPlanszy[box.y][box.x-1].box,kierunek,false,punkty,czyDodane)
                }else if ((box.x-1>=0 && this.tabPlanszy[box.y][box.x-1]!=undefined && this.tabPlanszy[box.y][box.x-1].color!=box.color)||box.x-1<0){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y][box.x+1].box,"E",true,1,czyDodane)
                }
                break;
            case "NW0":
                if (box.y-1>=0 && box.x-1>=0 && this.tabPlanszy[box.y-1][box.x-1]!=undefined && this.tabPlanszy[box.y-1][box.x-1].color==box.color){
                    this.zbicieRek(this.tabPlanszy[box.y-1][box.x-1].box,kierunek,false,punkty,czyDodane)
                }else if ((box.y-1>=0 && box.x-1>=0 && this.tabPlanszy[box.y-1][box.x-1]!=undefined && this.tabPlanszy[box.y-1][box.x-1].color!=box.color)||(box.y-1<0 || box.x-1<0)){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y+1][box.x+1].box,"SE",true,1,czyDodane)
                }
                break;
                //na górze - by ustawić liczenie na dobrej pozycji / na dole, by zliczyć wszystkie punkty i jeśli jest na tyle długie usunąć itd
            case "N1":
                if (box.y-1>=0 && this.tabPlanszy[box.y-1][box.x]!=undefined && this.tabPlanszy[box.y-1][box.x].color==box.color){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y-1][box.x].box,kierunek,true,punkty+1,czyDodane)
                }else if ((box.y-1>=0 && this.tabPlanszy[box.y-1][box.x]!=undefined && this.tabPlanszy[box.y-1][box.x].color!=box.color)||box.y-1<0){
                    if (punkty+1>=this.kulkiByWeszlo){
                        this.tabKulekDoUsuniecia.push(box)
                        this.punkty=punkty+1
                        this.tabKulekDoUsuniecia.forEach(e=> {
                            e.color=undefined
                            e.kulka.style.backgroundColor="transparent"
                            this.tabPlanszy[e.y][e.x].color=undefined
                        })
                    }else {
                        if (czyDodane==true){this.punkty=0}
                    }
                    this.tabKulekDoUsuniecia=[]
                }
                break;
            case "NE1":
                if (box.y-1>=0 && box.x+1<this.szerPlan && this.tabPlanszy[box.y-1][box.x+1]!=undefined && this.tabPlanszy[box.y-1][box.x+1].color==box.color){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y-1][box.x+1].box,kierunek,true,punkty+1,czyDodane)
                }else if ((box.y-1>=0 && box.x+1<this.szerPlan && this.tabPlanszy[box.y-1][box.x+1]!=undefined && this.tabPlanszy[box.y-1][box.x+1].color!=box.color)||(box.y-1<0 || box.x+1>=this.szerPlan)){
                    if (punkty+1>=this.kulkiByWeszlo){
                        this.tabKulekDoUsuniecia.push(box)
                        this.punkty=punkty+1
                        this.tabKulekDoUsuniecia.forEach(e=> {
                            e.color=undefined
                            e.kulka.style.backgroundColor="transparent"
                            this.tabPlanszy[e.y][e.x].color=undefined
                        })
                    }else {
                        if (czyDodane==true){this.punkty=0}                    }
                    this.tabKulekDoUsuniecia=[]
                }
                break;
            case "E1":
                if (box.x+1<this.szerPlan && this.tabPlanszy[box.y][box.x+1]!=undefined && this.tabPlanszy[box.y][box.x+1].color==box.color){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y][box.x+1].box,kierunek,true,punkty+1,czyDodane)
                }else if ((box.x+1<this.szerPlan && this.tabPlanszy[box.y][box.x+1]!=undefined && this.tabPlanszy[box.y][box.x+1].color!=box.color)||box.x+1>=this.szerPlan){
                    if (punkty+1>=this.kulkiByWeszlo){
                        this.tabKulekDoUsuniecia.push(box)
                        this.punkty=punkty+1
                        this.tabKulekDoUsuniecia.forEach(e=> {
                            e.color=undefined
                            e.kulka.style.backgroundColor="transparent"
                            this.tabPlanszy[e.y][e.x].color=undefined
                        })
                    }else {
                        if (czyDodane==true){this.punkty=0}                    }
                    this.tabKulekDoUsuniecia=[]
                }
                break;
            case "SE1":
                if (box.x+1<this.szerPlan && box.y+1<this.wysPlan && this.tabPlanszy[box.y+1][box.x+1]!=undefined && this.tabPlanszy[box.y+1][box.x+1].color==box.color){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y+1][box.x+1].box,kierunek,true,punkty+1,czyDodane)
                }else if ((box.x+1<this.szerPlan && box.y+1<this.wysPlan && this.tabPlanszy[box.y+1][box.x+1]!=undefined && this.tabPlanszy[box.y+1][box.x+1].color!=box.color)||(box.x+1>=this.szerPlan || box.y+1>=this.wysPlan)){
                    if (punkty+1>=this.kulkiByWeszlo){
                        this.tabKulekDoUsuniecia.push(box)
                        this.punkty=punkty+1
                        this.tabKulekDoUsuniecia.forEach(e=> {
                            e.color=undefined
                            e.kulka.style.backgroundColor="transparent"
                            this.tabPlanszy[e.y][e.x].color=undefined
                        })
                    }else {
                        if (czyDodane==true){this.punkty=0}                    }              
                    this.tabKulekDoUsuniecia=[]
                }
                break;
            case "S1":
                if (box.y+1<this.wysPlan && this.tabPlanszy[box.y+1][box.x]!=undefined && this.tabPlanszy[box.y+1][box.x].color==box.color){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y+1][box.x].box,kierunek,true,punkty+1,czyDodane)
                }else if ((box.y+1<this.szerPlan && this.tabPlanszy[box.y+1][box.x]!=undefined && this.tabPlanszy[box.y+1][box.x].color!=box.color)||box.y+1>=this.szerPlan){
                    if (punkty+1>=this.kulkiByWeszlo){
                        this.tabKulekDoUsuniecia.push(box)
                        this.punkty=punkty+1
                        this.tabKulekDoUsuniecia.forEach(e=> {
                            e.color=undefined
                            e.kulka.style.backgroundColor="transparent"
                            this.tabPlanszy[e.y][e.x].color=undefined
                        })
                    }else {
                        if (czyDodane==true){this.punkty=0}                    }              
                    this.tabKulekDoUsuniecia=[]
                }
                break;
            case "SW1":
                if (box.y+1<this.wysPlan && box.x-1>=0 && this.tabPlanszy[box.y+1][box.x-1]!=undefined && this.tabPlanszy[box.y+1][box.x-1].color==box.color){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y+1][box.x-1].box,kierunek,true,punkty+1,czyDodane)
                }else if ((box.y+1<this.wysPlan && box.x-1>=0 && this.tabPlanszy[box.y+1][box.x-1]!=undefined && this.tabPlanszy[box.y+1][box.x-1].color!=box.color)||(box.y+1>=this.wysPlan || box.x-1<0)){
                    if (punkty+1>=this.kulkiByWeszlo){
                        this.tabKulekDoUsuniecia.push(box)
                        this.punkty=punkty+1
                        this.tabKulekDoUsuniecia.forEach(e=> {
                            e.color=undefined
                            e.kulka.style.backgroundColor="transparent"
                            this.tabPlanszy[e.y][e.x].color=undefined
                        })
                    }else {
                        if (czyDodane==true){this.punkty=0}                    }              
                    this.tabKulekDoUsuniecia=[]
                }
                break;
            case "W1":
                if (box.x-1>=0 && this.tabPlanszy[box.y][box.x-1]!=undefined && this.tabPlanszy[box.y][box.x-1].color==box.color){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y][box.x-1].box,kierunek,true,punkty+1,czyDodane)
                }else if ((box.x-1>=0 && this.tabPlanszy[box.y][box.x-1]!=undefined && this.tabPlanszy[box.y][box.x-1].color!=box.color)||box.x-1<0){
                    if (punkty+1>=this.kulkiByWeszlo){
                        this.tabKulekDoUsuniecia.push(box)
                        this.punkty=punkty+1
                        this.tabKulekDoUsuniecia.forEach(e=> {
                            e.color=undefined
                            e.kulka.style.backgroundColor="transparent"
                            this.tabPlanszy[e.y][e.x].color=undefined
                        })
                    }else {
                        if (czyDodane==true){this.punkty=0}                    }               
                    this.tabKulekDoUsuniecia=[]
                }
                break;
            case "NW1":
                if (box.y-1>=0 && box.x-1>=0 && this.tabPlanszy[box.y-1][box.x-1]!=undefined && this.tabPlanszy[box.y-1][box.x-1].color==box.color){
                    this.tabKulekDoUsuniecia.push(box)
                    this.zbicieRek(this.tabPlanszy[box.y-1][box.x-1].box,kierunek,true,punkty+1,czyDodane)
                }else if ((box.y-1>=0 && box.x-1>=0 && this.tabPlanszy[box.y-1][box.x-1]!=undefined && this.tabPlanszy[box.y-1][box.x-1].color!=box.color)||(box.y-1<0 || box.x<0)){
                    if (punkty+1>=this.kulkiByWeszlo){
                        this.tabKulekDoUsuniecia.push(box)
                        this.punkty=punkty+1
                        
                        this.tabKulekDoUsuniecia.forEach(e=> {
                            e.color=undefined
                            e.kulka.style.backgroundColor="transparent"
                            this.tabPlanszy[e.y][e.x].color=undefined
                        })
                    }else {
                        if (czyDodane==true){this.punkty=0}                    }
                    this.tabKulekDoUsuniecia=[]
                }
                break;
            deafult:
                console.log("co jest halo")
                break;
        }
    }
}