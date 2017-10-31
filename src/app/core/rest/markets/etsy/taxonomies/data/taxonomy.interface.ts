export interface TaxonomyInterface
{
    id:number;
    level:number;
    name:string;
    isLeaf:boolean;
    parentId:number;
    children?:Array<TaxonomyInterface>;
    path?:Array<TaxonomyInterface>;
}
