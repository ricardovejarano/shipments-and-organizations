import { injectable } from "inversify";
import { WeightConverterDefinition } from "../interfaces/weight-converter";

export enum WeightUnit {
    KILOGRAMS = 'kilograms',
    OUNCES = 'ounces',
    POUNDS = 'pounds',
    GRAMS = 'grams',
    STONES = 'stones',
}

@injectable()
export class WeightConverterService implements WeightConverterDefinition {

    // took the math from: https://www.w3schools.com/howto/howto_js_weight_converter.asp
    public convert(weight: number, sourceUnit: WeightUnit, outputUnit: WeightUnit): number {
        
        if(sourceUnit === outputUnit) {
            return weight;
        }

        switch (sourceUnit) {
            case WeightUnit.KILOGRAMS:
                return this.fromKilograms(weight, outputUnit);
            case WeightUnit.OUNCES:
                return this.fromOunces(weight, outputUnit);
            case WeightUnit.POUNDS:
                return this.fromPounds(weight, outputUnit);
            case WeightUnit.GRAMS:
                return this.fromGrams(weight, outputUnit);
            case WeightUnit.STONES:
                return this.fromStones(weight, outputUnit);
            default:
                return 0;
        }
    }

    private fromKilograms(weight: number, unit: WeightUnit): number {
        switch (unit) {
            case WeightUnit.OUNCES:
                return this.kilogramsToOunces(weight);
            case WeightUnit.POUNDS:
                return this.kilogramsToPounds(weight);
            case WeightUnit.GRAMS:
                return this.kilogramsToGrams(weight);
            case WeightUnit.STONES:
                return this.kilogramsToStones(weight);
            default:
                return 0;
        }
    }

    private kilogramsToOunces(kg: number): number {
        return kg * 35.274;
    }

    private kilogramsToPounds(kg: number): number {
        return kg * 2.2046;
    }

    private kilogramsToGrams(kg: number): number {
        return kg * 1000
    }

    private kilogramsToStones(kg: number): number {
        return kg * 0.1574;
    }

    private fromOunces(weight: number, unit: WeightUnit): number {
        switch (unit) {
            case WeightUnit.KILOGRAMS:
                return this.ouncesToKilograms(weight);
            case WeightUnit.POUNDS:
                return this.ouncesToPounds(weight);
            case WeightUnit.GRAMS:
                return this.ouncesToGrams(weight);
            case WeightUnit.STONES:
                return this.ouncesToStones(weight);
            default:
                return 0;
        }
    }

    private ouncesToKilograms(oz: number): number {
        return oz / 35.274;
    }

    private ouncesToPounds(oz: number): number {
        return oz * 0.0625;
    }

    private ouncesToGrams(oz: number): number {
        return oz / 0.035274;
    }

    private ouncesToStones(oz: number): number {
        return oz * 0.0044643;
    }

    private fromPounds(weight: number, unit: WeightUnit): number {
        switch (unit) {
            case WeightUnit.KILOGRAMS:
                return this.poundsToKilograms(weight);
            case WeightUnit.OUNCES:
                return this.poundsToOunces(weight);
            case WeightUnit.GRAMS:
                return this.poundsToGrams(weight);
            case WeightUnit.STONES:
                return this.poundsToStones(weight);
            default:
                return 0;
        }
    }

    private poundsToKilograms(lb: number): number {
        return lb / 2.2046;
    }

    private poundsToOunces(lb: number): number {
        return lb * 16;
    }

    private poundsToGrams(lb: number): number {
        return lb / 0.0022046;
    }

    private poundsToStones(lb: number): number {
        return lb * 0.071429;
    }

    private fromGrams(weight: number, unit: WeightUnit): number {
        switch (unit) {
            case WeightUnit.KILOGRAMS:
                return this.gramsToKilograms(weight);
            case WeightUnit.OUNCES:
                return this.gramsToOunces(weight);
            case WeightUnit.POUNDS:
                return this.gramsToPounds(weight);
            case WeightUnit.STONES:
                return this.gramsToStones(weight);
            default:
                return 0;
        }
    }

    private gramsToKilograms(g: number): number {
        return g / 1000;
    }

    private gramsToOunces(g: number): number {
        return g * 0.035274;
    }

    private gramsToPounds(g: number): number {
        return g * 0.0022046;
    }

    private gramsToStones(g: number): number {
        return g * 0.00015747;
    }

    private fromStones(weight: number, unit: WeightUnit): number {
        switch (unit) {
            case WeightUnit.KILOGRAMS:
                return this.stonesToKilograms(weight);
            case WeightUnit.OUNCES:
                return this.stonesToOunces(weight);
            case WeightUnit.POUNDS:
                return this.stonesToPounds(weight);
            case WeightUnit.GRAMS:
                return this.stonesToGrams(weight);
            default:
                return 0;
        }
    }

    private stonesToKilograms(st: number): number {
        return st / 0.15747;
    }

    private stonesToOunces(st: number): number {
        return st * 224;
    }

    private stonesToPounds(st: number): number {
        return st * 14;
    }

    private stonesToGrams(st: number): number {
        return st / 0.00015747;
    }

}