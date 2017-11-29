import { PropertyInterface } from './property.interface';
import { SystemPropertyInterface } from './system-property.interface';

export interface PropertyCorrelationInterface
{
    uiId?:number;
    property:PropertyInterface;
    systemProperty:SystemPropertyInterface;
}
