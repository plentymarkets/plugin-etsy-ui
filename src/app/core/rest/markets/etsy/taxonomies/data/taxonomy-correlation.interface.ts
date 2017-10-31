import { TaxonomyInterface } from './taxonomy.interface';
import { CategoryInterface } from '../../categories/data/category.interface';

export interface TaxonomyCorrelationInterface
{
    taxonomy:TaxonomyInterface;
    category:CategoryInterface;
}
