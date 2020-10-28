import {Box} from "./Box"
import {log} from "./decorators"

interface Tablicaobiektow{
    x:number,
    y:number,
    color:string,
    box:Box
}
interface ObiektF{
    f:number,
    box:Box,
    index:number
}
export class Plansza {
    rozmiarBox :number = 50
    tabPlanszy :Tablicaobiektow[][]=[]
    pathOd:Box
    pathDo:Box
    openList:Box[]=[]
    closedList:Box[]=[]
    wysPlan:number
    szerPlan:number
    pathColor:string="lightgrey"
    pathLimit:number=10
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
    //@log
    public dekorator(tekst:string) {
        console.log(tekst)
    }
    boxClick(box:Box) {
        if (box.color || box.color=="transparent") {
            this.closedList.forEach(e=> {
                e.boxElement.style.backgroundColor="transparent"
            })
            this.pathOd=box
            box.boxElement.style.backgroundColor=this.pathColor
        }else {
            this.pathDo=box
            //przenieś na pathDo
        }
    }
    boxOver(box:Box) {
        if (this.pathOd===box) {
            this.closedList.forEach(e=> {
                e.boxElement.style.backgroundColor="transparent"
            })
            box.boxElement.style.backgroundColor=this.pathColor
        }
        else if (box.color==undefined || box.color=="transparent") {
            this.pathDo=box
            this.pathfinding()
        }else if (box.color) {
            this.closedList.forEach(e=> {
                e.boxElement.style.backgroundColor="transparent"
            })
        }
    }
    pathfinding() {
        if (this.pathOd && this.pathDo){
            this.openList=[]
            this.closedList.forEach(e=> {
                e.boxElement.style.backgroundColor="transparent"
            })
            this.closedList=[]
            this.tabPlanszy.forEach(row => {
                row.forEach(e => {
                    if (e.color==undefined || e.color=="transparent") {
                        e.box.h=Math.abs(this.pathDo.x-e.x)+Math.abs(this.pathDo.y-e.y)
                    }
                })
            })
            this.closedList.push(this.pathOd)
            this.nodeRec(0,this.pathOd)
        }
    }
    nodeRec(flag:number,boxToCheck:Box){
        let openToAdd:Box[]=[]
        console.log(flag)
        //dodajmy elementy dookoła thispathOd do szukanych - a*
        if(boxToCheck.y-1>=0 && this.tabPlanszy[boxToCheck.y-1][boxToCheck.x]!=undefined && this.tabPlanszy[boxToCheck.y-1][boxToCheck.x].color==undefined){
            this.tabPlanszy[boxToCheck.y-1][boxToCheck.x].box.g=flag+1
            openToAdd.push(this.tabPlanszy[boxToCheck.y-1][boxToCheck.x].box)
        }
        if(boxToCheck.y+1<this.wysPlan && this.tabPlanszy[boxToCheck.y+1][boxToCheck.x]!=undefined && this.tabPlanszy[boxToCheck.y+1][boxToCheck.x].color==undefined){
            this.tabPlanszy[boxToCheck.y+1][boxToCheck.x].box.g=flag+1
            openToAdd.push(this.tabPlanszy[boxToCheck.y+1][boxToCheck.x].box)
        }
        if(boxToCheck.x+1<this.szerPlan && this.tabPlanszy[boxToCheck.y][boxToCheck.x+1]!=undefined && this.tabPlanszy[boxToCheck.y][boxToCheck.x+1].color==undefined){
            this.tabPlanszy[boxToCheck.y][boxToCheck.x+1].box.g=flag+1
            openToAdd.push(this.tabPlanszy[boxToCheck.y][boxToCheck.x+1].box)
        }
        if(boxToCheck.x-1>=0 && this.tabPlanszy[boxToCheck.y][boxToCheck.x-1]!=undefined && this.tabPlanszy[boxToCheck.y][boxToCheck.x-1].color==undefined){
            this.tabPlanszy[boxToCheck.y][boxToCheck.x-1].box.g=flag+1
            openToAdd.push(this.tabPlanszy[boxToCheck.y][boxToCheck.x-1].box)
        }
        let toDel= {
            index:-1,
            from:""
        }
        openToAdd.forEach((e1,i1)=> {
            this.openList.forEach((e2,i2)=> {
                if (e1.x==e2.x&&e1.y==e2.y) {
                    if(e1.g<e2.g){
                        //this.openList.splice(i2,1)
                        toDel={
                            index:i2,
                            from:"open"
                        }
                    }else {
                        //openToAdd.splice(i1,1)
                        toDel={
                            index:i1,
                            from:"toadd"
                        }
                    }
                }
            })
            this.closedList.forEach((e2,i2)=> {
                if (e1.x==e2.x&&e1.y==e2.y) {
                    if(e1.g<e2.g){
                        //this.closedList.splice(i2,1)
                        toDel={
                            index:i2,
                            from:"closed"
                        }
                    }else {
                        //openToAdd.splice(i1,1)
                        toDel={
                            index:i1,
                            from:"toadd"
                        }
                    }
                }
            })
        })
        switch (toDel.from){
            case "toadd":
                openToAdd.splice(toDel.index,1)
                break;
            case "closed":
                this.closedList.splice(toDel.index,1)
                break;
            case "open":
                this.openList.splice(toDel.index,1)
                break;
            default:
                break;
        }
        let finalF:ObiektF= {
            f:undefined,
            box:undefined,
            index:undefined
        }
        openToAdd.forEach((e,i) => {
            e.parentNode=boxToCheck
            let f:number=e.g+e.h
            // if (finalF.f==f) {
            //     this.closedList.forEach(closed=> {
            //         if (closed.x==e.x&&closed.y==e.y){
            //             console.log("nice try man",closed)
            //         }
            //         else {
            //             finalF.f=f
            //             finalF.box=e
            //             finalF.index=i
            //             e.boxElement.style.backgroundColor="transparent"
            //         }
            //     })
            // }
            if (finalF.f==undefined || finalF.f>f) {
                finalF.f=f
                finalF.box=e
                finalF.index=i
                e.boxElement.style.backgroundColor="transparent"
            }
        })
        //console.log(finalF)
        let chosenBox:Box = finalF.box
        let dodac=true
        this.closedList.forEach(e=> {
            if (e.x==chosenBox.x && e.y==chosenBox.y)
                dodac=false
        })
        if (dodac){
            this.closedList.push(chosenBox)
        }
        chosenBox.boxElement.style.backgroundColor=this.pathColor
        
        console.log(openToAdd,this.openList,this.closedList)
        this.openList = this.openList.concat(openToAdd)
        this.closedList.forEach(e=> {
            e.boxElement.style.backgroundColor=this.pathColor
        })
        if (this.pathDo.x==chosenBox.x && this.pathDo.y==chosenBox.y){
            console.log("ścieżka gotowa")
        }else {
            //console.log(this.closedList)
            if (flag<this.pathLimit){
                this.nodeRec(flag+1,chosenBox)
            }
        }
    }
}