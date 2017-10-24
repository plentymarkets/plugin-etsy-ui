import {TerraPagerInterface} from "@plentymarkets/terra-components";
import { CategoryInterface } from './category.interface';

export interface CategoriesInterface extends TerraPagerInterface
{
    entries:Array<CategoryInterface>;
}