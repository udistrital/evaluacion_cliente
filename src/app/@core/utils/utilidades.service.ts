import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UtilidadesService {

    userArray: any[];
    jsonArray: any[];

    constructor() {
    }

    getSumArray(array): any {
        let sum = 0;
        array.forEach(element => {
            sum += element;
        });
        return sum;
    }

    translateTree(tree: any) {
        const trans = tree.map((n: any) => {
            let node = {};
            node = {
                id: n.Id,
                name: n.Nombre,
            };
            if (n.hasOwnProperty('Opciones')) {
                if (n.Opciones !== null) {
                    const children = this.translateTree(n.Opciones);
                    node = { ...node, ...{ children: children } };
                }
                return node;
            } else {
                return node;
            }
        });
        return trans;
    }

 decimalToRoman(decimal: string): string {
        
 let decimalNumber = Number(decimal);
        const romanSymbols = ['I', 'IV', 'V', 'IX', 'X', 'XL', 'L', 'XC', 'C', 'CD', 'D', 'M'];
        const decimalValues = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 1000];
    
        let roman = '';  
    
  
        for (let i = decimalValues.length - 1; i >= 0; i--) {
         
            while (decimalNumber >= decimalValues[i]) {
                roman += romanSymbols[i];
                decimalNumber -= decimalValues[i];
            }
        }
    
        return roman;
    }
    

}
