export interface TaxonomyInterface
{
    categoryId:string|number;
    id:string|number;
    level:number;
    name:string
    parentId?:string|number;
    children?:Array<TaxonomyInterface>;
}
