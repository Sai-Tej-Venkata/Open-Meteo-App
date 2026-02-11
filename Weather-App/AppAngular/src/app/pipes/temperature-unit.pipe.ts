import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'temperatureUnit', standalone: true })
export class TemperatureUnitPipe implements PipeTransform {
  transform(value: number, toUnit: 'C' | 'F'): number {
    if (toUnit === 'F') {
      return (value * 9) / 5 + 32;
    }
    return (value - 32) * 5 / 9;
  }
}

//{{ temperature | temperatureUnit:'F' }}