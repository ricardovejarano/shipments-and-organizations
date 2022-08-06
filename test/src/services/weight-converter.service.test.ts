import 'reflect-metadata';
import { Logger } from 'src/core/logger';
import winston from "winston";
import { WeightConverterService, WeightUnit } from '../../../src/services/weight-converter.service';


describe("test add function", () => {
  let service: WeightConverterService;
  beforeAll(() => {
    const logger: Logger = {
        getLogger: () => {
            return { error: () => { return '' } } as unknown as winston.Logger;
        },
    } 
    service = new WeightConverterService(logger);
  })
  it('should calculate conversion from Kilograms to...', () => {
    expect(service.convert(1000, WeightUnit.KILOGRAMS, WeightUnit.GRAMS)).toBe(1000000);
    expect(service.convert(1000, WeightUnit.KILOGRAMS, WeightUnit.OUNCES)).toBe(35274.00);
    expect(service.convert(1000, WeightUnit.KILOGRAMS, WeightUnit.POUNDS)).toBe(2204.60);
    expect(service.convert(1000, WeightUnit.KILOGRAMS, WeightUnit.STONES)).toBe(157.400);
  });

  it('should calculate conversion from Pounds to...', () => {
    expect(service.convert(1000, WeightUnit.POUNDS, WeightUnit.GRAMS)).toBe(453597.02);
    expect(service.convert(1000, WeightUnit.POUNDS, WeightUnit.OUNCES)).toBe(16000.00);
    expect(service.convert(1000, WeightUnit.POUNDS, WeightUnit.KILOGRAMS)).toBe(453.60);
    expect(service.convert(1000, WeightUnit.POUNDS, WeightUnit.STONES)).toBe(71.43);
  });

  it('should calculate conversion from Grams to...', () => {
    expect(service.convert(1000, WeightUnit.GRAMS, WeightUnit.POUNDS)).toBe(2.20);
    expect(service.convert(1000, WeightUnit.GRAMS, WeightUnit.OUNCES)).toBe(35.27);
    expect(service.convert(1000, WeightUnit.GRAMS, WeightUnit.KILOGRAMS)).toBe(1.00);
    expect(service.convert(1000, WeightUnit.GRAMS, WeightUnit.STONES)).toBe(0.16);
  });

  it('should calculate conversion from Ounces to...', () => {
    expect(service.convert(1000, WeightUnit.OUNCES, WeightUnit.POUNDS)).toBe(62.50);
    expect(service.convert(1000, WeightUnit.OUNCES, WeightUnit.GRAMS)).toBe(28349.49);
    expect(service.convert(1000, WeightUnit.OUNCES, WeightUnit.KILOGRAMS)).toBe(28.35);
    expect(service.convert(1000, WeightUnit.OUNCES, WeightUnit.STONES)).toBe(4.46);
  });

  it('should calculate conversion from Stones to...', () => {
    expect(service.convert(1000, WeightUnit.STONES, WeightUnit.POUNDS)).toBe(14000.00);
    expect(service.convert(1000, WeightUnit.STONES, WeightUnit.GRAMS)).toBe(6350415.95);
    expect(service.convert(1000, WeightUnit.STONES, WeightUnit.KILOGRAMS)).toBe(6350.42);
    expect(service.convert(1000, WeightUnit.STONES, WeightUnit.OUNCES)).toBe(224000);
  });

  it('should return same weight if source and target units are the same', () => {
    expect(service.convert(1000, WeightUnit.KILOGRAMS, WeightUnit.KILOGRAMS)).toBe(1000);
  });

  it('should return 0 for unsupported sourceUnit', () => {
    expect(service.convert(1000, 'unknown' as WeightUnit, WeightUnit.KILOGRAMS)).toBe(0);
  });

  it('should return 0 on unsupported outputUnits', () => {
    expect(service.convert(1000, WeightUnit.KILOGRAMS, 'unknown' as WeightUnit)).toBe(0);
    expect(service.convert(1000, WeightUnit.GRAMS, 'unknown' as WeightUnit)).toBe(0);
    expect(service.convert(1000, WeightUnit.OUNCES, 'unknown' as WeightUnit)).toBe(0);
    expect(service.convert(1000, WeightUnit.POUNDS, 'unknown' as WeightUnit)).toBe(0);
    expect(service.convert(1000, WeightUnit.STONES, 'unknown' as WeightUnit)).toBe(0);
  })
});