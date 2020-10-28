export function log(target: any, name: string, descriptor: any){
    console.log("log z dekoratora")
    descriptor.value = function () {
        console.log("log z funkcji")
        return ("zwracana wartość, log z glownego skryptu")
    }
  }