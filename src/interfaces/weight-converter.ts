export interface WeightConverterDefinition {
    convert(weight: number, sourceUnit: string, outputUnit: string): number;
}