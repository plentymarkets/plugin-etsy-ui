export interface PropertyInterface
{
    id:number;
    name:string;
    groupId:number;
    groupName:string;
    children?:Array<PropertyInterface>;
}
