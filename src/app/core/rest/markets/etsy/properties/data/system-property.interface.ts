export interface SystemPropertyInterface
{
    id:number;
    name:string;
    groupId:number;
    groupName:string;
    children?:Array<SystemPropertyInterface>;
}
